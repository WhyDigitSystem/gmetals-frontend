import {
  Globe,
  Package,
  Truck,
  TestTube,
  Download,
  Printer,
  Share2,
  Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const CertificateListing = () => {
  const navigate = useNavigate();

  const certificates = [
    {
      id: 1,
      name: "Origin Malaysia",
      icon: <Globe className="w-4 h-4" />,
      color: "from-amber-500 to-orange-500",
      bgColor: "bg-amber-50 dark:bg-amber-900/20",
      path: "/orgin",
      count: 15,
    },
    {
      id: 2,
      name: "Freight",
      icon: <Truck className="w-4 h-4" />,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      path: "/certificates/freight",
      count: 8,
    },
    {
      id: 3,
      name: "Packing List",
      icon: <Package className="w-4 h-4" />,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      path: "/certificates/packing-list",
      count: 23,
    },
    {
      id: 4,
      name: "Chemicals Analysis",
      icon: <TestTube className="w-4 h-4" />,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      path: "/certificates/chemicals-analysis",
      count: 12,
    },
  ];

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
                Certificates
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Manage and access all your certificates and documents
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="mt-4 lg:mt-0 lg:w-80">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search certificates..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              onClick={() => handleCardClick(cert.path)}
              className="group cursor-pointer"
            >
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200/80 dark:border-gray-600/50 p-4 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:border-gray-300 dark:hover:border-gray-500 group-hover:bg-white dark:group-hover:bg-gray-700/90 h-full flex flex-col">
                {/* Icon with Gradient Background */}
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`p-2 rounded-lg bg-gradient-to-br ${cert.color} shadow-xs`}
                  >
                    <div className="text-white filter drop-shadow-sm">
                      {cert.icon}
                    </div>
                  </div>
                  <div className="text-xs font-semibold px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 min-w-[20px] text-center">
                    {cert.count}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-2 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors line-clamp-1">
                    {cert.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2 leading-relaxed">
                    Manage {cert.name.toLowerCase()} certificates and documents
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-600">
                  <span className="text-xs font-medium text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                    View details
                  </span>
                  <div className="flex space-x-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log("Download clicked");
                      }}
                      className="p-1.5 text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                      title="Download"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log("Print clicked");
                      }}
                      className="p-1.5 text-gray-400 hover:text-green-500 dark:hover:text-green-400 rounded-full hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors"
                      title="Print"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log("Share clicked");
                      }}
                      className="p-1.5 text-gray-400 hover:text-purple-500 dark:hover:text-purple-400 rounded-full hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors"
                      title="Share"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State (if needed for future search functionality) */}
        {/* {certificates.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <Search className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No certificates found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Try adjusting your search terms to find what you're looking for.
            </p>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default CertificateListing;