import { styled } from 'styled-components';
import { useEffect, useState } from 'react';
import { useChannel } from 'hocs/channel';
import { listAssets } from 'services/backend';
import PostMenu from 'components/Queue/PostMenu';

const Container = styled.div`
    display: grid;
    grid-template-columns: 1fr minmax(0, 300px);
    grid-template-areas: 'assets channels';
    width: 100%;
    height: 100%;
    border-radius: 20px;
    background-color: #f0f0f0;
`;

const AssetContainer = styled.div`
    grid-area: assets;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
`;

const AssetList = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 10px;
    padding: 20px;
    margin-bottom: 20px;
    overflow-y: auto;
`;

const AssetCard = styled.div`
    width: 100px;
    height: 100px;
    border-radius: 12px;
    cursor: pointer;
    border: ${(props) => (props.selected ? '3px solid #4CCF50' : '3px solid #9a9a9a')};
    transition: border-color 0.2s ease;
    overflow: hidden;
    position: relative;
    margin: 0 auto;
`;

const AssetThumbnail = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    select: none;
    draggable: false;
`;

const UploadButtonRow = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const ActionButton = styled.div`
    width: 200px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 6px;
    background-color: ${(props) => (props.disabled ? '#ccc' : 'orange')};
    color: black;
    cursor: pointer;
    margin-bottom: 20px;
    transition: background-color 0.2s ease;
`;

const ButtonText = styled.h3`
    color: #5f5f5f;
`;

const ChannelListContainer = styled.div`
    grid-area: channels;
    border-left: 3px solid #9a9a9a;
`;

const ChannelContainer = styled.div`
    width: calc(100% -15px);
    height: 40px;
    display: flex;
    padding-left: 15px;
    align-items: center;
    cursor: pointer;
    background-color: ${(props) => (props.selected ? '#a0a0a0' : 'transparent')};
`;

const ChannelTitleContainer = styled.div`
    width: 100%;
    border-bottom: 2px solid #9a9a9a;
    display: flex;
    justify-content: center;
    margin-bottom: 5px;
`;

const ChannelTitleText = styled.h3`
    color: #5f5f5f;
`;

const ChannelLabel = styled.p`
    font-size: 16px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
`;

const AssetItem = ({ asset, selected, onClick }) => {
    return (
        <AssetCard selected={selected} onClick={onClick}>
            <AssetThumbnail src={asset.thumbnail_url} alt='Asset thumbnail' />
        </AssetCard>
    );
};

const AssetsView = () => {
    const { channels } = useChannel();
    const [assets, setAssets] = useState([]);
    const [highlightedChannel, setHighlightedChannel] = useState(null);
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [showPostMenu, setShowPostMenu] = useState(false);

    useEffect(() => {
        if (highlightedChannel) {
            // todo pull assets until all assets are exhibited
            listAssets(1, 10, highlightedChannel.id).then((res) => {
                console.log('Assets:', res);
                setAssets(res.items);
            });
        }
    }, [highlightedChannel]);

    useEffect(() => {
        if (channels && channels.length > 0) {
            setHighlightedChannel(channels[0]);
        }
    }, [channels]);

    const handleSelectChannel = (channel) => {
        setHighlightedChannel(channel);
    };

    const handleAssetClick = (asset) => {
        setSelectedAsset(selectedAsset?.id === asset.id ? null : asset);
    };

    const handleAddAsset = async (video) => {
        // update the asset list after adding a new asset
        // should do this smartly, e.g if the newly pulled
        // exists in the list, stop pulling. otherwise, keep
        // pulling until it's exhibited
    }

    return (
        <Container>
            <AssetContainer>
                <AssetList>
                    {assets.map((asset) => (
                        <AssetItem
                            key={asset.id}
                            asset={asset}
                            selected={selectedAsset?.id === asset.id}
                            onClick={() => handleAssetClick(asset)}
                        />
                    ))}
                </AssetList>
                <UploadButtonRow>
                    <ActionButton onClick={() => setShowPostMenu(true)} disabled={!highlightedChannel}>
                        <ButtonText>Upload</ButtonText>
                    </ActionButton>
                </UploadButtonRow>
            </AssetContainer>
            <ChannelListContainer>
                <ChannelTitleContainer>
                    <ChannelTitleText>Channels</ChannelTitleText>
                </ChannelTitleContainer>

                {channels.map((channel, index) => (
                    <ChannelContainer
                        key={index}
                        onClick={() => handleSelectChannel(channel)}
                        selected={highlightedChannel?.id === channel.id}
                    >
                        <ChannelLabel>{channel.display_name}</ChannelLabel>
                    </ChannelContainer>
                ))}
            </ChannelListContainer>

            {showPostMenu && (
                <PostMenu
                    channel={highlightedChannel}
                    onClose={() => setShowPostMenu(false)}
                    onSuccess={handleAddAsset}
                />
            )}
        </Container>
    );
};

export default AssetsView;
