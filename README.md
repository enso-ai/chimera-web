<img src="./public/logo.png" alt="Chimera Logo" width="80" height="80">

# Chimera Web Portal

## Overview

Chimera is the web portal frontend for the Chimera platform. It's designed to integrate with TikTok to pull analytics data for managed channels. Additionally, it connects with an in-house AI video generation tool to facilitate the automatic scheduling and posting of videos across multiple TikTok accounts.

This portal is primarily developed using React and styled-components.

## Project Structure

The project follows a standard React application structure, organized as follows:

-   **`public/`**: Contains static assets and the main `index.html` file.
-   **`src/`**: Contains the core application source code.
    -   **`components/`**: Reusable UI components used throughout the application. Organized further by feature (e.g., `Channels`, `Queue`, `SignIn`).
    -   **`constants/`**: Application-wide constants (e.g., API endpoints, status codes).
    -   **`hocs/`**: Higher-Order Components used for wrapping components with shared logic (e.g., authentication, data fetching).
    -   **`hooks/`**: Custom React hooks for reusable stateful logic.
    -   **`pages/`**: Components representing full pages, typically used for routes requiring external access or specific layouts (e.g., `SignIn`, `PrivacyPolicy`, `TiktokCallback`).
    -   **`services/`**: Modules for interacting with external services, particularly the Chimera backend API (`api.js`, `backend.js`).
    -   **`Tabs/`**: Components representing the main sections/views within the core authenticated application flow (e.g., `Dashboard`, `Channels`, `Queue`). This project uses a hybrid routing approach combining these Tabs with the `pages/` directory.
    -   **`utils/`**: Utility functions for common tasks (e.g., date formatting, file handling).
    -   **`App.js`**: The root application component, likely setting up routing.
    -   **`index.js`**: The main entry point for the React application.
-   **`api_docs/`**: Markdown files documenting the Chimera backend API endpoints.
-   **`.env.development`**: Environment variables for local development.
-   **`.env.staging`**: Environment variables for the staging environment.
-   **`.env.production`**: Environment variables for the production environment.
-   **`package.json`**: Project metadata and dependencies.
-   **`deploy_prod.sh` / `deploy_staging.sh`**: Scripts likely used for deploying the application to respective environments.

## Development Environments

The application operates in three distinct environments:

1.  **Production:**
    *   **URL:** `https://chimera.v01s.com`
    *   **Backend:** `https://chimera-backend.v01s.com` (Hosted on AWS EKS)
    *   This is the live environment for end-users.

2.  **Staging:**
    *   **Purpose:** Primarily used for developing and testing backend features locally, especially those requiring HTTPS interactions (like TikTok authentication) that might not work correctly when the frontend is served from `localhost`.
    *   **Backend:** Expects a local instance of the `chimera-backend` running on `http://localhost:8000`.
    *   Uses configuration from `.env.staging`.

3.  **Local Development:**
    *   **Purpose:** Standard day-to-day frontend development.
    *   **Backend:** Typically connects to the staging backend or a local backend instance (depending on `.env.development` configuration).
    *   **Limitations:** Full TikTok authentication flow might not work due to `localhost` limitations.
    *   Uses configuration from `.env.development`.

## Getting Started

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/enso-ai/chimera-web
    cd chimera-web
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Configure Environment:**
    *   Ensure you have the necessary `.env.development` file for local development.
    *   If running against a local backend for staging purposes, ensure the backend is running on port 8000 and configure `.env.staging` accordingly.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in development mode. It typically uses the configuration from `.env.development`.
Open [http://localhost:3000](http://localhost:3000) (or the configured port) to view it in your browser.

The page will reload when you make changes. Lint errors will appear in the console.

*(Note: To run in a mode simulating staging, you might need a specific script or modify your local environment setup to use `.env.staging` and connect to the local backend.)*

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder. It correctly bundles React in production mode and optimizes the build for performance. The build artifacts are suitable for deployment. This command likely uses configuration from `.env.production`.
