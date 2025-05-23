import { styled } from 'styled-components';
import { useState, useEffect, useCallback } from 'react';
import { useQueue } from 'hocs/queue';
import { FiEdit, FiCheck, FiX, FiRefreshCw, FiSend, FiTrash2 } from 'react-icons/fi';
import {
    ASSET_STATUS,
    STATUS_COLORS,
    PROCESSABLE_STATES,
    LOCKED_STATES,
} from 'constants/assetStatus';
import ThumbnailButton from './ThumbnailButton';
import { ButtonColors } from 'constants';

const Row = styled.div`
    display: grid;
    grid-template-columns: 90px 1fr 200px;
    gap: 20px;
    align-items: center;
    padding: 20px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const InfoSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const TitleSection = styled.div`
    display: flex;
    align-items: center; // Vertically align items
    gap: 8px;
`;

const Title = styled.input`
    font-size: 16px;
    padding: 4px 8px;
    border: ${(props) => (props.isEditing ? '1px solid #4CCF50' : '1px solid #ddd')};
    border-radius: 4px;
    background: ${(props) => (props.isEditing ? 'white' : '#f0f0f0')};
    color: #333;
    width: 100%;
    decoration: underline;
    &:disabled {
        background: ${(props) => (props.isEditing ? 'white' : '#f0f0f0')};
        color: #666;
        cursor: default;
    }
`;

const StatusSection = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
`;

const StatusIndicator = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 14px;
    color: ${(props) => STATUS_COLORS[props.status] || '#666666'};
    user-select: none;
    position: relative; // Needed for tooltip positioning
`;

const TooltipText = styled.span`
    visibility: hidden;
    width: max-content;
    max-width: 200px; /* Adjust as needed */
    background-color: #555;
    color: #fff;
    text-align: center;
    border-radius: 6px;
    padding: 5px 8px;
    position: absolute;
    z-index: 1;
    top: 125%; /* Position below the text */
    left: 50%;
    transform: translateX(-50%);
    opacity: 0;
    transition: opacity 0.3s;
    font-size: 11px; /* Smaller font for tooltip */
    font-weight: normal; /* Normal weight for tooltip */
    white-space: pre-wrap; /* Allow wrapping */

    /* Tooltip arrow */
    &::after {
        content: '';
        position: absolute;
        bottom: 100%; /* Arrow points up */
        left: 50%;
        margin-left: -5px;
        border-width: 5px;
        border-style: solid;
        border-color: transparent transparent #555 transparent; /* Arrow color */
    }
`;

// Container to manage hover state for the tooltip (copied from previous attempt)
const StatusContainer = styled.div`
    position: relative;
    display: inline-block; // Or block, depending on layout needs

    &:hover ${TooltipText} {
        visibility: visible;
        opacity: 1;
    }
`;

const LoadingSpinner = styled.span`
    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
    display: inline-block;
    width: 12px;
    height: 12px;
    border: 2px solid #2196f3;
    border-top: 2px solid transparent;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-right: 4px;
`;

const ActionButtons = styled.div`
    display: flex;
    gap: 12px;
    justify-content: flex-end;
`;

const IconButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: none;
    border-radius: 4px;
    background: ${(props) => props.color || 'gray'};
    color: white;
    cursor: pointer;
    transition: opacity 0.2s;
    &:hover {
        opacity: 0.8;
    }
    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

const FileAsset = ({ asset, channelId, onThumbnailClick }) => {
    const {
        updateTitle,
        postNow,
        deleteAsset,
        reprocessAsset,
        allowPost,
        isActionInProgress,
    } = useQueue(channelId); // Use the hook with the passed channelId

    const [isEditing, setIsEditing] = useState(false); // Manage editing state locally
    const [editedTitle, setEditedTitle] = useState(asset.title); // Manage edited title locally

    // Reset edited title if asset prop changes (e.g., external refresh)
    // or when editing is cancelled/finished
    useEffect(() => {
        setEditedTitle(asset.title);
    }, [asset.title]);

    const handleEditStart = useCallback(() => {
        setEditedTitle(asset.title); // Reset to current title on edit start
        setIsEditing(true);
    }, [asset.title]);

    const handleEditCancel = useCallback(() => {
        setIsEditing(false);
        setEditedTitle(asset.title); // Reset on cancel
    }, [asset.title]);

    const handleEditSave = useCallback(async () => {
        if (editedTitle.trim() === asset.title) {
            setIsEditing(false);
            return; // No change
        }
        // updateTitle is now async within the hook due to optimistic updates
        await updateTitle(asset.id, editedTitle.trim());
        setIsEditing(false); // Exit editing mode after save attempt
    }, [asset.id, asset.title, editedTitle, updateTitle]);

    // Generate action keys for disabling buttons
    const updateActionKey = `update-${asset.id}`;
    const postActionKey = `post-${asset.id}`;
    const deleteActionKey = `delete-${asset.id}`;
    const reprocessActionKey = `reprocess-${asset.id}`;

    return (
        <Row>
            <ThumbnailButton
                src={asset.thumbnail_url}
                alt={asset.title}
                onClick={() => onThumbnailClick(asset)}
            />
            <InfoSection>
                <TitleSection>
                    <Title
                        value={editedTitle} // Always use local state for input value
                        onChange={(e) => setEditedTitle(e.target.value)}
                        disabled={!isEditing || isActionInProgress(updateActionKey)} // Disable if not editing or update is in progress
                        isEditing={isEditing}
                        onKeyDown={(e) => {
                            // Add keyboard shortcuts
                            if (e.key === 'Enter') handleEditSave();
                            if (e.key === 'Escape') handleEditCancel();
                        }}
                    />
                    {isEditing ? (
                        <>
                            <IconButton
                                color={ButtonColors.POSITIVE}
                                onClick={handleEditSave}
                                disabled={isActionInProgress(updateActionKey)}
                            >
                                {isActionInProgress(updateActionKey) ? (
                                    '...'
                                ) : (
                                    <FiCheck size={18} />
                                )}
                            </IconButton>
                            <IconButton
                                color={ButtonColors.NEGATIVE}
                                onClick={handleEditCancel}
                                disabled={isActionInProgress(updateActionKey)}
                            >
                                <FiX size={18} />
                            </IconButton>
                        </>
                    ) : (
                        <IconButton
                            onClick={handleEditStart}
                            disabled={isActionInProgress(updateActionKey)}
                        >
                            <FiEdit size={18} />
                        </IconButton>
                    )}
                </TitleSection>
                <StatusSection>
                    <StatusContainer>
                        <StatusIndicator
                            status={asset.status}
                            hasTooltip={
                                asset.status === ASSET_STATUS.POSTING_FAILED && asset.failed_reason
                            }
                        >
                            {asset.status === ASSET_STATUS.POSTING ? <LoadingSpinner /> : '●'}
                            {asset.status === ASSET_STATUS.PROCESSING_FAILED // Keep existing status text logic
                                ? 'Processing Failed'
                                : asset.status === ASSET_STATUS.POSTING_FAILED
                                ? 'Posting Failed'
                                : asset.status.charAt(0).toUpperCase() + asset.status.slice(1)}
                            {/* Conditionally render TooltipText */}
                            {asset.status === ASSET_STATUS.POSTING_FAILED &&
                                asset.failed_reason && (
                                    <TooltipText>{asset.failed_reason}</TooltipText>
                                )}
                        </StatusIndicator>
                    </StatusContainer>
                </StatusSection>
            </InfoSection>
            <ActionButtons>
                <IconButton
                    color={ButtonColors.REFRESH}
                    onClick={() => reprocessAsset(asset.id)}
                    disabled={
                        !PROCESSABLE_STATES.includes(asset.status) ||
                        isActionInProgress(reprocessActionKey)
                    }
                    title='Reprocess'
                >
                    {isActionInProgress(reprocessActionKey) ? '...' : <FiRefreshCw size={18} />}
                </IconButton>
                <IconButton
                    color={ButtonColors.PRIMARY}
                    onClick={() => postNow(asset.id)}
                    disabled={
                        asset.status !== ASSET_STATUS.PROCESSED ||
                        isActionInProgress(postActionKey) ||
                        !allowPost // Disable if allowPost is false
                    }
                    title={!allowPost ? 'Posting not allowed for this channel' : 'Post Now'} // Add tooltip based on allowPost
                >
                    {isActionInProgress(postActionKey) ? '...' : <FiSend size={18} />}
                </IconButton>
                <IconButton
                    color={ButtonColors.DANGER}
                    onClick={() => deleteAsset(asset.id)}
                    disabled={
                        LOCKED_STATES.includes(asset.status) || isActionInProgress(deleteActionKey)
                    }
                    title='Delete'
                >
                    {isActionInProgress(deleteActionKey) ? '...' : <FiTrash2 size={18} />}
                </IconButton>
            </ActionButtons>
        </Row>
    );
};

export default FileAsset;
