import React, { useState } from 'react';
import AddDonation from '../components/addDonation';
import DonationTable from '../components/donationTable';
import FlickeringGrid from '../components/flickeringGrid';
const Track = () => {
  const [showForm, setShowForm] = useState(false);
  const handleClick = () => {
    setShowForm(prev=>!prev);
  };

  return (
    <div className="p-4">
      <div  className='absolute overflow-hidden z-[-1]' style={{ width: '100vw', height: '100vh' }}>
        <FlickeringGrid />
      </div>
      <DonationTable />
      <button 
        onClick={handleClick} 
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Add Donation
      </button>

      {showForm && (
        <div className="mt-4">
          <AddDonation />
        </div>
      )}
    </div>
  );
};

export default Track;
