import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useCartStore } from './stores/cartStore';
import { CatalogPage } from './pages/CatalogPage';
import { CartPage } from './pages/CartPage';
import { OrdersPage } from './pages/OrdersPage';

function App() {
  const { cart } = useCartStore();
  const cartItemCount = cart.items.length;

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <nav className="bg-white shadow">
          <div className="container mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <Link to="/" className="text-2xl font-bold text-blue-600">
                B2B Procurement
              </Link>
              <div className="flex gap-4">
                <Link
                  to="/"
                  className="text-gray-600 hover:text-gray-900 transition"
                >
                  カタログ
                </Link>
                <Link
                  to="/cart"
                  className="relative text-gray-600 hover:text-gray-900 transition"
                >
                  カート
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </Link>
                <Link
                  to="/orders"
                  className="text-gray-600 hover:text-gray-900 transition"
                >
                  注文
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<CatalogPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/orders" element={<OrdersPage />} />
        </Routes>

        {/* Footer */}
        <footer className="bg-gray-800 text-white mt-12 py-6">
          <div className="container mx-auto px-6 text-center">
            <p>© 2025 B2B Procurement System. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
