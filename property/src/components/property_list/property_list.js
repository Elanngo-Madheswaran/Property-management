import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PropertyList = () => {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await axios.get('https://ap-south-1.aws.data.mongodb-api.com/app/data-jqrtjox/endpoint/data/v1'); // Adjust the API endpoint
        setProperties(res.data); // Assuming the response contains an array of properties
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchProperties();
  }, []);

  return (
    <div className="property-list">
      {properties.map((property) => (
        <div key={property.id} className="property-box">
          <h3>{property.name}</h3>
          <p>Address: {property.address}</p>
          <p>Phone Number: {property.phnnumber}</p>
          <p>Description: {property.description}</p>
          <p>Price: ${property.price}</p>
        </div>
      ))}
    </div>
  );
};

export default PropertyList;
