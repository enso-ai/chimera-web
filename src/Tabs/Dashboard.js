import React, { useState, useMemo } from 'react';
import styled from 'styled-components';

import { useChannel } from 'hocs/channel';
import { formatNumber } from 'utils/numbers';
import ChartComponent from 'components/Chart';
import Loader from 'components/Loader';

// Constants for period options
const PERIOD_OPTIONS = [
    { label: 'Week', value: 'week' },
    { label: 'Month', value: 'month' },
    { label: 'Quarter', value: 'quarter' },
    { label: 'All Time', value: 'all' },
];

const Container = styled.div`
    height: 100%;
    display: grid;
    grid-template-rows: auto 1fr;
    grid-template-columns: repeat(6, 1fr);
    gap: 20px;
`;

const PeriodSelectorContainer = styled.div`
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
`;

const PeriodButton = styled.button`
    padding: 8px 16px;
    margin: 0 5px;
    background-color: ${(props) => (props.active ? '#1a1a1a' : '#f0f0f0')};
    color: ${(props) => (props.active ? 'white' : 'black')};
    border: 1px solid #ccc;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        background-color: ${(props) => (props.active ? '#333' : '#e0e0e0')};
    }
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

// Add Error Message Style
const ErrorMessage = styled.div`
    grid-column: 1 / -1; // Span all columns
    color: red;
    text-align: center;
    padding: 20px;
`;

const StatsChartContainer = styled.div`
    position: relative;
    background: #f0f0f0;
    grid-column: 1 / -1;
    grid-row: 2;
    border-radius: 20px;
    padding: 20px;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
`;

const ChartWrapper = styled.div`
    flex: 1;
    width: 100%;
`;

const LoaderContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    grid-column: 1 / -1; /* Span all columns */
    grid-row: 1 / -1; /* Span all rows */
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
    const statsKeys = ['follower', 'videos', 'views', 'likes', 'comments'];
    const [selectedPeriod, setSelectedPeriod] = useState('week');
    const {
        latestStats,
        channelCount,
        historicalStats,
        loadingLatestStats,
        errorLatestStats,
        loadingHistoricalStats,
        errorHistoricalStats,
        fetchHistoricalStats,
    } = useChannel();

    // Calculate current stats from the latest stats data (always from 'now' period)
    const counters = useMemo(() => {
        // If no data, loading, or error, return N/A for all stats
        if (
            loadingLatestStats ||
            errorLatestStats ||
            !Array.isArray(latestStats) ||
            latestStats.length === 0
        ) {
            return statsKeys.reduce((acc, key) => {
                acc[key] = 'N/A';
                return acc;
            }, {});
        }

        // Get the most recent data point
        const mostRecent = latestStats[0];

        // Extract stats
        return statsKeys.reduce((acc, key) => {
            // Check if the property exists and is a number
            const value = mostRecent[key];
            acc[key] = value !== undefined && value !== null ? Number(value) : 'N/A';
            return acc;
        }, {});
    }, [latestStats, loadingLatestStats, errorLatestStats, statsKeys]);

    // Filter historical stats based on selectedPeriod (client-side filtering)
    const filteredHistoricalStats = useMemo(() => {
        if (!Array.isArray(historicalStats) || historicalStats.length === 0) return [];

        // If it's 'all', just return all the data
        if (selectedPeriod === 'all') return historicalStats;

        const now = new Date();
        // Create a UTC date with hours, minutes, and seconds set to 0
        const nowUtc = new Date(
            Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0)
        );
        let cutoffDate = new Date(nowUtc);

        switch (selectedPeriod) {
            case 'week':
                cutoffDate.setUTCDate(nowUtc.getUTCDate() - 7);
                break;
            case 'month':
                cutoffDate.setUTCDate(nowUtc.getUTCDate() - 30);
                break;
            case 'quarter':
                cutoffDate.setUTCDate(nowUtc.getUTCDate() - 90);
                break;
            default:
                return historicalStats;
        }

        // the final result might skip for today if it's not ready in the backend
        // os if the period is 'week', it might show either 6 or 7 days of date
        return historicalStats.filter((stat) => new Date(stat.date) >= cutoffDate);
    }, [historicalStats, selectedPeriod]);

    // Handle period change - only pass to fetchHistoricalStats which will
    // decide if an API call is needed or just update the period for filtering
    const handlePeriodChange = (period) => {
        setSelectedPeriod(period);
        if (period === 'all') {
            // Fetch all historical stats if 'all' is selected
            fetchHistoricalStats(period);
        }
    };

    // Show loader if both stats are loading
    if (loadingLatestStats) {
        return (
            <Container>
                <LoaderContainer>
                    <Loader />
                </LoaderContainer>
            </Container>
        );
    }

    return (
        <Container>
            {/* Top row: Stat cards (always showing latest stats) */}
            <StatsCard key={'channels'} title={'channels'} count={channelCount} />
            {statsKeys.map((key) => (
                <StatsCard key={key} title={key} count={counters[key]} />
            ))}

            {/* Bottom row: Chart container with period selector and chart */}
            <StatsChartContainer>
                {/* Period selector inside the chart container */}
                <PeriodSelectorContainer>
                    {PERIOD_OPTIONS.map((option) => (
                        <PeriodButton
                            key={option.value}
                            active={selectedPeriod === option.value}
                            onClick={() => handlePeriodChange(option.value)}
                        >
                            {option.label}
                        </PeriodButton>
                    ))}
                </PeriodSelectorContainer>

                {/* Chart or error message */}
                {loadingHistoricalStats ? (
                    <LoaderContainer>
                        <Loader />
                    </LoaderContainer>
                ) : (
                    <ChartWrapper>
                        {errorHistoricalStats && (
                            <ErrorMessage>
                                Error loading historical stats: {errorHistoricalStats.message}
                            </ErrorMessage>
                        )}

                        {loadingHistoricalStats ? (
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: '100%',
                                }}
                            >
                                <Loader />
                            </div>
                        ) : filteredHistoricalStats.length > 0 ? (
                            <ChartComponent data={filteredHistoricalStats} />
                        ) : (
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: '100%',
                                }}
                            >
                                No chart data available for this period
                            </div>
                        )}
                    </ChartWrapper>
                )}
            </StatsChartContainer>
        </Container>
    );
}
