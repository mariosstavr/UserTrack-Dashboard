User Management & Contract Monitoring Dashboard
Overview:
A web-based administrative dashboard for managing users and monitoring contract expiration dates. The platform provides real-time interaction with a Firebase Realtime Database and includes authentication, contract tracking, and user notifications.

Key Features:

🔐 User Registration: Secure user creation with validations for unique username and VAT.

📋 User List Dashboard: Displays all registered users with company info, contact details, and contract timelines.

🔎 Search & Filter: Dynamic search bar to filter users by name, VAT, email, or contract dates.

🛠️ Contract Expiration Check: Detects users whose contracts are:

Expiring within 30 days

Already expired

🔔 Notification System: Displays alert modals for contract expirations.

🧹 Clear Notifications: Allows bulk clearing of read notifications for selected users.

🗑️ User Deletion: Supports multi-user selection and confirmation before removal.

📦 Frontend: HTML, CSS, Vanilla JavaScript

☁️ Backend: Node.js, Express.js

🔗 Database: Firebase Realtime Database
