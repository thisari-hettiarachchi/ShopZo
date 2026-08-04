import { useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppRoutes from './routes/AppRoutes';
import Navbar from './components/shared/Navbar';
import Footer from './components/shared/Footer';

export default function App() {
  const location = useLocation();
  const noHeaderFooter = location.pathname === '/auth'; 

  return (
    <>
      {!noHeaderFooter && <Navbar />}
      <AppRoutes />
      {!noHeaderFooter && <Footer />}
      <ToastContainer
        position="top-right"
        autoClose={3500}
        newestOnTop
        theme="colored"
        toastClassName="!rounded-xl !font-medium"
      />
    </>
  );
}
