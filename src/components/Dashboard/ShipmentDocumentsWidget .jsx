import React from "react";

const ShipmentDocumentsWidget = () => {
  const cards = [
    {
      id: 1,
      title: "Vessel Sail Status",
      count: 3,
      icon: "🚢",
      color: "blue",
      description: "Track vessel movements",
      status: "In Transit"
    },
    {
      id: 2,
      title: "Bank Documentation",
      count: 8,
      icon: "🏦",
      color: "green",
      description: "LC & payment documents",
      status: "85% Complete"
    },
    {
      id: 3,
      title: "Upcoming Documents",
      count: 5,
      icon: "📅",
      color: "amber",
      description: "Due within 7 days",
      status: "2 Urgent"
    },
    {
      id: 4,
      title: "Pending Actions",
      count: 12,
      icon: "⚠️",
      color: "red",
      description: "Need attention",
      status: "3 Overdue"
    }
  ];

  const colorClasses = {
    blue: {
      bg: "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10",
      text: "text-blue-600 dark:text-blue-400",
      border: "border-blue-200 dark:border-blue-800",
      button: "bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
    },
    green: {
      bg: "bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-900/10",
      text: "text-emerald-600 dark:text-emerald-400",
      border: "border-emerald-200 dark:border-emerald-800",
      button: "bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600"
    },
    amber: {
      bg: "bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-900/10",
      text: "text-amber-600 dark:text-amber-400",
      border: "border-amber-200 dark:border-amber-800",
      button: "bg-amber-600 hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-600"
    },
    red: {
      bg: "bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-900/20 dark:to-rose-900/10",
      text: "text-rose-600 dark:text-rose-400",
      border: "border-rose-200 dark:border-rose-800",
      button: "bg-rose-600 hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-600"
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg dark:shadow-gray-900/50 p-5">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
          Shipment Documents
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Manage and track all shipment documentation
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => {
          const colors = colorClasses[card.color];
          
          return (
            <div
              key={card.id}
              className={`${colors.bg} ${colors.border} border rounded-xl p-4 hover:shadow-md dark:hover:shadow-gray-900/30 transition-all duration-200`}
            >
              {/* Card Top */}
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-lg ${colors.bg}`}>
                  <span className="text-2xl">{card.icon}</span>
                </div>
                <span className={`text-2xl font-bold ${colors.text}`}>
                  {card.count}
                </span>
              </div>

              {/* Card Content */}
              <div className="mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-1">
                  {card.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                  {card.description}
                </p>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${colors.text.replace('text-', 'bg-')}`}></div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {card.status}
                  </span>
                </div>
              </div>

              {/* View Details Button */}
              <button className={`w-full ${colors.button} text-white py-2 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2`}>
                View Details
                <span className="text-lg">→</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ShipmentDocumentsWidget;