import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';

const ProtectedRoutes = () => {
  const { accessToken, setAccessToken, refreshAccessToken } = useAuth();
  const [isChecking, setIsChecking] = useState(true);

  //Comment the line below to enable auth
  return <Outlet />;

  //Auth
  useEffect(() => {
    const checkToken = async () => {
      if (!accessToken) {
        try {
          const newToken = await refreshAccessToken();
          if (newToken) {
            setAccessToken(newToken);
          }
        } catch (err) {
          console.error('Refresh token failed:', err);
        }
      }
      setIsChecking(false);
    };

    checkToken();
  }, [accessToken, refreshAccessToken, setAccessToken]);

  if (isChecking) {
    return <div>Loading...</div>; // or a spinner
  }

  if (!accessToken) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;
