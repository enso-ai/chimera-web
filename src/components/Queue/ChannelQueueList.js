import { styled } from 'styled-components';
import FileAsset from './FileAsset';
import Loader from 'components/Loader'; // Import Loader

const StateContainer = styled.div`
    box-sizing: border-box;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const ListContainer = styled.div`
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: 12px;

    /* Allow content to scroll but hide scrollbar */
    overflow-y: scroll;
    overflow-x: hidden;

    /* Hide scrollbar for Chrome, Safari and Opera */
    &::-webkit-scrollbar {
        display: none;
    }

    /* Hide scrollbar for Firefox */
    scrollbar-width: none;

    /* Hide scrollbar for IE, Edge */
    -ms-overflow-style: none;
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
    error,
}) => {
    // Editing state is now managed within FileAsset
    // const [editingId, setEditingId] = useState(null);

    // Removed handleEditStart and handleEditSave as they are no longer needed here

    if (isLoading && assets.length === 0) {
        return (
            <StateContainer>
                <Loader />
            </StateContainer>
        );
    }

    if (error) {
        return (
            <StateContainer>
                <ErrorMessage>Error loading queue: {error}</ErrorMessage>
            </StateContainer>
        );
    }

    return (
        <ListContainer>
            {assets.map((asset) => (
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
        </ListContainer>
    );
};

export default ChannelQueueList;
