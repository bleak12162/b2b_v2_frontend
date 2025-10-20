import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderAPI, shipToAPI } from '../services/api';
import { useCartStore } from '../stores/cartStore';

interface ShipTo {
  id: string;
  label: string;
  address: string;
  phone?: string;
}

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, removeItem, updateQuantity, setShipTo, getTotal, clearCart } =
    useCartStore();
  const [shipTos, setShipTos] = useState<ShipTo[]>([]);
  const [selectedShipTo, setSelectedShipTo] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Fetch ship-tos
  useEffect(() => {
    const loadShipTos = async () => {
      try {
        setLoading(true);
        const response = await shipToAPI.getShipTos();
        setShipTos(response.data || []);
      } catch (error) {
        console.error('Failed to load ship-tos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadShipTos();
  }, []);

  const handleCheckout = async () => {
    if (!selectedShipTo || !cart.farmerCompanyId) {
      alert('配送先を選択してください');
      return;
    }

    if (cart.items.length === 0) {
      alert('カートに商品がありません');
      return;
    }

    try {
      setLoading(true);
      const orderData = {
        farmerCompanyId: cart.farmerCompanyId,
        shipToId: selectedShipTo,
        items: cart.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        discountAmount: cart.discountAmount,
      };

      const response = await orderAPI.createOrder(orderData);
      alert('注文を作成しました');
      clearCart();
      navigate('/orders');
    } catch (error) {
      console.error('Failed to create order:', error);
      alert('注文の作成に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">カート</h1>
        <p>カートが空です</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">カート</h1>

      {/* Cart Items */}
      <div className="mb-8">
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">商品</th>
              <th className="border p-2 text-center">単価</th>
              <th className="border p-2 text-center">数量</th>
              <th className="border p-2 text-right">小計</th>
              <th className="border p-2 text-center">操作</th>
            </tr>
          </thead>
          <tbody>
            {cart.items.map((item) => (
              <tr key={item.productId}>
                <td className="border p-2">{item.productName}</td>
                <td className="border p-2 text-center">¥{item.unitPrice}</td>
                <td className="border p-2 text-center">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(item.productId, parseInt(e.target.value))
                    }
                    className="w-16 px-2 py-1 border rounded"
                  />
                </td>
                <td className="border p-2 text-right">¥{item.subtotal}</td>
                <td className="border p-2 text-center">
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    削除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Shipping Address Selection */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">配送先を選択</h2>
        <select
          value={selectedShipTo}
          onChange={(e) => {
            setSelectedShipTo(e.target.value);
            setShipTo(e.target.value);
          }}
          className="w-full max-w-md px-4 py-2 border rounded-lg"
        >
          <option value="">配送先を選択してください</option>
          {shipTos.map((shipTo) => (
            <option key={shipTo.id} value={shipTo.id}>
              {shipTo.label} - {shipTo.address}
            </option>
          ))}
        </select>
      </div>

      {/* Total and Checkout */}
      <div className="mb-8 p-4 bg-gray-100 rounded-lg">
        <div className="flex justify-between mb-4">
          <span className="text-lg font-semibold">合計:</span>
          <span className="text-2xl font-bold">¥{getTotal()}</span>
        </div>
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
        >
          {loading ? '処理中...' : '注文を確定'}
        </button>
      </div>
    </div>
  );
};
