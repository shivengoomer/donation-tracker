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
  <div className="text-white min-h-screen py-12 px-4 md:px-10 max-w-9xl ">
    <div className="w-full max-w-7xl mx-auto space-y-12">
      
      {/* Header */}
      <h2 className="text-4xl font-extrabold text-center text-white mb-2 drop-shadow-lg">
        📊 Donation Analytics
      </h2>
      <p className="text-center text-gray-400 mb-6 text-lg">
        Visual overview of donations by NGO.
      </p>
      <div className="w-24 h-1 mx-auto mb-8 bg-gradient-to-r from-emerald-400 via-indigo-400 to-pink-400 rounded-full"></div>

      {/* Charts */}
      <div className="flex flex-col lg:flex-row gap-10 w-full">
        
        {/* Bar Chart Card */}
        <div className="flex-1 bg-black/70 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/10 transition-all hover:shadow-2xl">
  <h3 className="text-2xl lg:text-3xl text-center font-semibold text-white mb-6">
    Total Donations by NGO
  </h3>

  <ResponsiveContainer width="100%" height={420}>
    <BarChart
      data={chartData}
      margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
    >
      <XAxis
        dataKey="name"
        stroke="#ccc"
        tick={{ fontSize: 12 }}
        interval={0}
        angle={-25}
        textAnchor="end"
      />
      <YAxis
        stroke="#ccc"
        tick={{ fontSize: 12 }}
        domain={[0, 'auto']}
        tickFormatter={(value) => `₹${value.toLocaleString()}`}
      />
      <Tooltip
        formatter={(value) => `₹${value.toLocaleString()}`}
        contentStyle={{
          backgroundColor: "#1f2937",
          borderRadius: 8,
          borderColor: "#4B5563",
          color: "#fff",
          fontSize: 14,
          padding: 10,
        }}
      />
      <Bar
        dataKey="value"
        radius={[8, 8, 0, 0]}
        fill="#34D399"
        isAnimationActive={true}
      >
        {/* Optional: Add data labels above bars */}
        {/* <LabelList dataKey="value" position="top" formatter={(v) => `₹${v.toLocaleString()}`} /> */}
      </Bar>
    </BarChart>
  </ResponsiveContainer>
</div>


        {/* Pie Chart Card */}
   <div className="flex-1 bg-black/70 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/10 transition-all hover:shadow-2xl">
  <h3 className="text-2xl lg:text-3xl text-center font-semibold text-white mb-6">
    Donation Distribution
  </h3>

  <ResponsiveContainer width="100%" height={360}>
    <PieChart>
      <Pie
        data={chartData}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="45%"
        innerRadius={60}
        outerRadius={110}
        paddingAngle={6}
        isAnimationActive={true}
        label={({ name, percent }) =>
          `${name} (${(percent * 100).toFixed(1)}%)`
        }
        labelLine={false}
      >
        {chartData.map((entry, index) => (
          <Cell
            key={`cell-${index}`}
            fill={COLORS[index % COLORS.length]}
            stroke="#1f2937"
            strokeWidth={2}
          />
        ))}
      </Pie>

      <Tooltip
        formatter={(value, name) => [`₹${value.toLocaleString()}`, name]}
        contentStyle={{
          backgroundColor: "#1f2937",
          borderRadius: 8,
          borderColor: "#4B5563",
          color: "#fff",
          fontSize: 14,
          padding: 10,
        }}
      />

      <Legend
        verticalAlign="bottom"
        iconType="circle"
        wrapperStyle={{
          color: "#ccc",
          fontSize: 15,
          marginTop: 24,
          lineHeight: "28px",
        }}
      />
    </PieChart>
  </ResponsiveContainer>
</div>


      </div>
    </div>
  </div>
);
};

export default DonationAnalytics;
