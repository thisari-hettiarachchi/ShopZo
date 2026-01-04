import { useLocation } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import Navbar from './components/shared/Navbar';
import Footer from './components/shared/Footer';

export default function App() {
  const location = useLocation();
  const noHeaderFooter = location.pathname === '/auth'; // Hide Navbar/Footer for Auth

  return (
    <>
      {!noHeaderFooter && <Navbar />}
      <AppRoutes />
      {!noHeaderFooter && <Footer />}
    </>
  );
}
