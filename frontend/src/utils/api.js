import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

export const citySearch = async (params) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/city_search`, { params });
    return response.data;
  } catch (error) {
    console.error('Error in city search:', error);
    throw error;
  }
};

export const hotelSearch = async (params) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/hotel_search`, { params });
    return response.data;
  } catch (error) {
    console.error('Error in hotel search:', error);
    throw error;
  }
};

export const bookingSearch = async (params) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/booking_search`, { params });
    return response.data;
  } catch (error) {
    console.error('Error in booking search:', error);
    throw error;
  }
};

export const searchMapping = async (name) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/mapping`, { params: { name } });
    return response.data;
  } catch (error) {
    console.error('Error in mapping search:', error);
    throw error;
  }
};

export const getAccountInfo = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/account`);
    return response.data;
  } catch (error) {
    console.error('Error fetching account information:', error);
    throw error;
  }
};

