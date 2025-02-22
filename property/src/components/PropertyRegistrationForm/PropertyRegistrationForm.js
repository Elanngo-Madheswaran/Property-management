import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || "https://property-management-server-chi.vercel.app";

const PropertyForm = ({ propertyToEdit, onSave }) => {
  const [property, setProperty] = useState({
    name: '',
    address: '',
    phnnumber: '',
    description: '',
    price: '',
    img: ''
  });

  useEffect(() => {
    if (propertyToEdit) {
      setProperty(propertyToEdit);
    }
  }, [propertyToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProperty(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (property._id) {
        await axios.put(`${API_BASE_URL}/properties/${property._id}`, property);
      } else {
        await axios.post(`${API_BASE_URL}/properties`, property);
      }

      onSave();
      setProperty({
        name: '',
        address: '',
        phnnumber: '',
        description: '',
        price: '',
        img: ''
      });
    } catch (error) {
      console.error('Error saving Property', error);
    }
  };

  return (
    <div className='m-5 p-5'>
      <h2>{property._id ? 'Edit Property' : 'Add Property'}</h2>
      <form onSubmit={handleSubmit} className='d-flex m-5 flex-column justify-content-center align-items-center'>
        <input className='m-2 form-control w-50' type="text" name="name" placeholder="Name" value={property.name} onChange={handleChange} required />
        <textarea className='m-2 form-control-lg w-50' name="address" placeholder="Address" value={property.address} onChange={handleChange} required />
        <input className='m-2 form-control w-50' type="number" name="phnnumber" placeholder="Phone Number" value={property.phnnumber} onChange={handleChange} required />
        <textarea className='m-2 form-control-lg w-50' name="description" placeholder="Description" value={property.description} onChange={handleChange} />
        <input className='m-2 form-control w-50' type="number" name="price" placeholder="Price" value={property.price} onChange={handleChange} required />
        <button className='btn btn-success m-3' type="submit">Save</button>
      </form>
    </div>
  );
};

export default PropertyForm;
