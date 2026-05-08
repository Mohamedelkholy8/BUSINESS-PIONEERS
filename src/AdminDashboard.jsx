import { useEffect, useState } from 'react';
import supabase from './lib/supabase.js';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    projects: 0,
    orders: 0,
    applications: 0
  });
  const [recentLeads, setRecentLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    try {
      setLoading(true);
      
      // Fetch counts for stat cards
      const [projectsCount, ordersCount, applicationsCount, leadsData] = await Promise.all([
        supabase.from('projects').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('applications').select('*', { count: 'exact', head: true }),
        supabase.from('leads').select('*').order('created_at', { ascending: false }).limit(5)
      ]);

      setStats({
        projects: projectsCount.count || 0,
        orders: ordersCount.count || 0,
        applications: applicationsCount.count || 0
      });

      setRecentLeads(leadsData.data || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }

  const statCards = [
    { label: 'Total Projects', value: stats.projects, color: 'text-black' },
    { label: 'Active Orders', value: stats.orders, color: 'text-main' },
    { label: 'New Applications', value: stats.applications, color: 'text-black' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-light tracking-tight text-black">Dashboard</h1>
        <p className="text-gray-500 mt-2 text-sm uppercase tracking-widest">Business Performance Overview</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">{stat.label}</p>
            <p className={`text-5xl font-light ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex justify-between items-center">
          <h3 className="text-xl font-medium text-black">Recent Leads</h3>
          <button className="text-sm text-gray-400 hover:text-black transition-colors">View All Leads →</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs uppercase tracking-widest text-gray-400">
                <th className="px-8 py-4 font-bold">Contact</th>
                <th className="px-8 py-4 font-bold">Inquiry</th>
                <th className="px-8 py-4 font-bold">Date</th>
                <th className="px-8 py-4 font-bold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentLeads.length > 0 ? recentLeads.map((lead) => (
                <tr key={lead.id} className="group hover:bg-gray-50 transition-colors">
                  <td className="px-8 py-6">
                    <p className="font-medium text-black">{lead.name || lead.email}</p>
                    <p className="text-sm text-gray-400">{lead.email}</p>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm text-gray-600 truncate max-w-[200px]">{lead.message || 'No message provided'}</p>
                  </td>
                  <td className="px-8 py-6 text-sm text-gray-400">
                    {new Date(lead.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <span className="inline-block w-2 h-2 rounded-full bg-main"></span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="px-8 py-20 text-center text-gray-400">
                    No recent leads found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
