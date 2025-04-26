import {
    useState, useEffect,
    useRef,
    createContext, useContext
} from 'react';
import NotificationService from 'services/notificationService';

const ASSET_CHANGE = "assetUpdate"
const CHANNEL_UPDATE = "channelUpdate"

const NotificationContext = createContext();

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
}

export function NotificationProvider({ children }) {
    const nServiceRef = useRef(null);
    const assetUpdateQueueRef = useRef([]);
    const [assetUpdatedTs, setAssetUpdatedTs] = useState(0);
    const AddAssetUpdateNotification = (notification) => {
        const { assetId, status } = notification;
        const existingNotification = assetUpdateQueueRef.current.find(
            (item) => item.assetId === assetId
        );

        if (existingNotification) {
            existingNotification.status = status;
        } else {
            assetUpdateQueueRef.current.push(notification);
        }

        setAssetUpdatedTs(Date.now());
    }

    const channelUpdateQueueRef = useRef([]);
    const [channelUpdatedTs, setChannelUpdatedTs] = useState(0);
    const AddChannelUpdateNotification = (notification) => {
        const { channelId, status } = notification;
        const existingNotification = channelUpdateQueueRef.current.find(
            (item) => item.channelId === channelId
        );

        if (existingNotification) {
            existingNotification.status = status;
        } else {
            channelUpdateQueueRef.current.push(notification);
        }

        setChannelUpdatedTs(Date.now());
    }

    const handleNotification = (rawData) => {
        console.log('Raw Notification received:', rawData);
        // Handle the notification here
        const { type, payload } = rawData;
        if (type === ASSET_CHANGE) {
            const notification = {
                channelId: payload.channel_id,
                assetId: payload.asset_id,
                status: payload.status,
                failedReason: payload.failed_reason,
                deleted: payload.deleted,
            }
            AddAssetUpdateNotification(notification);
        }
        else if (type === CHANNEL_UPDATE) {
            const notification = {
                channelId: payload.channel_id,
                status: payload.status,
            }
            AddChannelUpdateNotification(notification);
        } else {
            console.warn('Unknown notification type:', type);
        }
    };

    useEffect(() => {
        nServiceRef.current = new NotificationService();
        nServiceRef.current.initialize(handleNotification);
        nServiceRef.current.connect();

        return () => {
            nServiceRef.current.disconnect();
        };
    }, [])


    return (
        <NotificationContext.Provider value={{
            assetUpdateQueueRef,
            channelUpdateQueueRef,
            assetUpdatedTs,
            channelUpdatedTs,
        }}>
            {children}
        </NotificationContext.Provider>
    );
}