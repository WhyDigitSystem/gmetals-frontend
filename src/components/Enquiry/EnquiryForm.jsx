import { useState } from 'react';
import {
  User,
  FileText,
  MessageSquare,
  ChevronRight,
  ChevronLeft,
  Edit,
  Trash2,
  Clock,
  Search,
  Filter,
  Download,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EnquiryForm = ({ 
  viewMode, 
  enquiries, 
  onAddEnquiry, 
  onUpdateEnquiry, 
  onDeleteEnquiry, 
  loading, 
  setLoading 
}) => {
  const [currentTab, setCurrentTab] = useState(0);
  const [editingEnquiry, setEditingEnquiry] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

   const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    customer_name: '',
    contact_numbers: '',
    email_phone: '',
    address: '',
    enquiry_type: '',
    source: 'Phone',
    subject: '',
    description: '',
    priority: 'Medium',
    status: 'Open',
    assigned_agent: '',
    sla_hours: 24,
    sentiment: 'Neutral',
    attachments_count: 0,
    interaction_log: '',
    internal_notes: ''
  });

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Tab navigation
  const switchTab = (tabIndex) => {
    setCurrentTab(tabIndex);
  };

  const nextTab = () => {
    if (currentTab < 2) setCurrentTab(currentTab + 1);
  };

  const previousTab = () => {
    if (currentTab > 0) setCurrentTab(currentTab - 1);
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingEnquiry) {
        onUpdateEnquiry(editingEnquiry.id, formData);
      } else {
        onAddEnquiry(formData);
      }
      
      // Reset form
      setFormData({
        customer_name: '',
        contact_numbers: '',
        email_phone: '',
        address: '',
        enquiry_type: '',
        source: 'Phone',
        subject: '',
        description: '',
        priority: 'Medium',
        status: 'Open',
        assigned_agent: '',
        sla_hours: 24,
        sentiment: 'Neutral',
        attachments_count: 0,
        interaction_log: '',
        internal_notes: ''
      });
      
      setCurrentTab(0);
      setEditingEnquiry(null);
    } catch (error) {
      console.error('Failed to save enquiry:', error);
    } finally {
      setLoading(false);
    }
  };

  // Edit enquiry
  const handleEdit = (enquiry) => {
    setEditingEnquiry(enquiry);
    setFormData({
      customer_name: enquiry.customer_name || '',
      contact_numbers: enquiry.contact_numbers || '',
      email_phone: enquiry.email_phone || '',
      address: enquiry.address || '',
      enquiry_type: enquiry.enquiry_type || '',
      source: enquiry.source || 'Phone',
      subject: enquiry.subject || '',
      description: enquiry.description || '',
      priority: enquiry.priority || 'Medium',
      status: enquiry.status || 'Open',
      assigned_agent: enquiry.assigned_agent || '',
      sla_hours: enquiry.sla_hours || 24,
      sentiment: enquiry.sentiment || 'Neutral',
      attachments_count: enquiry.attachments_count || 0,
      interaction_log: enquiry.interaction_log || '',
      internal_notes: enquiry.internal_notes || ''
    });
  };

  // Cancel edit
  const cancelEdit = () => {
    setEditingEnquiry(null);
    setFormData({
      customer_name: '',
      contact_numbers: '',
      email_phone: '',
      address: '',
      enquiry_type: '',
      source: 'Phone',
      subject: '',
      description: '',
      priority: 'Medium',
      status: 'Open',
      assigned_agent: '',
      sla_hours: 24,
      sentiment: 'Neutral',
      attachments_count: 0,
      interaction_log: '',
      internal_notes: ''
    });
    setCurrentTab(0);
  };


  // Add this function to handle order conversion
const handleConvertToOrder = (enquiry) => {
  // You can implement different navigation strategies:
  
  // Option 1: Navigate to order booking page with enquiry data
  // navigate('/order-booking', { state: { enquiry } });
  
  // Option 2: Open a modal for order creation
  // setSelectedEnquiry(enquiry);
  // setShowOrderModal(true);
  
  // Option 3: Direct conversion with confirmation
  if (window.confirm(`Convert enquiry ${enquiry.enquiry_id} to order?`)) {
    // Update enquiry status to "Converted"
    onUpdateEnquiry(enquiry.id, { 
      ...enquiry, 
      status: 'Converted',
      converted_date: new Date().toISOString()
    });
    
    // Navigate to order booking or show success message
    navigate('/order-booking', { state: { enquiry } });
    
    console.log('Converting to order:', enquiry);
    // Add your order creation logic here
  }
};

  // Status badge classes
  const getStatusClass = (status) => {
    switch (status) {
      case 'Open': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'Closed': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'Low': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // Filter enquiries
  const filteredEnquiries = enquiries.filter(enquiry => {
    const matchesSearch = 
      enquiry.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.enquiry_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.email_phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.subject?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || enquiry.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || enquiry.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Compact form field component
  const FormField = ({ label, children, required = false, className = '' }) => (
    <div className={className}>
      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );

  // Form Section
  if (viewMode === 'form') {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
        {/* Compact Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${
              editingEnquiry ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
            }`}>
              {editingEnquiry ? <Edit className="w-4 h-4" /> : <User className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                {editingEnquiry ? 'Edit Enquiry' : 'New Enquiry'}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {editingEnquiry ? `Editing ${editingEnquiry.enquiry_id}` : 'Create a new customer enquiry'}
              </p>
            </div>
          </div>
          {editingEnquiry && (
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
            {['Customer', 'Enquiry', 'Log'].map((tab, index) => (
              <button
                key={tab}
                type="button"
                onClick={() => switchTab(index)}
                className={`px-3 py-2 rounded-t-md text-xs font-medium transition-colors whitespace-nowrap border-b-2 ${
                  currentTab === index
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-800'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {index === 0 && <User className="w-3 h-3 inline mr-1" />}
                {index === 1 && <FileText className="w-3 h-3 inline mr-1" />}
                {index === 2 && <MessageSquare className="w-3 h-3 inline mr-1" />}
                {tab}
              </button>
            ))}
          </div>

          {/* Tab 1: Customer Details - Compact */}
          {currentTab === 0 && (
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FormField label="Customer Name" required>
                  <input
                    type="text"
                    required
                    value={formData.customer_name}
                    onChange={(e) => handleInputChange('customer_name', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter customer name"
                  />
                </FormField>

                <FormField label="Contact Number" required>
                  <input
                    type="text"
                    required
                    value={formData.contact_numbers}
                    onChange={(e) => handleInputChange('contact_numbers', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="+1-234-567-8900"
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FormField label="Email/Phone" required>
                  <input
                    type="text"
                    required
                    value={formData.email_phone}
                    onChange={(e) => handleInputChange('email_phone', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="email@example.com"
                  />
                </FormField>

                <FormField label="Enquiry Type" required>
                  <select
                    required
                    value={formData.enquiry_type}
                    onChange={(e) => handleInputChange('enquiry_type', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select type...</option>
                    <option value="Product Details">Product Details</option>
                    <option value="Pricing Inquiry">Pricing Inquiry</option>
                    <option value="Technical Support">Technical Support</option>
                    <option value="Order Status">Order Status</option>
                    <option value="Complaint">Complaint</option>
                    <option value="General Query">General Query</option>
                  </select>
                </FormField>
              </div>

              <FormField label="Address">
                <textarea
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  rows="2"
                  placeholder="Customer address"
                />
              </FormField>

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

          {/* Tab 2: Enquiry Information - Compact */}
          {currentTab === 1 && (
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FormField label="Source" required>
                  <select
                    required
                    value={formData.source}
                    onChange={(e) => handleInputChange('source', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Phone">Phone</option>
                    <option value="Email">Email</option>
                    <option value="Website">Website</option>
                    <option value="Walk-in">Walk-in</option>
                  </select>
                </FormField>

                <FormField label="Priority" required>
                  <select
                    required
                    value={formData.priority}
                    onChange={(e) => handleInputChange('priority', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </FormField>
              </div>

              <FormField label="Subject" required>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Brief subject line"
                />
              </FormField>

              <FormField label="Description" required>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                  placeholder="Detailed description of the enquiry"
                />
              </FormField>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FormField label="Status" required>
                  <select
                    required
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Closed">Closed</option>
                  </select>
                </FormField>

                <FormField label="Assigned Agent" required>
                  <select
                    required
                    value={formData.assigned_agent}
                    onChange={(e) => handleInputChange('assigned_agent', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select agent...</option>
                    <option value="John Smith">John Smith</option>
                    <option value="Sarah Johnson">Sarah Johnson</option>
                    <option value="Mike Davis">Mike Davis</option>
                    <option value="Emily Wilson">Emily Wilson</option>
                  </select>
                </FormField>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FormField label="SLA Hours" required>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.sla_hours}
                    onChange={(e) => handleInputChange('sla_hours', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </FormField>

                <FormField label="Customer Sentiment">
                  <select
                    value={formData.sentiment}
                    onChange={(e) => handleInputChange('sentiment', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Positive">😊 Positive</option>
                    <option value="Neutral">😐 Neutral</option>
                    <option value="Negative">😟 Negative</option>
                  </select>
                </FormField>
              </div>

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

          {/* Tab 3: Interaction Log - Compact */}
          {currentTab === 2 && (
            <div className="p-4 space-y-4">
              <FormField label="Interaction Notes">
                <textarea
                  value={formData.interaction_log}
                  onChange={(e) => handleInputChange('interaction_log', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                  placeholder="Add interaction notes, call logs, email correspondence..."
                />
              </FormField>

              <FormField label="Internal Notes">
                <textarea
                  value={formData.internal_notes}
                  onChange={(e) => handleInputChange('internal_notes', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  rows="2"
                  placeholder="Admin-only remarks, escalation notes..."
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
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Saving...' : editingEnquiry ? 'Update Enquiry' : 'Create Enquiry'}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    );
  }

  // Compact List View
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
      {/* List Header with Search and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 gap-3">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-500" />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Enquiries</h3>
          <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-2 py-1 rounded-full">
            {filteredEnquiries.length}
          </span>
        </div>
        
        <div className="flex flex-1 max-w-md gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search enquiries..."
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
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Closed">Closed</option>
          </select>
          
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-2 py-1.5 text-xs border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

{/* Compact Table */}
<div className="overflow-x-auto">
  <table className="w-full text-xs">
    <thead className="bg-gray-50 dark:bg-gray-700">
      <tr>
        <th className="px-3 py-2 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          ID
        </th>
        <th className="px-3 py-2 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Customer
        </th>
        <th className="px-3 py-2 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Type
        </th>
        <th className="px-3 py-2 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Status
        </th>
        <th className="px-3 py-2 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Priority
        </th>
        <th className="px-3 py-2 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          SLA
        </th>
        <th className="px-3 py-2 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Actions
        </th>
        <th className="px-3 py-2 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Order
        </th>
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
      {filteredEnquiries.length === 0 ? (
        <tr>
          <td colSpan="8" className="px-3 py-4 text-center text-gray-500 dark:text-gray-400">
            {enquiries.length === 0 ? 'No enquiries found' : 'No matching enquiries found'}
          </td>
        </tr>
      ) : (
        filteredEnquiries.map((enquiry) => {
          const createdDate = new Date(enquiry.date_created);
          const now = new Date();
          const hoursElapsed = (now - createdDate) / (1000 * 60 * 60);
          const slaRemaining = enquiry.sla_hours - hoursElapsed;
          const slaWarning = slaRemaining < 2;
          const slaText = slaRemaining > 0 ? `${Math.floor(slaRemaining)}h` : 'Breached';

          return (
            <tr key={enquiry.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td className="px-3 py-2 font-medium text-gray-900 dark:text-white">
                {enquiry.enquiry_id}
              </td>
              <td className="px-3 py-2">
                <div className="text-gray-900 dark:text-white font-medium">
                  {enquiry.customer_name}
                </div>
                <div className="text-gray-500 dark:text-gray-400 truncate max-w-[120px]">
                  {enquiry.email_phone}
                </div>
              </td>
              <td className="px-3 py-2 text-gray-500 dark:text-gray-400">
                {enquiry.enquiry_type}
              </td>
              <td className="px-3 py-2">
                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${getStatusClass(enquiry.status)}`}>
                  {enquiry.status}
                </span>
              </td>
              <td className="px-3 py-2">
                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${getPriorityClass(enquiry.priority)}`}>
                  {enquiry.priority}
                </span>
              </td>
              <td className="px-3 py-2">
                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${
                  slaWarning ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                }`}>
                  <Clock className="w-2.5 h-2.5 mr-0.5" />
                  {slaText}
                </span>
              </td>
              <td className="px-3 py-2">
                <div className="flex space-x-1">
                  <button
                    onClick={() => handleEdit(enquiry)}
                    className="p-1 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded hover:bg-blue-200 dark:hover:bg-blue-800/60 transition-colors"
                    title="Edit"
                  >
                    <Edit className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => onDeleteEnquiry(enquiry.id)}
                    className="p-1 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 rounded hover:bg-red-200 dark:hover:bg-red-800/60 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </td>
              <td className="px-3 py-2">
                <button
                  onClick={() => handleConvertToOrder(enquiry)}
                  className="w-full px-2 py-1.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-xs font-medium rounded transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-1"
                  title="Convert to Order Booking"
                >
                  <FileText className="w-3 h-3" />
                  <span>Order</span>
                </button>
              </td>
            </tr>
          );
        })
      )}
    </tbody>
  </table>
</div>
    </div>
  );
};

export default EnquiryForm;