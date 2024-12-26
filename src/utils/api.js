import config from '../config';

const API_BASE_URL = 'http://localhost:9090/api'; // Default API endpoint

const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Refresh-Token': refreshToken
      },
      body: JSON.stringify({ refresh_token: refreshToken })
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const data = await response.json();
    localStorage.setItem('accessToken', data.access_token);
    localStorage.setItem('refreshToken', data.refresh_token);
    return data.access_token;
  } catch (error) {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userData');
    window.location.href = '/login';
    throw error;
  }
};

export const fetchWithAuth = async (endpoint, options = {}) => {
  try {
    const token = await ensureValidToken();
    
    const response = await fetch(`${config.API_URL}/api${endpoint}`, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Accept-Language': localStorage.getItem('language') || 'ar'
      }
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

export const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const { exp } = JSON.parse(jsonPayload);
    const currentTime = Math.floor(Date.now() / 1000);
    
    return exp < currentTime;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
};

export const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(`${config.API_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: {
        'X-Refresh-Token': refreshToken
      }
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const data = await response.json();
    
    // Store new tokens
    localStorage.setItem('accessToken', data.access_token);
    localStorage.setItem('refreshToken', data.refresh_token);
    
    return data.access_token;
  } catch (error) {
    console.error('Error refreshing token:', error);
    // Clear tokens and redirect to login
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
    throw error;
  }
};

export const ensureValidToken = async () => {
  const accessToken = localStorage.getItem('accessToken');
  
  if (!accessToken || isTokenExpired(accessToken)) {
    return await refreshToken();
  }
  
  return accessToken;
};

export const getUserProfile = async () => {
  try {
    const token = await ensureValidToken();
    
    const response = await fetch(`${config.API_URL}/api/users/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Accept-Language': localStorage.getItem('language') || 'ar'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (data) => {
  try {
    const token = await ensureValidToken();
    
    const response = await fetch(`${config.API_URL}/api/users/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Accept-Language': localStorage.getItem('language') || 'ar'
      },
      body: JSON.stringify(data)
    });

    return await response.json();
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}; 