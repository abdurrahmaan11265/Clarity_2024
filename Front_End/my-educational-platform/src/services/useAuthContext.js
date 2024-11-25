import { Navigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const AuthenticatedRoute = ({ element }) => {
    const { authToken } = useAuth();

    if (authToken) {
        return element; // If token exists, render the requested component
    } else {
        return <Navigate to="/" />; // If no token, redirect to login page
    }
};

export default AuthenticatedRoute;