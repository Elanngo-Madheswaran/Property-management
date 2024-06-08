import React, { useState } from 'react';
import PropertyList from './components/property_list/property_list';
import PropertyForm from './components/PropertyRegistrationForm/PropertyRegistrationForm';
import axios from 'axios';
const App = () => {

  const [PropertyToEdit, setPropertyToEdit] = useState(null);
  const handleEdit = (property) => {
    setPropertyToEdit(property);
  };
    

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/property/${id}`);
      setPropertyToEdit(null);
    } catch (error) {
      console.error('Error deleting property', error);
    }
  };

  const handleSave = () => {
    setPropertyToEdit(null);
  };

  return (
    <div className="App text-center bg bg-success bg-opacity-50">
      <h1 className='p-5'>Property Management System</h1>
      <hr></hr>
      <h1 className='mt-4'>List of Properties</h1>
      <div className='mt-5 d-flex align-items-center justify-content-center'>
          <PropertyList onEdit={handleEdit} onDelete={handleDelete} />
      </div>
      <hr></hr>
      <PropertyForm propertyToEdit={PropertyToEdit} onSave={handleSave} />
    </div>
  );
};

export default App;