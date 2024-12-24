import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

export const searchHotels = async (query) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/search`, { params: { query } });
    return response.data;
  } catch (error) {
    console.error('Error in hotel search:', error);
    throw error;
  }
};

export const getHotelDetails = async (hotelId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/hotel_search`, { params: { hotelid: hotelId } });
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

