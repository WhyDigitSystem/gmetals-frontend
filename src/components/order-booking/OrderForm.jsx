import {
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Edit,
  FileText,
  MapPin,
  Package,
  Paperclip,
  Plus,
  Search,
  Trash2,
  Truck,
  User,
} from "lucide-react";
import { useState } from "react";

const OrderForm = ({
  viewMode,
  orders,
  onAddOrder,
  onUpdateOrder,
  onDeleteOrder,
  loading,
  setLoading,
}) => {
  const [currentTab, setCurrentTab] = useState(0);
  const [editingOrder, setEditingOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [formData, setFormData] = useState({
    // Shipper & Consignee
    shipperName: "",
    shipperContact: "",
    shipperPhone: "",
    shipperAddress: "",
    consigneeName: "",
    consigneeContact: "",
    consigneePhone: "",
    consigneeAddress: "",

    // Cargo Details
    cargoType: "",
    packagingType: "",
    cargoDescription: "",
    quantity: "",
    weight: "",
    length: "",
    width: "",
    height: "",

    // Pickup & Delivery
    pickupDate: "",
    pickupTimeStart: "",
    pickupTimeEnd: "",
    pickupLocation: "",
    deliveryDate: "",
    deliveryTimeStart: "",
    deliveryTimeEnd: "",
    deliveryLocation: "",

    // Transportation
    transportMode: "",
    serviceLevel: "",
    vehicleType: "",

    // Charges & Payment
    freightCharges: "",
    paymentMethod: "",

    // Attachments & Notes
    specialInstructions: "",
  });

  const [additionalCharges, setAdditionalCharges] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [volume, setVolume] = useState(0);

  // Calculate volume
  const calculateVolume = () => {
    const length = parseFloat(formData.length) || 0;
    const width = parseFloat(formData.width) || 0;
    const height = parseFloat(formData.height) || 0;
    return (length * width * height) / 1000000;
  };

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Recalculate volume when dimensions change
    if (["length", "width", "height"].includes(field)) {
      setTimeout(() => {
        setVolume(calculateVolume());
      }, 0);
    }
  };

  // Tab navigation
  const switchTab = (tabIndex) => {
    setCurrentTab(tabIndex);
  };

  const nextTab = () => {
    if (currentTab < 5) setCurrentTab(currentTab + 1);
  };

  const previousTab = () => {
    if (currentTab > 0) setCurrentTab(currentTab - 1);
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const totalCost =
        parseFloat(formData.freightCharges || 0) +
        additionalCharges.reduce(
          (sum, charge) => sum + (parseFloat(charge.amount) || 0),
          0
        );

      if (editingOrder) {
        onUpdateOrder(editingOrder.id, {
          ...formData,
          total_volume: volume,
          total_cost: totalCost,
          updated_at: new Date().toISOString(),
        });
      } else {
        onAddOrder({
          ...formData,
          total_volume: volume,
          total_cost: totalCost,
        });
      }

      // Reset form
      setFormData({
        shipperName: "",
        shipperContact: "",
        shipperPhone: "",
        shipperAddress: "",
        consigneeName: "",
        consigneeContact: "",
        consigneePhone: "",
        consigneeAddress: "",
        cargoType: "",
        packagingType: "",
        cargoDescription: "",
        quantity: "",
        weight: "",
        length: "",
        width: "",
        height: "",
        pickupDate: "",
        pickupTimeStart: "",
        pickupTimeEnd: "",
        pickupLocation: "",
        deliveryDate: "",
        deliveryTimeStart: "",
        deliveryTimeEnd: "",
        deliveryLocation: "",
        transportMode: "",
        serviceLevel: "",
        vehicleType: "",
        freightCharges: "",
        paymentMethod: "",
        specialInstructions: "",
      });
      setAdditionalCharges([]);
      setUploadedFiles([]);
      setCurrentTab(0);
      setEditingOrder(null);
    } catch (error) {
      console.error("Failed to save order:", error);
    } finally {
      setLoading(false);
    }
  };

  // Edit order
  const handleEdit = (order) => {
    setEditingOrder(order);
    setFormData({
      shipperName: order.shipperName || "",
      shipperContact: order.shipperContact || "",
      shipperPhone: order.shipperPhone || "",
      shipperAddress: order.shipperAddress || "",
      consigneeName: order.consigneeName || "",
      consigneeContact: order.consigneeContact || "",
      consigneePhone: order.consigneePhone || "",
      consigneeAddress: order.consigneeAddress || "",
      cargoType: order.cargoType || "",
      packagingType: order.packagingType || "",
      cargoDescription: order.cargoDescription || "",
      quantity: order.quantity || "",
      weight: order.weight || "",
      length: order.length || "",
      width: order.width || "",
      height: order.height || "",
      pickupDate: order.pickupDate || "",
      pickupTimeStart: order.pickupTimeStart || "",
      pickupTimeEnd: order.pickupTimeEnd || "",
      pickupLocation: order.pickupLocation || "",
      deliveryDate: order.deliveryDate || "",
      deliveryTimeStart: order.deliveryTimeStart || "",
      deliveryTimeEnd: order.deliveryTimeEnd || "",
      deliveryLocation: order.deliveryLocation || "",
      transportMode: order.transportMode || "",
      serviceLevel: order.serviceLevel || "",
      vehicleType: order.vehicleType || "",
      freightCharges: order.freightCharges || "",
      paymentMethod: order.paymentMethod || "",
      specialInstructions: order.specialInstructions || "",
    });
    setVolume(order.total_volume || 0);
  };

  // Cancel edit
  const cancelEdit = () => {
    setEditingOrder(null);
    setFormData({
      shipperName: "",
      shipperContact: "",
      shipperPhone: "",
      shipperAddress: "",
      consigneeName: "",
      consigneeContact: "",
      consigneePhone: "",
      consigneeAddress: "",
      cargoType: "",
      packagingType: "",
      cargoDescription: "",
      quantity: "",
      weight: "",
      length: "",
      width: "",
      height: "",
      pickupDate: "",
      pickupTimeStart: "",
      pickupTimeEnd: "",
      pickupLocation: "",
      deliveryDate: "",
      deliveryTimeStart: "",
      deliveryTimeEnd: "",
      deliveryLocation: "",
      transportMode: "",
      serviceLevel: "",
      vehicleType: "",
      freightCharges: "",
      paymentMethod: "",
      specialInstructions: "",
    });
    setAdditionalCharges([]);
    setUploadedFiles([]);
    setCurrentTab(0);
  };

  // Additional charges management
  const addAdditionalCharge = () => {
    setAdditionalCharges((prev) => [
      ...prev,
      { id: Date.now(), name: "", amount: 0 },
    ]);
  };

  const updateAdditionalCharge = (id, field, value) => {
    setAdditionalCharges((prev) =>
      prev.map((charge) =>
        charge.id === id ? { ...charge, [field]: value } : charge
      )
    );
  };

  const removeAdditionalCharge = (id) => {
    setAdditionalCharges((prev) => prev.filter((charge) => charge.id !== id));
  };

  // File handling
  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  const removeFile = (index) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Status badge classes
  const getStatusClass = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "Confirmed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "In Transit":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "Delivered":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "Low":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.order_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.shipper_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.cargo_description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Compact form field component
  const FormField = ({ label, children, required = false, className = "" }) => (
    <div className={className}>
      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );

  // Form Section
  if (viewMode === "form") {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
        {/* Compact Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div
              className={`p-2 rounded-lg ${
                editingOrder
                  ? "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
                  : "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
              }`}
            >
              {editingOrder ? (
                <FileText className="w-4 h-4" />
              ) : (
                <User className="w-4 h-4" />
              )}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                {editingOrder ? "Edit Order" : "New Order Booking"}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {editingOrder
                  ? `Editing ${editingOrder.order_id}`
                  : "Create a new transportation order"}
              </p>
            </div>
          </div>
          {editingOrder && (
            <button
              onClick={cancelEdit}
              className="px-3 py-1.5 text-xs border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          {/* Compact Tab Buttons */}
          <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-2">
            {[
              "Parties",
              "Cargo",
              "Location",
              "Transport",
              "Payment",
              "Notes",
            ].map((tab, index) => (
              <button
                key={tab}
                type="button"
                onClick={() => switchTab(index)}
                className={`px-3 py-2 rounded-t-md text-xs font-medium transition-colors whitespace-nowrap border-b-2 ${
                  currentTab === index
                    ? "border-blue-500 text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-800"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                {index === 0 && <User className="w-3 h-3 inline mr-1" />}
                {index === 1 && <Package className="w-3 h-3 inline mr-1" />}
                {index === 2 && <MapPin className="w-3 h-3 inline mr-1" />}
                {index === 3 && <Truck className="w-3 h-3 inline mr-1" />}
                {index === 4 && <DollarSign className="w-3 h-3 inline mr-1" />}
                {index === 5 && <Paperclip className="w-3 h-3 inline mr-1" />}
                {tab}
              </button>
            ))}
          </div>

          {/* Tab 1: Parties */}
          {currentTab === 0 && (
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <FormField label="Shipper Name" required>
                  <input
                    type="text"
                    required
                    value={formData.shipperName}
                    onChange={(e) =>
                      handleInputChange("shipperName", e.target.value)
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter shipper name"
                  />
                </FormField>

                <FormField label="Contact Person" required>
                  <input
                    type="text"
                    required
                    value={formData.shipperContact}
                    onChange={(e) =>
                      handleInputChange("shipperContact", e.target.value)
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Contact person name"
                  />
                </FormField>

                    <FormField label="Phone / Email" required>
                <input
                  type="text"
                  required
                  value={formData.shipperPhone}
                  onChange={(e) =>
                    handleInputChange("shipperPhone", e.target.value)
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="+1-234-567-8900 or email@example.com"
                />
              </FormField>

              <FormField label="Shipper Address" required>
                <textarea
                  required
                  value={formData.shipperAddress}
                  onChange={(e) =>
                    handleInputChange("shipperAddress", e.target.value)
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-vertical min-h-[60px]"
                  placeholder="Complete pickup address"
                />
              </FormField>
              </div>

          

              <div className="grid grid-cols-4 md:grid-cols-4 gap-3">
                <FormField label="Consignee Name" required>
                  <input
                    type="text"
                    required
                    value={formData.consigneeName}
                    onChange={(e) =>
                      handleInputChange("consigneeName", e.target.value)
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter consignee name"
                  />
                </FormField>

                <FormField label="Consignee Contact" required>
                  <input
                    type="text"
                    required
                    value={formData.consigneeContact}
                    onChange={(e) =>
                      handleInputChange("consigneeContact", e.target.value)
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Contact person name"
                  />
                </FormField>

                    <FormField label="Consignee Phone / Email" required>
                <input
                  type="text"
                  required
                  value={formData.consigneePhone}
                  onChange={(e) =>
                    handleInputChange("consigneePhone", e.target.value)
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="+1-234-567-8900 or email@example.com"
                />
              </FormField>

              <FormField label="Delivery Address" required>
                <textarea
                  required
                  value={formData.consigneeAddress}
                  onChange={(e) =>
                    handleInputChange("consigneeAddress", e.target.value)
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-vertical min-h-[60px]"
                  placeholder="Complete delivery address"
                />
              </FormField>
              </div>

          

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={nextTab}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-1"
                >
                  Next <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

          {/* Tab 2: Cargo Details */}
          {currentTab === 1 && (
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FormField label="Cargo Type" required>
                  <select
                    required
                    value={formData.cargoType}
                    onChange={(e) =>
                      handleInputChange("cargoType", e.target.value)
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select type...</option>
                    <option value="General">General</option>
                    <option value="Perishables">Perishables</option>
                    <option value="Fragile">Fragile</option>
                    <option value="Liquid">Liquid</option>
                    <option value="Hazardous">Hazardous</option>
                  </select>
                </FormField>

                <FormField label="Packaging Type" required>
                  <select
                    required
                    value={formData.packagingType}
                    onChange={(e) =>
                      handleInputChange("packagingType", e.target.value)
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select packaging...</option>
                    <option value="Carton">Carton</option>
                    <option value="Pallet">Pallet</option>
                    <option value="Crate">Crate</option>
                    <option value="Custom">Custom</option>
                  </select>
                </FormField>
              </div>

              <FormField label="Cargo Description" required>
                <input
                  type="text"
                  required
                  value={formData.cargoDescription}
                  onChange={(e) =>
                    handleInputChange("cargoDescription", e.target.value)
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe the cargo"
                />
              </FormField>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FormField label="Quantity (units)" required>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.quantity}
                    onChange={(e) =>
                      handleInputChange("quantity", e.target.value)
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 50"
                  />
                </FormField>

                <FormField label="Weight (KG)" required>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.1"
                    value={formData.weight}
                    onChange={(e) =>
                      handleInputChange("weight", e.target.value)
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 1500"
                  />
                </FormField>
              </div>

              <FormField label="Dimensions (cm)">
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    placeholder="Length"
                    value={formData.length}
                    onChange={(e) =>
                      handleInputChange("length", e.target.value)
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    placeholder="Width"
                    value={formData.width}
                    onChange={(e) => handleInputChange("width", e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    placeholder="Height"
                    value={formData.height}
                    onChange={(e) =>
                      handleInputChange("height", e.target.value)
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Volume: {volume.toFixed(3)} m³
                </p>
              </FormField>

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={previousTab}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md text-sm font-medium hover:bg-gray-700 transition-colors flex items-center gap-1"
                >
                  <ChevronLeft className="w-3 h-3" />
                  Previous
                </button>
                <button
                  type="button"
                  onClick={nextTab}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-1"
                >
                  Next <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

          {/* Tab 3: Location & Timing */}
          {currentTab === 2 && (
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FormField label="Pickup Date" required>
                  <input
                    type="date"
                    required
                    value={formData.pickupDate}
                    onChange={(e) =>
                      handleInputChange("pickupDate", e.target.value)
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </FormField>

                <FormField label="Pickup Time Window" required>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="time"
                      required
                      value={formData.pickupTimeStart}
                      onChange={(e) =>
                        handleInputChange("pickupTimeStart", e.target.value)
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <input
                      type="time"
                      required
                      value={formData.pickupTimeEnd}
                      onChange={(e) =>
                        handleInputChange("pickupTimeEnd", e.target.value)
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </FormField>
              </div>

              <FormField label="Pickup Location" required>
                <input
                  type="text"
                  required
                  value={formData.pickupLocation}
                  onChange={(e) =>
                    handleInputChange("pickupLocation", e.target.value)
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter pickup location"
                />
              </FormField>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FormField label="Delivery Date" required>
                  <input
                    type="date"
                    required
                    value={formData.deliveryDate}
                    onChange={(e) =>
                      handleInputChange("deliveryDate", e.target.value)
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </FormField>

                <FormField label="Delivery Time Window" required>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="time"
                      required
                      value={formData.deliveryTimeStart}
                      onChange={(e) =>
                        handleInputChange("deliveryTimeStart", e.target.value)
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <input
                      type="time"
                      required
                      value={formData.deliveryTimeEnd}
                      onChange={(e) =>
                        handleInputChange("deliveryTimeEnd", e.target.value)
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </FormField>
              </div>

              <FormField label="Delivery Location" required>
                <input
                  type="text"
                  required
                  value={formData.deliveryLocation}
                  onChange={(e) =>
                    handleInputChange("deliveryLocation", e.target.value)
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter delivery location"
                />
              </FormField>

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={previousTab}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md text-sm font-medium hover:bg-gray-700 transition-colors flex items-center gap-1"
                >
                  <ChevronLeft className="w-3 h-3" />
                  Previous
                </button>
                <button
                  type="button"
                  onClick={nextTab}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-1"
                >
                  Next <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

          {/* Tab 4: Transportation */}
          {currentTab === 3 && (
            <div className="p-4 space-y-4">
              <FormField label="Transport Mode" required>
                <div className="flex gap-4 flex-wrap">
                  {["Road", "Air", "Sea", "Rail"].map((mode) => (
                    <label
                      key={mode}
                      className="flex items-center gap-2 cursor-pointer text-sm"
                    >
                      <input
                        type="radio"
                        name="transportMode"
                        value={mode}
                        required
                        checked={formData.transportMode === mode}
                        onChange={(e) =>
                          handleInputChange("transportMode", e.target.value)
                        }
                        className="w-4 h-4 cursor-pointer"
                      />
                      <span>
                        {mode === "Road" && "🚛 "}
                        {mode === "Air" && "✈️ "}
                        {mode === "Sea" && "🚢 "}
                        {mode === "Rail" && "🚂 "}
                        {mode}
                      </span>
                    </label>
                  ))}
                </div>
              </FormField>

              <FormField label="Service Level" required>
                <div className="flex gap-4 flex-wrap">
                  {["Express", "Standard", "Economy"].map((level) => (
                    <label
                      key={level}
                      className="flex items-center gap-2 cursor-pointer text-sm"
                    >
                      <input
                        type="radio"
                        name="serviceLevel"
                        value={level}
                        required
                        checked={formData.serviceLevel === level}
                        onChange={(e) =>
                          handleInputChange("serviceLevel", e.target.value)
                        }
                        className="w-4 h-4 cursor-pointer"
                      />
                      <span>{level}</span>
                    </label>
                  ))}
                </div>
              </FormField>

              {formData.transportMode === "Road" && (
                <FormField label="Vehicle Type">
                  <select
                    value={formData.vehicleType}
                    onChange={(e) =>
                      handleInputChange("vehicleType", e.target.value)
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select vehicle...</option>
                    <option value="Van">Van</option>
                    <option value="Truck">Truck</option>
                    <option value="Trailer">Trailer</option>
                    <option value="Refrigerated">Refrigerated</option>
                    <option value="Flatbed">Flatbed</option>
                  </select>
                </FormField>
              )}

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={previousTab}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md text-sm font-medium hover:bg-gray-700 transition-colors flex items-center gap-1"
                >
                  <ChevronLeft className="w-3 h-3" />
                  Previous
                </button>
                <button
                  type="button"
                  onClick={nextTab}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-1"
                >
                  Next <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

          {/* Tab 5: Payment */}
          {currentTab === 4 && (
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FormField label="Freight Charges ($)" required>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.freightCharges}
                    onChange={(e) =>
                      handleInputChange("freightCharges", e.target.value)
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.00"
                  />
                </FormField>

                <FormField label="Payment Method" required>
                  <select
                    required
                    value={formData.paymentMethod}
                    onChange={(e) =>
                      handleInputChange("paymentMethod", e.target.value)
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select method...</option>
                    <option value="Prepaid">Prepaid</option>
                    <option value="Collect">Collect</option>
                    <option value="Monthly Invoice">Monthly Invoice</option>
                  </select>
                </FormField>
              </div>

              <FormField label="Additional Charges">
                <div className="space-y-2">
                  {additionalCharges.map((charge) => (
                    <div key={charge.id} className="flex gap-2 items-center">
                      <input
                        type="text"
                        placeholder="Charge name"
                        value={charge.name}
                        onChange={(e) =>
                          updateAdditionalCharge(
                            charge.id,
                            "name",
                            e.target.value
                          )
                        }
                        className="flex-1 px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <input
                        type="number"
                        placeholder="Amount"
                        min="0"
                        step="0.01"
                        value={charge.amount}
                        onChange={(e) =>
                          updateAdditionalCharge(
                            charge.id,
                            "amount",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="w-24 px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => removeAdditionalCharge(charge.id)}
                        className="p-2 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 rounded hover:bg-red-200 dark:hover:bg-red-800/60 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addAdditionalCharge}
                    className="px-3 py-2 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    Add Charge
                  </button>
                </div>
              </FormField>

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={previousTab}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md text-sm font-medium hover:bg-gray-700 transition-colors flex items-center gap-1"
                >
                  <ChevronLeft className="w-3 h-3" />
                  Previous
                </button>
                <button
                  type="button"
                  onClick={nextTab}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-1"
                >
                  Next <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

          {/* Tab 6: Notes & Attachments */}
          {currentTab === 5 && (
            <div className="p-4 space-y-4">
              <FormField label="Special Instructions">
                <textarea
                  value={formData.specialInstructions}
                  onChange={(e) =>
                    handleInputChange("specialInstructions", e.target.value)
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-vertical min-h-[80px]"
                  placeholder="Special handling instructions, delivery notes, etc."
                />
              </FormField>

              <FormField label="Attachments">
                <div
                  className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md p-4 text-center cursor-pointer transition-colors hover:border-blue-500 hover:bg-gray-50 dark:hover:bg-gray-700"
                  onClick={() => document.getElementById("fileInput").click()}
                >
                  <Paperclip className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Click to upload files
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    Invoice, Packing List, Images
                  </p>
                </div>
                <input
                  type="file"
                  id="fileInput"
                  multiple
                  className="hidden"
                  onChange={handleFileSelect}
                />
                <div className="mt-2 space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded"
                    >
                      <span className="text-xs text-gray-600 dark:text-gray-300 truncate flex-1">
                        {file.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="p-1 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 rounded hover:bg-red-200 dark:hover:bg-red-800/60 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </FormField>

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={previousTab}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md text-sm font-medium hover:bg-gray-700 transition-colors flex items-center gap-1"
                >
                  <ChevronLeft className="w-3 h-3" />
                  Previous
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {loading
                    ? "Saving..."
                    : editingOrder
                    ? "Update Order"
                    : "Create Order"}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    );
  }

  // List View
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
      {/* List Header with Search and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 gap-3">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-500" />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Orders
          </h3>
          <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-2 py-1 rounded-full">
            {filteredOrders.length}
          </span>
        </div>

        <div className="flex flex-1 max-w-md gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2 py-1.5 text-xs border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="In Transit">In Transit</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>
      </div>

      {/* Compact Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-3 py-2 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-3 py-2 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-3 py-2 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Shipper
              </th>
              <th className="px-3 py-2 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Cargo
              </th>
              <th className="px-3 py-2 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-3 py-2 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-3 py-2 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Total Cost
              </th>
              <th className="px-3 py-2 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Transport
              </th>
              <th className="px-3 py-2 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredOrders.length === 0 ? (
              <tr>
                <td
                  colSpan="9"
                  className="px-3 py-4 text-center text-gray-500 dark:text-gray-400"
                >
                  {orders.length === 0
                    ? "No orders found"
                    : "No matching orders found"}
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-3 py-2 font-medium text-gray-900 dark:text-white">
                    {order.order_id}
                  </td>
                  <td className="px-3 py-2 text-gray-900 dark:text-white">
                    {order.customer_name}
                  </td>
                  <td className="px-3 py-2 text-gray-500 dark:text-gray-400">
                    {order.shipper_name}
                  </td>
                  <td className="px-3 py-2 text-gray-500 dark:text-gray-400 max-w-[120px] truncate">
                    {order.cargo_description}
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${getStatusClass(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${getPriorityClass(
                        order.priority
                      )}`}
                    >
                      {order.priority}
                    </span>
                  </td>
                  <td className="px-3 py-2 font-medium text-gray-900 dark:text-white">
                    ${order.total_cost?.toFixed(2) || "0.00"}
                  </td>
                  <td className="px-3 py-2 text-gray-500 dark:text-gray-400">
                    {order.transport_mode} - {order.service_level}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleEdit(order)}
                        className="p-1 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded hover:bg-blue-200 dark:hover:bg-blue-800/60 transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => onDeleteOrder(order.id)}
                        className="p-1 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 rounded hover:bg-red-200 dark:hover:bg-red-800/60 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderForm;
