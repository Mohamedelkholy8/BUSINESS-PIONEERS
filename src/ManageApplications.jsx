import { useEffect, useState } from 'react';
import supabase from './lib/supabase.js';

const ManageApplications = () => {
  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  const types = ['All', 'Job Applicant', 'Contractor', 'RFQ'];

  useEffect(() => {
    fetchApplications();
  }, []);

  async function fetchApplications() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id, newStatus) {
    const { error } = await supabase
      .from('applications')
      .update({ status: newStatus })
      .eq('id', id);
    
    if (!error) {
      setApplications(prev => prev.map(app => app.id === id ? { ...app, status: newStatus } : app));
    }
  }

  const filteredApps = filter === 'All' 
    ? applications 
    : applications.filter(app => app.type === filter);

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-light tracking-tight text-black">Applications</h1>
          <p className="text-gray-500 mt-2 text-sm uppercase tracking-widest">Talent & Procurement Management</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex bg-white border border-gray-100 p-1.5 rounded-2xl shadow-sm">
          {types.map(t => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-6 py-2 rounded-xl text-xs font-bold tracking-widest uppercase transition-all ${
                filter === t ? 'bg-black text-white shadow-lg' : 'text-gray-400 hover:text-black'
              }`}
            >
              {t === 'All' ? t : t + 's'}
            </button>
          ))}
        </div>
      </div>

      {/* Grid/Table */}
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] uppercase tracking-widest text-gray-400 border-b border-gray-50">
                <th className="px-8 py-5 font-bold">Applicant</th>
                <th className="px-8 py-5 font-bold">Type</th>
                <th className="px-8 py-5 font-bold">Details</th>
                <th className="px-8 py-5 font-bold">Attachment</th>
                <th className="px-8 py-5 font-bold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredApps.length > 0 ? filteredApps.map((app) => (
                <tr key={app.id} className="group hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <p className="font-medium text-black">{app.name}</p>
                    <p className="text-xs text-gray-400">{app.email}</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-[10px] font-bold uppercase tracking-widest bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                      {app.type}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <button 
                      onClick={() => alert(app.message || "No message provided")}
                      className="text-xs font-medium text-black hover:underline underline-offset-4"
                    >
                      View Message
                    </button>
                  </td>
                  <td className="px-8 py-6">
                    {app.file_attachment_url ? (
                      <a 
                        href={app.file_attachment_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs font-medium text-main hover:underline underline-offset-4 flex items-center gap-2"
                      >
                        📄 Download File
                      </a>
                    ) : (
                      <span className="text-xs text-gray-300">No file</span>
                    )}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <select
                      value={app.status || 'Pending'}
                      onChange={(e) => updateStatus(app.id, e.target.value)}
                      className={`text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-xl border-none outline-none cursor-pointer appearance-none text-center shadow-sm transition-all ${
                        app.status === 'Reviewed' 
                          ? 'bg-green-50 text-green-600 hover:bg-green-100' 
                          : 'bg-orange-50 text-orange-600 hover:bg-orange-100'
                      }`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Reviewed">Reviewed</option>
                    </select>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center text-gray-400">
                    No {filter.toLowerCase()} applications found.
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

export default ManageApplications;
