import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import supabase from './lib/supabase.js';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/admin' },
    { name: 'Projects', path: '/admin/projects' },
    { name: 'Orders', path: '/admin/orders' },
    { name: 'Applications', path: '/admin/applications' },
    { name: 'Leads', path: '/admin/leads' },
    { name: 'Settings', path: '/admin/settings' },
  ];

  return (
    <div className="flex min-h-screen bg-[#F9F9F9]">
      {/* Sticky Sidebar */}
      <aside className="w-72 h-screen bg-black text-white p-8 flex flex-col sticky top-0">
        <div className="mb-12">
          <h2 className="text-sm uppercase tracking-[0.3em] font-bold text-gray-500">Admin Portal</h2>
          <p className="text-xl font-light mt-1">Business Pioneers</p>
        </div>

        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.path} 
                to={item.path} 
                className={`group flex items-center justify-between py-3 px-4 rounded-xl transition-all duration-300 ${
                  isActive ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'
                }`}
              >
                <span className="text-sm font-medium">{item.name}</span>
                {isActive && <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_white]"></div>}
              </Link>
            );
          })}
        </nav>

        <div className="pt-8 border-t border-white/10 mt-auto">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 text-sm text-gray-500 hover:text-red-400 transition-colors duration-300 group"
          >
            <span className="font-medium">Sign Out</span>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-h-screen overflow-y-auto">
        <div className="p-12 max-w-6xl mx-auto">
          <Outlet /> 
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;