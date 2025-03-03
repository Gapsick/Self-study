import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const googleLogin = async (token) => {
  return await axios.post(`${API_URL}/auth/google-login`, { token });
};

export const signup = async (userData) => {
  return await axios.post(`${API_URL}/signup`, userData);
};
