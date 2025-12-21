import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrdersContext';

const Profile = () => {
  const { user, logout } = useAuth();
  const { orders } = useOrders();

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
            <img src={user.avatar} alt={user.name} className="w-32 h-32 rounded-full border-4 border-indigo-100 shadow-md" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-gray-600">{user.email}</p>
              {user.isAdmin && <span className="inline-block bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium mt-2">Admin</span>}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-6">Quick Links</h2>
              <ul className="space-y-4 text-lg">
                <li><Link to="/wishlist" className="text-indigo-600 hover:text-indigo-800 transition">My Wishlist</Link></li>
                <li><Link to="/shop" className="text-indigo-600 hover:text-indigo-800 transition">Continue Shopping</Link></li>
                {user.isAdmin && <li><Link to="/admin" className="text-rose-600 font-bold hover:text-rose-800 transition">Admin Dashboard</Link></li>}
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
              <ul className="space-y-4 text-lg">
                <li><button className="text-gray-600 hover:text-indigo-600 transition">Update Profile</button></li>
                <li><button onClick={logout} className="text-red-600 hover:text-red-800 transition">Sign Out</button></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold mb-8">Order History</h2>
          {orders.length === 0 ? (
            <p className="text-center text-gray-500 text-lg py-12">No orders yet. Start shopping to see your history here.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-max">
                <thead>
                  <tr className="border-b text-left text-gray-500 uppercase text-sm">
                    <th className="pb-4 pr-4">Order ID</th>
                    <th className="pb-4 pr-4">Date</th>
                    <th className="pb-4 pr-4">Items</th>
                    <th className="pb-4 pr-4">Total</th>
                    <th className="pb-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id} className="border-b last:border-0">
                      <td className="py-4 pr-4 font-medium">#{order.id.toString().slice(-6)}</td>
                      <td className="py-4 pr-4">{order.date}</td>
                      <td className="py-4 pr-4">{order.items.length}</td>
                      <td className="py-4 pr-4 font-bold">${order.total.toFixed(2)}</td>
                      <td className="py-4">
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