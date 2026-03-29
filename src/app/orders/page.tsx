import { useEffect, useState } from 'react';
import { getOrders, Order } from '@/lib/orders';
import { logout } from '@/lib/auth';

export const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const data = await getOrders();
      setOrders(data);
    };

    fetchOrders();
  }, []);

  return (
    <div>
      <h2>Orders</h2>

      <button onClick={logout}>Logout</button>

      {orders.map((order) => (
        <div key={order._id} style={{ border: '1px solid #ccc', margin: 10 }}>
          <h3>Order: {order._id}</h3>
          <p>Total: {order.totalPrice}</p>

          {order.items.map((item, i) => (
            <div key={i}>
              <p>{item.title}</p>
              <p>{item.price} x {item.quantity}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};