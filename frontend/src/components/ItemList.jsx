import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ShoppingCart, Package, LogOut, ShoppingBag, Sparkles } from 'lucide-react';

const ItemList = ({ onLogout }) => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get('https://shopping-cart-br9a.onrender.com/api/items');
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
      toast.error('Error loading items');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async (itemId) => {
    const token = localStorage.getItem('token');
    
    console.log('Adding item to cart:', itemId);
    console.log('Token:', token);
    
    try {
      const response = await axios.post(
        'https://shopping-cart-br9a.onrender.com/api/carts',
        { item_id: itemId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      console.log('Success:', response.data);
      toast.success('Item added to cart!', {
        icon: '🛒',
        duration: 2000
      });
    } catch (error) {
      console.error('Full error:', error);
      console.error('Error response:', error.response);
      
      if (error.response && error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Error adding item to cart');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <div className="text-xl text-gray-600 font-semibold">Loading items...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b-4 border-indigo-600">
        <div className="container mx-auto px-4 py-5">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-lg">
                <ShoppingBag size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  ShopCart
                </h1>
                <p className="text-sm text-gray-500">Premium Shopping Experience</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/cart')}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-5 py-2.5 rounded-lg hover:from-blue-600 hover:to-blue-700 transition shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <ShoppingCart size={20} />
                <span className="font-semibold">Cart</span>
              </button>
              <button
                onClick={() => navigate('/orders')}
                className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-5 py-2.5 rounded-lg hover:from-green-600 hover:to-emerald-700 transition shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <Package size={20} />
                <span className="font-semibold">Orders</span>
              </button>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-600 text-white px-5 py-2.5 rounded-lg hover:from-red-600 hover:to-pink-700 transition shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <LogOut size={20} />
                <span className="font-semibold">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Items Grid */}
      <div className="container mx-auto px-4 py-10">
        <div className="flex items-center gap-3 mb-8">
          <Sparkles size={32} className="text-indigo-600" />
          <h2 className="text-3xl font-bold text-gray-800">Featured Products</h2>
        </div>
        
        {items.length === 0 ? (
          <div className="text-center text-gray-600 py-20 bg-white rounded-2xl shadow-lg">
            <Package size={64} className="mx-auto text-gray-400 mb-4" />
            <p className="text-xl font-semibold">No items available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <div
                key={item._id}
                onClick={() => navigate(`/product/${item._id}`)}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 overflow-hidden"
              >
                <div className="relative">
                  {item.image ? (
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    className={`${item.image ? 'hidden' : 'flex'} items-center justify-center h-48 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 group-hover:from-indigo-200 group-hover:via-purple-200 group-hover:to-pink-200 transition-all`}
                  >
                    <Package size={64} className="text-indigo-600 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full shadow-md">
                    <span className="text-xs font-bold text-indigo-600">NEW</span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-indigo-600 transition">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">Premium Quality Product</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 font-medium">Click to view</span>
                    <div className="bg-indigo-100 p-2 rounded-full group-hover:bg-indigo-600 transition">
                      <ShoppingCart size={18} className="text-indigo-600 group-hover:text-white transition" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemList;
