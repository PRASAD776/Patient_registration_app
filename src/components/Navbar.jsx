import React, { useState, useEffect } from 'react';
import PatientRegistration from './components/PatientRegistration';
import SQLQuery from './components/SQLQuery';
import PatientList from './components/PatientList';
import databaseService from './services/database';
import './index.css';

function App() {
  const [currentPage, setCurrentPage] = useState('registration');
  const [navOpen, setNavOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  const handleSearch = async () => {
    try {
      await databaseService.initialize();
      const allPatients = await databaseService.getPatients();
      const results = allPatients.filter((patient) => {
        return Object.values(patient).some((value) =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
      setSearchResults(results);
      setCurrentPage('search');
    } catch (error) {
      console.error('Error searching patients:', error);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'registration':
        return <PatientRegistration />;
      case 'list':
        return <PatientList />;
      case 'sql':
        return <SQLQuery />;
      case 'search':
        return (
          <div className="search-results">
            <h2>Search Results</h2>
            {searchResults.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>DOB</th>
                    <th>Gender</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Address</th>
                  </tr>
                </thead>
                <tbody>
                  {searchResults.map((p) => (
                    <tr key={p.id}>
                      <td>{p.id}</td>
                      <td>{p.first_name}</td>
                      <td>{p.last_name}</td>
                      <td>{p.date_of_birth}</td>
                      <td>{p.gender}</td>
                      <td>{p.phone}</td>
                      <td>{p.email}</td>
                      <td>{p.address}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No results found.</p>
            )}
          </div>
        );
      default:
        return <PatientRegistration />;
    }
  };

  return (
    <div className="app-wrapper">
      <header className="app-header">
        <h1>Patient Portal</h1>
        <input
          type="text"
          placeholder="Search patients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
        <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? '🌙' : '☀️'}
        </button>
        <button className="nav-toggle" onClick={() => setNavOpen(!navOpen)}>
          ☰
        </button>
        <nav className={`nav-links ${navOpen ? 'open' : ''}`}>
          <button
            className={currentPage === 'registration' ? 'active' : ''}
            onClick={() => {
              setCurrentPage('registration');
              setNavOpen(false);
            }}
          >
            Register
          </button>
          <button
            className={currentPage === 'list' ? 'active' : ''}
            onClick={() => {
              setCurrentPage('list');
              setNavOpen(false);
            }}
          >
            Patient List
          </button>
          <button
            className={currentPage === 'sql' ? 'active' : ''}
            onClick={() => {
              setCurrentPage('sql');
              setNavOpen(false);
            }}
          >
            SQL Query
          </button>
        </nav>
      </header>

      <main className="main-content">{renderPage()}</main>
    </div>
  );
}

export default App;
