import { useLocation } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';;

export default function App() {
  const location = useLocation();
  const noHeaderFooter = location.pathname === '/auth'; 

  return (
    <>
      <AppRoutes />
    </>
  );
}
