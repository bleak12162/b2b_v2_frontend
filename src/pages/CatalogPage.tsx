import React, { useState, useEffect } from 'react';
import { catalogAPI, orderAPI } from '../services/api';
import { useCartStore } from '../stores/cartStore';

interface Product {
  id: string;
  name: string;
  unitPrice: number;
  effectivePrice: number;
  isSpecial: boolean;
  unit: string;
}

interface Farmer {
  id: string;
  name: string;
}

export const CatalogPage: React.FC = () => {
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [selectedFarmer, setSelectedFarmer] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const { addItem, setFarmer } = useCartStore();

  // Fetch farmers
  useEffect(() => {
    const loadFarmers = async () => {
      try {
        setLoading(true);
        // Note: Mock farmers for now, replace with actual API call
        const mockFarmers = [
          { id: '00000000-0000-0000-0000-000000000002', name: 'Farmer Tanaka' },
          { id: '00000000-0000-0000-0000-000000000003', name: 'Farmer Suzuki' },
        ];
        setFarmers(mockFarmers);
      } catch (error) {
        console.error('Failed to load farmers:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFarmers();
  }, []);

  // Fetch products when farmer is selected
  useEffect(() => {
    if (!selectedFarmer) return;

    const loadProducts = async () => {
      try {
        setLoading(true);
        const response = await catalogAPI.getProducts(selectedFarmer);
        setProducts(response.products || []);
        setFarmer(selectedFarmer);
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [selectedFarmer, setFarmer]);

  const handleAddToCart = (product: Product) => {
    addItem({
      productId: product.id,
      productName: product.name,
      quantity: 1,
      unitPrice: product.effectivePrice,
      subtotal: product.effectivePrice,
    });
    alert(`${product.name} をカートに追加しました`);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">カタログ</h1>

      {/* Farmer Selection */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">農家を選択</h2>
        <select
          value={selectedFarmer}
          onChange={(e) => setSelectedFarmer(e.target.value)}
          className="w-full max-w-md px-4 py-2 border rounded-lg"
        >
          <option value="">農家を選択してください</option>
          {farmers.map((farmer) => (
            <option key={farmer.id} value={farmer.id}>
              {farmer.name}
            </option>
          ))}
        </select>
      </div>

      {/* Products Grid */}
      {loading ? (
        <p>読み込み中...</p>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="border rounded-lg p-4 shadow-md">
              <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
              <p className="text-gray-600 mb-2">単位: {product.unit}</p>

              <div className="mb-4">
                {product.isSpecial ? (
                  <div>
                    <p className="line-through text-gray-400">
                      ¥{product.unitPrice}
                    </p>
                    <p className="text-2xl font-bold text-red-600">
                      ¥{product.effectivePrice}
                    </p>
                    <p className="text-sm text-red-500">特別価格</p>
                  </div>
                ) : (
                  <p className="text-2xl font-bold">¥{product.unitPrice}</p>
                )}
              </div>

              <button
                onClick={() => handleAddToCart(product)}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
              >
                カートに追加
              </button>
            </div>
          ))}
        </div>
      ) : selectedFarmer ? (
        <p>商品がありません</p>
      ) : (
        <p>農家を選択してください</p>
      )}
    </div>
  );
};
