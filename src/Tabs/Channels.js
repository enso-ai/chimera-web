import { useState, useEffect } from 'react';

import styled from 'styled-components';

import ChannelList from '../components/Channels/ChannelList';
import ChannelData from '../components/Channels/ChannelData';

import { listChannels } from 'services/backend';

const Container = styled.div`
    display: grid;
    border-radius: 20px;
    height: 100%;
    overflow: hidden;
    grid-template-areas: 'analytics accounts';
    grid-template-columns: 1fr minmax(0, min(25%, 300px));

    background-color: #f0f0f0; /* Just for visibility */
`;

const AnalyticsContainer = styled.div`
    grid-area: analytics;
`;

const ChannelListContainer = styled.div`
    grid-area: accounts;
    border-left: 3px solid #9a9a9a;
`;

const ChannelsView = () => {
    const [channels, setChannels] = useState([]);
    const [highlightedChannel, setHighlightedChannel] = useState(null);

    useEffect(() => {
        listChannels().then((res) => {
            console.log('returned channels', res);

            setChannels(res.data);
            if (res.data.length > 0) setHighlightedChannel(res.data[0]);
        });
    }, []);

    useEffect(() => {
        console.log('selected channel', highlightedChannel);
    }, [highlightedChannel]);

    return (
        <Container>
            <AnalyticsContainer>
                <ChannelData channel={highlightedChannel} />
            </AnalyticsContainer>
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
