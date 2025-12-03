import { useState, useEffect } from "react";
import ReusableComponent from "../../../utils/ReusableComponent.jsx";
import apiClient from "../../../api/apiClient.js";
import { toast } from 'react-hot-toast'

const Commodity = () => {

  const [commodityData, setCommodityData] = useState([]);
  const orgId = Number(localStorage.getItem("orgId"));
  const userName = (localStorage.getItem("userName"));
//   const [currentItem, setCurrentItem] = useState(null); 
const [currentItem, setCurrentItem] = useState({
  productCode:'',
  productName:'',
  category:'',
  subCategory:'',
  uom:'',
  price: 0,
  status: 'Active',  

});
  
const getAllCommodity = async () => {
  try {
    const res = await apiClient.get(
      `/api/master/getAllProductByOrgId?orgId=1000000001&page=1&size=10`
    );
    const commodity = res.paramObjectsMap.productVO.data || [];
    setCommodityData(commodity.reverse()); 
    console.log("Ports Data from API:", commodity); 
    return commodity;
  } catch (err) {
    console.error("Ports API Error:", err);
    setCommodityData([]);
    return [];
  }
};



const createCommodity = async (formData) => {
  try {
    const form = {
      ...formData,
      orgId: orgId,
      createdBy: userName,
    };

    await apiClient.put(`/api/master/updateCreateProduct`, form);
    await getAllCommodity();
    toast.success("created successfully");
 
  } catch(err) {
    console.error("Create API Error:", err);
    toast.error("Error creating Commodity");
  }
};



const editCommodity = async (id) => {
  try {
    const res = await apiClient.get(`/api/master/getProductById?id=${id}`);
    const data = res.paramObjectsMap.productVO;
    setCurrentItem({
      id: data.id,
      productCode: data.productCode,
      productName: data.productName,
      category:data.category,
      subCategory: data.subCategory, 
      uom:data.uom,
      price:data.price,
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

    await apiClient.put(`/api/master/updateCreateProduct`, updateForm);
    await getAllCommodity();
    toast.success("Update successfully");

  } catch (err) {
    console.error("Update API Error:", err);
    toast.error("Error updating Commodity");
  }
};


  useEffect(() => {
    getAllCommodity();
  }, []);

  const exporterFields = [
    { name: "productCode", label: "Product Code", required: true, placeholder: "Enter Product Code", colSpan: 2 },
    { name: "productName", label: "Product Name", required: true, placeholder: "Enter Product Name", colSpan: 2 },
    { name: "category", label: "Category", type: "select", colSpan: 2,options:[
         { value:'Raw Material', label:'Raw Material' }, 
         { value:'Finished Goods', label:'Finished Goods'},
         {value:'Semi-Finished Goods', label:'Semi-Finished Goods'},
         {value:'Consumables', label:'Consumables'},
         {value:'Services', label:'Services'},
         {value:'Packaging Material', label:'Packaging Material'},
         {value:'Spare Parts', label:'Spare Parts'},

    ] },
     { name: "subCategory", label: "Sub-Category", type: "select", colSpan: 2,options:[
         { value:'Metals', label:'Metals' }, 
         { value:'Chemicals', label:'Chemicals'},
         {value:'Plastics', label:'Plastics'},
         {value:'Textiles', label:'Textiles'},
         {value:'Minerals', label:'Minerals'},
         {value:'Standard Product', label:'Standard Product'},
         {value:'Custom Product', label:'Custom Product'},
    ] },
    { name: "uom", label: "Uom", required: true, placeholder: "Enter Uom", colSpan: 2 },
    { name: "price", label: "Price", required: true, placeholder: "Enter Price",type: "number", colSpan: 2 },
    { name: "status", label: "Status", type: "select", colSpan: 2, options: [
      { value:'Active', label:'Active' }, 
      { value:'Inactive', label:'Inactive'}
    ]}
  ];

  const handleExport = () => console.log("Export clicked");
  const handleImport = () => console.log("Import clicked");

  return (
    <ReusableComponent
      title="Commodity"
      initialData={commodityData} 
      fields={exporterFields}
      searchableFields={["productCode","productName","category","subCategory","uom","price","status"]}
      getAll={getAllCommodity} 
      create={createCommodity}
      update={updateExport}
      onRowEdit={editCommodity}
      editData={currentItem}
      onImport={handleImport}
      onExport={handleExport}
    />
  );
};

export default Commodity;

