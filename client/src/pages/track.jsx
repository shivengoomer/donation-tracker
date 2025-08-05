import React, { useState } from 'react';
import AddDonation from '../components/addDonation';
import DonationTable from '../components/donationTable';
import FlickeringGrid from '../components/flickeringGrid';
import DonationAnalytics from '../components/DonationAnalytics';

const Track = () => {
  const [showForm, setShowForm] = useState(false);

  const handleClick = () => {
    setShowForm(prev => !prev);
  };

  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      <div className="absolute overflow-hidden inset-0 z-[-1]">
        <FlickeringGrid />
      </div>

      <header className="w-full px-6 py-4 bg-gray-900/70 backdrop-blur-md shadow-md flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Donation Tracker</h1>
        <button
          onClick={handleClick}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition duration-300"
        >
          {showForm ? "Close Form" : "Add Donation"}
        </button>
      </header>

      <main className="p-6 pt-8 max-w-5xl mx-auto space-y-6">
        <DonationTable />
        <DonationAnalytics />
      </main>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700 w-full max-w-lg mx-4">
            <AddDonation />
          </div>
        </div>
      )}
    </div>
  );
};

export default Track;
