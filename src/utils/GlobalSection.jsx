import { useEffect, useRef, useState } from 'react';

// third-party
import { IconWorld } from '@tabler/icons-react';
import apiCalls from 'apicall';
import { ToastContainer } from 'react-toastify';
import { showToast } from 'utils/toast-component';

const GlobalSection = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [finYearValue, setFinYearValue] = useState('');
  const [companyValue, setCompanyValue] = useState('');
  const [customerValue, setCustomerValue] = useState('');
  const [warehouseValue, setWarehouseValue] = useState('');
  const [clientValue, setClientValue] = useState('');
  const [branchValue, setBranchValue] = useState('');
  const [orgId, setOrgId] = useState(parseInt(localStorage.getItem('orgId')));
  const [userId, setUserId] = useState(localStorage.getItem('userId'));
  const [userName, setUserName] = useState(localStorage.getItem('userName'));
  const [branchVO, setBranchVO] = useState([]);
  const [finVO, setFinVO] = useState([]);
  const [warehouseVO, setWarehouseVO] = useState([]);
  const [customerVO, setCustomerVO] = useState([]);
  const [clientVO, setClientVO] = useState([]);
  const [globalParameter, setGlobalParameter] = useState([]);
  const [branchName, setBranchName] = useState('');

  const anchorRef = useRef(null);

  useEffect(() => {
    getGlobalParameter();
    getAccessBranch();
    getFinYear();
  }, []);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const [selectedBranch, setSelectedBranch] = useState({ branch: '', branchcode: '' });

  const handleBranchChange = (event) => {
    const branchcode = event.target.value;
    const branch = branchVO.find((option) => option.branchcode === branchcode);

    if (branch) {
      setSelectedBranch({ branch: branch.branch, branchcode: branchcode });
      setBranchName(branch.branch);
    }

    setBranchValue(branchcode);
    getCustomer(branchcode);
  };

  const getAccessBranch = async () => {
    try {
      const result = await apiCalls('get', `commonmaster/globalparamBranchByUserName?orgid=${orgId}&userName=${userName}`);
      setBranchVO(result.paramObjectsMap.GlopalParameters || []);
    } catch (err) {
      console.log('error', err);
    }
  };

  const getFinYear = async () => {
    try {
      const result = await apiCalls('get', `/commonmaster/getAllAciveFInYear?orgId=${orgId}`);
      setFinVO(result.paramObjectsMap.financialYearVOs || []);
    } catch (err) {
      console.log('error', err);
    }
  };

  const getCustomer = async (branchcode) => {
    const formData = {
      branchcode: branchcode,
      orgid: orgId,
      userName: userName
    };

    const queryParams = new URLSearchParams(formData).toString();

    try {
      const result = await apiCalls('get', `commonmaster/globalparamCustomerByUserName?${queryParams}`);
      setCustomerVO(result.paramObjectsMap.GlopalParameterCustomer);
    } catch (err) {
      console.log('error', err);
    }
  };

  const getClient = async (customer, branchCode) => {
    const formData = {
      branchcode: branchCode,
      orgid: orgId,
      userName: userName,
      customer: customer
    };

    const queryParams = new URLSearchParams(formData).toString();

    try {
      const result = await apiCalls('get', `commonmaster/globalparamClientByUserName?${queryParams}`);
      setClientVO(result.paramObjectsMap.GlopalParameterClient);
    } catch (err) {
      console.log('error', err);
    }
  };

  const getGlobalParameter = async () => {
    try {
      const result = await apiCalls('get', `commonmaster/globalparam/username?orgid=${orgId}&userId=${userId}`);
      const globalParameterVO = result.paramObjectsMap.globalParam;
      setGlobalParameter(globalParameterVO);
      setCustomerValue(globalParameterVO.customer);
      setClientValue(globalParameterVO.client);
      setFinYearValue(globalParameterVO.finYear);
      setWarehouseValue(globalParameterVO.warehouse);
      setBranchValue(globalParameterVO.branchcode);
      setBranchName(globalParameterVO.branch);

      localStorage.setItem('customer', globalParameterVO.customer);
      localStorage.setItem('client', globalParameterVO.client);
      localStorage.setItem('finYear', globalParameterVO.finYear);
      localStorage.setItem('warehouse', globalParameterVO.warehouse);
      localStorage.setItem('branchcode', globalParameterVO.branchcode);
      localStorage.setItem('branch', globalParameterVO.branch);

      getCustomer(globalParameterVO.branchcode);
      getClient(globalParameterVO.customer, globalParameterVO.branchcode);
      getWareHouse(globalParameterVO.branchcode);
    } catch (err) {
      console.log('error', err);
    }
  };

  const handleSubmit = async () => {
    const formData = {
      branch: branchName,
      branchcode: branchValue,
      customer: customerValue,
      client: clientValue,
      finYear: finYearValue,
      warehouse: warehouseValue,
      userid: userId,
      orgId
    };
    try {
      const result = await apiCalls('put', `commonmaster/globalparam`, formData);
      showToast('success', 'Global Parameter updated successfully');
      setOpen(false);
    } catch (err) {
      console.log('error', err);
    }
  };

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = open;
  }, [open]);

  const handleChange = (event) => {
    if (event?.target.value) setValue(event?.target.value);
  };

  const handleFinYearChange = (event) => {
    setFinYearValue(event.target.value);
  };

  const handleClientChange = (event) => {
    setClientValue(event.target.value);
    getWareHouse(selectedBranch.branchcode);
  };

  const handleCustomerChange = (event) => {
    setCustomerValue(event.target.value);
    getClient(event.target.value, selectedBranch.branchcode);
  };

  const handleWarehouseChange = (event) => {
    setWarehouseValue(event.target.value);
  };

  const getWareHouse = async (branchCode) => {
    try {
      const result = await apiCalls('get', `warehousemastercontroller/warehouse/branch?branchcode=${branchCode}&orgid=${orgId}`);
      setWarehouseVO(result.paramObjectsMap.Warehouse || []);
    } catch (err) {
      console.log('error', err);
    }
  };

  return (
    <>
      <div className="mr-4">
        <button
          ref={anchorRef}
          onClick={handleToggle}
          className={`
            flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 ease-in-out
            bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          `}
        >
          <IconWorld stroke={1.5} size="1.3rem" />
        </button>
      </div>

      {/* Backdrop */}
      {open && (
        <div 
          className="fixed inset-0 z-40"
          onClick={handleClose}
        />
      )}

      {/* Dropdown Panel */}
      <div
        className={`
          fixed z-50 mt-2 w-80
          transition-all duration-200 ease-in-out
          ${open ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}
        `}
        style={{
          right: '1rem',
          top: '100%'
        }}
      >
        <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-semibold text-gray-800">Global Parameters</h3>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-4 space-y-4">
            {/* Fin Year */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fin Year</label>
              <select
                value={finYearValue}
                onChange={handleFinYearChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              >
                <option value="" disabled>Select Fin Year</option>
                {finVO?.map((option) => (
                  <option key={option.id} value={option.finYear}>
                    {option.finYear}
                  </option>
                ))}
              </select>
            </div>

            {/* Branch */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
              <select
                value={branchValue}
                onChange={handleBranchChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              >
                <option value="" disabled>Select Branch</option>
                {branchVO.map((option) => (
                  <option key={option.branchcode} value={option.branchcode}>
                    {option.branch}
                  </option>
                ))}
              </select>
            </div>

            {/* Customer */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
              <select
                value={customerValue}
                onChange={handleCustomerChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              >
                <option value="" disabled>Select Customer</option>
                {customerVO?.map((option) => (
                  <option key={option.customer} value={option.customer}>
                    {option.customer}
                  </option>
                ))}
              </select>
            </div>

            {/* Client */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
              <select
                value={clientValue}
                onChange={handleClientChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              >
                <option value="" disabled>Select Client</option>
                {clientVO?.map((option) => (
                  <option key={option.client} value={option.client}>
                    {option.client}
                  </option>
                ))}
              </select>
            </div>

            {/* Warehouse */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Warehouse</label>
              <select
                value={warehouseValue}
                onChange={handleWarehouseChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              >
                <option value="" disabled>Select Warehouse</option>
                {warehouseVO?.map((option) => (
                  <option key={option.Warehouse} value={option.Warehouse}>
                    {option.Warehouse}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
            <div className="flex justify-center">
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 font-medium"
              >
                Change Parameters
              </button>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer />
    </>
  );
};

export default GlobalSection;