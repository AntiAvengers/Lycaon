export async function fetchWithAuth(url, options = {}, accessToken, refreshAccessToken, setAccessToken) {
    async function makeRequest(token) {
      try {
        const merged_options = {
          ...options,
          headers: {
            ...options.headers,
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: options.body || JSON.stringify({}),
          credentials: 'include', // to include cookies
        }
        return await fetch(url, merged_options);
      } catch(err) {
        console.error(err);
      }
    }
    try {
      let response = await makeRequest(accessToken);
  
      if (response.status === 403) {
        console.log('whale oil beef hooked');
        try {
          const newToken = await refreshAccessToken();
          setAccessToken(newToken);
          response = await makeRequest(newToken);
        } catch (refreshError) {
          console.error('Failed to refresh token:', refreshError);
          throw new Error('Authentication failed');
        }
      }
      return response;
    }
    catch(err) {
      console.error(err);
    }
  }
  