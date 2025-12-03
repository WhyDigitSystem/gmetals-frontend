import { useState, useEffect } from "react";
import ReusableComponent from "../../../utils/ReusableComponent.jsx";
import apiClient from "../../../api/apiClient.js";
import { toast } from 'react-hot-toast'

const Party = () => {

  const [partyData, setPartyData] = useState([]);
  const orgId = Number(localStorage.getItem("orgId"));
  const userName = (localStorage.getItem("userName"));
  const branch = localStorage.getItem("branch");
  const branchCode = localStorage.getItem("branchCode");
//   const [currentItem, setCurrentItem] = useState(null); 
const [currentItem, setCurrentItem] = useState({
  partyCode:'',
  partyName:'',
  partyType:'',
  contactPerson:'',
  phone:'',
  email:'',
  address:'',
  creditLimit: 0,
  status: 'Active',  

});
  
const getAllParty = async () => {
  try {
    const res = await apiClient.get(
      `/api/party/GetAllParty?branchCode=${branchCode}&count=10&orgId=${orgId}&page=1`
    );
    const party = res.paramObjectsMap.partyList.data || [];
    setPartyData(party.reverse()); 
    console.log("Ports Data from API:", party); 
    return party;
  } catch (err) {
    console.error("Ports API Error:", err);
    setPartyData([]);
    return [];
  }
};



const createParty = async (formData) => {
  try {
    const form = {
      ...formData,
      orgId: orgId,
      createdBy: userName,
      branch: branch,
      branchCode: branchCode
    };

    await apiClient.put(`/api/party/CreateUpdateParty`, form);
    await getAllParty();
    toast.success("created successfully");
 
  } catch(err) {
    console.error("Create API Error:", err);
    toast.error("Error creating Party");
  }
};



const editParty = async (id) => {
  try {
    const res = await apiClient.get(`/api/party/getPartyById?id=${id}`);
    const data = res.paramObjectsMap.partyVO;
    setCurrentItem({
      id: data.id,
      partyCode: data.partyCode,
      partyName: data.partyName,
      partyType:data.partyType,
      contactPerson: data.contactPerson, 
      phone:data.phone,
      email:data.email,
      address:data.address,
      creditLimit:data.address,
      status: data.status,
    });
  } catch(err) {
    console.error("Error fetching port by ID", err);
  }
};

const updateParty = async (id, formData) => {
  try {
    const updateForm = {
      ...formData,
      id: id,
      orgId: orgId,
      createdBy: userName,
    };

    await apiClient.put(`/api/party/CreateUpdateParty`, updateForm);
    await getAllParty();
    toast.success("Update successfully");

  } catch (err) {
    console.error("Update API Error:", err);
    toast.error("Error updating Party");
  }
};


  useEffect(() => {
    getAllParty();
  }, []);

  const exporterFields = [
    { name: "partyCode", label: "Party Code", required: true, placeholder: "Enter Party Code", colSpan: 2 },
    { name: "partyName", label: "Party Name", required: true, placeholder: "Enter Party Name", colSpan: 2 },
    { name: "partyType", label: "Party Type", type: "select", colSpan: 2,options:[
         { value:'Customer', label:'Customer' }, 
         { value:'Supplier', label:'Supplier'},
         {value:'Distributor', label:'Distributor'},
         {value:'Dealer', label:'Dealer'},
         {value:'Retailer', label:'Retailer'},
         {value:'Wholesaler', label:'Wholesaler'},
         {value:'Manufacturer', label:'Manufacturer'},
         {value:'Transporter', label:'Transporter'},
         {value:'Agent', label:'Agent'},
    ] },
   
    { name: "contactPerson", label: "Contact Person", required: true, placeholder: "Enter Contact Person", colSpan: 2 },
    { name: "phone", label: "Phone No", required: true, placeholder: "Enter Phone No", colSpan: 2 },
    { name: "email", label: "Email", required: true, placeholder: "Enter Email", colSpan: 2 },
    { name: "address", label: "Address", required: true, placeholder: "Enter Address", colSpan: 2 },
    { name: "creditLimit", label: "Credit Limit", required: true,type:'number', placeholder: "Enter Credit Limit", colSpan: 2 },
    { name: "status", label: "Status", type: "select", colSpan: 2, options: [
      { value:'Active', label:'Active' }, 
      { value:'Inactive', label:'Inactive'}
    ]}
  ];

  const handleExport = () => console.log("Export clicked");
  const handleImport = () => console.log("Import clicked");

  return (
    <ReusableComponent
      title="Party"
      initialData={partyData} 
      fields={exporterFields}
      searchableFields={["partyCode","partyName","partyType","contactPerson","phone","email","address","creditLimit","status"]}
      getAll={getAllParty} 
      create={createParty}
      update={updateParty}
      onRowEdit={editParty}
      editData={currentItem}
      onImport={handleImport}
      onExport={handleExport}
    />
  );
};

export default Party;

