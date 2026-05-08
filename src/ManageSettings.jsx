import { useEffect, useState } from 'react';
import supabase from './lib/supabase.js';

const ManageSettings = () => {
  const [settings, setSettings] = useState([]);
  const [authData, setAuthData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('chatbot_settings').select('*');
      if (error) throw error;
      setSettings(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  async function saveSetting(key, value) {
    try {
      setSaveLoading(true);
      const { error } = await supabase
        .from('chatbot_settings')
        .upsert({ key, value }, { onConflict: 'key' });
      
      if (error) throw error;
      fetchSettings(); // Refresh
      alert('Setting updated successfully');
    } catch (error) {
      alert(error.message);
    } finally {
      setSaveLoading(false);
    }
  }

  async function updateAdminAuth(e) {
    e.preventDefault();
    try {
      setSaveLoading(true);
      const updatePayload = {};
      if (authData.email) updatePayload.email = authData.email;
      if (authData.password) updatePayload.password = authData.password;

      const { error } = await supabase.auth.updateUser(updatePayload);
      if (error) throw error;
      alert('Account updated. Check your email if you changed it.');
      setAuthData({ email: '', password: '' });
    } catch (error) {
      alert(error.message);
    } finally {
      setSaveLoading(false);
    }
  }

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="space-y-16">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-light tracking-tight text-black">Settings</h1>
        <p className="text-gray-500 mt-2 text-sm uppercase tracking-widest">Platform & Security Control</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Chatbot Settings */}
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white text-sm">01</div>
            <h2 className="text-xl font-medium text-black">Chatbot Configurations</h2>
          </div>
          
          <div className="bg-white rounded-[2rem] border border-gray-100 p-8 space-y-6 shadow-sm">
            {['welcome_message', 'bot_status', 'api_key'].map((key) => {
              const currentVal = settings.find(s => s.key === key)?.value || '';
              return (
                <div key={key} className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">{key.replace('_', ' ')}</label>
                  <div className="flex gap-4">
                    <input 
                      defaultValue={currentVal}
                      id={`input-${key}`}
                      placeholder={`Enter ${key}...`}
                      className="flex-1 bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-black outline-none"
                    />
                    <button 
                      onClick={() => saveSetting(key, document.getElementById(`input-${key}`).value)}
                      disabled={saveLoading}
                      className="bg-black text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all disabled:bg-gray-300"
                    >
                      Save
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Admin Security */}
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white text-sm">02</div>
            <h2 className="text-xl font-medium text-black">Admin Security</h2>
          </div>

          <form onSubmit={updateAdminAuth} className="bg-white rounded-[2rem] border border-gray-100 p-8 space-y-6 shadow-sm">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Update Email</label>
              <input 
                type="email"
                placeholder="New admin email"
                value={authData.email}
                onChange={(e) => setAuthData({...authData, email: e.target.value})}
                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-black outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Update Password</label>
              <input 
                type="password"
                placeholder="New secret password"
                value={authData.password}
                onChange={(e) => setAuthData({...authData, password: e.target.value})}
                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-black outline-none"
              />
            </div>
            <button 
              type="submit"
              disabled={saveLoading}
              className="w-full bg-black text-white py-4 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all disabled:bg-gray-300 shadow-lg shadow-black/10"
            >
              {saveLoading ? 'Processing...' : 'Update Credentials'}
            </button>
            <p className="text-[10px] text-gray-400 text-center uppercase tracking-widest">Sensitive Action · Verify your input</p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ManageSettings;
