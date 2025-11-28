import { Calendar, Download, Mail, Phone } from "lucide-react";

const QuickActions = () => {
  const actions = [
    {
      icon: <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
      label: "Send Quote",
      description: "Send quotation to customer",
      color:
        "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30",
    },
    {
      icon: <Phone className="w-6 h-6 text-green-600 dark:text-green-400" />,
      label: "Call Customer",
      description: "Make follow-up call",
      color:
        "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/30",
    },
    {
      icon: (
        <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
      ),
      label: "Schedule Follow-up",
      description: "Set reminder for follow-up",
      color:
        "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/30",
    },
    {
      icon: (
        <Download className="w-6 h-6 text-orange-600 dark:text-orange-400" />
      ),
      label: "Export Report",
      description: "Download enquiry report",
      color:
        "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 hover:bg-orange-100 dark:hover:bg-orange-900/30",
    },
  ];

  return (
    <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        Quick Actions
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            className={`p-4 rounded-lg border transition-colors text-left ${action.color}`}
          >
            <div className="flex items-center mb-2">
              {action.icon}
              <span className="ml-2 text-sm font-medium text-gray-800 dark:text-white">
                {action.label}
              </span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {action.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
