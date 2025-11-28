import { useEffect } from "react";
import { Provider, useSelector } from "react-redux";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from "react-router-dom";
import AuctionDashboard from "./components/Auction/AuctionDashboard";
import LoginForm from "./components/Auth/LoginForm";
import InboundMenu from "./components/inbound/InboundMenu";
import Layout from "./components/Layout/Layout";
import CustomerMasterPage from "./components/masters/customer/CustomerMaster";
import MastersList from "./components/masters/MasterList";
import Setup from "./components/masters/Setup";
import OutboundMenu from "./components/outbound/OutboundList";
import ReportsList from "./components/reports/ReportList";
import ProfileSettings from "./components/settings/Profile";
import SettingsDashboard from "./components/settings/SettingsDashboard";
import UserManagement from "./components/settings/UserManagement";
import StockProcessList from "./components/stock-process/StockProcessList";
import TripExecutionDashboard from "./components/trip/TripExecutionDashboard";
import VASList from "./components/VAS/VASList";
import CustomerBookingRequest from "./pages/CustomerBookingRequest";
import Dashboard from "./pages/Dashboard";
import Driver from "./pages/Driver";
import Indent from "./pages/Indent";
import Payouts from "./pages/Payouts";
import RFQ from "./pages/RFQ";
import RoutePage from "./pages/RoutePage";
import Trip from "./pages/Trip";
import Vehicle from "./pages/Vehicle";
import Vendor from "./pages/Vendor";
import VendorRate from "./pages/VendorRate";
import { store } from "./store";
import "./styles/globals.css";
import ChatWidget from "./utils/ChatWidget";

import CertificateListing from "./components/certificate/CertificateListing";
import CertificateOfOriginInput from "./components/certificate/Orgin";
import CustomerEnquirySystem from "./components/Enquiry/Enquiry";
import FormNine from "./components/forms/FormNine";
import FormsListing from "./components/forms/Forms";
import InvoiceListing from "./components/invoice/invoice";
import ExportersMaster from "./components/masters/exporter/Exporter";
import OrderBooking from "./components/order-booking/OrderBooking";
import Invoice from "./components/invoice/InvoiceForm";

// Theme initializer component
const ThemeInitializer = () => {
  const { mode } = useSelector((state) => state.theme);

  useEffect(() => {
    if (mode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [mode]);

  return null;
};

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Public Route component (redirect if already authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return !isAuthenticated ? children : <Navigate to="/" />;
};

// Chat Widget with conditional rendering
const ConditionalChatWidget = () => {
  const location = useLocation();
  const hideChatRoutes = ["/login", "/register", "/forgot-password"];
  const shouldHideChat = hideChatRoutes.includes(location.pathname);

  return !shouldHideChat ? <ChatWidget /> : null;
};

const AppContent = () => {
  return (
    <>
      <ThemeInitializer />
      <Router>
        <ConditionalChatWidget />
        <Routes>
          {/* Public routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginForm />
              </PublicRoute>
            }
          />

          {/* Protected routes */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/vendor" element={<Vendor />} />
                    <Route path="/route" element={<RoutePage />} />
                    <Route path="/trip" element={<Trip />} />
                    <Route path="/vehicle" element={<Vehicle />} />
                    <Route path="/driver" element={<Driver />} />
                    <Route path="/auction" element={<AuctionDashboard />} />
                    <Route
                      path="/trip-execution"
                      element={<TripExecutionDashboard />}
                    />
                    <Route path="/indents" element={<Indent />} />
                    <Route path="/vendor-rate" element={<VendorRate />} />
                    <Route
                      path="/booking-request"
                      element={<CustomerBookingRequest />}
                    />
                    <Route path="/payouts" element={<Payouts />} />
                    <Route
                      path="/calendar"
                      element={<div className="p-6">Calendar Page</div>}
                    />
                    <Route path="/rfq" element={<RFQ />} />
                    <Route path="/settings" element={<SettingsDashboard />} />
                    <Route
                      path="/settings/users"
                      element={<UserManagement />}
                    />
                    <Route
                      path="/settings/profile"
                      element={<ProfileSettings />}
                    />
                    {/* WMS Routes */}
                    <Route path="/masters" element={<MastersList />} />
                    <Route path="/inbound" element={<InboundMenu />} />
                    <Route path="/outbound" element={<OutboundMenu />} />
                    <Route path="/customer" element={<CustomerMasterPage />} />
                    <Route path="/vas" element={<VASList />} />
                    <Route
                      path="/stock-process"
                      element={<StockProcessList />}
                    />
                    <Route path="/reports" element={<ReportsList />} />
                    <Route path="/setup" element={<Setup />} />
                    <Route path="/exporter" element={<ExportersMaster />} />
                    <Route
                      path="/certificate"
                      element={<CertificateListing />}
                    />
                    <Route path="/forms" element={<FormsListing />} />
                    <Route path="/invoice" element={<InvoiceListing />} />

                    <Route path="/order-booking" element={<OrderBooking />} />
                    <Route
                      path="/Enquiry"
                      element={<CustomerEnquirySystem />}
                    />

                    <Route
                      path="/orgin"
                      element={<CertificateOfOriginInput />}
                    />

                    <Route path="/forms/form-9" element={<FormNine />} />
                     <Route path="/invoice-form" element={<Invoice />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </>
  );
};

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
