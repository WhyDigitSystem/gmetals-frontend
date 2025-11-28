import { useState, useEffect } from "react";
import { Plus, List } from "lucide-react";
import StatsDashboard from "./StatsDashboard";
import OrderForm from "./OrderForm";

const OrderBooking = () => {
  const [orders, setOrders] = useState([]);
  const [viewMode, setViewMode] = useState('form');
  const [loading, setLoading] = useState(false);

  // Sample data for demonstration
  useEffect(() => {
    const sampleData = [
      {
        id: 1,
        order_id: 'ORD-001',
        customer_name: 'John Smith',
        shipper_name: 'ABC Manufacturing',
        status: 'Pending',
        priority: 'High',
        total_cost: 1500,
        date_created: new Date().toISOString(),
        transport_mode: 'Road',
        service_level: 'Express',
        cargo_description: 'Electronics Components',
        pickup_location: 'Kuala Lumpur',
        delivery_location: 'Singapore'
      },
      {
        id: 2,
        order_id: 'ORD-002',
        customer_name: 'Sarah Chen',
        shipper_name: 'Precision Engineering',
        status: 'Confirmed',
        priority: 'Medium',
        total_cost: 2800,
        date_created: new Date().toISOString(),
        transport_mode: 'Air',
        service_level: 'Standard',
        cargo_description: 'Machine Parts',
        pickup_location: 'Penang',
        delivery_location: 'Tokyo'
      },
      {
        id: 3,
        order_id: 'ORD-003',
        customer_name: 'Robert Tan',
        shipper_name: 'Metal Works Co',
        status: 'In Transit',
        priority: 'Low',
        total_cost: 4200,
        date_created: new Date().toISOString(),
        transport_mode: 'Sea',
        service_level: 'Economy',
        cargo_description: 'Steel Beams',
        pickup_location: 'Johor',
        delivery_location: 'Dubai'
      }
    ];
    setOrders(sampleData);
  }, []);

  // Add new order
  const addOrder = (newOrder) => {
    const orderWithId = {
      ...newOrder,
      id: Date.now(),
      order_id: `ORD-${Date.now()}`,
      date_created: new Date().toISOString(),
      status: 'Pending'
    };
    setOrders(prev => [...prev, orderWithId]);
  };

  // Update order
  const updateOrder = (id, updatedData) => {
    setOrders(prev => 
      prev.map(order => 
        order.id === id ? { ...order, ...updatedData } : order
      )
    );
  };

  // Delete order
  const deleteOrder = (id) => {
    setOrders(prev => prev.filter(order => order.id !== id));
  };

  // View mode toggles
  const showForm = () => setViewMode('form');
  const showList = () => setViewMode('list');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto p-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Order Booking Management
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Create and manage transportation orders efficiently
          </p>
        </div>

        {/* Stats Dashboard */}
        <StatsDashboard orders={orders} />

        {/* View Mode Toggle */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Order Management</h2>
          <div className="flex gap-2">
            <button
              onClick={showForm}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'form' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <Plus className="w-4 h-4 inline mr-2" />
              New Order
            </button>
            <button
              onClick={showList}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'list' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <List className="w-4 h-4 inline mr-2" />
              View All
            </button>
          </div>
        </div>

        {/* Order Form and List View */}
        <OrderForm
          viewMode={viewMode}
          orders={orders}
          onAddOrder={addOrder}
          onUpdateOrder={updateOrder}
          onDeleteOrder={deleteOrder}
          loading={loading}
          setLoading={setLoading}
        />
      </div>
    </div>
  );
};

export default OrderBooking;