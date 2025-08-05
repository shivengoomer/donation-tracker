import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DonationTable = () => {
  const [donations, setDonations] = useState([]);
  const [filteredDonations, setFilteredDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [ngoFilter, setNgoFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editedAmount, setEditedAmount] = useState('');

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/donations");
        setDonations(res.data);
        setFilteredDonations(res.data);
      } catch (err) {
        console.error("Error fetching donations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  useEffect(() => {
    let filtered = donations;

    if (ngoFilter) {
      filtered = filtered.filter((d) =>
        d.ngoName.toLowerCase().includes(ngoFilter.toLowerCase())
      );
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      filtered = filtered.filter((d) => {
        const donationDate = new Date(d.date);
        return donationDate >= start && donationDate <= end;
      });
    }

    setFilteredDonations(filtered);
  }, [ngoFilter, startDate, endDate, donations]);

  const handleEdit = (id, currentAmount) => {
    setEditingId(id);
    setEditedAmount(currentAmount);
  };

  const handleUpdate = async (id) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/donations/${id}`, {
        amount: Number(editedAmount),
      });

      const updated = donations.map((donation) =>
        donation._id === id ? { ...donation, amount: res.data.amount } : donation
      );

      setDonations(updated);
      setEditingId(null);
    } catch (err) {
      console.error("Error updating amount:", err);
    }
  };

  if (loading) {
    return <div className="text-white text-center mt-8">Loading donations...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 text-white">
      <h2 className="text-5xl font-bold mb-6 text-center">All Donations</h2>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4 justify-center">
        <input
          type="text"
          placeholder="Filter by NGO Name"
          value={ngoFilter}
          onChange={(e) => setNgoFilter(e.target.value)}
          className="px-3 py-2 rounded bg-gray-800 border border-gray-600 placeholder-gray-400"
        />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="px-3 py-2 rounded bg-gray-800 border border-gray-600 text-white"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="px-3 py-2 rounded bg-gray-800 border border-gray-600 text-white"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-600 bg-black">
          <thead>
            <tr className="bg-gray-800 text-left">
              <th className="border border-gray-700 px-4 py-2">NGO Name</th>
              <th className="border border-gray-700 px-4 py-2">Amount</th>
              <th className="border border-gray-700 px-4 py-2">Transaction ID</th>
              <th className="border border-gray-700 px-4 py-2">Date</th>
              <th className="border border-gray-700 px-4 py-2">Payee Name</th>
              <th className="border border-gray-700 px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredDonations.map((donation) => (
              <tr key={donation._id} className="hover:bg-gray-700">
                <td className="border border-gray-700 px-4 py-2">{donation.ngoName}</td>
                <td className="border border-gray-700 px-4 py-2">
                  {editingId === donation._id ? (
                    <input
                      type="number"
                      value={editedAmount}
                      onChange={(e) => setEditedAmount(e.target.value)}
                      className="bg-gray-800 border border-gray-600 text-white px-2 py-1 rounded w-24"
                    />
                  ) : (
                    <>₹{donation.amount}</>
                  )}
                </td>
                <td className="border border-gray-700 px-4 py-2">{donation.transactionId}</td>
                <td className="border border-gray-700 px-4 py-2">
                  {new Date(donation.date).toLocaleDateString()}
                </td>
                <td className="border border-gray-700 px-4 py-2">{donation.payeeName}</td>
                <td className="border border-gray-700 px-4 py-2">
                  {editingId === donation._id ? (
                    <button
                      onClick={() => handleUpdate(donation._id)}
                      className="text-green-500 hover:underline"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEdit(donation._id, donation.amount)}
                      className="text-blue-400 hover:underline"
                    >
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DonationTable;
