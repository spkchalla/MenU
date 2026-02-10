# Project Overview

MenU is a system designed to streamline the lifecycle of institutional dietary schedules. It enforces structural integrity on menu data, transforming human-readable inputs into a persistent, actionable schema for consumption and analysis.

# Intended Use and Scope

The system is intended to be used for managing institutional dietary schedules by treating menus as structured data assets.

**Scope includes:**
*   **Data Ingestion:** Normalizing natural language or simplified menu descriptions into a strict JSON schema using AI.
*   **Administrative Control:** Reviewing and committing normalized schedules to the database.
*   **Distribution:** Providing read-only views for end-users and aggregating voting signals for feedback.
*   **Public Access:** Allowing anonymous, frictionless access (no account required) for users to check menus via web or PWA.

# User Roles and Access Boundaries

*   **Menu Administrators:** Have oversight capabilities to review and commit the AI-normalized schedules to the database. There is a strict separation between administrators and unprivileged users.
*   **Unprivileged Users (High Assurance/Public):** Have read-only access to menu views. This role includes anonymous users who can check menus without an account. They provide voting signals which are aggregated for trends.

# High-Level Data Flow

1.  **Input:** Natural language or simplified menu descriptions are provided to the system.
2.  **Processing:** The **Google Gemini API** parses intent and converts raw input into a strict JSON schema.
3.  **Persistence:** The normalized data is saved to the system. (Note: There is currently no pre-check step before this initial save).
4.  **Review:** Administrators review and commit the schedules.
5.  **Distribution:** Data is distributed to end-users via read-only views.
6.  **Feedback:** Voting signals are aggregated (by count, then like percentage) to provide statistical trends.

# Future Considerations

The following features are explicitly planned or considered for future implementation:

*   **Dietary Toggles:** Veg/Non-veg filtering options.
*   **Meal Statistics:** Granular stats per meal.
*   **Feedback Mechanism:** Dedicated feedback box.
*   **Notification System:** Alerts for users.
*   **User Dashboard:** Displaying user-specific information.
*   **Automated Calorie Tracking:** Automated calculation of food calories with support for manual overrides.
*   **Favorite Food Alerts:** Notifications when a user's favorite food is on the menu.
