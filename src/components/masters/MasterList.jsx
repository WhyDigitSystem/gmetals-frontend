import { useState,useEffect } from "react";
import {
  Anchor,
  Briefcase,
  Globe,
  Grid,
  Hash,
  Navigation,
  Package,
  Phone,
  Truck,
  User,
  Users,
  Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import apiClient from '../../../src/api/apiClient'

const MastersList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  // 
  const orgId = Number(localStorage.getItem("orgId"));
  const [vessel,setVessel] = useState(0);

  const getAllVessel = async () => {
  try {
    const res = await apiClient.get(
      `/api/master/getAllVesselByOrgId?orgId=${orgId}&page=1&size=10`
    );
    const data = res.paramObjectsMap.vesselVO || [];
    setVessel(data.totalCount); 
    console.log("Ports Data from API:", vessel); 
    // return vessel;
  } catch (err) {
    console.error("Ports API Error:", err);
    setVessel([]);
    // return [];
  }
};

useEffect(()=>{
  getAllVessel()
},[])
  // 

  const masters = [
    {
      id: 1,
      name: "Exporters",
      icon: <Truck className="w-4 h-4" />,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      path: "/exporter",
      count: 24,
    },
    {
      id: 2,
      name: "Consignee",
      icon: <User className="w-4 h-4" />,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      path: "/party",
      count: 18,
    },
    {
      id: 3,
      name: "Party",
      icon: <Users className="w-4 h-4" />,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      path: "/party",
      count: 42,
    },
    {
      id: 4,
      name: "Port",
      icon: <Anchor className="w-4 h-4" />,
      color: "from-amber-500 to-orange-500",
      bgColor: "bg-amber-50 dark:bg-amber-900/20",
      path: "/port",
      count: 36,
    },
    {
      id: 5,
      name: "Country",
      icon: <Globe className="w-4 h-4" />,
      color: "from-indigo-500 to-blue-500",
      bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
      path: "/masters/country",
      count: 156,
    },
    {
      id: 6,
      name: "Vessel",
      icon: <Navigation className="w-4 h-4" />,
      color: "from-red-500 to-rose-500",
      bgColor: "bg-red-50 dark:bg-red-900/20",
      path: "/vessel",
      count: vessel,
    },
    {
      id: 7,
      name: "Contact Person",
      icon: <Phone className="w-4 h-4" />,
      color: "from-pink-500 to-rose-500",
      bgColor: "bg-pink-50 dark:bg-pink-900/20",
      path: "/masters/contact-person",
      count: 67,
    },
    {
      id: 8,
      name: "Recovery Abbreviation",
      icon: <Hash className="w-4 h-4" />,
      color: "from-gray-500 to-slate-500",
      bgColor: "bg-gray-50 dark:bg-gray-800/50",
      path: "/masters/recovery-abbreviation",
      count: 12,
    },
    {
      id: 9,
      name: "Buyer",
      icon: <Briefcase className="w-4 h-4" />,
      color: "from-teal-500 to-cyan-500",
      bgColor: "bg-teal-50 dark:bg-teal-900/20",
      path: "/masters/buyer",
      count: 31,
    },
    {
      id: 10,
      name: "Commodity",
      icon: <Package className="w-4 h-4" />,
      color: "from-orange-500 to-amber-500",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      path: "/commodity",
      count: 58,
    },
  ];

  const filteredMasters = masters.filter((master) =>
    master.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCardClick = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-6 px-4 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Masters
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Manage your core data and configurations
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="mt-4 lg:mt-0 lg:w-80">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search masters..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredMasters.map((master) => (
            <div
              key={master.id}
              onClick={() => handleCardClick(master.path)}
              className="group cursor-pointer"
            >
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200/80 dark:border-gray-600/50 p-4 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:border-gray-300 dark:hover:border-gray-500 group-hover:bg-white dark:group-hover:bg-gray-700/90 h-full flex flex-col">
                {/* Icon with Gradient Background */}
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`p-2 rounded-lg bg-gradient-to-br ${master.color} shadow-xs`}
                  >
                    <div className="text-white filter drop-shadow-sm">
                      {master.icon}
                    </div>
                  </div>
                  <div className="text-xs font-semibold px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 min-w-[20px] text-center">
                    {master.count}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-2 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors line-clamp-1">
                    {master.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2 leading-relaxed">
                    Manage {master.name.toLowerCase()} data and configurations
                  </p>
                </div>

                {/* Action Button */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-600">
                  <span className="text-xs font-medium text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                    View details
                  </span>
                  <div className="w-5 h-5 rounded-full bg-blue-50 dark:bg-blue-900/30 group-hover:bg-blue-100 dark:group-hover:bg-blue-800/50 transition-colors flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400 group-hover:bg-blue-600 dark:group-hover:bg-blue-300 transition-colors" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredMasters.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <Search className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No masters found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Try adjusting your search terms to find what you're looking for.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MastersList;