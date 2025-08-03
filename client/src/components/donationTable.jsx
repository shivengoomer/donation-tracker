import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DonationTable = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/donations");
        setDonations(res.data);
      } catch (err) {
        console.error("Error fetching donations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  if (loading) {
    return <div className="text-white text-center mt-8">Loading donations...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6 text-white">
      <h2 className="text-2xl font-bold mb-4 text-center">All Donations</h2>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-600">
          <thead>
            <tr className="bg-gray-800">
              <th className="border border-gray-700 px-4 py-2">Ngo Name</th>
              <th className="border border-gray-700 px-4 py-2">Amount</th>
              <th className="border border-gray-700 px-4 py-2">Transaction ID</th>
              <th className="border border-gray-700 px-4 py-2">Date</th>
              <th className="border border-gray-700 px-4 py-2">Payee Name</th>
            </tr>
          </thead>
          <tbody>
            {donations.map((donation) => (
              <tr key={donation._id} className="hover:bg-gray-700">
                <td className="border border-gray-700 px-4 py-2">{donation.ngoName}</td>
                <td className="border border-gray-700 px-4 py-2">{donation.amount}</td>
                <td className="border border-gray-700 px-4 py-2">{donation.transactionId}</td>
                <td className="border border-gray-700 px-4 py-2">{new Date(donation.date).toLocaleDateString()}</td>
                <td className="border border-gray-700 px-4 py-2">{donation.payeeName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DonationTable;
