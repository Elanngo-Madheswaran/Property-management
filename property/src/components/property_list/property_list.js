import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PropertyList = ({ onEdit, onDelete }) => {
  const [properties, setProperties] = useState([]); // Initialize as an empty array

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await axios.get('http://localhost:5000/writetodatabase');
      setProperties(response.data.data); // Assuming the API response has a 'data' property
    } catch (error) {
      console.error('Error fetching Properties', error);
    }
  };

  return (
    <div className='bg bg-primary'>
      <ul>
        {properties.map(property => (
          <li key={property._id}>
            {property.name}
            <button onClick={() => onEdit(property)}>Edit</button>
            <button onClick={() => onDelete(property._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PropertyList;
