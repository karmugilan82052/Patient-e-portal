import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateAppointment from './pages/CreateAppointment';
import DoctorDashboard from './pages/DoctorDashboard';
import DoctorAppointments from './pages/DoctorAppointments';
import PatientHistory from './pages/PatientHistory';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminAppointments from './pages/AdminAppointments';
import Sidebar from './components/Sidebar';
import './index.css';

const PrivateRoute = ({ children, role }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (role && userRole !== role) {
    return <Navigate to="/" />;
  }

  return children;
};

const MainLayout = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/register';
  const showSidebar = Boolean(token) && !isAuthRoute;

  return (
    <div className={showSidebar ? "main-layout" : "auth-layout"}>
      {showSidebar && <Sidebar />}
      <main className={showSidebar ? "content-area" : "auth-content-area"}>
        {children}
      </main>
    </div>
  );
};

const RootRedirect = () => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token) return <Navigate to="/login" />;
  if (role === 'ADMIN') return <Navigate to="/admin-dashboard" />;
  return role === 'DOCTOR' ? <Navigate to="/doctor-dashboard" /> : <Navigate to="/create-appointment" />;
};

function App() {
  return (
    <Router>
      <Navbar />
      <MainLayout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/create-appointment"
            element={
              <PrivateRoute role="USER">
                <CreateAppointment />
              </PrivateRoute>
            }
          />
          <Route
            path="/patient-history"
            element={
              <PrivateRoute role="USER">
                <PatientHistory />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/doctor-dashboard"
            element={
              <PrivateRoute role="DOCTOR">
                <DoctorDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/doctor-appointments"
            element={
              <PrivateRoute role="DOCTOR">
                <DoctorAppointments />
              </PrivateRoute>
            }
          />
          {/* Admin Routes */}
          <Route
            path="/admin-dashboard"
            element={
              <PrivateRoute role="ADMIN">
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin-users"
            element={
              <PrivateRoute role="ADMIN">
                <AdminUsers />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin-appointments"
            element={
              <PrivateRoute role="ADMIN">
                <AdminAppointments />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<RootRedirect />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
