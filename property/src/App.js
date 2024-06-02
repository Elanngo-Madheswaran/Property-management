import React from 'react';
import PropertyRegistrationForm from './components/PropertyRegistrationForm/PropertyRegistrationForm';
import PropertyList from './components/property_list/property_list';

function App() {
  return (
    <div className="App text-center m-3">
      <header className="App-header">
        <h1>Property Registration</h1>
        <PropertyRegistrationForm />
      </header>
      <div className='container m-5 text-center'>
      <h1>Property list</h1>
      <PropertyList />
    </div>
    </div>
 );
}

export default App;