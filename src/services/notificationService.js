// src/services/NotificationService.js
import { BASE_URL } from "constants";

export const NOTIFICATION_TYPES = {
    ASSET_STATUS_CHANGE: "assetStatusChange",
    CHANNEL_UPDATE: "channelUpdate",
};

class NotificationService {
    constructor() {
        this.connection = null;
        this.callback = null;
        this.isConnected = false;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectTimeoutId = null;
    }

    // Initialize with callback
    initialize(callback) {
        if (typeof callback !== "function") {
            throw new Error("NotificationService: callback must be a function");
        }
        this.callback = callback;
    }

    // Connect to WebSocket
    connect() {
        if (this.connection) {
            return;
        }

        if (!this.callback) {
            console.error(
                "NotificationService: No callback set, call initialize() first"
            );
            return;
        }

        const token = localStorage.getItem("auth_token");
        if (!token) {
            console.error("NotificationService: No auth token available");
            return;
        }

        const wsUrl = `${BASE_URL.replace(
            /^http/,
            "ws"
        )}ws/notification?token=${token}`;
        this.connection = new WebSocket(wsUrl);

        this.connection.onopen = this.handleOpen.bind(this);
        this.connection.onclose = this.handleClose.bind(this);
        this.connection.onerror = this.handleError.bind(this);
        this.connection.onmessage = this.handleMessage.bind(this);
    }

    // Handle WebSocket open event
    handleOpen() {
        console.log("NotificationService: Connection established");
        this.isConnected = true;
        this.reconnectAttempts = 0;
    }

    // Handle WebSocket close event
    handleClose(event) {
        console.log(`NotificationService: Connection closed (${event.code})`);
        this.isConnected = false;
        this.connection = null;

        // Attempt to reconnect if not a clean closure
        if (event.code !== 1000) {
            this.attemptReconnect();
        }
    }

    // Handle WebSocket error
    handleError(error) {
        console.error("NotificationService: Connection error", error);
        this.isConnected = false;
    }

    // Handle incoming messages and directly call the callback
    handleMessage(event) {
        try {
            const data = JSON.parse(event.data);

            // Directly call the callback with the parsed data
            if (this.callback) {
                this.callback(data);
            }
        } catch (err) {
            console.error("NotificationService: Error parsing message", err);
        }
    }

    // Attempt to reconnect with exponential backoff
    attemptReconnect() {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.error("NotificationService: Max reconnect attempts reached");
            return;
        }

        const delay = Math.min(30000, 1000 * Math.pow(2, this.reconnectAttempts));
        console.log(`NotificationService: Reconnecting in ${delay}ms`);

        this.reconnectTimeoutId = setTimeout(() => {
            this.reconnectAttempts++;
            this.connect();
        }, delay);
    }

    // Disconnect from WebSocket
    disconnect() {
        if (this.reconnectTimeoutId) {
            clearTimeout(this.reconnectTimeoutId);
            this.reconnectTimeoutId = null;
        }

        if (this.connection && this.isConnected) {
            this.connection.close(1000, "Client disconnect");
            this.connection = null;
            this.isConnected = false;
        }
    }
}

export default NotificationService;
