import { useState, useEffect } from 'react';
import { Plus, List } from 'lucide-react';
import StatsDashboard from './StatsDashboard';
import EnquiryForm from './EnquiryForm';
import QuickActions from './QuickActions';
import { useNavigate } from 'react-router-dom';

const CustomerEnquirySystem = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [viewMode, setViewMode] = useState('form');
  const [loading, setLoading] = useState(false);

  

  // Sample data for demonstration
  useEffect(() => {
    const sampleData = [
      {
        id: 1,
        enquiry_id: 'ENQ-001',
        customer_name: 'John Smith',
        email_phone: 'john@example.com',
        enquiry_type: 'Product Details',
        subject: 'Inquiry about Model X specifications',
        status: 'Open',
        priority: 'High',
        date_created: new Date().toISOString(),
        assigned_agent: 'Sarah Johnson',
        sla_hours: 24,
        contact_numbers: '+1-234-567-8900',
        address: '123 Main Street, Kuala Lumpur',
        description: 'Customer needs detailed specifications for Model X',
        source: 'Phone',
        sentiment: 'Positive',
        attachments_count: 2
      },
      {
        id: 2,
        enquiry_id: 'ENQ-002',
        customer_name: 'Sarah Chen',
        email_phone: 'sarah@precision.com',
        enquiry_type: 'Pricing Inquiry',
        subject: 'Quote for aluminum rods',
        status: 'In Progress',
        priority: 'Medium',
        date_created: new Date().toISOString(),
        assigned_agent: 'Mike Davis',
        sla_hours: 48,
        contact_numbers: '+1-234-567-8901',
        address: '456 Tech Park, Selangor',
        description: 'Requesting bulk pricing for aluminum rods',
        source: 'Email',
        sentiment: 'Neutral',
        attachments_count: 1
      },
      {
        id: 3,
        enquiry_id: 'ENQ-003',
        customer_name: 'Robert Tan',
        email_phone: 'robert@metalworks.com',
        enquiry_type: 'Technical Support',
        subject: 'Installation assistance required',
        status: 'Closed',
        priority: 'Low',
        date_created: new Date().toISOString(),
        assigned_agent: 'Emily Wilson',
        sla_hours: 72,
        contact_numbers: '+1-234-567-8902',
        address: '789 Industrial Area, Penang',
        description: 'Need technical support for equipment installation',
        source: 'Website',
        sentiment: 'Positive',
        attachments_count: 3
      }
    ];
    setEnquiries(sampleData);
  }, []);

  // Add new enquiry
  const addEnquiry = (newEnquiry) => {
    const enquiryWithId = {
      ...newEnquiry,
      id: Date.now(),
      enquiry_id: `ENQ-${Date.now()}`,
      date_created: new Date().toISOString()
    };
    setEnquiries(prev => [...prev, enquiryWithId]);
  };

  // Update enquiry
  const updateEnquiry = (id, updatedData) => {
    setEnquiries(prev => 
      prev.map(enquiry => 
        enquiry.id === id ? { ...enquiry, ...updatedData } : enquiry
      )
    );
  };

  // Delete enquiry
  const deleteEnquiry = (id) => {
    setEnquiries(prev => prev.filter(enquiry => enquiry.id !== id));
  };

  // View mode toggles
  const showForm = () => setViewMode('form');
  const showList = () => setViewMode('list');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto p-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Customer Enquiry Management
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Manage and track all customer enquiries in one place
          </p>
        </div>

        {/* Stats Dashboard */}
        <StatsDashboard enquiries={enquiries} />

        {/* View Mode Toggle */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Enquiry Management</h2>
          <div className="flex gap-2">
            <button
              onClick={showForm}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'form' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <Plus className="w-4 h-4 inline mr-2" />
              New Enquiry
            </button>
            <button
              onClick={showList}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'list' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <List className="w-4 h-4 inline mr-2" />
              View All
            </button>
          </div>
        </div>

        {/* Enquiry Form and List View */}
        <EnquiryForm
          viewMode={viewMode}
          enquiries={enquiries}
          onAddEnquiry={addEnquiry}
          onUpdateEnquiry={updateEnquiry}
          onDeleteEnquiry={deleteEnquiry}
          loading={loading}
          setLoading={setLoading}
        />

        {/* Quick Actions Section */}
        <QuickActions />
      </div>
    </div>
  );
};

export default CustomerEnquirySystem;