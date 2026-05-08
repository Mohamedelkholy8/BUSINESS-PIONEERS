import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from './lib/supabase.js';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) throw loginError;
      
      if (data.session) {
        navigate('/admin');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 transition-colors duration-500">
      <div className="w-full max-w-md space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-block w-12 h-12 bg-black rounded-full flex items-center justify-center mb-4 mx-auto">
            <span className="text-white text-xs font-bold tracking-tighter">BP</span>
          </div>
          <h1 className="text-4xl font-light tracking-tight text-black">Welcome Back</h1>
          <p className="text-gray-400 text-sm uppercase tracking-[0.3em]">Administrative Portal Access</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-500 text-xs font-bold uppercase tracking-widest p-4 rounded-2xl text-center border border-red-100 animate-shake">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 ml-4">Email Address</label>
            <input 
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@businesspioneers.com"
              className="w-full bg-gray-50 border-none rounded-[2rem] px-8 py-4 text-sm focus:ring-2 focus:ring-black outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 ml-4">Password</label>
            <input 
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-gray-50 border-none rounded-[2rem] px-8 py-4 text-sm focus:ring-2 focus:ring-black outline-none transition-all"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-5 rounded-[2rem] text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-xl shadow-black/10 disabled:bg-gray-200"
          >
            {loading ? 'Verifying Credentials...' : 'Authenticate Access'}
          </button>
        </form>

        {/* Footer */}
        <div className="pt-8 text-center">
          <button 
            onClick={() => navigate('/')}
            className="text-[10px] uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-colors"
          >
            ← Return to Public Site
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
