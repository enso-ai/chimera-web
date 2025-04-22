export const CLIENT_KEY = process.env.REACT_APP_TIKTOK_CLIENT_KEY;
export const REDIRECT_PATH = '/login_callback/';

// Environment variables example
// Environment variables prefixed with REACT_APP_ are embedded during build time
// and remain accessible at runtime through process.env.REACT_APP_*
export const BASE_URL = process.env.REACT_APP_BASE_URL;

export const PageNames = {
    SIGNIN: 'signin',
    APP: 'app',
    LOGIN_CALLBACK: 'login_callback',
    TERMS_OF_SERVICE: 'terms-of-service',
    PRIVACY_POLICY: 'privacy-policy',
};

// Button Color Palette
export const ButtonColors = {
  PRIMARY: '#4CCF50',    // Green - Main action (like Upload)
  SECONDARY: '#f5f5f5',  // Light gray - Cancel/secondary actions
  WARNING: '#ffc107',    // Amber - Confirm/warning actions
  DANGER: '#dc3545',      // Red - Destructive actions
  DISABLED: '#cccccc',   // Gray for disabled state background
  DISABLED_TEXT: '#666666' // Gray for disabled state text
};
