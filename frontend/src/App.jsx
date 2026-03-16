import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import DashboardLayout from './layouts/DashboardLayout';
import OverallDashboard from './pages/Dashboard/OverallDashboard';
import Cars from './pages/Dashboard/Cars';
import Users from './pages/Dashboard/Users';
import Owners from './pages/Dashboard/Owners';
import Drivers from './pages/Dashboard/Drivers';
import Locations from './pages/Dashboard/Locations';
import Workshop from './pages/Dashboard/Workshop';
import Bookings from './pages/Dashboard/Bookings';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

// Admin Route Wrapper
const AdminRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  if (user?.role !== 'Admin') return <Navigate to="/" replace />;
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        {/* Protected Dashboard Routes */}
        <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<OverallDashboard />} />
          <Route path="cars" element={<Cars />} />
          <Route path="owners" element={<Owners />} />
          <Route path="workshop" element={<Workshop />} />
          <Route path="drivers" element={<Drivers />} />
          <Route path="locations" element={<Locations />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="users" element={<AdminRoute><Users /></AdminRoute>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
