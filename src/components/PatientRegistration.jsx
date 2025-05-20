import React from 'react';
import { useState, useEffect } from 'react';
import databaseService from '../services/database';
import './PatientRegistration.css';

// event for patient registration
const patientRegisteredEvent = new Event('patientRegistered');

export default function PatientRegistration() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    phone: '',
    email: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const setupDatabase = async () => {
      try {
        await databaseService.initialize();
      } catch (err) {
        console.error('Error initializing database:', err);
        setError('Error initializing database: ' + err.message);
      }
    };

    setupDatabase();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const patients = await databaseService.registerPatient(formData);
      console.log('Registered patient and got updated list:', patients);
      const channel = new BroadcastChannel('patient_updates');
      channel.postMessage('patient_registered');
      alert('Patient registered successfully!');
      
      window.dispatchEvent(patientRegisteredEvent);
      
     
      setFormData({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: '',
        address: '',
        phone: '',
        email: '',
      });
    } catch (err) {
      console.error('Error registering patient:', err);
      setError('Error registering patient: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registration-wrapper">
      <div className="registration-card">
        <h2>Patient Registration</h2>
        <p className="form-subtext">Fill in the details below to register a new patient.</p>
  
        {error && <div className="error-message">{error}</div>}
  
        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group">
            <input name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <input name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <input name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <select name="gender" value={formData.gender} onChange={handleChange} required>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="form-group full-width">
          <textarea name="address" placeholder="Address" value={formData.address} onChange={handleChange} />
          </div>
          <div className="form-group">
            <input name="phone" type="tel" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group full-width">
            <button type="submit" disabled={loading}>
              {loading ? 'Registering...' : 'Register Patient'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
  
} 