import { useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppRoutes from './routes/AppRoutes';
import Navbar from './components/shared/Navbar';
import Footer from './components/shared/Footer';
import ScrollToTop from './components/shared/ScrollToTop';
import ScrollToTopButton from './components/shared/ScrollToTopButton';

export default function App() {
  const location = useLocation();
  const noHeaderFooter = location.pathname === '/auth'; 

  return (
    <>
      <ScrollToTop />
      {!noHeaderFooter && <Navbar />}
      <AppRoutes />
      {!noHeaderFooter && <Footer />}
      <ScrollToTopButton />
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
