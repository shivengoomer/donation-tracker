import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';

const COLORS = ['#34D399', '#60A5FA', '#FBBF24', '#F87171', '#A78BFA'];

const DonationAnalytics = () => {
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get("http://localhost:5000/api/donations", {
          withCredentials: true
        });
      setDonations(res.data);
    };

    fetchData();
  }, []);

  const ngoTotals = donations.reduce((acc, curr) => {
    acc[curr.ngoName] = (acc[curr.ngoName] || 0) + curr.amount;
    return acc;
  }, {});

  const chartData = Object.entries(ngoTotals).map(([ngo, amount]) => ({
    name: ngo,
    value: amount,
  }));

  return (
    <div className="bg-black text-white min-h-screen py-12 px-4 md:px-10">
      <div className="max-w-6xl mx-auto space-y-12">
        <h2 className="text-4xl font-extrabold text-center text-white mb-2 drop-shadow-lg">
          📊 Donation Analytics
        </h2>
        <p className="text-center text-gray-400 mb-6">
          Visual overview of donations by NGO.
        </p>

        <div className="bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-700">
          <h3 className=" text-2xl font-semibold mb-4">Total Donations by NGO</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="#ccc" />
                <YAxis
                stroke="#ccc"
                domain={[0, 'auto']}
                tickFormatter={(value) => `₹${value.toLocaleString()}`}
                tick={{ fontSize: 10 }} 
                />

                <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="#34D399" className='text-sm' />
            </BarChart>
            </ResponsiveContainer>

        </div>

        <div className="bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-700">
          <h3 className="text-2xl font-semibold mb-4">Donation Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label={({ name}) => `${name}`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DonationAnalytics;
