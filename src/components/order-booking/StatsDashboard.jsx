import { FileText, Clock, CheckCircle, Truck } from "lucide-react";

const StatsDashboard = ({ orders }) => {
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'Pending').length,
    confirmed: orders.filter(o => o.status === 'Confirmed').length,
    inTransit: orders.filter(o => o.status === 'In Transit').length,
    delivered: orders.filter(o => o.status === 'Delivered').length,
    highPriority: orders.filter(o => o.priority === 'High').length,
    totalRevenue: orders.reduce((sum, order) => sum + (order.total_cost || 0), 0),
    roadTransport: orders.filter(o => o.transport_mode === 'Road').length,
    airTransport: orders.filter(o => o.transport_mode === 'Air').length,
    seaTransport: orders.filter(o => o.transport_mode === 'Sea').length,
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Orders</p>
          </div>
          <FileText className="w-8 h-8 text-blue-500" />
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pending}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Pending</p>
          </div>
          <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
            <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.confirmed}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Confirmed</p>
          </div>
          <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
            <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.inTransit}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">In Transit</p>
          </div>
          <Truck className="w-8 h-8 text-blue-500" />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">${stats.totalRevenue.toLocaleString()}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Revenue</p>
          </div>
          <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsDashboard;