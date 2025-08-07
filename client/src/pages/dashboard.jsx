import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid
} from 'recharts';

const COLORS = ['#22d3ee', '#a78bfa', '#facc15', '#f97316', '#4ade80'];

const Dashboard = () => {
  const [donations, setDonations] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const userRes = await axios.get('http://localhost:5000/api/user/me', { withCredentials: true });
        if (!userRes.data.isAdmin) return window.location.href = '/';
        setUsers(userRes.data.users || []);

        const donationsRes = await axios.get('http://localhost:5000/api/donations', { withCredentials: true });
        setDonations(donationsRes.data || []);
        setLoading(false);
      } catch (err) {
        console.error(err);
        window.location.href = '/';
      }
    };

    fetchDashboardData();
  }, []);

  useEffect(() => {
    const handleBeforePrint = () => {
      window.dispatchEvent(new Event('resize'));
    };
    window.addEventListener('beforeprint', handleBeforePrint);
    return () => window.removeEventListener('beforeprint', handleBeforePrint);
  }, []);

  const getTotalAmount = () => donations.reduce((sum, d) => sum + (d.amount || 0), 0);

  const getTodayDonations = () => {
    const today = new Date().toISOString().slice(0, 10);
    return donations.filter(d => d.createdAt?.slice(0, 10) === today);
  };

  const getMonthlyData = () => {
    const monthlyMap = {};
    donations.forEach(d => {
      const rawDate = d.date || d.createdAt;
      const date = new Date(rawDate);
      if (isNaN(date.getTime())) return;

      const month = date.toLocaleString('default', {
        month: 'short',
        year: 'numeric',
      });
      monthlyMap[month] = (monthlyMap[month] || 0) + d.amount;
    });

    const sorted = Object.entries(monthlyMap).sort(
      ([a], [b]) => new Date(a) - new Date(b)
    );

    return sorted.map(([name, amount]) => ({ name, amount }));
  };

  const getTopDonors = () => {
    const donorMap = {};
    donations.forEach(d => {
      const user = d.userId?.username || 'Unknown';
      donorMap[user] = (donorMap[user] || 0) + d.amount;
    });
    return Object.entries(donorMap)
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 4);
  };

  if (loading) return <div className="text-center p-10 text-white">Loading Dashboard...</div>;

  return (
    <div className="min-h-screen flex bg-black text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-black/95 border-1 p-6 space-y-6">
        <h1 className="text-2xl font-bold tracking-wide text-white">DONAVISION</h1>
        <nav className="flex flex-col space-y-4">
          <a href="/admin" className="font-semibold text-[#facc15] hover:text-white">Dashboard</a>
          <a href="/track" className="text-gray-400 hover:text-white">Track</a>
          <a href="/login" className="text-gray-400 hover:text-white">Logout</a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 space-y-10 overflow-auto">
        <header className="flex justify-between items-center">
          <h2 className="text-3xl font-bold">Dashboard Overview</h2>
          <button
            className="bg-[#facc15] text-black px-5 py-2 rounded-lg font-semibold hover:bg-yellow-400"
            onClick={() => window.print()}
          >
            Download Reports
          </button>
        </header>

        {/* Stats Cards */}
        <section className="print-section print-avoid-break grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Total Users", value: users.length },
            { title: "Donations Today", value: getTodayDonations().length },
            { title: "Monthly Donations", value: `₹${getMonthlyData().slice(-1)[0]?.amount || 0}` },
            { title: "Total Amount", value: `₹${getTotalAmount()}` }
          ].map((item, index) => (
            <div
              key={index}
              className="bg-black/95 border-1 p-6 rounded-xl shadow-md hover:scale-105 transform transition duration-300"
            >
              <h3 className="text-lg font-semibold text-gray-300">{item.title}</h3>
              <p className="text-3xl font-bold mt-2 text-white">{item.value}</p>
            </div>
          ))}
        </section>

        {/* Graphs Section */}
        {/* Monthly Donation Growth Chart */}
<section className="print-section chart-container bg-black/95 border-1 p-6 rounded-xl shadow-md">
  <h3 className="text-2xl text-center font-bold mb-4">Monthly Donation Growth</h3>
  <ResponsiveContainer width="100%" height={250}>
    <LineChart data={getMonthlyData()}>
      <CartesianGrid stroke="#334155" />
      <XAxis dataKey="name" stroke="#94a3b8" />
      <YAxis stroke="#94a3b8" />
      <Tooltip />
      <Line type="monotone" dataKey="amount" stroke="#facc15" strokeWidth={5} />
    </LineChart>
  </ResponsiveContainer>
</section>

{/* Top Donors Pie Chart */}
<section className="print-section chart-container bg-black/95 border-1 p-6 rounded-xl shadow-md">
  <h3 className="text-2xl text-center font-bold mb-4">Top Donors</h3>
  <div style={{ height: 250 }}>
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={getTopDonors()}
          dataKey="amount"
          nameKey="name"
          outerRadius={100}
          label
        >
          {getTopDonors().map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  </div>
</section>

        {/* Donation Table Section */}
        <section className="print-section print-avoid-break bg-black/95 border-1 p-6 rounded-xl shadow-md table-container">
          <h3 className="text-2xl text-center font-bold mb-4">Donation History</h3>
          <div className="overflow-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-[#334155] text-white">
                <tr>
                  <th className="px-4 py-2">ID</th>
                  <th className="px-4 py-2">User</th>
                  <th className="px-4 py-2">Amount</th>
                  <th className="px-4 py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {donations.map(d => (
                  <tr key={d._id} className="border-t border-[#475569]">
                    <td className="px-4 py-2">{d._id.slice(-6)}</td>
                    <td className="px-4 py-2">{d.userId?.username || 'Unknown'}</td>
                    <td className="px-4 py-2">₹{d.amount}</td>
                    <td className="px-4 py-2">
                      {d.date
                        ? new Date(d.date).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
