import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import AdminDashboard from './pages/Admin/AdminDashboard';
import ManageRequests from './pages/Admin/ManageRequests';
import ManageRents from './pages/Admin/ManageRents';
import TenantDashboard from './pages/Tenant/TenantDashboard';
import SearchRoommates from './pages/Tenant/SearchRoommates';
import SearchApartments from './pages/Tenant/SearchApartments';
import ApplyForApartment from './pages/Tenant/ApplyForApartment';
import ServiceRequest from './pages/Tenant/ServiceRequest';
import LandlordDashboard from './pages/Landlord/LandlordDashboard';
import ManageApartments from './pages/Landlord/ManageApartments';
import RentedProperties from './pages/Landlord/RentedProperties';

const App = () => {
  const role = localStorage.getItem('role'); // Get role from localStorage

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        {/* Admin Routes */}
        {role === 'admin' && (
          <>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/manage-requests" element={<ManageRequests />} />
            <Route path="/admin/manage-rents" element={<ManageRents />} />
          </>
        )}
        {/* Tenant Routes */}
        {role === 'tenant' && (
          <>
            <Route path="/tenant/dashboard" element={<TenantDashboard />} />
            <Route path="/tenant/search-roommates" element={<SearchRoommates />} />
            <Route path="/tenant/search-apartments" element={<SearchApartments />} />
            <Route path="/tenant/apply-for-apartment" element={<ApplyForApartment />} />
            <Route path="/tenant/service-request" element={<ServiceRequest />} />
          </>
        )}
        {/* Landlord Routes */}
        {role === 'landlord' && (
          <>
            <Route path="/landlord/dashboard" element={<LandlordDashboard />} />
            <Route path="/landlord/manage-apartments" element={<ManageApartments />} />
            <Route path="/landlord/rented-properties" element={<RentedProperties />} />
          </>
        )}
        {/* Redirect to login if no role is found */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
 
// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
