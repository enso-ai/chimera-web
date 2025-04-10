import axios from 'axios';
import { BASE_URL } from 'constants';

// Create axios instance with base URL
const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle 401 Unauthorized
        if (error.response?.status === 401) {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_id');
            localStorage.removeItem('username');
            return Promise.reject(new Error('No Authorization'));
        } else if (error.response?.status === 409) {
            return Promise.reject(new Error('Conflict'));
        }
        
        // Handle other errors
        const errorMessage = error.response?.data?.detail || error.message || 'Request failed';
        const err = new Error(errorMessage);
        err.code = error.response?.status;
        return Promise.reject(err);
    }
);

// Check authentication status
export const isAuthenticated = () => {
    return !!localStorage.getItem('auth_token');
};

// Get current user info
export const getCurrentUser = () => {
    return {
        id: localStorage.getItem('user_id'),
        username: localStorage.getItem('username')
    };
};

// Logout function
export const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('username');
};

export default api;
