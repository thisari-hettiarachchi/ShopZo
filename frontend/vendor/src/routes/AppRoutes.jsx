import { Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/VendorDashboard';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
    </Routes>
  );
}
