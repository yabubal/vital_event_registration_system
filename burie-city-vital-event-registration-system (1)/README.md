# Burie City Vital Event Registration System

A digital platform for managing vital events (Birth, Death, Marriage, Divorce) for Burie City Administration. This system streamlines the registration process, ensuring data accuracy and providing real-time statistics.

## User Roles & Permissions

The system supports four distinct user roles, each with specific permissions:

### 1. System Administrator (`ADMIN`)
**Access Level:** Full Control
-   **Dashboard:** View comprehensive statistics across all Kebeles.
-   **Records:** View, Edit, and Delete any vital event record.
-   **Approvals:** Authority to **Approve** or **Reject** pending applications.
-   **Certificates:** Can generate and print official certificates for approved records.
-   **User Management:** (Future) Manage other system users and their roles.

### 2. Supervisor (`SUPERVISOR`)
**Access Level:** High
-   **Primary Goal:** Quality Assurance.
-   **Approvals:** Can **Approve** or **Reject** records submitted by clerks or citizens.
-   **Review:** Double-checks data accuracy before a certificate is issued.

### 3. Data Clerk (`DATA_CLERK`)
**Access Level:** Operational
-   **Registration:** The primary user for entering new data. Can register events on behalf of citizens.
-   **View:** Can view records they have registered or records within their assigned Kebele.
-   **Limitation:** Cannot approve records; they can only submit them for review (`PENDING` status).

### 4. Public Citizen (`CITIZEN`)
**Access Level:** Basic / Personal
-   **Application:** Can submit applications for their own vital events (e.g., registering a child's birth).
-   **Tracking:** Can view the **status** of their applications (Pending, Approved, Rejected).
-   **Limitation:** Read-only access to their own data. Cannot see other people's records.

## Technical Setup
1.  **Backend:** PHP API (located in `/api`) handling MySQL database operations.
2.  **Frontend:** React (Vite) application using Tailwind CSS.
3.  **Database:** MySQL database `burie_vital_events`.

## Quick Start
1.  **Start Backend:** Ensure Apache and MySQL are running in XAMPP.
2.  **Start Frontend:** `npm run dev`
3.  **Login:** Use the default credentials (e.g., `admin` / `password123`).
