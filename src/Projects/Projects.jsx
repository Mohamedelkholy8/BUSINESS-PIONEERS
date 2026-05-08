import { useEffect, useState } from 'react';
import supabase from './../lib/supabase';

const Projects = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error) setProjects(data);
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-24">
      {/* Header */}
      <div className="mb-16">
        <h1 className="text-5xl md:text-6xl font-light tracking-tight text-black mb-4">Our Projects</h1>
        <p className="text-gray-500 text-sm uppercase tracking-[0.3em]">Engineering · Excellence · Innovation</p>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {projects?.map((project) => (
          <div key={project.id} className="group cursor-pointer">
            <div className="aspect-[4/5] bg-gray-100 rounded-3xl mb-6 overflow-hidden relative">
              {project.thumbnail_url ? (
                <img 
                  src={project.thumbnail_url} 
                  alt={project.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">No Image</div>
              )}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                <span className="text-white text-sm uppercase tracking-widest font-medium border border-white/40 px-6 py-2 rounded-full backdrop-blur-sm">View Details</span>
              </div>
            </div>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-xl text-black mb-1">{project.title}</h3>
                <p className="text-gray-400 text-sm">{project.category}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {projects?.length === 0 && (
        <div className="text-center py-20 border border-dashed border-gray-200 rounded-3xl">
          <p className="text-gray-400">No projects found.</p>
        </div>
      )}
    </div>
  );
};

export default Projects;