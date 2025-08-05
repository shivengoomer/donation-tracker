import React, { useState } from 'react';
import axios from 'axios';

const AddDonation = () => {
  const [ngoName, setNgoName] = useState('');
  const [amount, setAmount] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [date, setDate] = useState('');
  const [payeeName, setPayeeName] = useState('');

  const handleSuccess = () => {
    alert("Donation submitted successfully!");
    window.location.reload();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const donationData = {
      ngoName,
      amount,
      transactionId,
      date,
      payeeName,
    };

    try {
      const response = await axios.post('http://localhost:5000/api/donations', donationData);
      console.log('Server response:', response.data);
    } catch (error) {
      console.error('Error submitting donation:', error);
      alert('Something went wrong! Please try again.');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white/5 backdrop-blur-md p-8 rounded-xl shadow-2xl border border-white/20">
      <h2 className="text-2xl font-bold mb-6 text-center text-white">Add a New Donation</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* NGO Name */}
        <div>
          <label htmlFor="ngoName" className="block text-sm font-medium text-gray-300 mb-1">
            NGO Name
          </label>
          <input
            type="text"
            id="ngoName"
            value={ngoName}
            onChange={(e) => setNgoName(e.target.value)}
            className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="Enter NGO name"
            required
          />
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-1">
            Amount (₹)
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="Enter amount"
            required
          />
        </div>

        <div>
          <label htmlFor="transactionId" className="block text-sm font-medium text-gray-300 mb-1">
            Transaction ID
          </label>
          <input
            type="text"
            id="transactionId"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="Enter transaction ID"
            required
          />
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-1">
            Donation Date
          </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          />
        </div>

        <div>
          <label htmlFor="payeeName" className="block text-sm font-medium text-gray-300 mb-1">
            Payee Name
          </label>
          <input
            type="text"
            id="payeeName"
            value={payeeName}
            onChange={(e) => setPayeeName(e.target.value)}
            className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="Enter payee name"
            required
          />
        </div>
        <div className="text-center">
          <button
            type="submit"
            onClick={handleSuccess}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:opacity-90 transition duration-300"
          >
            Add Donation
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddDonation;
