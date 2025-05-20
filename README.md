# Patient Registration App

A frontend-only patient registration application built with React and PGlite for local data storage.

## Features
- Patient registration form with validation
- View list of registered patients
- Local data storage using PGlite
- Responsive design with CSS
- Query Patient Records using SQL (safe `SELECT` queries only).
- Persistent Data across refreshes using IndexedDB via PGlite.
- Multi-Tab Syncing using `BroadcastChannel`.
- Search Bar for full-text search across patient records.
- Edit/Delete Patient Records directly from the list.
- Email Uniqueness Check before registration.

##  Tech Stack
- React + Vite
- PGlite (SQLite for the browser)
- Vanilla CSS (fully customizable)

## Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```


## PGlite Setup

PGlite is a lightweight PostgreSQL-compatible database that runs entirely in the browser. The app is already configured to use PGlite for local data storage. No additional setup is required.

## Usage

1. Register a new patient:
   - Fill out the registration form with patient details
   - Click "Register Patient" to save the information

2. View registered patients:
   - Navigate to the "View Patients" page
   - See a list of all registered patients
   - Patients are sorted by registration date (newest first)

## Project Structure

- `src/components/`: Contains React components
  - `PatientRegistration.jsx`: Patient registration form
  - `PatientList.jsx`: List of registered patients
  - `Navbar.jsx`: Navigation component
- `src/App.jsx`: Main application component with routing
- `src/index.css`: CSS styles
- `EditPatientModal.jsx`: Modal popup to edit existing patient data
  - `SQLQuery.jsx`: SQL interface to query patient records directly
  - `Navbar.jsx`: Top navigation bar with theme toggle and navigation
- `src/App.jsx`: Main application component with navigation and page switching logic
- `src/index.css`: Global CSS styling

## Future Improvements
- Add data export capabilities
- Implement data backup functionality
- Add user authentication
- Role-based authentication.
- Light-dark mode toggle
