import { useAuth } from '@/context/auth-context';
import { Redirect, Route, RouteProps } from 'wouter';

// Define the props for ProtectedRoute, extending RouteProps from wouter
interface ProtectedRouteProps extends Omit<RouteProps, 'component'> {
  component: React.ComponentType<any>;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ component: Component, ...rest }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    // Optional: Render a loading indicator while auth state is being determined
    return <div className="flex items-center justify-center min-h-screen">Checking authentication...</div>;
  }

  if (!isAuthenticated) {
    // If not authenticated, redirect to the login page
    // Pass the current location to redirect back after login (optional)
    // const currentLocation = useLocation();
    // return <Redirect to={`/login?redirect=${currentLocation[0]}`} />;
    return <Redirect to="/login" />;
  }

  // If authenticated, render the component
  return <Route {...rest} component={Component} />;
};
