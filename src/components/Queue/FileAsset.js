import { styled } from 'styled-components';
import { useState, useEffect, useCallback } from 'react';
import { useQueue } from 'hocs/queue';

const Row = styled.div`
    display: grid;
    grid-template-columns: 120px 1fr 200px;
    gap: 16px;
    align-items: center;
    padding: 12px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const Thumbnail = styled.img`
    width: 120px;
    height: 67.5px; // 16:9 aspect ratio
    object-fit: cover;
    border-radius: 4px;
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
    border: ${props => props.isEditing ? '1px solid #4CCF50' : '1px solid #ddd'};
    border-radius: 4px;
    background: ${props => props.isEditing ? 'white' : '#f5f5f5'};
    color: #333;
    width: 100%;
    decoration: underline;
    &:disabled {
        background: transparent;
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
    color: ${props => {
        switch (props.status) {
            case 'processed': return '#4CCF50';
            case 'uploaded': return '#FFA500';
            case 'failed': return '#FF4444';
            default: return '#666666';
        }
    }};
`;

const PostedIndicator = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 14px;
    color: ${props => props.isPosted ? '#4CCF50' : '#666'};
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
    background: ${props => props.variant === 'danger' ? '#FF4444' : props.variant === 'primary' ? '#4CCF50' : '#f0f0f0'};
    color: ${props => props.variant === 'danger' || props.variant === 'primary' ? 'white' : '#666'};
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

// Renamed Component: FileAsset (formerly AssetRow)
const FileAsset = ({ asset, channelId }) => { // Receive channelId, remove handler/editing props
    const {
        updateTitle,
        postNow,
        deleteAsset,
        reprocessAsset,
        isActionInProgress // Get action status checker
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
            <Thumbnail src={asset.thumbnail_url} alt={asset.title} />
            <InfoSection>
                <TitleSection>
                    <Title
                        value={editedTitle} // Always use local state for input value
                        onChange={(e) => setEditedTitle(e.target.value)}
                        disabled={!isEditing || isActionInProgress(updateActionKey)} // Disable if not editing or update is in progress
                        isEditing={isEditing}
                        onKeyDown={(e) => { // Add keyboard shortcuts
                            if (e.key === 'Enter') handleEditSave();
                            if (e.key === 'Escape') handleEditCancel();
                        }}
                    />
                    {isEditing ? (
                        <>
                            <IconButton onClick={handleEditSave} disabled={isActionInProgress(updateActionKey)}>
                                {isActionInProgress(updateActionKey) ? '...' : '✓'}
                            </IconButton>
                            <IconButton onClick={handleEditCancel} disabled={isActionInProgress(updateActionKey)}>
                                ✕
                            </IconButton>
                        </>
                    ) : (
                        <IconButton onClick={handleEditStart} disabled={isActionInProgress(updateActionKey)}>
                            ✎
                        </IconButton>
                    )}
                </TitleSection>
                <StatusSection>
                    <StatusIndicator status={asset.status}>
                        ● {asset.status.charAt(0).toUpperCase() + asset.status.slice(1)}
                    </StatusIndicator>
                    <PostedIndicator isPosted={asset.is_posted}>
                        {asset.is_posted ? '✓ Posted' : '○ Not Posted'}
                    </PostedIndicator>
                </StatusSection>
            </InfoSection>
            <ActionButtons>
                {asset.status === 'failed' && (
                    <IconButton
                        onClick={() => reprocessAsset(asset.id)}
                        disabled={isActionInProgress(reprocessActionKey)}
                        title="Reprocess"
                    >
                        {isActionInProgress(reprocessActionKey) ? '...' : '↻'}
                    </IconButton>
                )}
                <IconButton
                    variant="primary"
                    onClick={() => postNow(asset.id)}
                    disabled={asset.is_posted || asset.status !== 'processed' || isActionInProgress(postActionKey)}
                    title="Post Now"
                >
                    {isActionInProgress(postActionKey) ? '...' : '↗'}
                </IconButton>
                <IconButton
                    variant="danger"
                    onClick={() => deleteAsset(asset.id)}
                    disabled={isActionInProgress(deleteActionKey)}
                    title="Delete"
                >
                    {isActionInProgress(deleteActionKey) ? '...' : '✕'}
                </IconButton>
            </ActionButtons>
        </Row>
    );
};

export default FileAsset;
