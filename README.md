# MenU

MenU is a full-stack web application designed for managing and viewing dietary menus. It provides a centralized platform for recurring meal planning, allowing administrators to manage offerings and users to view and interact with daily menus.

## Problem Statement

Managing and communicating recurring menus (e.g., for mess halls, cafeterias, or meal services) is often disorganized, relying on static files or physical boards. MenU solves this by providing:
*   **For Users:** A digital, accessible, and interactive way to view what is on the menu.
*   **For Admins:** A structured system to digitize, update, and manage meal data efficiently.

## High-Level Functionality

### Public & User Features
*   **Menu Viewing:** Access daily and weekly menu schedules.
*   **Voting System:** Users can vote on specific menu items.
*   **User Dashboard:** Personalized view for registered users.
*   **Authentication:** Secure login and registration.
*   **Statistics:** View voting insights and menu popularity.
*   **Responsive Design:** optimized for mobile and desktop viewing.

### Admin Features
*   **Admin Dashboard:** Central hub for system management.
*   **Menu Management:** Tools to create and update menu entries.
*   **Admin Approval:** Workflow for approving new administrators.
*   **AI Integration:** Utilizes Google Gemini for assisting with menu content processing.
*   **Notification System:** Mechanism to alert users of updates.

## Technology Stack

### Frontend
*   **Framework:** React 19 (via Vite)
*   **Routing:** React Router 7
*   **HTTP Client:** Axios
*   **Styling:** CSS Modules / Vanilla CSS

### Backend
*   **Runtime:** Node.js
*   **Framework:** Express.js 5
*   **Database:** MongoDB (Mongoose 9)
*   **Authentication:** JWT (JSON Web Tokens) & Bcrypt
*   **AI & OCR:** Google Gemini API, Tesseract.js, PDF.js

## Repository Structure

*   `frontend/` - React client application.
*   `backend/` - Express server, API routes, and database models.
*   `docs/` - Detailed documentation for specific roles.

## Getting Started

### Prerequisites
*   Node.js (LTS version recommended)
*   MongoDB instance (local or Atlas)

### Backend Setup
1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure environment variables in a `.env` file (ensure MongoDB URI and API keys are set).
4.  Start the development server:
    ```bash
    npm run dev
    ```

### Frontend Setup
1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```

## Documentation

For more detailed guides, please refer to:
*   [Admin Documentation](docs/admin.md)
*   [User Documentation](docs/users.md)

## Contributing

Contributions are welcome. Please ensure that any pull requests are scoped to a specific feature or fix and include relevant testing where applicable.
