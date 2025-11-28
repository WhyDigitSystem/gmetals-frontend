import ReusableComponent from "../../../utils/ReusableComponent";

const ExportersMaster = () => {
  const initialExporters = [
    {
      id: 1,
      name: "GANAPATHY METAL SDN BHD",
      address:
        "NO: 37, PERSIARAN SEGAMBUT TENGAH, SEGAMBUT INDUSTRIAL PARK, 51200 KUALA LUMPUR, MALAYSIA.",
      contactPerson: "Mr. Rajesh Kumar",
      phone: "+60 3 6242 1899",
      email: "info@ganapathymetal.com",
      taxId: "T1234567890",
      status: "Active",
    },
    {
      id: 2,
      name: "MALAYSIA EXPORT ENTERPRISE",
      address: "LOT 123, JALAN INDUSTRI, 47500 SUBANG JAYA, SELANGOR",
      contactPerson: "Ms. Sarah Lim",
      phone: "+60 3 5634 7890",
      email: "sales@malaysiaexport.com",
      taxId: "T9876543210",
      status: "Active",
    },
  ];

  const exporterFields = [
    {
      name: "name",
      label: "Company Name",
      required: true,
      placeholder: "Enter company name",
      colSpan: 3,
    },
    {
      name: "contactPerson",
      label: "Contact Person",
      placeholder: "Enter contact person",
      colSpan: 2,
      subField: "phone",
    },
    {
      name: "taxId",
      label: "Tax ID",
      placeholder: "Enter tax ID",
      colSpan: 2,
      subField: "email",
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: [
        { value: "Active", label: "Active" },
        { value: "Inactive", label: "Inactive" },
      ],
      colSpan: 2,
    },
    {
      name: "address",
      label: "Address",
      placeholder: "Enter full address",
      fullWidth: true,
    },
    {
      name: "phone",
      label: "Phone",
      type: "tel",
      placeholder: "Enter phone number",
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "Enter email address",
    },
  ];

  const handleExport = () => {
    console.log("Export functionality");
    // Implement export logic here
  };

  const handleImport = () => {
    console.log("Import functionality");
    // Implement import logic here
  };

  return (
    <ReusableComponent
      title="Exporters"
      initialData={initialExporters}
      fields={exporterFields}
      searchableFields={["name", "contactPerson", "taxId", "email"]}
      onExport={handleExport}
      onImport={handleImport}
    />
  );
};

export default ExportersMaster;
