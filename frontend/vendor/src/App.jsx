import { useLocation } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import Navbar from './components/shared/Navbar';

export default function App() {
  const location = useLocation();
  const noNavbar = location.pathname === '/auth';

  return (
    <>
      {!noNavbar && <Navbar />}
      <AppRoutes />
    </>
  );
}
