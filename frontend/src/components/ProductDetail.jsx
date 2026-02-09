import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ArrowLeft, ShoppingCart, Package } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchItem();
  }, [id]);

  const fetchItem = async () => {
    try {
      const response = await axios.get(`https://shopping-cart-br9a.onrender.com/api/items`);
      const foundItem = response.data.find(i => i._id === id);
      setItem(foundItem);
    } catch (error) {
      console.error('Error fetching item:', error);
      toast.error('Error loading product');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async () => {
    const token = localStorage.getItem('token');
    
    try {
      await axios.post(
        'https://shopping-cart-br9a.onrender.com/api/carts',
        { item_id: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success('Item added to cart!', {
        icon: '🛒',
        duration: 2000
      });
    } catch (error) {
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
          <div className="text-xl text-gray-600 font-semibold">Loading product...</div>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="text-center">
          <Package size={64} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Product not found</h2>
          <button
            onClick={() => navigate('/items')}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b-4 border-indigo-600">
        <div className="container mx-auto px-4 py-5">
          <button
            onClick={() => navigate('/items')}
            className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 font-semibold transition"
          >
            <ArrowLeft size={20} />
            Back to Products
          </button>
        </div>
      </div>

      {/* Product Detail */}
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            {/* Product Image */}
            <div className="flex items-center justify-center">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-96 object-cover rounded-xl shadow-lg"
                />
              ) : (
                <div className="w-full h-96 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center">
                  <Package size={120} className="text-indigo-600" />
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col justify-center">
              <div className="mb-6">
                <span className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-sm font-bold">
                  NEW
                </span>
              </div>

              <h1 className="text-4xl font-bold text-gray-800 mb-4">{item.name}</h1>
              
              <p className="text-gray-600 text-lg mb-6">
                Premium Quality Product - High performance and reliability guaranteed.
              </p>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-800 mb-2">Features:</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>✓ Premium build quality</li>
                  <li>✓ Latest technology</li>
                  <li>✓ 1 year warranty</li>
                  <li>✓ Fast shipping</li>
                </ul>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transition shadow-lg flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={24} />
                  Add to Cart
                </button>
                
                <button
                  onClick={() => navigate('/cart')}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-4 rounded-xl font-semibold transition"
                >
                  View Cart
                </button>
              </div>

              <div className="mt-6 text-sm text-gray-500">
                <p>Product ID: {item._id}</p>
                <p>Status: {item.status}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
