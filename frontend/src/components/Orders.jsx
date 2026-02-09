import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Package, CheckCircle, Calendar, ShoppingBag, X } from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const token = localStorage.getItem('token');
    
    try {
      const response = await axios.get('http://localhost:5000/api/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewItems = (order) => {
    setSelectedOrder(order);
  };

  const closeModal = () => {
    setSelectedOrder(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <div className="text-xl text-gray-600 font-semibold">Loading orders...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="bg-white shadow-lg border-b-4 border-indigo-600">
        <div className="container mx-auto px-4 py-5 flex justify-between items-center">
          <button
            onClick={() => navigate('/items')}
            className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 font-semibold transition"
          >
            <ArrowLeft size={20} />
            Back to Shopping
          </button>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Order History
          </h1>
          <div className="w-32"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        {orders.length === 0 ? (
          <div className="max-w-md mx-auto text-center py-20 bg-white rounded-2xl shadow-lg">
            <Package size={80} className="mx-auto text-gray-300 mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 mb-3">No orders yet</h2>
            <p className="text-gray-500 mb-8">Start shopping to create your first order!</p>
            <button
              onClick={() => navigate('/items')}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition shadow-lg"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-800">Your Orders</h2>
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2 rounded-full font-bold shadow-lg">
                {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
              </span>
            </div>
            
            <div className="space-y-6">
              {orders.map((order, index) => (
                <div
                  key={order._id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="bg-white p-3 rounded-full">
                          <ShoppingBag size={28} className="text-indigo-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-white text-lg">Order #{index + 1}</h3>
                          <p className="text-indigo-100 text-sm">ID: {order._id}</p>
                        </div>
                      </div>
                      <div className="bg-green-500 text-white px-4 py-2 rounded-full flex items-center gap-2 font-semibold shadow-lg">
                        <CheckCircle size={18} />
                        Completed
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <Calendar size={20} className="text-indigo-600" />
                        <div>
                          <p className="text-xs text-gray-500 font-semibold">Order Date</p>
                          <p className="text-sm font-bold text-gray-800">
                            {new Date(order.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Package size={20} className="text-indigo-600" />
                        <div>
                          <p className="text-xs text-gray-500 font-semibold">Items</p>
                          <p className="text-sm font-bold text-gray-800">
                            {order.items?.length || 0} {order.items?.length === 1 ? 'Item' : 'Items'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleViewItems(order)}
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition shadow-md"
                    >
                      View Order Items
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal for Order Items */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-white">Order Items</h2>
                <p className="text-indigo-100 text-sm">Order ID: {selectedOrder._id}</p>
              </div>
              <button
                onClick={closeModal}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-full transition"
              >
                <X size={24} className="text-white" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {selectedOrder.items && selectedOrder.items.length > 0 ? (
                <div className="space-y-4">
                  {selectedOrder.items.map((cartItem, index) => (
                    <div
                      key={cartItem._id}
                      className="flex items-center gap-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border-2 border-indigo-100"
                    >
                      {cartItem.item_id?.image ? (
                        <img
                          src={cartItem.item_id.image}
                          alt={cartItem.item_id.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center">
                          <Package size={32} className="text-indigo-600" />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-800">
                          {cartItem.item_id?.name || 'Unknown Item'}
                        </h3>
                        <p className="text-sm text-gray-500">Item #{index + 1}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          Item ID: {cartItem.item_id?._id}
                        </p>
                      </div>
                      {/* Quantity Badge */}
                      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-full font-bold shadow-lg">
                        <span className="text-sm">Qty: {cartItem.quantity || 1}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Package size={64} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">No items found in this order</p>
                </div>
              )}
            </div>

            <div className="p-6 bg-gray-50 border-t">
              <button
                onClick={closeModal}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
