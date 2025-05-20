import React, { useState } from 'react';
import './EditPatientModal.css'; 

const EditPatientModal = ({ patient, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        id: patient.id,  
        first_name: patient.first_name || '',
        last_name: patient.last_name || '',
        date_of_birth: patient.date_of_birth || '',
        gender: patient.gender || '',
        address: patient.address || '',
        phone: patient.phone || '',
        email: patient.email || '',
      });
      

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Saving patient:', formData);
    onSave(formData);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>Edit Patient</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <input name="first_name" value={formData.first_name} onChange={handleChange} placeholder="First Name" required />
          <input name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Last Name" required />
          <input type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} required />
          <select name="gender" value={formData.gender} onChange={handleChange} required>
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
          <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" required />
          <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
          <textarea name="address" value={formData.address} onChange={handleChange} placeholder="Address" rows={3} />
          
          <div className="modal-buttons">
            <button type="submit">Save</button>
            <button type="button" className="cancel" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPatientModal;
