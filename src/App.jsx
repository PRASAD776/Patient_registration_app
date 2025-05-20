import React, { useState, useEffect } from 'react';
import PatientRegistration from './components/PatientRegistration';
import SQLQuery from './components/SQLQuery';
import PatientList from './components/PatientList';
import './index.css';
import databaseService from './services/database';

function App() {
  const [currentPage, setCurrentPage] = useState('registration');
  const [navOpen, setNavOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    document.body.className = darkMode ? 'dark-mode' : '';
  }, [darkMode]);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      await databaseService.initialize();
      const allPatients = await databaseService.getPatients();
      const filtered = allPatients.filter((p) =>
        Object.values(p).some((val) =>
          val && val.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      setSearchResults(filtered);
      setCurrentPage('search');
      setSearchQuery(''); 
    } catch (err) {
      console.error('Search error:', err);
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
            <h3>Search Results</h3>
            {searchResults.length === 0 ? (
              <p>No matching patients found.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>ID</th><th>First Name</th><th>Last Name</th>
                    <th>DOB</th><th>Gender</th><th>Phone</th>
                    <th>Email</th><th>Address</th>
                  </tr>
                </thead>
                <tbody>
                  {searchResults.map((p) => (
                    <tr key={p.id}>
                      <td>{p.id}</td><td>{p.first_name}</td><td>{p.last_name}</td>
                      <td>{p.date_of_birth}</td><td>{p.gender}</td><td>{p.phone}</td>
                      <td>{p.email}</td><td>{p.address}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
        <h2>MediPortal</h2>

        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            id='searchPatient'
            placeholder="Search patients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        <button className="nav-toggle" onClick={() => setNavOpen(!navOpen)}>
          ☰
        </button>

        <nav className={`nav-links ${navOpen ? 'open' : ''}`}>
          <button className={currentPage === 'registration' ? 'active' : ''} onClick={() => { setCurrentPage('registration'); setNavOpen(false); }}>Register</button>
          <button className={currentPage === 'list' ? 'active' : ''} onClick={() => { setCurrentPage('list'); setNavOpen(false); }}>Patient List</button>
          <button className={currentPage === 'sql' ? 'active' : ''} onClick={() => { setCurrentPage('sql'); setNavOpen(false); }}>SQL Query</button>
        </nav>
      </header>

      <main className="main-content">{renderPage()}</main>
    </div>
  );
}

export default App;
