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

     <header className="fixed w-full backdrop-blur-sm px-6 py-1 bg-black/5 flex justify-between items-center">

        <h1 className="py-2 text-3xl font-[Nunito]">Donation Tracker</h1>
        <button
          onClick={handleClick}
          className="bg-green-300 hover:bg-green-500 text-black font-medium px-4 py-2 rounded-lg transition duration-300"
        >
          {showForm ? "Close Form" : "Add Donation"}
        </button>
      </header>

      <main className="mt-3 p-6 pt-8 max-w-full  mx-auto space-y-6">
        <DonationTable />
        <DonationAnalytics />
      </main>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700 w-full max-w-lg mx-4">
            <button
            className="absolute bg-red-500 top-4 right-4 px-3 py-1 border border-gray-300 rounded-md ho text-sm font-semibold"
            onClick={handleClick}
          >
            X
          </button>

            <AddDonation />
          </div>
        </div>
      )}
    </div>
  );
};

export default Track;
