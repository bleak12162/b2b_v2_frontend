import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderAPI } from '../services/api';

interface Order {
  id: string;
  status: string;
  farmerCompanyId: string;
  totalAmount: number;
  createdAt: string;
}

export const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('');

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        const response = await orderAPI.getOrders({ status: filterStatus || undefined });
        setOrders(response.data || []);
      } catch (error) {
        console.error('Failed to load orders:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [filterStatus]);

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      new: '新規',
      processing: '処理中',
      shipped: '配送中',
      completed: '完了',
      canceled: 'キャンセル',
    };
    return labels[status] || status;
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">注文一覧</h1>

      <div className="mb-6">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="">すべて</option>
          <option value="new">新規</option>
          <option value="processing">処理中</option>
          <option value="shipped">配送中</option>
          <option value="completed">完了</option>
        </select>
      </div>

      {loading ? (
        <p>読み込み中...</p>
      ) : orders.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">注文ID</th>
                <th className="border p-2 text-center">ステータス</th>
                <th className="border p-2 text-right">金額</th>
                <th className="border p-2 text-left">作成日</th>
                <th className="border p-2 text-center">操作</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="border p-2">{order.id.substring(0, 8)}...</td>
                  <td className="border p-2 text-center">
                    <span className="px-3 py-1 rounded-full text-sm">
                      {getStatusLabel(order.status)}
                    </span>
                  </td>
                  <td className="border p-2 text-right">¥{order.totalAmount}</td>
                  <td className="border p-2">
                    {new Date(order.createdAt).toLocaleDateString('ja-JP')}
                  </td>
                  <td className="border p-2 text-center">
                    <button
                      onClick={() => navigate(`/orders/${order.id}`)}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                      詳細
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>注文がありません</p>
      )}
    </div>
  );
};
