import { useLocation } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import Navbar from './components/shared/Navbar';

export default function App() {
  useLocation();

  return (
    <>
      <Navbar />
      <AppRoutes />
    </>
  );
}
