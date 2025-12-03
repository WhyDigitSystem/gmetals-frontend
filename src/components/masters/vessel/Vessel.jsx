import { useState, useEffect } from "react";
import ReusableComponent from "../../../utils/ReusableComponent.jsx";
import apiClient from "../../../api/apiClient.js";
import { toast } from 'react-hot-toast'

const Vessel = () => {

  const [vesselData, setVesselData] = useState([]);
  const orgId = Number(localStorage.getItem("orgId"));
  const userName = (localStorage.getItem("userName"));
//   const [currentItem, setCurrentItem] = useState(null); 
const [currentItem, setCurrentItem] = useState({
  vesselCode: '',
  vesselName: '',
  imoNumber: '',
  carrierName: '',
  type: '',
  status: 'Active',  

});
  
const getAllVessel = async () => {
  try {
    const res = await apiClient.get(
      `/api/master/getAllVesselByOrgId?orgId=${orgId}&page=1&size=10`
    );
    const vessel = res.paramObjectsMap.vesselVO.data || [];
    setVesselData(vessel.reverse()); 
    console.log("Ports Data from API:", vessel); 
    return vessel;
  } catch (err) {
    console.error("Ports API Error:", err);
    setVesselData([]);
    return [];
  }
};



const createVessel = async (formData) => {
  try {
    const form = {
      ...formData,
      orgId: orgId,
      createdBy: userName,
    };

    await apiClient.put(`/api/master/updateCreateVessel`, form);
    await getAllVessel();
    toast.success("created successfully");
 
  } catch(err) {
    console.error("Create API Error:", err);
    toast.error("Error creating Vessel");
  }
};



const editVessel = async (id) => {
  try {
    const res = await apiClient.get(`/api/master/getVesselById?id=${id}`);
    const data = res.paramObjectsMap.vesselVO;
    setCurrentItem({
      id: data.id,
      vesselCode: data.vesselCode,
      vesselName: data.vesselName,
      imoNumber:data.imoNumber,
      type: data.type, 
      carrierName:data.carrierName,
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
    };

    await apiClient.put(`/api/master/updateCreateVessel`, updateForm);
    await getAllVessel();
    toast.success("Update successfully");

  } catch (err) {
    console.error("Update API Error:", err);
    toast.error("Error updating port");
  }
};


  useEffect(() => {
    getAllVessel();
  }, []);

  const exporterFields = [
    { name: "vesselCode", label: "Vessel Code", required: true, placeholder: "Enter Vessel Code", colSpan: 2 },
    { name: "vesselName", label: "Vessel Name", required: true, placeholder: "Enter vessel Name", colSpan: 2 },
    { name: "imoNumber", label: "Imo Number", required: true, placeholder: "Enter Imo Number", colSpan: 2 },
    { name: "carrierName", label: "Carrier Name", required: true, placeholder: "Enter Carrier Name", colSpan: 2 },
    { name: "type", label: "Type", type: "select", colSpan: 2,options:[
         { value:'Cargo Vessel', label:'Cargo Vessel' }, 
         { value:'Continer Vessel', label:'Container Vessel'},
         {value:'Bulk Carrier', label:'Bulk Carrier'},
         {value:'Tanker', label:'Tanker'},
         {value:'Ro-Ro Vessel', label:'Ro-Ro Vessel'},
         {value:'Reefer Vessel', label:'Reefer Vessel'},
    ] },
    { name: "status", label: "Status", type: "select", colSpan: 2, options: [
      { value:'Active', label:'Active' }, 
      { value:'Inactive', label:'Inactive' }
    ]}
  ];

  const handleExport = () => console.log("Export clicked");
  const handleImport = () => console.log("Import clicked");

  return (
    <ReusableComponent
      title="Vessel"
      initialData={vesselData} 
      fields={exporterFields}
      searchableFields={["vesselCode","vesselName","imoNumber","carrierName","type","status"]}
      getAll={getAllVessel} 
      create={createVessel}
      update={updateExport}
      onRowEdit={editVessel}
      editData={currentItem}
      onImport={handleImport}
      onExport={handleExport}
    />
  );
};

export default Vessel;

