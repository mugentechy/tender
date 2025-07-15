import axios from "axios";

// Set base URL for axios
const BASE_URL = "https://tender-sgqr.onrender.com/api";

// Get token from localStorage
const getToken = () => localStorage.getItem("token");


// Axios config
const axiosConfig = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
    "Content-Type": "application/json",
  },
});

// Get My Details
const GetMyDetails = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/user/my-details`, axiosConfig());
    return response.data?.user || null;
  } catch (error) {
    console.error("Error fetching my details:", error);
    return null;
  }
};

// Get User Details by ID
const GetUserDetails = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/user/user-details/${userId}`, axiosConfig());
    return response.data?.message || null;
  } catch (error) {
    console.error("Error fetching user details:", error);
    return null;
  }
};

// Get Vendors
const GetVendors = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/user/getvendors`, axiosConfig());
    console.log(response)
    return response.data?.message || [];
  } catch (error) {
    console.error("Error fetching vendors:", error);
    return [];
  }
};

// Get Companies
const GetCompanies = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/user/getcompany`, axiosConfig());
    return response.data?.message || [];
  } catch (error) {
    console.error("Error fetching companies:", error);
    return [];
  }
};



export { GetMyDetails, GetUserDetails, GetVendors, GetCompanies };
