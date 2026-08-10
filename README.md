# AI Healthcare CRM Platform

A modern full-stack Healthcare CRM platform designed to help healthcare
and pharmaceutical teams manage customers, interactions, follow-ups,
dashboards, and reporting from a centralized web application.

## 🚀 Overview

AI Healthcare CRM Platform provides a structured interface for managing
healthcare-related customer and sales activities. The application
combines a React frontend with a Django REST backend to provide a
responsive and scalable CRM experience.

## ✨ Features

-   📊 Interactive dashboard
-   👥 Customer management
-   ➕ Add and update customer records
-   ✏️ Edit customer information
-   🗑️ Delete customer records
-   🔎 Customer data management through REST APIs
-   📈 Dashboard charts and reports
-   🤝 Interaction management
-   🔐 Login/authentication interface
-   ⚙️ Settings section
-   📱 Responsive frontend interface
-   🌐 React + Django REST API architecture
-   🔄 Frontend/backend API integration
-   🧩 Modular project structure

## 🛠️ Tech Stack

### Frontend

-   React
-   Vite
-   JavaScript
-   CSS
-   Axios

### Backend

-   Python
-   Django
-   Django REST Framework
-   Django CORS Headers

### Database

-   SQLite for the current local development setup
-   Database configuration can be adapted for MySQL or another supported
    database for deployment

## 📁 Project Structure

``` text
healthcare-crm-platform/
│
├── backend/
│   ├── accounts/
│   ├── config/
│   ├── customers/
│   ├── manage.py
│   └── requirements.txt
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── docs/
├── screenshots/
├── .gitignore
└── README.md
```

## ⚙️ Installation & Setup

### 1. Clone the repository

``` bash
git clone https://github.com/connectwithashurana-beep/healthcare-crm-platform.git
cd healthcare-crm-platform
```

## 🔧 Backend Setup

Open a terminal and move into the backend:

``` bash
cd backend
```

Create and activate a virtual environment.

### Windows

``` powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

Install dependencies:

``` powershell
pip install -r requirements.txt
```

Run migrations:

``` powershell
python manage.py migrate
```

Start the Django server:

``` powershell
python manage.py runserver
```

Backend will normally be available at:

``` text
http://127.0.0.1:8000/
```

## 🎨 Frontend Setup

Open a second terminal:

``` bash
cd frontend
```

Install dependencies:

``` bash
npm install
```

Start the Vite development server:

``` bash
npm run dev
```

Frontend will normally be available at:

``` text
http://localhost:5173/
```

## 🔗 API

The frontend communicates with the Django REST API.

Example customer endpoint:

``` text
GET /api/customers/
POST /api/customers/
```

When running locally:

``` text
http://127.0.0.1:8000/api/customers/
```

## 🔐 Environment Variables

For production, keep secrets and environment-specific configuration
outside the repository.

Example:

``` env
SECRET_KEY=your-secret-key
DEBUG=False
```

Never commit real passwords, API keys, secret keys, email credentials,
or other private credentials to GitHub.

## 📸 Screenshots

Add application screenshots to the `screenshots/` directory and
reference them here.

Example:

``` markdown
![Dashboard](screenshots/dashboard.png)
![Customers](screenshots/customers.png)
![Reports](screenshots/reports.png)
```

## 🧪 Development

The project is organized into separate frontend and backend
applications, allowing each layer to be developed and tested
independently.

Recommended development workflow:

1.  Start the Django backend.
2.  Start the React/Vite frontend.
3.  Open the frontend in the browser.
4.  Test API communication through the CRM interface.
5.  Verify CRUD operations and dashboard functionality.

## 🔮 Future Improvements

-   AI-assisted form filling
-   Intelligent follow-up suggestions
-   Advanced healthcare/pharmaceutical workflows
-   Role-based access control
-   Production MySQL configuration
-   Cloud deployment with HTTPS
-   Advanced analytics and reporting
-   Automated testing and CI/CD

## 👨‍💻 Author

**Ashu**

GitHub:
[connectwithashurana-beep](https://github.com/connectwithashurana-beep)

## 📄 License

This project is currently provided for portfolio and educational
purposes.
