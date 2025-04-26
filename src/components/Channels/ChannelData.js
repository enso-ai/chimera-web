import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

import LoadingSpinner from 'components/Loader';
import ChartComponent from 'components/Chart';
import { backfill_stats } from 'services/backend';
import { useChannel } from 'hocs/channel';
import { formatNumber } from 'utils/numbers';

const Container = styled.div`
    position: relative;
    height: calc(100% - 40px);
    display: grid;
    grid-template-rows: auto auto 1fr;
    grid-template-columns: auto 1fr auto;

    padding: 20px;
    gap: 20px;

    overflow: hidden;
`;

const EmptyStateContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
`;

const EmptyStateMsg = styled.h3`
    color: #444;
    font-size: 24px;
    font-weight: 400;
    text-align: center;
    margin: 0;
    padding: 20px;
    background: #f0f0f0;
    border-radius: 10px;
    width: 100%;
`;

const ChannelTitle = styled.a`
    decoration: none;
    font-size: 32px;
    color: #444;

    grid-column: 1 / 2;
`;

const ImportGroup = styled.div`
    display: flex;
    flex-direction: row;

    grid-column: 3 / 4;
`;

const ImportButton = styled.button`
    background: #5f5f5f;
    color: white;
    border: 1px solid #ccc;
    border-radius: 10px;
    padding: 10px;
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;
`;

const FileInput = styled.input`
    display: none;
`;

const StatsRow = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;

    gap: 10px;

    grid-row: 2 / 3;
    grid-column: 1 / 4;
`;

const StatsCardContainer = styled.div`
    box-sizing: border-box;
    background: #f0f0f0;
    border: 1px solid #ccc;

    padding: 20px;
    aspect-ratio: 1 / 1;

    border-radius: 10px;
    width: 150px;
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
    grid-column: 1 / 4;
    grid-row: 3 / 4;

    overflow: hidden;
`;

const statsKeys = ['follower_count', 'video_count', 'view_count', 'likes_count', 'comment_count'];

export default function ChannelDataView({ channel }) {
    const { refreshStats, fetchChannelHistoricalStats } = useChannel();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [statsData, setStatsData] = useState([]);

    const inputRef = useRef(null);

    useEffect(() => {
        console.log('channel id changed, fetching data');
        // fetch data from backend
        if (!channel?.id) return;
        setLoading(true);
        fetchChannelHistoricalStats(channel.id)
            .then((res) => {
                setStatsData(res);
            })
            .finally(() => setLoading(false));
    }, [channel]);

    useEffect(() => {
        console.log('ChannelDate component show stats:', statsData);
    }, [statsData]);

    const handleUploadClicked = () => {
        if (inputRef.current) inputRef.current.click();
    };

    const handleFileChange = async (event) => {
        setUploading(true);
        const file = event.target.files[0];
        if (!file) return;

        try {
            await backfill_stats(channel.id, file);
            await refreshStats();
        } catch (error) {
            console.error('failed to backfill stats', error);
        } finally {
            setUploading(false);
        }
    };

    if (loading)
        return (
            <Container>
                <LoadingSpinner />
            </Container>
        );

    if (!channel)
        return (
            <EmptyStateContainer>
                <EmptyStateMsg>Channel Data is empty, please add your channel!</EmptyStateMsg>
            </EmptyStateContainer>
        );
    console.log("statsData last slice:", statsData[statsData.length - 1]);

    return (
        <Container>
            <ChannelTitle>{channel?.display_name}</ChannelTitle>
            <ImportGroup>
                <ImportButton onClick={handleUploadClicked} disabled={uploading}>
                    {uploading ? 'Uploading...' : 'Import History'}
                </ImportButton>
                <FileInput ref={inputRef} type='file' accept='.csv' onChange={handleFileChange} />
            </ImportGroup>
            <StatsRow>
                {statsKeys.map((key) => (
                    <StatsCardContainer key={key}>
                        <StatsCardTitle>{key.split('_')[0]}</StatsCardTitle>
                        <StatsCardCount>{formatNumber(statsData[statsData.length-1]?.[key])}</StatsCardCount>
                    </StatsCardContainer>
                ))}
            </StatsRow>
            <StatsChartContainer>
                <ChartComponent
                    data={statsData.map((item) => ({
                        views: item.view_count || 0,
                        followers: item.follower_count || 0,
                        date: item.date,
                    }))}
                />
            </StatsChartContainer>
        </Container>
    );
}
