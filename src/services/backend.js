import api from './api';

// Custom error class for TikTok post rejections
class TikTokPostRejectionError extends Error {
    constructor(message, details = {}) {
        super(message);
        this.name = 'TikTokPostRejectionError';
        this.details = details;
        
        // Maintain proper stack traces for where our error was thrown (only in V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, TikTokPostRejectionError);
        }
    }
}

// Make the error class available for import
export { TikTokPostRejectionError };


// Authentication functions
export const login = async (username, password) => {
    const response = await api.post('auth/login', { username, password });
    
    // Store user data
    localStorage.setItem('auth_token', response.data.access_token);
    localStorage.setItem('user_id', response.data.id);
    localStorage.setItem('username', response.data.username);
    
    return response.data;
};

export const signup = async (username, password) => {
    const response = await api.post('auth/signup', { username, password });
    
    // Store user data
    localStorage.setItem('auth_token', response.data.access_token);
    localStorage.setItem('user_id', response.data.id);
    localStorage.setItem('username', response.data.username);
    
    return response.data;
};

export const verifyTiktokToken = async (code) => {
    const response = await api.post('channels/authenticate', { code });
    return response.data;
};

export const listChannels = async (page_no = 1, page_size = 20) => {
    const response = await api.get('channels/', {
        params: { page_no, page_size },
    });
    return response.data;
};

export const getTotalStats = async (period = 'now') => {
    const response = await api.get('channels/stats', {
        params: {
            period
        }
    });
    return response.data;
};

export const getChannelStats = async (channelId) => {
    const response = await api.get(`channels/${channelId}/stats`);
    return response.data;
};

export const getChannelVideos = async (channelId) => {
    const response = await api.get(`channels/${channelId}/videos`);
    return response.data;
};

export const backfill_stats = async (channelId, file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await api.post(`channels/${channelId}/stats/backfill`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        if (error.code === 400) {
            console.error('Error uploading file:', error.message);
            alert('Failed to import data: \nInvalid file format or content');
            return null;
        }
    }
};

// developer endpoints, import/export db
export const downloadChannels = async () => {
    const response = await api.get('channels/export', {
        responseType: 'blob',
    });
    return response.data;
};

export const uploadChannels = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('channels/import', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const getCurrentUser = async () => {
    const response = await api.get('auth/me');
    return response.data;
};

// Asset management functions
export const getSignedUrl = async (channelId, title) => {
    const response = await api.post('assets/signed_url', {
        channel_id: channelId,
        title
    });
    return response.data;
};

export const processAsset = async (objectKey) => {
    const response = await api.post(`assets/${objectKey}/process`);
    return response.data;
};

export const listAssets = async (page = 1, size = 10, channelId) => {
    const response = await api.get('assets/videos', {
        params: {
            page,
            size,
            channel_id: channelId
        }
    });
    return response.data;
};

export const deleteAssets = async (objectKeys) => {
    const response = await api.delete('assets/', {
        data: objectKeys
    });
    return response.data;
};

export const getAssetDetails = async (objectKey) => {
    const response = await api.get(`assets/${objectKey}`);
    return response.data;
};

export const updateAsset = async (objectKey, payload) => {
    const response = await api.patch(`assets/${objectKey}`, payload);
    return response.data;
};

export const getCreatorPostingInfo = async (channelId) => {
    try {
        const response = await api.get(`channels/${channelId}/creator_posting_info`);
        return response.data;
    } catch (error) {
        if (error.response?.status === 406) {
            console.error("Tiktok rejected the posting request:", error);
            // TikTok rejected the posting request - throw specific error
            const message = error.response.data?.message || 'TikTok has rejected this posting request';
            throw new TikTokPostRejectionError(message, error.response.data);
        }
        // For all other error cases, just re-throw the original error
        console.error('Error fetching creator posting info:', error);
        throw error;
    }
};

export const postAsset = async (fileId, postSettings = {}) => {
    const response = await api.post(`assets/${fileId}/post`, postSettings);
    return response.data;
};

export const getPostStatus = async (fileId) => {
    const response = await api.get(`assets/${fileId}/post_status`);
    return response.data;
};

export const getAssetStatus = async (fileId) => {
    const response = await api.get(`assets/${fileId}/status`);
    return response.data;
};

// GCS Ingestion
export const ingestFromGCS = async (channelId, jobId) => {
    try {
        const response = await api.post(`channels/${channelId}/ingest_from_gcs`, { job_id: jobId });
        return response.data; // Should return { status: "pending" } on success
    } catch (error) {
        console.error('Error ingesting from GCS:', error);
        // Rethrow the error so the component can handle it (e.g., show error message)
        // Include response data if available for more specific error handling
        throw error.response?.data || error;
    }
};

export const getChannelSchedule = async (channelId) => {
    const response = await api.get(`channels/${channelId}/schedule`);
    return response.data;
};

export const updateChannelSchedule = async (channelId, payload) => {
    if (payload.alert_email_destination === '') {
        // backend requires this field to be None if it's empty
        delete payload.alert_email_destination;
    }
    const response = await api.patch(`channels/${channelId}/schedule`, payload);
    return response.data;
};
