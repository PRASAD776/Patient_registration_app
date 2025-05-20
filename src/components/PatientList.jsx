import React, { useState, useEffect } from 'react';
import databaseService from '../services/database';
import EditPatientModal from './EditPatientModal';
import './PatientList.css';

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingPatient, setEditingPatient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const itemsPerPage = 10;

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const allPatients = await databaseService.getPatients();

      if (Array.isArray(allPatients)) {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        setPatients(allPatients.slice(startIndex, endIndex));
        setTotalPages(Math.ceil(allPatients.length / itemsPerPage));
      } else {
        setError('Invalid data received from database');
      }
    } catch (err) {
      setError('Error fetching patients: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    const setupDatabase = async () => {
      try {
        await databaseService.initialize();
        if (mounted) await fetchPatients();
      } catch (err) {
        if (mounted) setError('Error initializing database: ' + err.message);
      }
    };

    setupDatabase();

    const channel = new BroadcastChannel('patient_updates');
    channel.onmessage = (event) => {
      if (event.data === 'patient_registered') fetchPatients();
    };

    const handlePatientRegistered = () => fetchPatients();
    window.addEventListener('patientRegistered', handlePatientRegistered);

    return () => {
      mounted = false;
      window.removeEventListener('patientRegistered', handlePatientRegistered);
      channel.close();
    };
  }, [currentPage]);

  const handlePageChange = (page) => setCurrentPage(page);

  const handleEdit = (patient) => {
    setEditingPatient(patient);
    setIsModalOpen(true);
  };

  const handleSave = async (updatedPatient) => {
    try {
      console.log("Saving patient:", updatedPatient);
      await databaseService.updatePatient(updatedPatient); 
      fetchPatients(); 
      setIsModalOpen(false); 
    } catch (err) {
      console.error("Error updating patient:", err);
      setError("Error updating patient: " + err.message);
    }
  };  

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this patient?')) return;
    try {
      await databaseService.deletePatient(id);
      fetchPatients();
    } catch (err) {
      setError('Error deleting patient: ' + err.message);
    }
  };

  return (
    <div className="patient-list-container">
      <h2>Patient List</h2>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : patients.length === 0 ? (
        <div className="no-patients">No patients found in the database.</div>
      ) : (
        <>
          <div className="table-container">
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
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient) => (
                  <tr key={patient.id}>
                    <td>{patient.id}</td>
                    <td>{patient.first_name}</td>
                    <td>{patient.last_name}</td>
                    <td>{patient.date_of_birth}</td>
                    <td>{patient.gender}</td>
                    <td>{patient.phone}</td>
                    <td>{patient.email}</td>
                    <td>{patient.address}</td>
                    <td>
                      <div className='actionButtons'>
                      <button className="edit-btn" onClick={() => handleEdit(patient)}>Edit</button>
                      <button className="delete-btn" onClick={() => handleDelete(patient.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button key={page} onClick={() => handlePageChange(page)} className={currentPage === page ? 'active' : ''}>{page}</button>
              ))}
              <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
            </div>
          )}
        </>
      )}

      {isModalOpen && editingPatient && (
        <EditPatientModal
          patient={editingPatient}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default PatientList;
