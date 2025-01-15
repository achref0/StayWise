import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const login = async (username, password) => {
  const response = await api.post('/login', { username, password });
  return response.data;
};

export const signup = async (username, password, email, name) => {
  const response = await api.post('/signup', { username, password, email, name });
  return response.data;
};

export const logout = async () => {
  await api.post('/logout');
};

export const getCurrentUser = async () => {
  const response = await api.get('/current-user');
  return response.data;
};

export const updateUserSettings = async (name, email, password) => {
  const response = await api.put('/user-settings', { name, email, password });
  return response.data;
};

export const getHotelDetails = async (hotelId) => {
  try {
    console.log("Fetching hotel details for ID:", hotelId);
    const response = await api.get('/hotel_search', { params: { hotelid: hotelId } });
    console.log("Hotel details:", response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching hotel details:', error);
    throw error;
  }
};

export const getAccountInfo = async () => {
  try {
    const response = await api.get('/account');
    return response.data;
  } catch (error) {
    console.error('Error fetching account information:', error);
    throw error;
  }
};

export const getGovernorateInfo = async (governorate) => {
  try {
    const response = await api.get(`/governorate-info/${governorate}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching governorate info:', error);
    throw error;
  }
};

export const searchHotels = async (query) => {
  try {
    console.log("Searching hotels with query:", query);
    const response = await api.get('/search', { params: { query } });
    console.log("Search results:", response.data);
    return response.data;
  } catch (error) {
    console.error('Error in hotel search:', error);
    throw error;
  }
};

