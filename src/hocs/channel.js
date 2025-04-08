import { useState, useEffect, createContext, useContext, useRef } from 'react';
import { listChannels, getTotalStats, getChannelStats } from 'services/backend';
import { useAuth } from 'hocs/auth';

const INITIAL_FETCH_PERIOD = 'quarter'; // initial fetch period for historical stats

const ChannelContext = createContext();

export const ChannelProvider = ({ children }) => {
    const { user } = useAuth();
    const [channels, setChannels] = useState([]);
    const channelStatsMap = useRef({}); // Map to store channel stats by ID
    // Stats for the top cards (latest data)
    const [latestStats, setLatestStats] = useState([]);
    const [loadingLatestStats, setLoadingLatestStats] = useState(true);
    const [errorLatestStats, setErrorLatestStats] = useState(null);

    // Stats for the chart (historical data)
    const [historicalStats, setHistoricalStats] = useState([]);
    const [hasAllTimeData, setHasAllTimeData] = useState(false); // Track if we've fetched all data
    const [loadingChannels, setLoadingChannels] = useState(true);
    const [errorChannels, setErrorChannels] = useState(null);
    const [loadingHistoricalStats, setLoadingHistoricalStats] = useState(true);
    const [errorHistoricalStats, setErrorHistoricalStats] = useState(null);

    const fetchChannels = async () => {
        console.log('Fetching channels...');
        setLoadingChannels(true);
        setErrorChannels(null);
        try {
            const res = await listChannels();
            console.log('Channels fetched:', res.data);
            setChannels(res.data || []);
        } catch (error) {
            console.error('Error fetching channels:', error);
            setErrorChannels(error);
            setChannels([]); // Clear channels on error
        } finally {
            setLoadingChannels(false);
        }
    };

    // Fetch latest stats (for cards)
    const fetchLatestStats = async () => {
        console.log('Fetching latest stats...');
        setLoadingLatestStats(true);
        setErrorLatestStats(null);
        try {
            const data = await getTotalStats('now');
            console.log('Latest stats fetched:', data);
            setLatestStats(data || []);
        } catch (error) {
            console.error('Error fetching latest stats:', error);
            setErrorLatestStats(error);
            setLatestStats([]); // Clear stats on error
        } finally {
            setLoadingLatestStats(false);
        }
    };

    // Fetch historical stats (for chart)
    const fetchHistoricalStats = async (period, forceFetch = false) => {
        // Optimize API calls
        if (period === 'all' && hasAllTimeData) {
            // If we already have all-time data, skip
            return;
        }

        // Only make an API call when:
        // 1. It's the first load
        // 2. User explicitly selects 'all' and we don't have all data yet
        const shouldFetch = (period === 'all' && !hasAllTimeData) || forceFetch;

        if (!shouldFetch) {
            console.log(`Skipping fetch for period: ${period}`);
            return;
        }

        console.log(`Fetching historical stats for period: ${period}...`);
        setLoadingHistoricalStats(true);
        setErrorHistoricalStats(null);

        try {
            const data = await getTotalStats(period);
            setHistoricalStats(data || []);

            // If we successfully fetched all data, mark it
            if (period === 'all') {
                setHasAllTimeData(true);
            }
        } catch (error) {
            console.error('Error fetching historical stats:', error);
            setErrorHistoricalStats(error);
            setHistoricalStats([]); // Clear stats on error
            setHasAllTimeData(false); // Reset all-time data flag
        } finally {
            setLoadingHistoricalStats(false);
        }
    };

    const fetchChannelHistoricalStats = async (channel_id, force = false) => {
        if (!force && channelStatsMap.current[channel_id]) {
            console.log(`Using cached historical stats for channel: ${channel_id}`);
        } else {
            console.log(`Fetching historical stats for channel: ${channel_id}...`);
            try {
                const data = await getChannelStats(channel_id);
                console.log('Channel historical stats fetched:', data);
                channelStatsMap.current[channel_id] = data || [];
            } catch (error) {
                console.error('Error fetching channel historical stats:', error);
                return [];
            }
        }
        return channelStatsMap.current[channel_id];
    };

    const refreshAllData = async () => {
        console.log('Refreshing data...');
        await fetchChannels();
        fetchLatestStats();
        fetchHistoricalStats(INITIAL_FETCH_PERIOD, true);
    };

    const refreshStats = async () => {
        console.log('Refreshing stats...');
        fetchLatestStats();
        fetchHistoricalStats(INITIAL_FETCH_PERIOD, true); // Fetch quarter data on refresh
    };

    // Initial fetch on mount - get both latest and historical stats
    useEffect(() => {
        if (user && user.id) {
            // Fetch channels and stats only if user is authenticated
            fetchChannels();
            fetchLatestStats();
            fetchHistoricalStats(INITIAL_FETCH_PERIOD, true); // Fetch quarter data on first load
        }
    }, [user]);

    const value = {
        channels,
        latestStats,
        historicalStats, // Provide raw historical stats, let component filter
        loadingChannels,
        errorChannels,
        loadingLatestStats,
        errorLatestStats,
        loadingHistoricalStats,
        errorHistoricalStats,
        refreshAllData,
        refreshStats,
        fetchLatestStats,
        fetchHistoricalStats,
        fetchChannelHistoricalStats,
    };

    return <ChannelContext.Provider value={value}>{children}</ChannelContext.Provider>;
};

export const useChannel = () => {
    const context = useContext(ChannelContext);
    if (context === undefined) {
        throw new Error('useChannel must be used within a ChannelProvider');
    }
    return context;
};
