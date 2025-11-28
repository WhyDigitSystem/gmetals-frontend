import { BarChart3, Clock } from 'lucide-react';

const StatsDashboard = ({ enquiries }) => {
  const stats = {
    total: enquiries.length,
    open: enquiries.filter(e => e.status === 'Open').length,
    inProgress: enquiries.filter(e => e.status === 'In Progress').length,
    closed: enquiries.filter(e => e.status === 'Closed').length,
    highPriority: enquiries.filter(e => e.priority === 'High').length,
    overdue: enquiries.filter(e => {
      const created = new Date(e.date_created);
      const now = new Date();
      const hoursElapsed = (now - created) / (1000 * 60 * 60);
      return hoursElapsed > e.sla_hours && e.status !== 'Closed';
    }).length
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Enquiries</p>
          </div>
          <BarChart3 className="w-8 h-8 text-blue-500" />
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.open}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Open</p>
          </div>
          <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.inProgress}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">In Progress</p>
          </div>
          <Clock className="w-8 h-8 text-yellow-500" />
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.closed}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Closed</p>
          </div>
          <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.highPriority}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">High Priority</p>
          </div>
          <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.overdue}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Overdue</p>
          </div>
          <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsDashboard;