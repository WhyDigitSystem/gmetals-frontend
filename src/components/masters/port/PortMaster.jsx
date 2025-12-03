import { useState, useEffect } from "react";
import ReusableComponent from "../../../utils/ReusableComponent.jsx";
import apiClient from "../../../api/apiClient.js";
import { toast } from 'react-hot-toast'

const PortMaster = () => {
  const [countryList, setCountryList] = useState([]);
  const [portsData, setPortsData] = useState([]);
  const orgId = Number(localStorage.getItem("orgId"));
  const userName = (localStorage.getItem("userName"));
 const [currentItem, setCurrentItem] = useState({
  portName:'',
  portCode:'',
  countryName:'',
  status:'Active'
 }); 
  
 
  const getAllCountry = async () => {
    try {
      const res = await apiClient.get(`/api/commonmaster/country?orgid=${orgId}`);
      setCountryList(res.paramObjectsMap.countryVO || []);
    } catch (err) {
      console.error("Country API Error:", err);
    }
  };




const getAllPorts = async () => {
  try {
    const res = await apiClient.get(
      `/api/master/getAllPortByOrgId?orgId=${orgId}&page=1&size=10`
    );
    const ports = res.paramObjectsMap.portVO.data || [];

    const formattedPorts = ports.map(p => ({
      ...p,
      countryName: p.country.countryName,
    }));

    setPortsData(formattedPorts.reverse()); 
    console.log("Ports Data from API:", formattedPorts); 
    return formattedPorts;
  } catch (err) {
    console.error("Ports API Error:", err);
    setPortsData([]);
    return [];
  }
};



const createPort = async (formData) => {
  try {
    const form = {
      ...formData,
      orgId: orgId,
      createdBy: userName,
    };

    await apiClient.put(`/api/master/updateCreatePort`, form);
    await getAllPorts();
    toast.success("created successfully");
 
  } catch(err) {
    console.error("Create API Error:", err);
    toast.error("Error creating port");
  }
};



const editPort = async (id) => {
  try {
    const res = await apiClient.get(`/api/master/getPortById?id=${id}`);
    const data = res.paramObjectsMap.portVO;
    setCurrentItem({
      id: data.id,
      portName: data.portName,
      portCode: data.portCode,
      // countryId: data.country.id,
      countryName: data.country.countryName, 
      status: data.status,
    });
  } catch(err) {
    console.error("Error fetching port by ID", err);
  }
};

const updatePort = async (id, formData) => {
  try {
    const updateForm = {
      ...formData,
      id: id,
      orgId: orgId,
      createdBy: userName
    };

    await apiClient.put(`/api/master/updateCreatePort`, updateForm);
    await getAllPorts();
    toast.success("Update successfully");

  } catch (err) {
    console.error("Update API Error:", err);
    toast.error("Error updating port");
  }
};


  useEffect(() => {
    getAllCountry();
    getAllPorts();
  }, []);

  const exporterFields = [
    { name: "portName", label: "Port Name", required: true, placeholder: "Enter Port Name", colSpan: 2 },
    { name: "portCode", label: "Port Code", required: true, placeholder: "Enter Port Code", colSpan: 2 },
    { 
      name: "countryName", label: "Country", type: "select", colSpan: 2,
      options: countryList.map(c => ({ value: c.countryName, label: c.countryName }))
    },
    { name: "status", label: "Status", type: "select", colSpan: 2, options: [
      { value:'Active', label:'Active' }, 
      { value:'Inactive', label:'Inactive' }
    ]}
  ];

  const handleExport = () => console.log("Export clicked");
  const handleImport = () => console.log("Import clicked");

  return (
    <ReusableComponent
      title="Port"
      initialData={portsData} 
      fields={exporterFields}
      searchableFields={["portName","portCode","countryName","status"]}
      getAll={getAllPorts} 
      create={createPort}
      update={updatePort}
      onRowEdit={editPort}
      editData={currentItem}
      onImport={handleImport}
      onExport={handleExport}
    />
  );
};

export default PortMaster;

