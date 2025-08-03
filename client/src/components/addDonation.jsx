import React, { useState } from 'react';
import axios from 'axios';

const AddDonation = () => {
  const [ngoName, setngoName] = useState('');
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
      // Change the URL to your actual backend endpoint
      const response = await axios.post('http://localhost:5000/api/donations', donationData);

      console.log('Server response:', response.data);
    } catch (error) {
      console.error('Error submitting donation:', error);
      alert('Something went wrong! Please try again.');
    }
  };

  return (
    <div className="text-lg border border-white backdrop-blur-xl max-w-4xl mx-auto p-4 text-white">
      <form onSubmit={handleSubmit} className="space-y-4 bg-transparent p-4 rounded-md">
        <div className="flex flex-col">
          <label htmlFor="ngoName" className="text-gray-300">NGO Name</label>
          <input
            type="text"
            id="ngoName"
            value={ngoName}
            onChange={(e) => setngoName(e.target.value)}
            className="p-2 border border-gray-300 rounded-md "
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="amount" className="text-gray-300">Amount</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="p-2 border border-gray-300 rounded-md  "
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="transactionId" className="text-gray-300">Transaction ID</label>
          <input
            type="text"
            id="transactionId"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            className="p-2 border border-gray-300 rounded-md  "
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="date" className="text-gray-300">Date</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="p-2 border border-gray-300 rounded-md  "
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="payeeName" className="text-gray-300">Payee Name</label>
          <input
            type="text"
            id="payeeName"
            value={payeeName}
            onChange={(e) => setPayeeName(e.target.value)}
            className="p-2 border border-gray-300 rounded-md  "
            required
          />
        </div>

        <button type="submit" onClick={handleSuccess} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Add Donation
        </button>
      </form>
    </div>
  );
};

export default AddDonation;
