import { styled } from 'styled-components';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { useChannel } from 'hocs/channel';
import { useQueue } from 'hocs/queue';
import { getChannelSchedule, updateChannelSchedule } from 'services/backend';
import UploadDialog from 'components/Queue/UploadDialog';
import ChannelQueueList from 'components/Queue/ChannelQueueList';
import AutoPostSettingDisplay from 'components/Queue/AutoPostSettings/AutoPostSettingsDisplay';
import AutoPostSettingDialog from 'components/Queue/AutoPostSettings/AutoPostSettingsDialog';
import PlayerModal from 'components/Queue/PlayerModal';
import GCSIngestDialog from 'components/Queue/GCSIngestDialog';
import PrePostingDialog from 'components/Queue/PrePostingDialog';
import { Button } from 'components/Button';
import { ButtonColors } from 'constants';
import ChannelList from 'components/ChannelList';
import { FiRefreshCcw } from 'react-icons/fi';

const Container = styled.div`
    display: grid;
    grid-template-columns: 1fr minmax(0, 300px);
    grid-template-areas: 'assets channels';
    width: 100%;
    height: 100%;
    border-radius: 20px;
    background-color: #f0f0f0;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const StatsContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`;

const Summary = styled.div`
    font-size: 16px;
    color: #5f5f5f;
`;

const RefreshButton = styled.button`
    background: transparent;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #5f5f5f;
    padding: 4px;
    border-radius: 4px;
    transition: background-color 0.2s;

    &:hover {
        background-color: #e0e0e0;
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    svg {
        width: 18px;
        height: 18px;
    }
`;

const AssetContainer = styled.div`
    box-sizing: border-box;
    height: 100%;
    grid-area: assets;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
    padding: 20px;
    gap: 20px;
`;

const UploadButtonRow = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px; // Add gap between buttons
`;

const ChannelListContainer = styled.div`
    grid-area: channels;
    border-left: 3px solid #9a9a9a;
`;

const AssetsView = () => {
    const { channels } = useChannel();
    const [highlightedChannel, setHighlightedChannel] = useState(null);
    const [highlightedChannelSettings, setHighlightedChannelSettings] = useState(null);
    const [showUploadDialog, setShowUploadDialog] = useState(false);
    const [showGCSIngestDialog, setShowGCSIngestDialog] = useState(false); // State for the new dialog
    const [showAutoPostSettings, setShowAutoPostSettings] = useState(false);
    const [scheduleSettingLoading, setScheduleSettingLoading] = useState(false);
    const [playingAsset, setPlayingAsset] = useState(null);

    const {
        assets,
        isLoading,
        error,
        refreshQueue,
        creatorInfoDialogOpen,
        activeAssetForPosting,
        creatorInfo,
        isCreatorInfoLoading,
        creatorInfoError,
        handlePostConfirm,
        closeCreatorInfoDialog,
    } = useQueue(highlightedChannel?.id);

    useEffect(() => {
        if (channels && channels.length > 0) {
            setHighlightedChannel(channels[0]);
        }
    }, [channels]);

    useEffect(() => {
        if (highlightedChannel) {
            setScheduleSettingLoading(true);
            try {
                // Fetch the schedule for the selected channel
                getChannelSchedule(highlightedChannel.id)
                    .then((schedule) => {
                        console.log('Fetched schedule:', schedule);
                        setHighlightedChannelSettings(schedule);
                    })
                    .catch((err) => {
                        console.error('Failed to fetch schedule:', err);
                    });
            } finally {
                setScheduleSettingLoading(false);
            }
        }
    }, [highlightedChannel]);

    const handleSelectChannel = (channel) => {
        setHighlightedChannel(channel);
    };

    const handleRefreshQueue = useCallback(() => {
        if (highlightedChannel?.id) {
            refreshQueue();
        }
    }, [highlightedChannel?.id, refreshQueue]);

    // handleAddAsset is called by PostMenu on success.
    // PostMenu will now call refreshQueue directly via the hook.
    // We still need a function to pass to PostMenu's onSuccess prop,
    // but it might not need to do anything here if PostMenu handles the refresh.
    // Let's keep it simple for now and let PostMenu handle the refresh.
    const handleAddAssetSuccess = useCallback(() => {
        // No action needed here anymore, PostMenu will trigger refresh via useQueue.
        console.log('Asset upload process completed in PostMenu.');
    }, []);

    // Handler for successful GCS ingestion start
    const handleGCSIngestSuccess = useCallback(
        (channel_id) => {
            console.log('GCS ingestion job started successfully.');
            // Queue refresh is handled within the dialog component
            refreshQueue();
            setShowGCSIngestDialog(false);
        },
        [refreshQueue]
    );

    const handleToggle = useCallback(
        async (isEnabled) => {
            if (scheduleSettingLoading) return;

            setScheduleSettingLoading(true);
            try {
                const new_schedule = await updateChannelSchedule(highlightedChannel.id, {
                    ...highlightedChannelSettings,
                    schedule_enabled: isEnabled,
                });
                setHighlightedChannelSettings(new_schedule); // Optimistic update
            } catch (err) {
                alert('Failed to update schedule. Please try again.');
            } finally {
                setScheduleSettingLoading(false);
            }
        },
        [highlightedChannel, highlightedChannelSettings, scheduleSettingLoading]
    );

    const handleSaveSettings = async (newSettings) => {
        if (scheduleSettingLoading) return;
        setScheduleSettingLoading(true);
        try {
            const updatedSettings = await updateChannelSchedule(highlightedChannel.id, newSettings);
            setHighlightedChannelSettings(updatedSettings); // Optimistic update
        } catch (err) {
            alert('Failed to update settings. Please try again.');
        } finally {
            setScheduleSettingLoading(false);
            setShowAutoPostSettings(false);
        }
    };

    const notPostedCount = useMemo(
        () => assets.filter((a) => !a.status === 'posted').length,
        [assets]
    );

    return (
        <Container>
            <AssetContainer>
                <Header>
                    <StatsContainer>
                        <Summary>
                            Total Assets: {assets.length} | Not Posted: {notPostedCount}
                            {isLoading && assets.length > 0 && ' (Loading more...)'}
                        </Summary>
                        <RefreshButton
                            onClick={handleRefreshQueue}
                            disabled={isLoading || !highlightedChannel}
                            title='Refresh Queue'
                        >
                            <FiRefreshCcw />
                        </RefreshButton>
                    </StatsContainer>
                    <AutoPostSettingDisplay
                        settings={highlightedChannelSettings}
                        onToggle={handleToggle}
                        onOpenSettings={() => setShowAutoPostSettings(true)}
                    />
                </Header>

                <ChannelQueueList
                    assets={assets}
                    channelId={highlightedChannel?.id}
                    isLoading={isLoading}
                    error={error}
                    onPlayVideo={(asset) => {
                        if (asset) {
                            setPlayingAsset(asset);
                        }
                    }}
                />
                <UploadButtonRow>
                    <Button
                        onClick={() => setShowUploadDialog(true)}
                        disabled={!highlightedChannel || !highlightedChannel.id || isLoading}
                        color={ButtonColors.SECONDARY}
                    >
                        Upload Files
                    </Button>
                    <Button
                        onClick={() => setShowGCSIngestDialog(true)}
                        disabled={!highlightedChannel || !highlightedChannel.id || isLoading}
                        color={ButtonColors.PRIMARY}
                    >
                        Ingest GCS
                    </Button>
                </UploadButtonRow>
            </AssetContainer>
            <ChannelListContainer>
                <ChannelList
                    channels={channels}
                    onSelectChannel={handleSelectChannel}
                    highlightedChannel={highlightedChannel}
                    showAddButton={false}
                />
            </ChannelListContainer>

            {showUploadDialog && (
                <UploadDialog
                    channel={highlightedChannel}
                    onClose={() => setShowUploadDialog(false)}
                    onSuccess={handleAddAssetSuccess}
                />
            )}

            {/* Render the GCS Ingest Dialog */}
            {showGCSIngestDialog && (
                <GCSIngestDialog
                    channel={highlightedChannel}
                    onClose={() => setShowGCSIngestDialog(false)}
                    onSuccess={handleGCSIngestSuccess}
                />
            )}

            {showAutoPostSettings && (
                <AutoPostSettingDialog
                    settings={highlightedChannelSettings}
                    onClose={() => setShowAutoPostSettings(false)}
                    onSave={handleSaveSettings}
                />
            )}

            {creatorInfoDialogOpen && activeAssetForPosting && (
                <PrePostingDialog
                    creatorInfo={creatorInfo}
                    asset={activeAssetForPosting}
                    channelId={highlightedChannel?.id}
                    onClose={closeCreatorInfoDialog}
                    onConfirm={handlePostConfirm}
                    isLoading={isCreatorInfoLoading}
                    error={creatorInfoError}
                    onPlayVideo={(asset) => {
                        if (asset) setPlayingAsset(asset);
                    }}
                />
            )}

            {playingAsset && (
                <PlayerModal playingAsset={playingAsset} onClose={() => setPlayingAsset(null)} />
            )}
        </Container>
    );
};

export default AssetsView;
