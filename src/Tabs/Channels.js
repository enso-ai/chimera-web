import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router'; // Add router hooks
import styled from 'styled-components';
import { useChannel } from 'hocs/channel'; // Add channel hook

import Loader from 'components/Loader'; // Add Loader
import ChannelList from 'components/ChannelList';
import ChannelData from 'components/Channels/ChannelData';

const Container = styled.div`
    display: grid;
    border-radius: 20px;
    height: 100%;
    overflow: hidden;
    grid-template-areas: 'analytics accounts';
    grid-template-rows: 1fr;
    grid-template-columns: 1fr minmax(0, min(25%, 300px));

    background-color: #f0f0f0; /* Just for visibility */
`;

const LoaderContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    grid-column: 1 / -1; /* Span all columns */
    grid-row: 1 / -1; /* Span all rows */
`;

const ChannelListContainer = styled.div`
    grid-area: accounts;
    border-left: 3px solid #9a9a9a;
`;

const ChannelsView = () => {
    // Use channel context
    const { channels, loadingChannels, errorChannels, refreshAllData } = useChannel();
    const location = useLocation();
    const navigate = useNavigate();

    // Keep local state for highlighted channel
    const [highlightedChannel, setHighlightedChannel] = useState(null);

    // Effect to handle refresh parameter
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get('refresh') === 'true') {
            console.log('Refresh detected, fetching channels...');
            refreshAllData(); // Call refreshStats to fetch channels and stats
            // Remove the query parameter from the URL without reloading
            navigate(location.pathname, { replace: true });
        }
    }, [location.search, refreshAllData, navigate]);

    // Effect to set default highlighted channel when channels load/change
    useEffect(() => {
        // Set highlighted channel only if channels exist and none is highlighted yet,
        // or if the currently highlighted one is no longer in the list
        if (
            channels &&
            channels.length > 0 &&
            (!highlightedChannel || !channels.some((c) => c.id === highlightedChannel.id))
        ) {
            console.log('Setting default highlighted channel:', channels[0]);
            setHighlightedChannel(channels[0]);
        } else if (channels && channels.length === 0) {
            // Clear highlight if no channels
            setHighlightedChannel(null);
        }
        // Dependency on channels array content requires careful stringification or length check
    }, [channels, highlightedChannel]); // Rerun when channels array changes

    if (loadingChannels) {
        return (
            <Container>
                <LoaderContainer>
                    <Loader />
                </LoaderContainer>
            </Container>
        ); // Show loader while fetching
    }

    if (errorChannels) {
        return <div>Error loading channels: {errorChannels.message}</div>; // Show error
    }

    return (
        <Container>
            <ChannelData channel={highlightedChannel} />
            <ChannelListContainer>
                <ChannelList
                    channels={channels} // Pass channels from context
                    onSelectChannel={setHighlightedChannel}
                    highlightedChannel={highlightedChannel}
                />
            </ChannelListContainer>
        </Container>
    );
};
export default ChannelsView;
