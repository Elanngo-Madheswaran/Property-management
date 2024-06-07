import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PropertyList = ({ onEdit, onDelete }) => {
  const [Properties, setProperties] = useState([]);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await axios.get('http://localhost:5000/properties');
      setProperties(response.data);
    } catch (error) {
      console.error('Error fetching Properties', error);
    }
  };


  return (
    <div>
      <ul>
        {Properties.map(Property => (
          <div key={Property._id} className='m-5 d-flex'>
            <div className='bg bg-secondary bg-opacity-50 border-0 shadow-lg card m-5 p-5'>
              <div className='px-5 fs-1 fw-bold text-light h1'>
                  {Property.name}
              </div>
              <div className='px-5 fs-1 mx-5 mt-3 text-light'>
                  <p>Address:{Property.address}</p>
                  <p>Price: ${Property.price}</p>
                  <p>Description: {Property.description}</p>
                  <p>Phn no : {Property.phnnumber}</p>
              </div>
            </div>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default PropertyList;