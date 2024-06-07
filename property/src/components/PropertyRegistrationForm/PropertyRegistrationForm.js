import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PropertyForm = ({ PropertyToEdit, onSave }) => {
  const [property, setProperty] = useState({
    name: '',
    address: '',
    phnnumber: 0,
    description: '',
    price: 0,
    img:''
  });

  useEffect(() => {
    if (PropertyToEdit) {
      setProperty(PropertyToEdit);
    }
  }, [PropertyToEdit]);

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
        await axios.put(`http://localhost:5000/property/${property._id}`, property);
      } else {
        await axios.post('http://localhost:5000/property', property);
      }

      onSave();
      setProperty({
        name: '',
        address: '',
        phnnumber: 0,
        description: '',
        price: 0,
        img:''
      });
    } catch (error) {
      console.error('Error saving Property', error);
    }
  };

  return (
    <div className='m-5 p-5'>
      <h2>{property._id ? 'Edit Property' : 'Add Property'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={property.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="address"
          placeholder="address"
          value={property.address}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="phnnumber"
          placeholder="phn no"
          value={property.phnnumber}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="description"
          placeholder="description"
          value={property.description}
          onChange={handleChange}
          
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={property.price}
          onChange={handleChange}
          required
        />
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default PropertyForm;