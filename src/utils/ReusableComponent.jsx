import { useState, useEffect } from "react";
import {
  Download,
  Edit,
  Plus,
  Search,
  Trash2,
  Upload,
  X,
} from "lucide-react";

// Mock API Service
const createMockApiService = (resourceName, initialData = []) => {
  // Simulate network delay
  const delay = () => new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 400));
  
  let data = [...initialData];
  let nextId = Math.max(0, ...initialData.map(item => item.id)) + 1;
  
  return {
    getAll: async () => {
      await delay();
      return [...data];
    },
    
    get: async (id) => {
      await delay();
      const item = data.find(item => item.id === id);
      if (!item) throw new Error(`${resourceName} not found`);
      return {...item};
    },
    
    create: async (itemData) => {
      await delay();
      const newItem = { ...itemData, id: nextId++ };
      data.push(newItem);
      return {...newItem};
    },
    
    update: async (id, itemData) => {
      await delay();
      const index = data.findIndex(item => item.id === id);
      if (index === -1) throw new Error(`${resourceName} not found`);
      data[index] = { ...data[index], ...itemData };
      return {...data[index]};
    },
    
    delete: async (id) => {
      await delay();
      const index = data.findIndex(item => item.id === id);
      if (index === -1) throw new Error(`${resourceName} not found`);
      data.splice(index, 1);
      return { success: true };
    },
    
    search: async (query) => {
      await delay();
      const lowercaseQuery = query.toLowerCase();
      return data.filter(item => 
        Object.values(item).some(value => 
          String(value).toLowerCase().includes(lowercaseQuery)
        )
      );
    }
  };
};

// Reusable MasterData Component
const ReusableComponent = ({
  title,
  initialData = [],
  fields,
  searchableFields = [],
  formLayout = 'grid-cols-1 md:grid-cols-2',
  onExport,
  onImport,
  getAll,
  create,
  update,
  onRowEdit,
   editData
}) => {
  const [data, setData] = useState(initialData);
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [currentItem, setCurrentItem] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Initialize API service
  const apiService = createMockApiService(title.toLowerCase(), initialData);

  useEffect(() => {
    loadData();
  }, []);

 

  const loadData = async () => {
    setIsLoading(true);
    try {
      const result = await getAll();
      setData(result);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredData = searchTerm
    ? data.filter(item =>
        searchableFields.some(field => 
          String(item[field] || '').toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : data;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (isEditing) {
        await update(currentItem.id, currentItem);
      } else {
        // await apiService.create(currentItem);
        await create(currentItem);
      }
      await loadData(); // Reload data after operation
      resetForm();
    } catch (error) {
      console.error("Error saving data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 
  const handleEdit = async (item) => {
  await onRowEdit(item.id);  
  setIsEditing(true);
  setShowForm(true);
};

useEffect(() => {
  if (editData && Object.keys(editData).length > 0) {
    setCurrentItem(editData); 
  }
}, [editData]);

// 
  // 

  // const handleEdit = (item) => {
    
  //   setCurrentItem({...item});
  //   setIsEditing(true);
  //   setShowForm(true);
  // };

  // const handleDelete = async (id) => {
  //   if (!window.confirm("Are you sure you want to delete this item?")) return;
    
  //   setIsLoading(true);
  //   try {
  //     await apiService.delete(id);
  //     await loadData();
  //   } catch (error) {
  //     console.error("Error deleting item:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const resetForm = () => {
    setCurrentItem({});
    setIsEditing(false);
    setShowForm(false);
  };








  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleInputChange = (field, value) => {
    setCurrentItem(prev => ({
      ...prev,
      [field]: value
    }));
  };
 

  return (
    <div className="pt-0 pb-2 px-2 max-w-6xl mx-auto">
      {/* Header with Search and Actions */}
      <div className="flex items-center justify-between gap-4 mb-4 p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white min-w-max">
          {title}
        </h2>
        
        <div className="flex-1 max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder={`Search ${title.toLowerCase()}...`}
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-3 pr-8 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all"
            />
            <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 dark:text-gray-500" />
          </div>
        </div>

        <div className="flex items-center space-x-2 min-w-max">
          {onExport && (
            <button
              onClick={onExport}
              className="px-3 py-2 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-medium flex items-center hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-800/40 dark:hover:to-blue-700/40 transition-all shadow-xs"
              title="Export"
            >
              <Download className="w-4 h-4 mr-1" />
            </button>
          )}
          
          {onImport && (
            <button
              onClick={onImport}
              className="px-3 py-2 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 text-green-600 dark:text-green-400 rounded-lg text-sm font-medium flex items-center hover:from-green-100 hover:to-green-200 dark:hover:from-green-800/40 dark:hover:to-green-700/40 transition-all shadow-xs"
              title="Import"
            >
              <Upload className="w-4 h-4 mr-1" />
            </button>
          )}
          
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 text-white rounded-lg text-sm font-medium flex items-center hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-600 dark:hover:to-blue-700 transition-all shadow-md"
            title={showForm ? "Close Form" : "Add New"}
          >
            {showForm ? (
              <X className="w-4 h-4"  />
            ) : (
              <Plus className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* Form */}
        {showForm && (
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-800 dark:text-white">
                {isEditing ? `Edit ${title}` : `Add New ${title}`}
              </h3>
              <button
                onClick={resetForm}
                className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className={`grid ${formLayout} gap-3`}>
                {fields.map(field => (
                  <div key={field.name} className={field.fullWidth ? 'col-span-1 md:col-span-2' : ''}>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                      {field.label} {field.required && '*'}
                    </label>
                    {field.type === 'select' ? (
                      <select
                        required={field.required}
                        value={currentItem[field.name] || ''}
                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                      >
                      
                      <option value=''>Select {field.label}</option>
                        {field.options?.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type || 'text'}
                        required={field.required}
                        value={currentItem[field.name] || ''}
                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all"
                        placeholder={field.placeholder}
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-600 dark:hover:to-blue-700 disabled:opacity-50 transition-all shadow-md"
                >
                  {isLoading ? 'Processing...' : isEditing ? `Update ${title}` : `Add ${title}`}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Data Table */}
        {!showForm && (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="grid grid-cols-12 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 px-3 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              {fields.slice(0, 4).map(field => (
                <div key={field.name} className={`col-span-${field.colSpan || 3}`}>
                  {field.label}
                </div>
              ))}
              <div className="col-span-3 text-center">Actions</div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="p-6 text-center text-gray-400 dark:text-gray-500 text-sm">
                  Loading...
                </div>
              ) : filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-12 px-4 py-3 border-b border-gray-100 dark:border-gray-700 hover:bg-blue-50/30 dark:hover:bg-blue-900/20 transition-colors group"
                  >
                    {fields.slice(0, 4).map(field => (
                      <div key={field.name} className={`col-span-${field.colSpan || 3}`}>
                        <div className="text-sm text-gray-800 dark:text-gray-200 truncate">
                          {item[field.name]}
                        </div>
                        {field.subField && item[field.subField] && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                            {item[field.subField]}
                          </div>
                        )}
                      </div>
                    ))}
                    <div className="col-span-3 flex items-center justify-center space-x-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-1.5 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800/60 hover:text-blue-800 dark:hover:text-blue-300 transition-colors shadow-xs"
                        title="Edit"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      {/* <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-800/60 hover:text-red-800 dark:hover:text-red-300 transition-colors shadow-xs"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button> */}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-gray-400 dark:text-gray-500 text-sm">
                  {searchTerm
                    ? "No matching items found"
                    : `No ${title.toLowerCase()} added yet. Click the + button to add your first item.`}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReusableComponent;