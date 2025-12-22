import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrdersContext';

const Profile = () => {
  const { user, logout, error: authError } = useAuth();
  const { orders, loading, error: ordersError } = useOrders();

  if (authError) return <div className="p-4 text-red-500">{authError}</div>;
  if (ordersError) return <div className="p-4 text-red-500">{ordersError}</div>;

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h2 className="text-3xl font-bold mb-4">Please sign in</h2>
          <Link to="/login" className="text-indigo-600 hover:underline text-lg">Go to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
            <img src={user.avatar || "https://via.placeholder.com/128"} alt={user.name} className="w-32 h-32 rounded-full border-4 border-indigo-100 shadow-md" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.name}</h1>
              <p className="text-gray-600 mb-1">{user.email}</p>
              {user.isAdmin && <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">Admin</span>}
            </div>
          </div>
          <button onClick={logout} className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600">Logout</button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b bg-gray-50">
            <h2 className="text-2xl font-bold">Your Orders</h2>
          </div>
          {orders.length === 0 ? (
            <div className="p-12 text-center text-gray-500">No orders yet. <Link to="/shop" className="text-indigo-600">Start shopping</Link></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map(order => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap font-medium">{order._id.slice(-6)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{order.items.length}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold">${order.total.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                          order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                          order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                          order.status === 'Processing' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;