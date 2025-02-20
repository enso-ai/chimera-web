import { useState, useEffect } from 'react';

import styled from 'styled-components';

import ChannelList from '../components/Channels/ChannelList';
import ChannelData from '../components/Channels/ChannelData';

import { listChannels } from 'services/backend';

const Container = styled.div`
    display: grid;
    height: 100%;
    grid-template-areas: 'analytics accounts';
    grid-template-columns: 1fr minmax(0, min(25%, 300px));
`;

const AnalyticsContainer = styled.div`
    grid-area: analytics;
    background-color: #e0e0e0; /* Just for visibility */
`;

const ChannelListContainer = styled.div`
    grid-area: accounts;
    background-color: #d0d0d0; /* Just for visibility */
`;

const ChannelsView = () => {
    const [channels, setChannels] = useState([]);
    const [highlightedChannel, setHighlightedChannel] = useState(null);

    useEffect(() => {
        listChannels().then((res) => {
            console.log("returned channels", res);

            setChannels(res.data);
            if (res.data.length > 0)
                setHighlightedChannel(res.data[0]);
        });
    }, [])

    useEffect(() => {
        console.log("selected channel", highlightedChannel);
    }, [highlightedChannel])

    return (
        <Container>
            <ChannelData channel={highlightedChannel} />
            <ChannelListContainer>
                <ChannelList
                    channels={channels}
                    onSelectChannel={setHighlightedChannel}
                    highlightedChannel={highlightedChannel}
                />
            </ChannelListContainer>
        </Container>
    );
};
export default ChannelsView;
