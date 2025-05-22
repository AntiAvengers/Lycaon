// AuthContext.js
import { v4 as uuidv4 } from 'uuid';

import { useEffect } from 'react';
import { app } from '../firebase/firebaseConfig.js';
import { getAuth, signInWithCustomToken, onAuthStateChanged, signOut, setPersistence, browserSessionPersistence } from 'firebase/auth';

import { fetchWithAuth } from '../api/fetchWithAuth.js';

import { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);
  const [firebaseStatus, setFirebaseStatus] = useState(false);
  const navigate = useNavigate();

  async function refreshAccessToken() {
    const refresh_base_url = import.meta.env.VITE_APP_MODE == 'DEVELOPMENT' ? import.meta.env.VITE_DEV_URL : '/';
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

  const authenticate = async () => {
      const auth = getAuth(app);
      const API_BASE_URL = import.meta.env.VITE_APP_MODE == 'DEVELOPMENT' 
        ? import.meta.env.VITE_DEV_URL
        : '/';
      const URL = API_BASE_URL + 'auth/firebase';
      try {
          const response = await fetchWithAuth(
            URL, 
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  uid: uuidv4(),
                  claims: { role: 'user' },
              }),
            },
            accessToken,
            refreshAccessToken,
            setAccessToken
          );

          const data = await response.json();
          await setPersistence(auth, browserSessionPersistence);
          await signInWithCustomToken(auth, data.token);
          setFirebaseStatus(true);
      } catch (error) {
        console.error('Authentication error:', error);
      }
  };

  useEffect(() => {
    const auth = getAuth(app);
    if(location.pathname !== "/") {

      if(accessToken) {
        authenticate();
      }

      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          console.log('Firebase: Client Connection Successful');
          setFirebaseStatus(true);
        } else {
          console.log('Firebase: Client Connection Failed/Logged Out');
          setFirebaseStatus(false)
        }
      });

      return unsubscribe;
    }
  }, [accessToken]);

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, refreshAccessToken, authenticate, firebaseStatus }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
