import { useRoutes } from 'react-router-dom';

// routes
import MainRoutes from './main-routes';
// import AuthRoutes from './auth-routes';
// import AdminRoutes from './admin-routes';
import ErrorRoutes from './error-routes';

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
    return useRoutes([MainRoutes,  ErrorRoutes]);
}
