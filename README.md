# MenU

MenU is a system designed to streamline the lifecycle of institutional dietary schedules. It enforces structural integrity on menu data, transforming human-readable inputs into a persistent, actionable schema for consumption and analysis.

## Problem Statement

Institutional menu management is typically high-friction, relying on manual data entry and fragmented updates. This results in:
*   **Operational Inefficiency:** Administrators spend excessive time formatting and broadcasting updates.
*   **Data rigidness:** Static schedules are difficult to query or analyze for trends.
*   **Disconnect:** Validating user preferences against served meals is often anecdotal rather than data-driven.

MenU resolves this by treating the menu not as a text list, but as a structured data asset, managed by an intelligent ingestion layer.

## System Architecture

The project is organized into three control planes:

### 1. Data Ingestion & Normalization
The system prioritizes ease of management by offloading improved data structuring to AI.
*   **Input:** Natural language or simplified menu descriptions.
*   **Processing:** The **Google Gemini API** acts as the normalization engine, parsing intent and converting raw input into a strict JSON schema.
*   **Persistence:** Structured data is stored, ensuring consistent query capabilities across dates and meal types.

### 2. Administrative Control
*   **Role-Based Access:** Strict separation between unprivileged users and menu administrators.
*   **Ingestion Oversight:** Administrators review and commit the AI-normalized schedules to the database.

### 3. Distribution & Intelligence
*   **Public Access:** Frictionless, read-only views for end-users.
*   **Feedback Loop:** Voting signals are aggregated to provide statistical trends on menu performance.

## Technology Stack

*   **Ingestion / Intelligence:** Google Gemini API
*   **Persistence:** MongoDB (Mongoose 9)
*   **Logic:** Node.js / Express.js 5
*   **Interface:** React 19 (Vite)

## Repository Structure

*   `backend/` - Core business logic and schema definitions.
*   `frontend/` - Client-side presentation and interaction layer.
*   `docs/` - Role-specific operational guides.

## Getting Started

### Prerequisites
*   Node.js (LTS)
*   MongoDB instance
*   **Google Gemini API Key** (Required for menu processing)

### Environment Configuration
The system requires specific environment variables to function. Ensure `GOOGLE_API_KEY`, `MONGO_URI`, and `JWT_SECRET` are correctly provisioned in the backend `.env` file before startup.

### Installation
1.  **Backend:**
    ```bash
    cd backend
    npm install
    npm run dev
    ```
2.  **Frontend:**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

## Documentation

*   [Admin Documentation](docs/admin.md)
*   [User Documentation](docs/users.md)
*   [Contribution Guidelines](CONTRIBUTIONS.md)
