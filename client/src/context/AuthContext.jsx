// AuthContext.js
import { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);
  const navigate = useNavigate();

  async function refreshAccessToken() {
    const refresh_base_url = import.meta.env.VITE_APP_MODE == 'DEVELOPMENT' ? import.meta.env.VITE_DEV_URL : '';
    const res = await fetch(refresh_base_url + `auth/login/refresh`, {
      method: 'POST',
      credentials: 'include', // send the cookie
    });

    if (!res.ok) {
      navigate('/');
      return;
    }

    const data = await res.json();
    setAccessToken(data.accessToken);
    return data.accessToken;
  }

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, refreshAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
