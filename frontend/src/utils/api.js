import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

export const getHotelDetails = async (hotelId) => {
  try {
    console.log("Fetching hotel details for ID:", hotelId);
    const response = await axios.get(`${API_BASE_URL}/hotel_search`, { params: { hotelid: hotelId } });
    console.log("Hotel details:", response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching hotel details:', error);
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

export const getGovernorateInfo = async (governorate) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/governorate-info/${governorate}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching governorate info:', error);
    throw error;
  }
};

export const searchHotels = async (query) => {
  try {
    console.log("Searching hotels with query:", query);
    const response = await axios.get(`${API_BASE_URL}/search`, { params: { query } });
    console.log("Search results:", response.data);
    return response.data;
  } catch (error) {
    console.error('Error in hotel search:', error);
    throw error;
  }
};

