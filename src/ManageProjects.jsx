import { useEffect, useState } from 'react';
import supabase from './lib/supabase';

const ManageProjects = () => {
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    status: 'draft'
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    setProjects(data);
  }

  async function handleDelete(id) {
    if (window.confirm('Are you sure you want to delete this project?')) {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (!error) fetchProjects();
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      let thumbnail_url = '';

      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('portfolio')
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage.from('portfolio').getPublicUrl(fileName);
        thumbnail_url = urlData.publicUrl;
      }

      const { error } = await supabase.from('projects').insert([
        { ...formData, thumbnail_url }
      ]);

      if (error) throw error;

      setIsModalOpen(false);
      setFormData({ title: '', category: '', description: '', status: 'draft' });
      setImageFile(null);
      fetchProjects();
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-light tracking-tight text-black">Manage Projects</h1>
          <p className="text-gray-500 mt-2 text-sm uppercase tracking-widest">Portfolio & Works Management</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-black text-white px-8 py-3 rounded-full hover:bg-zinc-800 transition-all text-sm font-medium shadow-lg shadow-black/10"
        >
          + Create Project
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] uppercase tracking-widest text-gray-400 border-b border-gray-50">
                <th className="px-8 py-6 font-bold">Project Info</th>
                <th className="px-8 py-6 font-bold">Category</th>
                <th className="px-8 py-6 font-bold">Status</th>
                <th className="px-8 py-6 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {projects?.map((project) => (
                <tr key={project.id} className="group hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                        {project.thumbnail_url && (
                          <img src={project.thumbnail_url} alt="" className="w-full h-full object-cover" />
                        )}
                      </div>
                      <p className="font-medium text-black">{project.title}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-xs text-gray-500">{project.category}</span>
                  </td>
                  <td className="px-8 py-6">
                     <span className={`text-[10px] uppercase tracking-widest px-3 py-1 rounded-full font-bold ${
                       project.status === 'published' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
                     }`}>
                      {project.status}
                     </span>
                  </td>
                  <td className="px-8 py-6 text-right space-x-4">
                    <button className="text-xs font-bold text-black hover:underline underline-offset-4 opacity-40 hover:opacity-100 transition-opacity">Edit</button>
                    <button 
                      onClick={() => handleDelete(project.id)}
                      className="text-xs font-bold text-red-500 hover:underline underline-offset-4 opacity-40 hover:opacity-100 transition-opacity"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-xl rounded-[2.5rem] p-10 shadow-2xl overflow-y-auto max-h-[90vh] animate-in fade-in zoom-in duration-300">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-3xl font-semibold text-black">New Project</h2>
                <p className="text-xs text-gray-400 uppercase tracking-widest mt-2">Add a new masterpiece to your portfolio</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-300 hover:text-black transition-colors text-xl">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 ml-4">Title</label>
                <input 
                  required
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-black outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 ml-4">Category</label>
                <input 
                  required
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                  className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-black outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 ml-4">Description</label>
                <textarea 
                  rows="3"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-black outline-none transition-all resize-none"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 ml-4">Cover Image</label>
                <div className="relative">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={e => setImageFile(e.target.files[0])}
                    className="w-full text-sm file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-xs file:font-bold file:uppercase file:tracking-widest file:bg-black file:text-white hover:file:bg-zinc-800 cursor-pointer"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 ml-4">Visibility Status</label>
                <select 
                  value={formData.status}
                  onChange={e => setFormData({...formData, status: e.target.value})}
                  className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-black outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>

              <button 
                disabled={loading}
                className="w-full bg-black text-white py-5 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-zinc-800 disabled:bg-gray-200 transition-all shadow-xl shadow-black/10 mt-4"
              >
                {loading ? 'Creating Project...' : 'Launch Project'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProjects;