# Contributing to MenU

Thank you for your interest in contributing to MenU! We welcome improvements, bug fixes, and new features.

## Getting Started

1.  **Fork the Repository:** click the "Fork" button on the top right of the repository page.
2.  **Clone Your Fork:**
    ```bash
    git clone https://github.com/your-username/MenU.git
    cd MenU
    ```
3.  **Install Dependencies:**
    *   Backend: `cd backend && npm install`
    *   Frontend: `cd frontend && npm install`

## Development Workflow

1.  **Create a Branch:** Always work on a new branch for your changes.
    ```bash
    git checkout -b feature/my-new-feature
    ```
2.  **Make Changes:** Implement your feature or fix.
3.  **Test Your Changes:** Ensure both frontend and backend run without errors.
    *   Backend: `npm run dev` (in `backend/`)
    *   Frontend: `npm run dev` (in `frontend/`)
4.  **Commit:** Use clear and descriptive commit messages.
    ```bash
    git commit -m "feat: Add new voting animation"
    ```

## Technology Stack

*   **Frontend:** React, Vite
*   **Backend:** Node.js, Express, MongoDB
*   **Database:** MongoDB

## Pull Request Process

1.  Push your branch to your forked repository.
2.  Open a **Pull Request (PR)** against the `main` branch of the original repository.
3.  Provide a clear description of what your PR does.
4.  Wait for review and address any feedback.

Happy Coding!
