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

export const getTotalStats = async () => {
    const response = await api.get('channels/stats');
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

    const response = await api.post(`channels/${channelId}/stats/backfill`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
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
