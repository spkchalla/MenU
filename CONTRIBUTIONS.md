# Contributing to MenU

Thank you for your interest in contributing to MenU. To maintain system integrity, we adhere to strict architectural patterns.

## Architectural Guidelines

When submitting code, ensure your changes respect the following separation of concerns:

### 1. Controllers (`/backend/controller`)
*   **Responsibility:** Input sanitation and HTTP response handling ONLY.
*   **Restriction:** Controllers should **NEVER** contain business logic or database queries.
*   **Flow:** Receive request → Validate/Sanitize → Call Util → Return Response.

### 2. Utilities (`/backend/utils` & `/backend/services`)
*   **Responsibility:** Core business logic and data manipulation.
*   **Privilege:** **ONLY** files in this layer are permitted to access the database directly.
*   **Flow:** Receive sanitized data → Execute Logic/DB Operations → Return Result.

### 3. Routers (`/backend/routes`)
*   **Responsibility:** Route definition and middleware application.
*   **Organization:** Separate routers must be created for distinct feature sets (e.g., `menuRoutes`, `authRoutes`).

## Development Workflow

1.  **Fork & Clone:**
    ```bash
    git clone https://github.com/spkchalla/MenU.git
    ```
2.  **Branching:**
    *   Create a new branch for every feature or fix.
    *   Name branches descriptively: `feat/new-vote-logic` or `fix/jwt-validation`.
3.  **Testing:**
    *   Verify both frontend and backend functionality locally before pushing.
4.  **Pull Request:**
    *   Target the `main` branch.
    *   Clearly describe the architectural changes.
    *   Pull requests are expected to preserve the Controller/Util separation.
    *   PRs that introduce business logic into controllers or bypass existing utilities
        will be closed without review.

## Technology Stack Context

*   **Frontend:** React (Vite)
*   **Backend:** Express.js
*   **Database:** MongoDB

Happy Coding!
