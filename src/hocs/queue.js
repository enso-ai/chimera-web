import React, {
    createContext,
    useContext,
    useReducer,
    useEffect,
    useCallback,
    useRef,
} from 'react';
import {
    listAssets,
    postAsset,
    updateAsset,
    deleteAssets,
    processAsset,
    getPostStatus,
    getAssetStatus,
    getAssetDetails, // Import the new function
} from 'services/backend';
import {
    ASSET_STATUS,
    PROCESSING_TERMINAL_STATES,
    POSTING_TERMINAL_STATES,
    LOCKED_STATES
} from 'constants/assetStatus';

const QueueContext = createContext();

const initialState = {
    queues: {}, // { [channelId]: { assets: [], isLoading: false, isFullyLoaded: false, error: null, page: 1 } }
    actionsInProgress: new Set(), // Track ongoing API calls for specific assets (e.g., 'delete-assetId')
    pollingPostStatus: new Map(), // Track active post status polling { assetId: { intervalId: number, attempts: number } }
    pollingDeleteStatus: new Map(), // Track active delete status polling { assetId: { intervalId: number, attempts: number, channelId: string } }
    pollingProcessStatus: new Map(), // Track active processing status polling { assetId: { intervalId: number, attempts: number } }
};

const actionTypes = {
    FETCH_START: 'FETCH_START',
    FETCH_SUCCESS: 'FETCH_SUCCESS',
    FETCH_APPEND: 'FETCH_APPEND',
    FETCH_COMPLETE: 'FETCH_COMPLETE',
    FETCH_ERROR: 'FETCH_ERROR',
    SET_ASSET: 'SET_ASSET',
    REMOVE_ASSET: 'REMOVE_ASSET',
    ACTION_START: 'ACTION_START',
    ACTION_END: 'ACTION_END',
    CLEAR_QUEUE: 'CLEAR_QUEUE',
};

function queueReducer(state, action) {
    switch (action.type) {
        case actionTypes.FETCH_START:
            return {
                ...state,
                queues: {
                    ...state.queues,
                    [action.payload.channelId]: {
                        ...(state.queues[action.payload.channelId] || {
                            assets: [],
                            isFullyLoaded: false,
                            page: 1,
                        }),
                        isLoading: true,
                        error: null,
                    },
                },
            };
        case actionTypes.FETCH_SUCCESS: // Initial fetch or refresh
            return {
                ...state,
                queues: {
                    ...state.queues,
                    [action.payload.channelId]: {
                        ...state.queues[action.payload.channelId],
                        assets: action.payload.assets,
                        isLoading: false,
                        isFullyLoaded: action.payload.isFullyLoaded,
                        page: 2, // Start next fetch from page 2
                        error: null,
                    },
                },
            };
        case actionTypes.FETCH_APPEND: // Subsequent page fetches
            return {
                ...state,
                queues: {
                    ...state.queues,
                    [action.payload.channelId]: {
                        ...state.queues[action.payload.channelId],
                        // Avoid duplicates if API/timing overlap
                        assets: [
                            ...state.queues[action.payload.channelId].assets,
                            ...action.payload.assets.filter(
                                (newAsset) =>
                                    !state.queues[action.payload.channelId].assets.some(
                                        (existing) => existing.id === newAsset.id
                                    )
                            ),
                        ],
                        isLoading: true, // Still loading subsequent pages
                        page: state.queues[action.payload.channelId].page + 1,
                        error: null,
                    },
                },
            };
        case actionTypes.FETCH_COMPLETE:
            return {
                ...state,
                queues: {
                    ...state.queues,
                    [action.payload.channelId]: {
                        ...state.queues[action.payload.channelId],
                        isLoading: false,
                        isFullyLoaded: true,
                    },
                },
            };
        case actionTypes.FETCH_ERROR:
            return {
                ...state,
                queues: {
                    ...state.queues,
                    [action.payload.channelId]: {
                        ...(state.queues[action.payload.channelId] || {
                            assets: [],
                            isFullyLoaded: false,
                            page: 1,
                        }),
                        isLoading: false,
                        error: action.payload.error,
                    },
                },
            };
        case actionTypes.SET_ASSET: // Update or add single asset
            const currentQueue = state.queues[action.payload.channelId];
            if (!currentQueue) return state; // Should not happen if fetched first
            const existingIndex = currentQueue.assets.findIndex(
                (a) => a.id === action.payload.asset.id
            );
            let newAssets;
            if (existingIndex > -1) {
                newAssets = [...currentQueue.assets];
                newAssets[existingIndex] = { ...newAssets[existingIndex], ...action.payload.asset };
            } else {
                // Add if not found (e.g., after upload/process) - might need sorting later
                newAssets = [...currentQueue.assets, action.payload.asset];
            }
            return {
                ...state,
                queues: {
                    ...state.queues,
                    [action.payload.channelId]: {
                        ...currentQueue,
                        assets: newAssets,
                    },
                },
            };
        case actionTypes.REMOVE_ASSET:
            const queueToRemoveFrom = state.queues[action.payload.channelId];
            if (!queueToRemoveFrom) return state;
            return {
                ...state,
                queues: {
                    ...state.queues,
                    [action.payload.channelId]: {
                        ...queueToRemoveFrom,
                        assets: queueToRemoveFrom.assets.filter(
                            (a) => a.id !== action.payload.assetId
                        ),
                    },
                },
            };
        case actionTypes.ACTION_START:
            return {
                ...state,
                actionsInProgress: new Set(state.actionsInProgress).add(action.payload.actionKey),
            };
        case actionTypes.ACTION_END:
            const newActions = new Set(state.actionsInProgress);
            newActions.delete(action.payload.actionKey);
            return {
                ...state,
                actionsInProgress: newActions,
            };
        case actionTypes.CLEAR_QUEUE:
            const { [action.payload.channelId]: _, ...remainingQueues } = state.queues;
            return {
                ...state,
                queues: remainingQueues,
            };
        default:
            return state;
    }
}

const PAGE_SIZE = 20; // Or adjust as needed
const POLLING_INTERVAL = {
    POST: 3000, // 3 seconds
    DELETE: 3000, // 3 seconds
    PROCESS: 3000, // 3 seconds
};
const MAX_POLLING_ATTEMPTS = {
    POST: 20, // 60 seconds total (20 * 3s)
    DELETE: 10, // 30 seconds total (10 * 3s)
    PROCESS: 20, // 60 seconds total (20 * 3s)
};

export const QueueProvider = ({ children }) => {
    const [state, dispatch] = useReducer(queueReducer, initialState);
    const activeFetches = useRef(new Set()); // Track active full fetches per channel

    const fetchAllAssetsForChannel = useCallback(async (channelId, isRefresh = false) => {
        if (!channelId || activeFetches.current.has(channelId)) {
            return;
        }
        activeFetches.current.add(channelId);

        dispatch({ type: actionTypes.FETCH_START, payload: { channelId } });
        let currentPage = 1;
        let isFullyLoaded = false;
        let accumulatedAssets = [];

        try {
            while (!isFullyLoaded) {
                const data = await listAssets(currentPage, PAGE_SIZE, channelId);
                const fetchedAssets = data.items || [];
                isFullyLoaded = fetchedAssets.length < PAGE_SIZE;

                if (currentPage === 1) {
                    accumulatedAssets = fetchedAssets; // For initial dispatch
                    dispatch({
                        type: actionTypes.FETCH_SUCCESS,
                        payload: { channelId, assets: fetchedAssets, isFullyLoaded },
                    });
                } else {
                    accumulatedAssets = [...accumulatedAssets, ...fetchedAssets]; // Keep track locally
                    dispatch({
                        type: actionTypes.FETCH_APPEND,
                        payload: { channelId, assets: fetchedAssets },
                    });
                }

                if (isFullyLoaded) {
                    dispatch({ type: actionTypes.FETCH_COMPLETE, payload: { channelId } });
                } else {
                    currentPage++;
                }
            }
        } catch (error) {
            console.error(`Failed to fetch assets for channel ${channelId}:`, error);
            dispatch({
                type: actionTypes.FETCH_ERROR,
                payload: { channelId, error: error.message || 'Failed to fetch' },
            });
        } finally {
            activeFetches.current.delete(channelId);
        }
    }, []);

    const refreshQueue = useCallback(
        (channelId) => {
            if (!channelId) return;
            // Clear existing state for the channel before starting refresh
            dispatch({ type: actionTypes.CLEAR_QUEUE, payload: { channelId } });
            // Use setTimeout to ensure state update completes before fetch starts
            setTimeout(() => fetchAllAssetsForChannel(channelId, true), 0);
        },
        [fetchAllAssetsForChannel]
    );

    const getQueueState = useCallback(
        (channelId) => {
            return (
                state.queues[channelId] || {
                    assets: [],
                    isLoading: false,
                    isFullyLoaded: false,
                    error: null,
                    page: 1,
                }
            );
        },
        [state.queues]
    );

    const isActionInProgress = useCallback(
        (actionKey) => {
            return state.actionsInProgress.has(actionKey);
        },
        [state.actionsInProgress]
    );

    // --- Action Handlers ---

    const handleUpdateTitle = useCallback(
        async (channelId, assetId, newTitle) => {
            const actionKey = `update-${assetId}`;
            if (isActionInProgress(actionKey)) return;
            dispatch({ type: actionTypes.ACTION_START, payload: { actionKey } });
            const originalAsset = state.queues[channelId]?.assets.find((a) => a.id === assetId);
            // Optimistic update
            dispatch({
                type: actionTypes.SET_ASSET,
                payload: { channelId, asset: { ...originalAsset, id: assetId, title: newTitle } },
            });
            try {
                await updateAsset(assetId, { title: newTitle });
                // Success - state already updated optimistically
            } catch (error) {
                console.error('Failed to update title:', error);
                alert('Failed to update title. Please try again.');
                // Revert optimistic update on error
                if (originalAsset) {
                    dispatch({
                        type: actionTypes.SET_ASSET,
                        payload: { channelId, asset: originalAsset },
                    });
                }
            } finally {
                dispatch({ type: actionTypes.ACTION_END, payload: { actionKey } });
            }
        },
        [state.queues, isActionInProgress]
    );

    const startPollingPostStatus = useCallback(
        (channelId, assetId) => {
            // Clear any existing polling for this asset
            if (state.pollingPostStatus.has(assetId)) {
                clearInterval(state.pollingPostStatus.get(assetId).intervalId);
            }

            const intervalId = setInterval(async () => {
                const pollState = state.pollingPostStatus.get(assetId);
                if (!pollState) return; // Polling was stopped

                const newAttempts = pollState.attempts + 1;
                if (newAttempts > MAX_POLLING_ATTEMPTS.POST) {
                    // Stop polling after max attempts
                    clearInterval(intervalId);
                    state.pollingPostStatus.delete(assetId);
                    console.warn(`Polling timed out for asset ${assetId}`);
                    return;
                }

                try {
                    const response = await getPostStatus(assetId);
                    const status = response.status;

                    // Update polling attempts
                    state.pollingPostStatus.set(assetId, {
                        intervalId,
                        attempts: newAttempts,
                    });

                    if (POSTING_TERMINAL_STATES.includes(status)) {
                        // Terminal state reached
                        clearInterval(intervalId);
                        state.pollingPostStatus.delete(assetId);

                        // Update asset status and include failed_reason if status is posting_failed
                        const assetUpdate = { id: assetId, status };
                        if (status === ASSET_STATUS.POSTING_FAILED && response.failed_reason) {
                            assetUpdate.failed_reason = response.failed_reason;
                        }

                        dispatch({
                            type: actionTypes.SET_ASSET,
                            payload: { channelId, asset: assetUpdate },
                        });
                    }
                } catch (error) {
                    console.error('Failed to poll post status:', error);
                    // Continue polling until max attempts reached
                    state.pollingPostStatus.set(assetId, {
                        intervalId,
                        attempts: newAttempts,
                    });
                }
            }, POLLING_INTERVAL.POST);

            // Initialize polling state
            state.pollingPostStatus.set(assetId, {
                intervalId,
                attempts: 0,
            });
        },
        [state.pollingPostStatus, dispatch]
    );

    const stopPollingPostStatus = useCallback(
        (assetId) => {
            const pollState = state.pollingPostStatus.get(assetId);
            if (pollState) {
                clearInterval(pollState.intervalId);
                state.pollingPostStatus.delete(assetId);
            }
        },
        [state.pollingPostStatus]
    );

    // --- Start Polling for Processing Status ---
    const startPollingProcessStatus = useCallback(
        (channelId, assetId) => {
            // Clear any existing polling for this asset
            if (state.pollingProcessStatus.has(assetId)) {
                clearInterval(state.pollingProcessStatus.get(assetId).intervalId);
            }

            const intervalId = setInterval(async () => {
                const pollState = state.pollingProcessStatus.get(assetId);
                if (!pollState) return; // Polling was stopped

                const newAttempts = pollState.attempts + 1;
                if (newAttempts > MAX_POLLING_ATTEMPTS.PROCESS) {
                    clearInterval(intervalId);
                    state.pollingProcessStatus.delete(assetId);
                    console.warn(`Process polling timed out for asset ${assetId}`);
                    dispatch({ type: actionTypes.SET_ASSET, payload: { channelId, asset: { id: assetId, status: 'process_timeout' } } });
                    return;
                }

                try {
                    const response = await getAssetStatus(assetId);
                    const status = response.status;

                    // Update polling attempts
                    state.pollingProcessStatus.set(assetId, {
                        intervalId,
                        attempts: newAttempts,
                    });

                    // Check if processing is done (either success or failure)
                    if ( PROCESSING_TERMINAL_STATES.includes(status) ) {
                        clearInterval(intervalId);
                        state.pollingProcessStatus.delete(assetId);

                        const newAsset = await getAssetDetails(assetId);
                        // Update asset in the queue
                        dispatch({
                            type: actionTypes.SET_ASSET,
                            payload: { channelId, asset: newAsset },
                        });
                    }
                    // If status is still 'uploaded' or 'processing', continue polling
                } catch (error) {
                    console.error('Failed to poll processing status:', error);
                    // If we get a 404, the file may have been removed due to processing failure or other reasons
                    if (error.code === 404) {
                        clearInterval(intervalId);
                        state.pollingProcessStatus.delete(assetId);
                        // Optionally remove the asset from the queue if it's gone
                        // dispatch({ type: actionTypes.REMOVE_ASSET, payload: { channelId, assetId } });
                    } else {
                        // Other error, continue polling
                        state.pollingProcessStatus.set(assetId, {
                            intervalId,
                            attempts: newAttempts,
                        });
                    }
                }
            }, POLLING_INTERVAL.PROCESS);

            // Initialize polling state
            state.pollingProcessStatus.set(assetId, {
                intervalId,
                attempts: 0,
            });
        },
        [state.pollingProcessStatus, dispatch]
    );

    const stopPollingProcessStatus = useCallback(
        (assetId) => {
            const pollState = state.pollingProcessStatus.get(assetId);
            if (pollState) {
                clearInterval(pollState.intervalId);
                state.pollingProcessStatus.delete(assetId);
            }
        },
        [state.pollingProcessStatus]
    );
    // --- End Polling for Processing Status ---

    const handlePostNow = useCallback(
        async (channelId, assetId) => {
            const actionKey = `post-${assetId}`;
            if (isActionInProgress(actionKey)) return;

            if (!window.confirm('Are you sure you want to post this video now?')) {
                return;
            }
            dispatch({ type: actionTypes.ACTION_START, payload: { actionKey } });
            const originalAsset = state.queues[channelId]?.assets.find((a) => a.id === assetId);

            try {
                await postAsset(assetId);
                // Update status to posting and start polling
                dispatch({
                    type: actionTypes.SET_ASSET,
                    payload: {
                        channelId,
                        asset: { ...originalAsset, id: assetId, status: ASSET_STATUS.POSTING },
                    },
                });
                startPollingPostStatus(channelId, assetId);
            } catch (error) {
                console.error('Failed to post asset:', error);
                alert('Failed to post video. Please try again.');
            } finally {
                dispatch({ type: actionTypes.ACTION_END, payload: { actionKey } });
            }
        },
        [state.queues, isActionInProgress, startPollingPostStatus]
    );

    const startPollingDeleteStatus = useCallback(
        (channelId, assetId) => {
            // Clear any existing polling for this asset
            if (state.pollingDeleteStatus.has(assetId)) {
                clearInterval(state.pollingDeleteStatus.get(assetId).intervalId);
            }

            const intervalId = setInterval(async () => {
                const pollState = state.pollingDeleteStatus.get(assetId);
                if (!pollState) return; // Polling was stopped

                const newAttempts = pollState.attempts + 1;
                if (newAttempts > MAX_POLLING_ATTEMPTS.DELETE) {
                    clearInterval(intervalId);
                    state.pollingDeleteStatus.delete(assetId);
                    console.warn(`Delete polling timed out for asset ${assetId}`);
                    return;
                }

                try {
                    await getAssetStatus(assetId); // Use the correct function here
                    // If we get here, the asset still exists
                    state.pollingDeleteStatus.set(assetId, {
                        intervalId,
                        attempts: newAttempts,
                        channelId,
                    });
                } catch (error) {
                    if (error.code === 404) {
                        // Asset has been deleted from the backend
                        clearInterval(intervalId);
                        state.pollingDeleteStatus.delete(assetId);
                        dispatch({
                            type: actionTypes.REMOVE_ASSET,
                            payload: { channelId, assetId },
                        });
                    } else {
                        // Other error, continue polling
                        state.pollingDeleteStatus.set(assetId, {
                            intervalId,
                            attempts: newAttempts,
                            channelId,
                        });
                    }
                }
            }, POLLING_INTERVAL.DELETE);

            // Initialize polling state
            state.pollingDeleteStatus.set(assetId, {
                intervalId,
                attempts: 0,
                channelId,
            });
        },
        [state.pollingDeleteStatus, dispatch]
    );

    const stopPollingDeleteStatus = useCallback(
        (assetId) => {
            const pollState = state.pollingDeleteStatus.get(assetId);
            if (pollState) {
                clearInterval(pollState.intervalId);
                state.pollingDeleteStatus.delete(assetId);
            }
        },
        [state.pollingDeleteStatus]
    );

    const handleDeleteAsset = useCallback(
        async (channelId, assetId) => {
            const actionKey = `delete-${assetId}`;
            if (isActionInProgress(actionKey)) return;

            const asset = state.queues[channelId]?.assets.find((a) => a.id === assetId);
            if (LOCKED_STATES.includes(asset?.status)) {
                alert('Cannot delete video while it is being posted or deleted.');
                return;
            }

            if (!window.confirm('Are you sure you want to delete this video?')) {
                return;
            }

            // Stop any active polling
            stopPollingPostStatus(assetId);
            stopPollingDeleteStatus(assetId);

            dispatch({ type: actionTypes.ACTION_START, payload: { actionKey } });
            const originalAsset = state.queues[channelId]?.assets.find((a) => a.id === assetId);

            try {
                // Update status to deleting
                dispatch({
                    type: actionTypes.SET_ASSET,
                    payload: {
                        channelId,
                        asset: { ...originalAsset, status: ASSET_STATUS.DELETING },
                    },
                });

                await deleteAssets([assetId]);
                // Start polling for deletion confirmation
                startPollingDeleteStatus(channelId, assetId);
            } catch (error) {
                console.error('Failed to delete asset:', error);
                alert('Failed to delete video. Please try again.');
                // Revert status change on error
                if (originalAsset) {
                    dispatch({
                        type: actionTypes.SET_ASSET,
                        payload: { channelId, asset: originalAsset },
                    });
                }
            } finally {
                dispatch({ type: actionTypes.ACTION_END, payload: { actionKey } });
            }
        },
        [
            state.queues,
            isActionInProgress,
            stopPollingPostStatus,
            stopPollingDeleteStatus,
            startPollingDeleteStatus,
        ]
    );

    const handleReprocessAsset = useCallback(
        async (channelId, assetId) => {
            const actionKey = `reprocess-${assetId}`;
            if (isActionInProgress(actionKey)) return;

            if (!window.confirm('Are you sure you want to reprocess this video?')) {
                return;
            }
            dispatch({ type: actionTypes.ACTION_START, payload: { actionKey } });
            // Optionally update status optimistically to 'processing' or similar
            // dispatch({ type: actionTypes.SET_ASSET, payload: { channelId, asset: { id: assetId, status: 'processing' } } });

            try {
                const { status } = await processAsset(assetId);
                console.log("Reprocess status:", status);
                dispatch({
                    type: actionTypes.SET_ASSET,
                    payload: {
                        channelId,
                        asset: { id: assetId, status },
                    }
                });

                startPollingProcessStatus(channelId, assetId);
            } catch (error) {
                console.error('Failed to reprocess asset:', error);
                alert('Failed to reprocess video. Please try again.');
                // Revert optimistic status update if implemented
            } finally {
                dispatch({ type: actionTypes.ACTION_END, payload: { actionKey } });
            }
        },
        [refreshQueue, isActionInProgress, startPollingProcessStatus] // Added startPollingProcessStatus dependency
    );

    // Effect to automatically start polling for assets in relevant states
    useEffect(() => {
        Object.entries(state.queues).forEach(([channelId, queue]) => {
            if (queue && queue.assets) {
                queue.assets.forEach((asset) => {
                    // Start polling if asset is uploaded or processing and not already being polled for processing
                    if (
                        (asset.status === ASSET_STATUS.PENDING || asset.status === ASSET_STATUS.PROCESSING) && // 'processing' might be initial state from PostMenu
                        !state.pollingProcessStatus.has(asset.id)
                    ) {
                        console.log(
                            `Starting process polling for asset ${asset.id} with status ${asset.status}`
                        );
                        startPollingProcessStatus(channelId, asset.id);
                    }

                    // Start polling if asset is posting and not already being polled for posting
                    if (
                        asset.status === ASSET_STATUS.POSTING &&
                        !state.pollingPostStatus.has(asset.id)
                    ) {
                        console.log(`Starting post polling for asset ${asset.id}`);
                        startPollingPostStatus(channelId, asset.id);
                    }

                    // Start polling if asset is deleting and not already being polled for deletion
                    if (
                        asset.status === ASSET_STATUS.DELETING &&
                        !state.pollingDeleteStatus.has(asset.id)
                    ) {
                        console.log(`Starting delete polling for asset ${asset.id}`);
                        startPollingDeleteStatus(channelId, asset.id);
                    }
                });
            }
        });
        // Dependencies: state.queues to re-run when assets change, and the polling start functions
    }, [
        state.queues,
        startPollingProcessStatus,
        startPollingPostStatus,
        startPollingDeleteStatus,
        state.pollingProcessStatus,
        state.pollingPostStatus,
        state.pollingDeleteStatus,
    ]);

    // Add cleanup effect for polling intervals
    useEffect(() => {
        return () => {
            // Clean up all polling intervals on unmount
            state.pollingPostStatus.forEach((pollState, assetId) => {
                clearInterval(pollState.intervalId);
            });
            state.pollingPostStatus.clear();

            state.pollingDeleteStatus.forEach((pollState, assetId) => {
                clearInterval(pollState.intervalId);
            });
            state.pollingDeleteStatus.clear();

            state.pollingProcessStatus.forEach((pollState, assetId) => {
                clearInterval(pollState.intervalId);
            });
            state.pollingProcessStatus.clear();
        };
    }, [state.pollingPostStatus, state.pollingDeleteStatus, state.pollingProcessStatus]);

    const value = {
        getQueueState,
        startPollingProcessStatus, // Expose the new polling function
        stopPollingProcessStatus, // Expose the stop function
        fetchAllAssetsForChannel,
        refreshQueue,
        handleUpdateTitle,
        handlePostNow,
        handleDeleteAsset,
        handleReprocessAsset,
        isActionInProgress,
    };

    return <QueueContext.Provider value={value}>{children}</QueueContext.Provider>;
};

// Custom hook to consume the context
export const useQueue = (channelId) => {
    const context = useContext(QueueContext);
    if (context === undefined) {
        throw new Error('useQueue must be used within a QueueProvider');
    }

    const queueState = context.getQueueState(channelId);

    // Trigger fetch if channelId is provided and queue hasn't been loaded or started loading
    useEffect(() => {
        if (
            channelId &&
            !queueState.isLoading &&
            queueState.assets.length === 0 &&
            !queueState.error &&
            !queueState.isFullyLoaded
        ) {
            // The check for active fetches is handled within fetchAllAssetsForChannel itself.
            context.fetchAllAssetsForChannel(channelId);
        }
        // Add dependency on queueState.assets.length to refetch if cleared by refresh
    }, [
        channelId,
        queueState.isLoading,
        queueState.assets.length,
        queueState.error,
        queueState.isFullyLoaded,
        context,
    ]);

    // Return state specific to the channelId and the actions
    return {
        assets: queueState.assets,
        isLoading: queueState.isLoading,
        isFullyLoaded: queueState.isFullyLoaded,
        error: queueState.error,
        refreshQueue: () => context.refreshQueue(channelId),
        updateTitle: (assetId, newTitle) => context.handleUpdateTitle(channelId, assetId, newTitle),
        postNow: (assetId) => context.handlePostNow(channelId, assetId),
        deleteAsset: (assetId) => context.handleDeleteAsset(channelId, assetId),
        reprocessAsset: (assetId) => context.handleReprocessAsset(channelId, assetId),
        isActionInProgress: context.isActionInProgress, // Pass this through
    };
};
