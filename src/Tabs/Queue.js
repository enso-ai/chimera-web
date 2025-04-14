import { styled } from 'styled-components';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { useChannel } from 'hocs/channel';
import { useQueue } from 'hocs/queue';
import { getChannelSchedule, updateChannelSchedule } from 'services/backend';
import PostMenu from 'components/Queue/PostMenu';
import ChannelQueueList from 'components/Queue/ChannelQueueList';
import PostSettingDisplay from 'components/Queue/PostSettings/PostSettingsDisplay';
import PostSettingDialog from 'components/Queue/PostSettings/PostSettingsDialog';

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

const Summary = styled.div`
    font-size: 16px;
    color: #5f5f5f;
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

const AssetsView = () => {
    const { channels } = useChannel();
    const [highlightedChannel, setHighlightedChannel] = useState(null);
    const [highlightedChannelSettings, setHighlightedChannelSettings] = useState(null);
    const [showPostMenu, setShowPostMenu] = useState(false);
    const [showPostSettings, setShowPostSettings] = useState(false);
    const [scheduleSettingLoading, setScheduleSettingLoading] = useState(false);

    const { assets, isLoading, error } = useQueue(highlightedChannel?.id);

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

    // handleAddAsset is called by PostMenu on success.
    // PostMenu will now call refreshQueue directly via the hook.
    // We still need a function to pass to PostMenu's onSuccess prop,
    // but it might not need to do anything here if PostMenu handles the refresh.
    // Let's keep it simple for now and let PostMenu handle the refresh.
    const handleAddAssetSuccess = useCallback(() => {
        // No action needed here anymore, PostMenu will trigger refresh via useQueue.
        console.log('Asset upload process completed in PostMenu.');
    }, []);

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
            setShowPostSettings(false);
        }
    };

    const notPostedCount = useMemo(() => assets.filter((a) => !a.is_posted).length, [assets]);

    return (
        <Container>
            <AssetContainer>
                <Header>
                    <Summary>
                        Total Assets: {assets.length} | Not Posted: {notPostedCount}
                        {isLoading && assets.length > 0 && ' (Loading more...)'}
                    </Summary>
                    <PostSettingDisplay
                        settings={highlightedChannelSettings}
                        onToggle={handleToggle}
                        onOpenSettings={() => setShowPostSettings(true)}
                    />
                </Header>

                <ChannelQueueList
                    assets={assets}
                    channelId={highlightedChannel?.id}
                    isLoading={isLoading}
                    error={error}
                />
                <UploadButtonRow>
                    <ActionButton
                        onClick={() => setShowPostMenu(true)}
                        disabled={!highlightedChannel || !highlightedChannel.id || isLoading}
                    >
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
                    onSuccess={handleAddAssetSuccess}
                />
            )}

            {showPostSettings && (
                <PostSettingDialog
                    settings={highlightedChannelSettings}
                    onClose={() => setShowPostSettings(false)}
                    onSave={handleSaveSettings}
                />
            )}
        </Container>
    );
};

export default AssetsView;
