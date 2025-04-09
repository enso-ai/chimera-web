// Use environment variable for client key
export const CLIENT_KEY = process.env.REACT_APP_TIKTOK_CLIENT_KEY || 'sbaw8h6p58f0t5wmyc';
export const REDIRECT_PATH = '/login_callback/';

// Environment variables example
// Environment variables prefixed with REACT_APP_ are embedded during build time
// and remain accessible at runtime through process.env.REACT_APP_*
export const API_URL = process.env.REACT_APP_API_URL || 'https://default-api-url.com';

export const PageNames = {
    SIGNIN: 'signin',
    APP: 'app',
    LOGIN_CALLBACK: 'login_callback',
    TERMS_OF_SERVICE: 'terms-of-service',
    PRIVACY_POLICY: 'privacy-policy',
};
