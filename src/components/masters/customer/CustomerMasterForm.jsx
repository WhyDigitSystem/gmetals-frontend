import {
  ArrowLeft,
  Building,
  Plus,
  Save,
  Trash2,
  UserCircle,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { masterAPI } from "../../../api/customerAPI";
import { FloatingInput, FloatingSelect } from "../../../utils/InputFields";

/* -----------------------------------------------
   MAIN COMPONENT
------------------------------------------------ */
const CustomerMasterForm = ({ editData, onBack }) => {
  const ORG_ID = 1000000001;
  const [activeTab, setActiveTab] = useState("client");
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    id: editData?.id || "",
    customerName: editData?.customerName || "",
    customerShortName: editData?.customerShortName || "",
    contactPerson: editData?.contactPerson || "",
    mobileNumber: editData?.mobileNumber || "",
    emailId: editData?.emailId || "",
    groupOf: editData?.groupOf || "",
    panNo: editData?.panNo || "",
    tanNo: editData?.tanNo || "",
    address1: editData?.address1 || "",
    country: editData?.country || "",
    state: editData?.state || "",
    city: editData?.city || "",
    gstRegistration: editData?.gstRegistration || "",
    gstNo: editData?.gstNo || "",
    active: editData?.active === "Active" ? true : false,
  });

  console.log("EditData", editData);

  const [clientRows, setClientRows] = useState(() => {
    // If editing and client data exists, use it
    if (editData?.clientVO?.length) {
      return editData.clientVO;
    }
    // Otherwise start with empty row
    return [
      { client: "", clientCode: "", clientType: "", fifofife: "", id: 0 },
    ];
  });

  const [branchRows, setBranchRows] = useState(() => {
    // If editing and branch data exists, use it
    if (editData?.clientBranchVO?.length) {
      return editData.clientBranchVO;
    }
    // Otherwise start with empty row
    return [{ branch: "", branchCode: "", id: 0 }];
  });

  /* -------------------------- FETCH COUNTRIES FROM API -------------------------- */
  useEffect(() => {
    const fetchCountries = async () => {
      setLoading(true);
      try {
        const countriesData = await masterAPI.getCountries(ORG_ID);
        setCountries(countriesData);
      } catch (error) {
        console.error("Error fetching countries:", error);
        alert("Failed to load countries");
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, [ORG_ID]);

  /* -------------------------- FETCH STATES FROM API -------------------------- */
  useEffect(() => {
    const fetchStates = async () => {
      if (!form.country) {
        setStates([]); // Clear states if no country selected
        return;
      }

      setLoading(true);
      try {
        const statesData = await masterAPI.getState(ORG_ID, form.country);
        setStates(statesData);
      } catch (error) {
        console.error("Error fetching states:", error);
        alert("Failed to load states");
      } finally {
        setLoading(false);
      }
    };

    fetchStates();
  }, [ORG_ID, form.country]); // Re-fetch when country changes

  useEffect(() => {
    const fetchCities = async () => {
      if (!form.state) {
        setCities([]); // Clear states if no country selected
        return;
      }

      setLoading(true);
      try {
        const CityData = await masterAPI.getCity(ORG_ID, form.state);
        setCities(CityData);
      } catch (error) {
        console.error("Error fetching Cities:", error);
        alert("Failed to load Cities");
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, [ORG_ID, form.state]); // Re-fetch when country changes

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => {
      const newForm = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };

      // Reset state when country changes
      if (name === "country" && value !== prev.country) {
        newForm.state = "";
        newForm.city = "";
      }

      // Reset city when state changes
      if (name === "state" && value !== prev.state) {
        newForm.city = "";
      }

      return newForm;
    });
  };

  /* -------------------------- CLIENT METHODS -------------------------- */
  const updateClient = (index, field, value) => {
    setClientRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    );
  };

  const addClient = () => {
    setClientRows((prev) => [
      ...prev,
      { client: "", clientCode: "", clientType: "", fifofife: "", id: 0 },
    ]);
  };

  const removeClient = (index) => {
    if (clientRows.length > 1) {
      setClientRows((prev) => prev.filter((_, i) => i !== index));
    }
  };

  /* -------------------------- BRANCH METHODS -------------------------- */
  const updateBranch = (index, field, value) => {
    setBranchRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    );
  };

  const addBranch = () => {
    setBranchRows((prev) => [...prev, { branch: "", branchCode: "", id: 0 }]);
  };

  const removeBranch = (index) => {
    if (branchRows.length > 1) {
      setBranchRows((prev) => prev.filter((_, i) => i !== index));
    }
  };

  /* -------------------------- SAVE METHOD -------------------------- */
  const handleSave = async () => {
    if (!form.customerName.trim()) {
      alert("Please enter Customer Name");
      return;
    }

    const payload = {
      ...form,
      orgId: ORG_ID,
      createdBy: "SYSTEM",
      updatedBy: "SYSTEM",
      cancel: false,
      cancelRemarks: "",
      clientDTO: clientRows,
      clientBranchDTO: branchRows,
    };

    try {
      await masterAPI.saveCustomer(payload);
      alert(editData ? "Customer Updated!" : "Customer Saved!");
      onBack();
    } catch (error) {
      console.error("Save Error:", error);
      alert("Save Failed!");
    }
  };

  /* -------------------------- OPTIONS -------------------------- */
  const clientTypeOptions = [
    { value: "FIXED", label: "Fixed" },
    { value: "OPEN", label: "Open" },
  ];

  const strategyOptions = [
    { value: "FEFO", label: "FEFO" },
    { value: "FIFO", label: "FIFO" },
    { value: "LILO", label: "LILO" },
  ];

  // Convert API countries to dropdown options
  const countryOptions = countries.map((country) => ({
    value: country.countryName, // Using countryCode as value
    label: country.countryName, // Using countryName as display label
  }));

  // Convert API states to dropdown options
  const stateOptions = states.map((state) => ({
    value: state.stateName || state.id, // Use stateCode or id as value
    label: state.stateName, // Using stateName as display label
  }));

  const cityOptions = cities.map((city) => ({
    value: city.cityName || city.id, // Use stateCode or id as value
    label: city.cityName, // Using stateName as display label
  }));

  const gstRegistrationOptions = [
    { value: "YES", label: "YES" },
    { value: "NO", label: "NO" },
  ];

  return (
    <div className="p-4 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={onBack}
          className="p-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {editData ? "Edit Customer" : "Add Customer"}
        </h2>
      </div>

      {/* MAIN CARD */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        {/* MAIN FORM GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
          <FloatingInput
            label="Customer Name"
            name="customerName"
            value={form.customerName}
            onChange={handleChange}
            required
          />
          <FloatingInput
            label="Short Name"
            name="customerShortName"
            value={form.customerShortName}
            onChange={handleChange}
          />
          <FloatingInput
            label="Contact Person"
            name="contactPerson"
            value={form.contactPerson}
            onChange={handleChange}
          />
          <FloatingInput
            label="Mobile"
            name="mobileNumber"
            value={form.mobileNumber}
            onChange={handleChange}
            type="tel"
          />
          <FloatingInput
            label="Email"
            name="emailId"
            value={form.emailId}
            onChange={handleChange}
            type="email"
          />

          <FloatingInput
            label="Group Of"
            name="groupOf"
            value={form.groupOf}
            onChange={handleChange}
          />
          <FloatingInput
            label="PAN"
            name="panNo"
            value={form.panNo}
            onChange={handleChange}
            className="uppercase"
          />
          <FloatingInput
            label="TAN"
            name="tanNo"
            value={form.tanNo}
            onChange={handleChange}
            className="uppercase"
          />
          <FloatingInput
            label="Address"
            name="address1"
            value={form.address1}
            onChange={handleChange}
            className="md:col-span-2"
          />

          {/* Country Dropdown with API data */}
          <FloatingSelect
            label="Country"
            name="country"
            value={form.country}
            onChange={handleChange}
            options={countryOptions}
            required
          />

          {/* State Dropdown with API data */}
          <FloatingSelect
            label="State"
            name="state"
            value={form.state}
            onChange={handleChange}
            options={stateOptions}
            required
            disabled={!form.country} // Disable if no country selected
          />

          <FloatingSelect
            label="City"
            name="city"
            value={form.city}
            onChange={handleChange}
            options={cityOptions}
          />
          <FloatingSelect
            label="GST Reg"
            name="gstRegistration"
            value={form.gstRegistration}
            onChange={handleChange}
            options={gstRegistrationOptions}
          />
          <FloatingInput
            label="GST No"
            name="gstNo"
            value={form.gstNo}
            onChange={handleChange}
            className="uppercase"
          />

          {/* ACTIVE CHECKBOX */}
          <div className="flex items-center gap-2 p-1">
            <input
              type="checkbox"
              name="active"
              checked={form.active}
              onChange={handleChange}
              className="h-3 w-3 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              Active
            </span>
          </div>
        </div>

        {/* TABS NAVIGATION */}
        <div className="flex gap-1 mb-4">
          <button
            onClick={() => setActiveTab("client")}
            className={`flex items-center gap-1 px-3 py-2 rounded text-xs font-medium transition-colors ${
              activeTab === "client"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            <UserCircle className="h-3 w-3" />
            Clients
            <span className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 text-xs px-1 rounded">
              {clientRows.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("branch")}
            className={`flex items-center gap-1 px-3 py-2 rounded text-xs font-medium transition-colors ${
              activeTab === "branch"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            <Building className="h-3 w-3" />
            Branches
            <span className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 text-xs px-1 rounded">
              {branchRows.length}
            </span>
          </button>
        </div>

        {/* CLIENT TAB */}
        {activeTab === "client" && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Client Details
              </h3>
              <button
                onClick={addClient}
                className="flex items-center gap-1 px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs transition-colors dark:text-white"
              >
                <Plus className="h-3 w-3" /> Add
              </button>
            </div>

            <div className="overflow-hidden border border-gray-200 dark:border-gray-700 rounded">
              <table className="w-full text-xs">
                <thead className="bg-gray-50 dark:bg-gray-700 dark:text-white">
                  <tr>
                    <th className="p-2 text-left font-medium w-10"></th>
                    <th className="p-2 text-left font-medium">Client</th>
                    <th className="p-2 text-left font-medium">Code</th>
                    <th className="p-2 text-left font-medium">Type</th>
                    <th className="p-2 text-left font-medium">Strategy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 dark:text-white">
                  {clientRows.map((row, index) => (
                    <tr
                      key={index}
                      className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750"
                    >
                      <td className="p-2">
                        <button
                          onClick={() => removeClient(index)}
                          disabled={clientRows.length === 1}
                          className={`p-1 rounded ${
                            clientRows.length === 1
                              ? "text-gray-400 cursor-not-allowed"
                              : "text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                          }`}
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </td>
                      <td className="p-2">
                        <input
                          value={row.client}
                          onChange={(e) =>
                            updateClient(index, "client", e.target.value)
                          }
                          placeholder="Client name"
                          className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 focus:outline-none focus:border-blue-500"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          value={row.clientCode}
                          onChange={(e) =>
                            updateClient(index, "clientCode", e.target.value)
                          }
                          placeholder="Code"
                          className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 focus:outline-none focus:border-blue-500"
                        />
                      </td>
                      <td className="p-2">
                        <select
                          value={row.clientType}
                          onChange={(e) =>
                            updateClient(index, "clientType", e.target.value)
                          }
                          className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 focus:outline-none focus:border-blue-500"
                        >
                          <option value="">Type</option>
                          {clientTypeOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-2">
                        <select
                          value={row.fifofife}
                          onChange={(e) =>
                            updateClient(index, "fifofife", e.target.value)
                          }
                          className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 focus:outline-none focus:border-blue-500"
                        >
                          <option value="">Strategy</option>
                          {strategyOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* BRANCH TAB */}
        {activeTab === "branch" && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Branch Details
              </h3>
              <button
                onClick={addBranch}
                className="flex items-center gap-1 px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs transition-colors"
              >
                <Plus className="h-3 w-3" /> Add
              </button>
            </div>

            <div className="overflow-hidden border border-gray-200 dark:border-gray-700 rounded">
              <table className="w-full text-xs">
                <thead className="bg-gray-50 dark:bg-gray-700 dark:text-white">
                  <tr>
                    <th className="p-2 text-left font-medium w-10"></th>
                    <th className="p-2 text-left font-medium">Branch</th>
                    <th className="p-2 text-left font-medium">Code</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {branchRows.map((row, index) => (
                    <tr
                      key={index}
                      className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 dark:text-white"
                    >
                      <td className="p-2">
                        <button
                          onClick={() => removeBranch(index)}
                          disabled={branchRows.length === 1}
                          className={`p-1 rounded ${
                            branchRows.length === 1
                              ? "text-gray-400 cursor-not-allowed"
                              : "text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                          }`}
                        >
                          <Trash2 className="h-3 w-3 " />
                        </button>
                      </td>
                      <td className="p-2">
                        <input
                          value={row.branch}
                          onChange={(e) =>
                            updateBranch(index, "branch", e.target.value)
                          }
                          placeholder="Branch name"
                          className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 focus:outline-none focus:border-blue-500"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          value={row.branchCode}
                          onChange={(e) =>
                            updateBranch(index, "branchCode", e.target.value)
                          }
                          placeholder="Code"
                          className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 focus:outline-none focus:border-blue-500"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ACTION BUTTONS */}
        <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onBack}
            className="flex items-center gap-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="h-3 w-3" /> Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
          >
            <Save className="h-3 w-3" /> {editData ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerMasterForm;
