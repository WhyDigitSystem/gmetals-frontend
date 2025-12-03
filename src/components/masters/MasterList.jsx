import {
  Anchor,
  Box,
  Briefcase,
  Building,
  Container,
  Globe,
  Hash,
  Navigation,
  Package,
  Phone,
  Search,
  Ship,
  Truck,
  User,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../../src/api/apiClient";

const MastersList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const orgId = Number(localStorage.getItem("orgId"));
  const [vessel, setVessel] = useState(0);

  const getAllVessel = async () => {
    try {
      const res = await apiClient.get(
        `/api/master/getAllVesselByOrgId?orgId=${orgId}&page=1&size=10`
      );
      const data = res.paramObjectsMap.vesselVO || [];
      setVessel(data.totalCount);
    } catch (err) {
      console.error("Ports API Error:", err);
      setVessel(0);
    }
  };

  useEffect(() => {
    getAllVessel();
  }, []);

  const masters = [
    {
      id: 11,
      name: "Customer",
      icon: <Building className="w-3.5 h-3.5" />,
      color: "from-blue-600 to-indigo-500",
      path: "/customer",
      count: 89,
    },
    {
      id: 12,
      name: "Liner",
      icon: <Ship className="w-3.5 h-3.5" />,
      color: "from-violet-500 to-purple-500",
      path: "/liner",
      count: 23,
    },
    {
      id: 13,
      name: "Agent",
      icon: <User className="w-3.5 h-3.5" />,
      color: "from-emerald-500 to-teal-500",
      path: "/agent",
      count: 45,
    },
    {
      id: 14,
      name: "Material",
      icon: <Box className="w-3.5 h-3.5" />,
      color: "from-amber-600 to-yellow-500",
      path: "/material",
      count: 76,
    },
    {
      id: 15,
      name: "Container",
      icon: <Container className="w-3.5 h-3.5" />,
      color: "from-cyan-500 to-blue-500",
      path: "/container",
      count: 34,
    },
    {
      id: 1,
      name: "Exporters",
      icon: <Truck className="w-3.5 h-3.5" />,
      color: "from-blue-500 to-cyan-500",
      path: "/exporter",
      count: 24,
    },
    {
      id: 2,
      name: "Consignee",
      icon: <User className="w-3.5 h-3.5" />,
      color: "from-purple-500 to-pink-500",
      path: "/party",
      count: 18,
    },
    {
      id: 3,
      name: "Party",
      icon: <Users className="w-3.5 h-3.5" />,
      color: "from-green-500 to-emerald-500",
      path: "/party",
      count: 42,
    },
    {
      id: 4,
      name: "Port",
      icon: <Anchor className="w-3.5 h-3.5" />,
      color: "from-amber-500 to-orange-500",
      path: "/port",
      count: 36,
    },
    {
      id: 5,
      name: "Country",
      icon: <Globe className="w-3.5 h-3.5" />,
      color: "from-indigo-500 to-blue-500",
      path: "/masters/country",
      count: 156,
    },
    {
      id: 6,
      name: "Vessel",
      icon: <Navigation className="w-3.5 h-3.5" />,
      color: "from-red-500 to-rose-500",
      path: "/vessel",
      count: vessel,
    },
    {
      id: 7,
      name: "Contact Person",
      icon: <Phone className="w-3.5 h-3.5" />,
      color: "from-pink-500 to-rose-500",
      path: "/masters/contact-person",
      count: 67,
    },
    {
      id: 8,
      name: "Recovery Abbreviation",
      icon: <Hash className="w-3.5 h-3.5" />,
      color: "from-gray-500 to-slate-500",
      path: "/masters/recovery-abbreviation",
      count: 12,
    },
    {
      id: 9,
      name: "Buyer",
      icon: <Briefcase className="w-3.5 h-3.5" />,
      color: "from-teal-500 to-cyan-500",
      path: "/masters/buyer",
      count: 31,
    },
    {
      id: 10,
      name: "Commodity",
      icon: <Package className="w-3.5 h-3.5" />,
      color: "from-orange-500 to-amber-500",
      path: "/commodity",
      count: 58,
    },
    // New cards
  ];

  const filteredMasters = masters.filter((master) =>
    master.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCardClick = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 px-4 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                Setup
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Manage your core data and configurations
              </p>
            </div>

            {/* Search Bar */}
            <div className="mt-3 lg:mt-0 lg:w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                <input
                  type="text"
                  placeholder="Search Setup..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {filteredMasters.map((master) => (
            <div
              key={master.id}
              onClick={() => handleCardClick(master.path)}
              className="group cursor-pointer"
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 transition-all duration-200 hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 h-full flex flex-col">
                {/* Icon with Gradient Background */}
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`p-1.5 rounded-md bg-gradient-to-br ${master.color}`}
                  >
                    <div className="text-white">{master.icon}</div>
                  </div>
                  <div className="text-xs font-semibold px-1.5 py-0.5 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 min-w-[20px] text-center">
                    {master.count}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-white text-xs mb-1 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors truncate">
                    {master.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate leading-tight">
                    Manage {master.name.toLowerCase()}
                  </p>
                </div>

                {/* View Indicator */}
                <div className="flex items-center justify-between pt-2 mt-1 border-t border-gray-100 dark:border-gray-700">
                  <span className="text-xs font-medium text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                    View
                  </span>
                  <div className="w-4 h-4 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-blue-500 dark:bg-blue-400" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MastersList;
