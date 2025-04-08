import { styled } from 'styled-components';
import FileAsset from './FileAsset';
import Loader from 'components/Loader'; // Import Loader

const Container = styled.div`
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    padding: 20px;
`;

const Summary = styled.div`
    font-size: 16px;
    color: #5f5f5f;
    margin-bottom: 20px;
`;

const List = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
    overflow-y: auto;
`;

const ErrorMessage = styled.div`
    color: red;
    padding: 10px;
    text-align: center;
`;

// Removed AssetRow and its associated styled components as they are now in FileAsset.js

const ChannelQueueList = ({
    assets = [], // Default to empty array
    channelId,
    isLoading,
    error
}) => {
    // Editing state is now managed within FileAsset
    // const [editingId, setEditingId] = useState(null);
    const notPostedCount = assets.filter(a => !a.is_posted).length;

    // Removed handleEditStart and handleEditSave as they are no longer needed here

    if (isLoading && assets.length === 0) {
        return <Container><Loader /></Container>;
    }

    if (error) {
        return <Container><ErrorMessage>Error loading queue: {error}</ErrorMessage></Container>;
    }

    return (
        <Container>
            <Summary>
                Total Assets: {assets.length} | Not Posted: {notPostedCount}
                {isLoading && assets.length > 0 && " (Loading more...)"}
            </Summary>
            <List>
                {assets.map(asset => (
                    <FileAsset
                        key={asset.id}
                        asset={asset}
                        // Pass channelId down so FileAsset can use the hook correctly
                        // Remove props related to editing state and handlers
                        channelId={channelId}
                    />
                ))}
                {assets.length === 0 && !isLoading && (
                    <div>No assets in the queue for this channel.</div>
                )}
            </List>
        </Container>
    );
};

export default ChannelQueueList;
