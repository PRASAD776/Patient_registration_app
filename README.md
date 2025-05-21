# 🏥 Patient Registration App

A simple frontend-only Patient Registration System built with React and PGlite for in-browser SQL storage. The app allows users to register patients, view a patient list, and execute SQL queries in real-time.

---

## 🚀 Features

- 📝 Register new patients  
- 📋 View and manage registered patients  
- ✏️ Edit and delete patient details  
- 🗃️ Use PGlite (SQLite in the browser) for storage  
- 🔵 Execute custom SQL queries with live feedback  

---

## 🗂️ Project Structure

- `src/components/`: React components for UI  
  - `PatientRegistration.jsx`: Registration form  
  - `PatientList.jsx`: List of registered patients  
  - `EditPatientModal.jsx`: Modal to edit patient info  
  - `SQLQuery.jsx`: Execute queries directly
- `src/App.jsx`: Main app logic and page routing  
- `src/index.css`: Global styles  
- `src/main.jsx`: Entry point

---

## 💻 Tech Stack

- React + Vite  
- PGlite (SQLite for browser)  
- Vanilla CSS (fully customizable)

---

## 🔧 Prerequisites

- Node.js (v14 or higher)  
- npm (v6 or higher)

---

## ⚙️ Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

---

## 🧪 PGlite Setup

PGlite is a lightweight PostgreSQL-compatible database that runs entirely in the browser. No external setup is required. It is used for:

- Local storage and retrieval of patient data  
- Running custom SQL queries in-browser with instant results

---

## 📝 Usage

1. Register a new patient:
   - Fill out the form
   - Click "Register Patient"
2. View patients:
   - Go to the "View Patients" tab
   - View list sorted by registration date (latest first)
3. Execute SQL:
   - Navigate to SQL tab
   - Write and execute SQL directly on local DB

---

## ⚠️ Challenges Faced

- Understanding how to configure `@electric-sql/pglite` for browser-only storage
- Ensuring SQL queries persist in-memory and reflect immediately in UI
- Handling state updates after executing queries
- Styling modals and building user-friendly navigation
- Deployment challenges: Vercel gave a blank screen due to client-only routing

---

## 🚀 Deployment Notes

### Vercel
Hosted on Vercel: [View Live](https://patient-registration-application.vercel.app/)
If deploying to Vercel:
- Ensure `vite.config.js` has correct `base` and routing setup
- Avoid server routes unless using SSR
- Use `HashRouter` if you're deploying client-only routes

### Netlify

Steps:
1. Push code to GitHub
2. Go to Netlify > New site from Git
3. Link repository
4. Set build command:
   ```bash
   npm run build
   ```
5. Set publish directory:
   ```bash
   dist
   ```
6. Deploy

> ⚠️ Tip: If you get a blank screen after deploy, use `HashRouter` in React Router.

---

## 🛠️ Future Improvements

- Add export (CSV/JSON) options
- Implement backup and restore feature
- User-based login system
- Role-based access
- Dark/light mode toggle

---

## 🔖 Hashtags

`#PatientRegistrationApp` `#React` `#Vite` `#PGlite` `#FrontendOnly`
