import { useState, useEffect } from 'react';
import styled from 'styled-components';

import { getTotalStats, getChannelStats } from 'services/backend';
import { formatNumber } from 'utils/numbers';
import ChartComponent from 'components/Chart';

const Container = styled.div`
    height: 100%;

    display: grid;
    grid-template-rows: auto 1fr;
    grid-template-columns: repeat(5, 1fr);
    gap: 20px;
`;

const StatsCardContainer = styled.div`
    box-sizing: border-box;
    background: #f0f0f0;
    border: 1px solid #ccc;

    padding: 20px;
    aspect-ratio: 1 / 1;

    border-radius: 20px;
    width: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const StatsCardTitle = styled.div`
    font-size: calc(1.5 * 100%);
    font-weight: bold;
    margin-bottom: 10px;
`;

const StatsCardCount = styled.div`
    font-size: calc(1.5 * 100%);
    text-align: right;
`;

const StatsChartContainer = styled.div`
    position: relative;
    background: #f0f0f0;
    grid-column: 1 / span 5;
    grid-row: 2;
    border-radius: 20px;
    padding: 20px;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
`;

const StatsCard = ({ title, count }) => {
    const capTitle = title.charAt(0).toUpperCase() + title.slice(1);
    return (
        <StatsCardContainer>
            <StatsCardTitle>{capTitle}</StatsCardTitle>
            <StatsCardCount>{formatNumber(count)}</StatsCardCount>
        </StatsCardContainer>
    );
};

export default function Dashboard() {
    const statsKeys = ['channels', 'videos', 'views', 'likes', 'comments'];
    const [counters, setCounters] = useState(statsKeys.map((key) => ({ [key]: 'N/A' })));
    const [statsData, setStatsData] = useState([]);

    // useEffect(() => {
    //     getTotalStats().then((data) => {
    //         console.log(data);
    //         const newCounters = {};
    //         for (const key of statsKeys) {
    //             console.log('key=', key, ' value=', data[key]);
    //             newCounters[key] = data[key];
    //         }
    //         console.log(newCounters);

    //         setCounters(newCounters);
    //     });
    // }, []);

    // useEffect(() => {
    //     const channel_id = '508ea579-c51d-5124-856d-975829362fe4';
    //     getChannelStats(channel_id).then((res) => {
    //         console.log('returned stats', res);
    //         setStatsData(res);
    //     });
    // }, []);

    return (
        <Container>
            {statsKeys.map((key) => {
                return <StatsCard title={key} count={counters[key]} />;
            })}
            <StatsChartContainer>
                <ChartComponent data={[...statsData].reverse()} />
            </StatsChartContainer>
        </Container>
    );
}
