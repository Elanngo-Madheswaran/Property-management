// PropertyList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PropertyList = ({ onEdit, onDelete }) => {
  const [Properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await axios.get('http://localhost:5000/properties');
      setProperties(response.data);
      setFilteredProperties(response.data); // Initialize filteredProperties
    } catch (error) {
      console.error('Error fetching Properties', error);
    }
  };

  const handleSearch = () => {
    const filtered = Properties.filter((property) =>
      property.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProperties(filtered);
  };

  const handleSortByPrice = () => {
    // Sort filteredProperties by price in ascending order
    const sortedProperties = [...filteredProperties].sort((a, b) => a.price - b.price);
    setFilteredProperties(sortedProperties);
  };

  const handleSortByPriceDescending = () => {
    // Sort filteredProperties by price in descending order
    const sortedProperties = [...filteredProperties].sort((a, b) => b.price - a.price);
    setFilteredProperties(sortedProperties);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/property/${id}`);
      setProperties(Properties.filter(property => property._id !== id));
      setFilteredProperties(filteredProperties.filter(property => property._id !== id));
    } catch (error) {
      console.error('Error deleting property', error);
    }
  };

  return (
    <div className='d-flex flex-column align-items-center justify-content-center'>
      <div>
      <input
        type="text"
        placeholder="Search by name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button className='btn btn-success m-3' onClick={handleSearch}>Search</button>
      </div>
      <div className='d-flex m-2'>
      <button className='btn btn-success m-3' onClick={handleSortByPrice}>Sort by Price (Low to High)</button>
      <button className='btn btn-success m-3' onClick={handleSortByPriceDescending}>Sort by Price (High to Low)</button>
      </div>
      <ul>
        {filteredProperties.map((Property) => (
          <div key={Property._id} className='m-5 d-flex'>
            <div className='bg bg-light bg-opacity-25 border-0 shadow-lg card m-5 p-5'>
              <div className='px-5 fs-1 fw-bold text-dark h1'>
                {Property.name}
              </div>
              <div className='px-5 fs-1 mx-5 mt-3 text-dark'>
                <p>Address: {Property.address}</p>
                <p>Price: ${Property.price}</p>
                <p>Description: {Property.description}</p>
                <p>Phn no: {Property.phnnumber}</p>
              </div>
              <button className='btn btn-danger' onClick={() => handleDelete(Property._id)}>Delete</button>
            </div>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default PropertyList;
