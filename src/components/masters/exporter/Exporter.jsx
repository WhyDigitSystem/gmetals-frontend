import { useState, useEffect } from "react";
import ReusableComponent from "../../../utils/ReusableComponent.jsx";
import apiClient from "../../../api/apiClient.js";
import { toast } from 'react-hot-toast'

const PortMaster = () => {

  const [exportData, setExportData] = useState([]);
  const orgId = Number(localStorage.getItem("orgId"));
  const branch = localStorage.getItem("branch");
  const branchCode = localStorage.getItem("branchCode");
  const userName = (localStorage.getItem("userName"));
 const [currentItem, setCurrentItem] = useState({
   companyName:'',
   shortName:'',
   contactPerson:'',
   phone:'',
   email:'',
   address:'',
   taxId:'',
   status:"Active"
 }); 
  
const getAllExport = async () => {
  try {
    const res = await apiClient.get(
      `/api/exporter/getAllExportersByOrgId?branchCode=${branchCode}&count=10&orgId=${orgId }&page=1`
    );
    const exports = res.paramObjectsMap.exportersVO.data || [];
    setExportData(exports.reverse()); 
    console.log("Ports Data from API:", exports); 
    return exports;
  } catch (err) {
    console.error("Ports API Error:", err);
    setExportData([]);
    return [];
  }
};



const createExport = async (formData) => {
  try {
    const form = {
      ...formData,
      orgId: orgId,
      createdBy: userName,
      branch: branch,
      branchCode: branchCode
    };

    await apiClient.put(`/api/exporter/createUpdateExporter`, form);
    await getAllExport();
    toast.success("created successfully");
 
  } catch(err) {
    console.error("Create API Error:", err);
    toast.error("Error creating port");
  }
};



const editExport = async (id) => {
  try {
    const res = await apiClient.get(`/api/exporter/getByIdExporter?id=${id}`);
    const data = res.paramObjectsMap.exporterVO;
    setCurrentItem({
      id: data.id,
      companyName: data.companyName,
      shortName: data.shortName,
      contactPerson:data.contactPerson,
      phone: data.phone, 
      email:data.email,
      address:data.address,
      taxId:data.taxId,
      status: data.status,
    });
  } catch(err) {
    console.error("Error fetching port by ID", err);
  }
};

const updateExport = async (id, formData) => {
  try {
    const updateForm = {
      ...formData,
      id: id,
      orgId: orgId,
      createdBy: userName,
      branch: branch,
      branchCode: branchCode
    };

    await apiClient.put(`/api/exporter/createUpdateExporter`, updateForm);
    await getAllExport();
    toast.success("Update successfully");

  } catch (err) {
    console.error("Update API Error:", err);
    toast.error("Error updating port");
  }
};


  useEffect(() => {
    getAllExport();
  }, []);

  const exporterFields = [
    { name: "companyName", label: "Company Name", required: true, placeholder: "Enter Company Name", colSpan: 2 },
    { name: "shortName", label: "Short Name", required: true, placeholder: "Enter Short Name", colSpan: 2 },
    { name: "contactPerson", label: "Contact Person", required: true, placeholder: "Enter Contact Person", colSpan: 2 },
    { name: "phone", label: "Phone Number", required: true, placeholder: "Enter Phone Number", colSpan: 2 },
    { name: "email", label: "Email", required: true, placeholder: "Enter Email", colSpan: 2 },
    { name: "address", label: "Address", required: true, placeholder: "Enter Address", colSpan: 2 },
    { name: "taxId", label: "Tax Id", required: true, placeholder: "Enter Tax Id", colSpan: 2 },
    { name: "status", label: "Status", type: "select", colSpan: 2,  options: [
      { value:'Active', label:'Active' }, 
      { value:'Inactive', label:'Inactive' }
    ]}
  ];

  const handleExport = () => console.log("Export clicked");
  const handleImport = () => console.log("Import clicked");

  return (
    <ReusableComponent
      title="Export"
      initialData={exportData} 
      fields={exporterFields}
      searchableFields={["companyName","shortName","contactPerson","phone","email","address","taxId","status"]}
      getAll={getAllExport} 
      create={createExport}
      update={updateExport}
      onRowEdit={editExport}
      editData={currentItem}
      onImport={handleImport}
      onExport={handleExport}
    />
  );
};

export default PortMaster;

