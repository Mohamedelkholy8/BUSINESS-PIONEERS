import { useEffect, useState } from 'react';
import supabase from './lib/supabase.js';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  async function togglePaymentStatus(id, currentStatus) {
    const newStatus = currentStatus === 'Paid' ? 'Unpaid' : 'Paid';
    const { error } = await supabase
      .from('orders')
      .update({ payment_status: newStatus })
      .eq('id', id);
    
    if (!error) {
      setOrders(prev => prev.map(order => order.id === id ? { ...order, payment_status: newStatus } : order));
    }
  }

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-light tracking-tight text-black">Orders</h1>
        <p className="text-gray-500 mt-2 text-sm uppercase tracking-widest">Transaction & Fulfillment Tracking</p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] uppercase tracking-widest text-gray-400 border-b border-gray-50">
                <th className="px-8 py-5 font-bold">Date</th>
                <th className="px-8 py-5 font-bold">Customer</th>
                <th className="px-8 py-5 font-bold">Total</th>
                <th className="px-8 py-5 font-bold">Items</th>
                <th className="px-8 py-5 font-bold text-right">Payment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.length > 0 ? orders.map((order) => (
                <tr key={order.id} className="group hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-6 text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-8 py-6">
                    <p className="font-medium text-black">{order.customer_name}</p>
                    <p className="text-xs text-gray-400">{order.customer_email}</p>
                  </td>
                  <td className="px-8 py-6 font-medium text-black">
                    ${order.total_amount?.toLocaleString()}
                  </td>
                  <td className="px-8 py-6">
                    <button 
                      onClick={() => setSelectedOrder(order)}
                      className="text-xs font-bold uppercase tracking-widest text-black hover:text-main transition-colors flex items-center gap-2"
                    >
                      View Items <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded-full">{order.items?.length || 0}</span>
                    </button>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button
                      onClick={() => togglePaymentStatus(order.id, order.payment_status)}
                      className={`text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-xl transition-all ${
                        order.payment_status === 'Paid' 
                          ? 'bg-green-50 text-green-600 hover:bg-green-100' 
                          : 'bg-red-50 text-red-600 hover:bg-red-100'
                      }`}
                    >
                      {order.payment_status || 'Unpaid'}
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center text-gray-400">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Items Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-2xl font-semibold text-black">Order Items</h2>
                <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">Ref: #{selectedOrder.id.slice(0, 8)}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-300 hover:text-black transition-colors text-xl">✕</button>
            </div>

            <div className="space-y-4 mb-8">
              {selectedOrder.items?.map((item, i) => (
                <div key={i} className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="font-medium text-black">{item.name}</p>
                    <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium text-black">${(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 flex justify-between items-center">
              <p className="text-sm font-bold uppercase tracking-widest text-gray-400">Total Amount</p>
              <p className="text-2xl font-light text-black">${selectedOrder.total_amount?.toLocaleString()}</p>
            </div>

            <button 
              onClick={() => setSelectedOrder(null)}
              className="w-full bg-black text-white py-4 rounded-2xl font-bold mt-8 hover:bg-zinc-800 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageOrders;
