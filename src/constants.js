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

export const Theme = {
    PRIMARY: '#1565C0', // Dark Blue
    PRIMARY_LIGHT: '#E8EAF6', // Light Blue
    SECONDARY: '#00695C', // Dark Teal
    SECONDARY_LIGHT: '#B2DFDB', // Light Teal
};

// Button Color Palette
export const ButtonColors = {
  PRIMARY: Theme.PRIMARY,    // Dark Blue - Main action
  SECONDARY: Theme.SECONDARY,  // Light gray - Cancel/secondary actions
  REFRESH: '#4CAF50', // Green - Refresh actions
  WARNING: '#ffc107',    // Amber - Confirm/warning actions
  DANGER: '#dc3545',      // Red - Destructive actions
  DISABLED: '#cccccc',   // Gray for disabled state background
  POSITIVE: '#4CAF50', // Green - Positive actions
  NEGATIVE: '#dc3545', // Red - Negative actions
};

export const TT_MUSIC_CMP_URL =
  "https://www.tiktok.com/legal/page/global/music-usage-confirmation/en"
export const TT_BC_CMP_URL =
  "https://www.tiktok.com/legal/page/global/bc-policy/en"