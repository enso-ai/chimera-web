import api from './api';

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

export const listChannels = async () => {
    const response = await api.get('channels/', {
        params: {
            page_no: 1,
            page_size: 20,
        }
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
    const response = await api.post('assets/process', { object_key: objectKey });
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

export const updateAsset = async (objectKey, extra) => {
    const response = await api.patch(`assets/${objectKey}`, { extra });
    return response.data;
};

export const postAsset = async (fileId) => {
    const response = await api.post('assets/post', {
        id: fileId
    });
    return response.data;
};
