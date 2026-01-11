import { useLocation } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import Navbar from './components/shared/Navbar';
import Sidebar from './components/shared/SideBar';

export default function App() {
  const location = useLocation();
  const noHeaderFooter = location.pathname === '/auth'; 

  return (
    <>
      {!noHeaderFooter && <Navbar />}
      <AppRoutes />
    </>
  );
}
