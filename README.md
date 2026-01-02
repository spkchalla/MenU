# MenU

MenU is a comprehensive platform designed for managing and viewing dietary menus. It provides a user-friendly interface for diners to access daily meal information and a robust backend for administrators to maintain menu records.

## Usage

### Public Access
The platform is designed for effortless meal tracking. The Home page serves as your primary dashboard for checking what's being served.

*   **Dynamic Meal Rotation**: The system automatically detects the current time and rotates the display to show the most relevant meal (Breakfast, Lunch, Snacks, or Dinner).
*   **Present Week Overview**: You can instantly view the full menu for any day of the current week by clicking the day buttons (Monday through Sunday).
*   **Specific Date Search**: Use the calendar picker at the bottom of the page to look up the menu for any past or future specific date.

### Administration
Administrative functions are restricted to authorized personnel. To experience admin privileges:
1. Register an account through the platform.
2. Send a formal request for elevated privileges to cspk1694@protonmail.com via email.

## Development and Contributions

The enhanced version of MenU is currently under development. We appreciate interest from the community and welcome contributions to the project.

### How to Contribute
If you wish to contribute to the codebase, we are always welcome:
1. Fork the repository.
2. Create a new feature branch for your changes.
3. Submit a pull request with a detailed description of your modifications.
4. Ensure your code follows the established coding standards and includes appropriate documentation.

## Installation and Setup

### Prerequisites
* Node.js (Latest stable version)
* npm (Node Package Manager)
* MongoDB (Local or Atlas instance)

### Project Structure
* /backend: Express server and API services.
* /frontend: React/Vite development environment.

### Getting Started
1. Clone the repository to your local machine.
2. Install dependencies for the backend:
   ```bash
   cd backend
   npm install
   ```
3. Install dependencies for the frontend:
   ```bash
   cd frontend
   npm install
   ```
4. Configure environment variables in the backend directory.
5. Start the development servers:
   * Backend: Run `npm run dev` within the backend directory.
   * Frontend: Run `npm run dev` within the frontend directory.

---
MenU - Systematic Menu Management.
