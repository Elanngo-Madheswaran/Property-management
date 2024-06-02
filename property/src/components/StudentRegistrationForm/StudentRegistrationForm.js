import React, { useState } from 'react';
import axios from 'axios';

const StudentRegistrationForm = () => {
 const initialState = {
  name: '',
  class: '',
  rollNo: '',
  yearOfStudying: '',
  mobileNo: '',
  emailId: ''
 };

 const [formData, setFormData] = useState(initialState);

 const { name, class: studentClass, rollNo, yearOfStudying, mobileNo, emailId } = formData;

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
    <label>Name:</label>
    <input type="text" name="name" value={name} onChange={onChange} required />
   </div>
   <div>
    <label>Class:</label>
    <input type="text" name="class" value={studentClass} onChange={onChange} required />
   </div>
   <div>
    <label>Roll No:</label>
    <input type="text" name="rollNo" value={rollNo} onChange={onChange} required />
   </div>
   <div>
    <label>Year of Studying:</label>
    <input type="text" name="yearOfStudying" value={yearOfStudying} onChange={onChange} required />
   </div>
   <div>
    <label>Mobile No:</label>
    <input type="text" name="mobileNo" value={mobileNo} onChange={onChange} required />
   </div>
   <div>
    <label>Email ID:</label>
    <input type="email" name="emailId" value={emailId} onChange={onChange} required />
   </div>
   <button type="submit">Register</button>
  </form>
 );
};

export default StudentRegistrationForm;