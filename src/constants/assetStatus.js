// Asset processing status
export const ASSET_STATUS = {
    UPLOADED: 'uploaded',
    PROCESSED: 'processed',
    PROCESS_FAILED: 'process_failed',
    POSTING: 'posting',
    POSTED: 'posted',
    POSTING_FAILED: 'posting_failed',
    DELETING: 'deleting'
};

// Status groups for easier checks
export const TERMINAL_STATES = [ASSET_STATUS.POSTED, ASSET_STATUS.POSTING_FAILED];
export const FAILED_STATES = [ASSET_STATUS.PROCESS_FAILED, ASSET_STATUS.POSTING_FAILED];
export const LOCKED_STATES = [ASSET_STATUS.POSTING, ASSET_STATUS.DELETING];

// Status colors for UI
export const STATUS_COLORS = {
    [ASSET_STATUS.PROCESSED]: '#4CCF50',
    [ASSET_STATUS.UPLOADED]: '#FFA500',
    [ASSET_STATUS.PROCESS_FAILED]: '#FF4444',
    [ASSET_STATUS.POSTING_FAILED]: '#FF4444',
    [ASSET_STATUS.POSTING]: '#2196F3',
    [ASSET_STATUS.POSTED]: '#4CCF50',
    [ASSET_STATUS.DELETING]: '#FF9800'
};
