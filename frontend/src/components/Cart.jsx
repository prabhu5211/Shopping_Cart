import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ArrowLeft, ShoppingBag, CreditCard, Trash2, Plus, Minus, Package } from 'lucide-react';

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    const token = localStorage.getItem('token');
    
    try {
      const response = await axios.get('https://shopping-cart-br9a.onrender.com/api/carts', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setCart(response.data.cart);
      setCartItems(response.data.items);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;

    const token = localStorage.getItem('token');
    
    try {
      await axios.put(
        `https://shopping-cart-br9a.onrender.com/api/carts/${cartItemId}`,
        { quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local state
      setCartItems(cartItems.map(item => 
        item._id === cartItemId ? { ...item, quantity: newQuantity } : item
      ));

      toast.success('Quantity updated');
    } catch (error) {
      toast.error('Error updating quantity');
    }
  };

  const removeItem = async (cartItemId) => {
    const token = localStorage.getItem('token');
    
    try {
      await axios.delete(
        `https://shopping-cart-br9a.onrender.com/api/carts/${cartItemId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local state
      setCartItems(cartItems.filter(item => item._id !== cartItemId));
      
      toast.success('Item removed from cart', {
        icon: '🗑️'
      });
    } catch (error) {
      toast.error('Error removing item');
    }
  };

  const handleCheckout = async () => {
    const token = localStorage.getItem('token');
    
    if (!cart || cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    try {
      await axios.post(
        'https://shopping-cart-br9a.onrender.com/api/orders',
        { cart_id: cart._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Order placed successfully! 🎉', {
        duration: 3000,
        icon: '✅'
      });
      
      setTimeout(() => {
        navigate('/items');
      }, 1500);
    } catch (error) {
      if (error.response && error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Error creating order');
      }
    }
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <div className="text-xl text-gray-600 font-semibold">Loading cart...</div>
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
            My Shopping Cart
          </h1>
          <div className="w-32"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        {!cart || cartItems.length === 0 ? (
          <div className="max-w-md mx-auto text-center py-20 bg-white rounded-2xl shadow-lg">
            <ShoppingBag size={80} className="mx-auto text-gray-300 mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Your cart is empty</h2>
            <p className="text-gray-500 mb-8">Looks like you haven't added anything yet!</p>
            <button
              onClick={() => navigate('/items')}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition shadow-lg"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Cart Items</h2>
                <span className="bg-indigo-100 text-indigo-600 px-4 py-2 rounded-full font-bold">
                  {getTotalItems()} {getTotalItems() === 1 ? 'Item' : 'Items'}
                </span>
              </div>
              
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center gap-4 p-5 border-2 border-gray-100 rounded-xl hover:border-indigo-200 transition bg-gradient-to-r from-white to-indigo-50"
                  >
                    {/* Product Image */}
                    {item.item_id?.image ? (
                      <img
                        src={item.item_id.image}
                        alt={item.item_id.name}
                        className="w-24 h-24 object-cover rounded-lg shadow-md"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center">
                        <Package size={40} className="text-indigo-600" />
                      </div>
                    )}

                    {/* Product Info */}
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-800">{item.item_id?.name}</h3>
                      <p className="text-sm text-gray-500">Premium Quality Product</p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 bg-white rounded-lg p-2 shadow-md">
                      <button
                        onClick={() => updateQuantity(item._id, (item.quantity || 1) - 1)}
                        disabled={(item.quantity || 1) <= 1}
                        className="bg-indigo-100 hover:bg-indigo-200 disabled:bg-gray-100 disabled:cursor-not-allowed p-2 rounded-lg transition"
                      >
                        <Minus size={18} className="text-indigo-600" />
                      </button>
                      <span className="font-bold text-lg w-8 text-center">{item.quantity || 1}</span>
                      <button
                        onClick={() => updateQuantity(item._id, (item.quantity || 1) + 1)}
                        className="bg-indigo-100 hover:bg-indigo-200 p-2 rounded-lg transition"
                      >
                        <Plus size={18} className="text-indigo-600" />
                      </button>
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={() => removeItem(item._id)}
                      className="bg-red-100 hover:bg-red-200 p-3 rounded-lg transition group"
                      title="Remove from cart"
                    >
                      <Trash2 size={20} className="text-red-600 group-hover:scale-110 transition" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-2xl p-8 text-white">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Ready to Checkout?</h3>
                  <p className="text-indigo-100">Complete your purchase now</p>
                  <p className="text-sm text-indigo-200 mt-2">Total: {getTotalItems()} items</p>
                </div>
                <CreditCard size={48} className="text-white opacity-50" />
              </div>
              
              <button
                onClick={handleCheckout}
                className="w-full bg-white text-indigo-600 py-4 rounded-xl font-bold text-lg hover:bg-indigo-50 transition shadow-lg transform hover:scale-105"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
