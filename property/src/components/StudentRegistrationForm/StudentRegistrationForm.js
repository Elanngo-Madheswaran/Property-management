import React, { useState } from 'react';
import axios from 'axios';

const StudentRegistrationForm = () => {
 const initialState = {
  name: '',
  address: '',
  phnnumber: 0,
  description: '',
  price: 0
 };

 const [formData, setFormData] = useState(initialState);

 const { name, address , phnnumber, description, price } = formData;

 const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

 const onSubmit = async e => {
  e.preventDefault();
  try {
   const res = await axios.post('http://localhost:5000/writetodatabase', formData);
   alert(res.data.message);
   setFormData(initialState); // Reset form after successful submission
  } catch (err) {
   console.error('Server error', err);
   alert('Server error while saving data');
  }
 };

 return (
  <form onSubmit={onSubmit}>
   <div>
    <label>Property Name:</label>
    <input type="text" name="name" value={name} onChange={onChange} required />
   </div>
   <div>
    <label>Address:</label>
    <input type="text" name="address" value={address} onChange={onChange} required />
   </div>
   <div>
    <label>Phn number:</label>
    <input type="number" name="phnnumber" value={phnnumber} onChange={onChange} required />
   </div>
   <div>
    <label>Description:</label>
    <input type="text" name="description" value={description} onChange={onChange} required />
   </div>
   <div>
    <label>Price:</label>
    <input type="number" name="price" value={price} onChange={onChange} required />
   </div>
   <button type="submit">Register</button>
  </form>
 );
};

export default StudentRegistrationForm;