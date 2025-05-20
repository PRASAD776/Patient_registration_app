import React, { useState, useEffect } from 'react';
import databaseService from '../services/database';
import './SQLQuery.css';

const SQLQuery = () => {
  const [query, setQuery] = useState('SELECT * FROM patients;');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        await databaseService.initialize();
        const patients = await databaseService.getPatients();
        setResults(patients);
      } catch (err) {
        console.error('Error initializing database:', err);
        setError('Error initializing database: ' + err.message);
      }
    };

    initializeDatabase();

    const refreshOnPatientRegistered = async () => {
      try {
        const patients = await databaseService.getPatients();
        setResults(patients);
      } catch (err) {
        console.error('Error refreshing patient list:', err);
        setError('Error refreshing patient list: ' + err.message);
      }
    };

    window.addEventListener('patientRegistered', refreshOnPatientRegistered);
    return () => window.removeEventListener('patientRegistered', refreshOnPatientRegistered);
  }, []);

  const handleQuerySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResults([]);
  
    try {
      const forbidden = ['drop', 'delete', 'update', 'alter'];
      const lowerQuery = query.toLowerCase();
  
      if (forbidden.some(keyword => lowerQuery.includes(keyword))) {
        throw new Error('Restricted operation detected. Please use only safe SELECT queries.');
      }
  
      const result = await databaseService.executeQuery(query);
      if (!Array.isArray(result) || result.length === 0) {
        setError('Query executed successfully but returned no results.');
      } else {
        setResults(result);
        setQuery(''); 
      }
    } catch (err) {
      console.error('Error executing query:', err);
      setError('Error executing query: ' + err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="sql-query-container">
      <h2>SQL Query Interface</h2>

      <div className="query-info">
        <p><strong>Available table:</strong> <code>patients</code></p>
        <p><strong>Example queries:</strong></p>
        <ul>
          <li><code>SELECT * FROM patients;</code></li>
          <li><code>SELECT * FROM patients WHERE gender = 'Male';</code></li>
          <li><code>SELECT first_name, last_name FROM patients;</code></li>
        </ul>
      </div>

      <form onSubmit={handleQuerySubmit} className="query-form">
            <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Write your SQL SELECT query here..."
        rows={4}
        data-gramm="false"
        data-gramm_editor="false"
        data-enable-grammarly="false"
        spellCheck={false}
      />


        <button type="submit" disabled={loading}>
          {loading ? 'Executing...' : 'Execute Query'}
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}

      {results.length > 0 && (
        <div className="results-container">
          <h3>Query Results</h3>
          <table>
            <thead>
              <tr>
                {Object.keys(results[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {results.map((row, idx) => (
                <tr key={idx}>
                  {Object.values(row).map((value, i) => (
  <td key={i}>
    {value instanceof Date
      ? value.toLocaleDateString()
      : String(value)}
  </td>
))}

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SQLQuery;
