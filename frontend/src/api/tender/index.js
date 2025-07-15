import axios from "axios";

const BASE_URL = "https://tender-sgqr.onrender.com/api";


const getToken = () => localStorage.getItem("token");


const createTender = async (tenderInfo) => {
  const { data } = await axios.post(`${BASE_URL}/user/createtender`, tenderInfo, {
  headers: {
    Authorization: `Bearer ${getToken()}`,
    "Content-Type": "application/json",
  },
  });
  return data;
};

const updateTender = async (tenderId, tenderInfo) => {
  const { data } = await axios.put(`${BASE_URL}/user/updatetender?id=${tenderId}`, tenderInfo, {
  headers: {
    Authorization: `Bearer ${getToken()}`,
    "Content-Type": "application/json",
  },
  });
  return data;
};

const reviewTender = async (tenderId, rating) => {
  const { data } = await axios.put(`${BASE_URL}/user/reviewtender?id=${tenderId}`, rating, {
  headers: {
    Authorization: `Bearer ${getToken()}`,
    "Content-Type": "application/json",
  },
  });
  return data;
};

const deleteTender = async (tenderId) => {
  const { data } = await axios.delete(`${BASE_URL}/user/deletetender?id=${tenderId}`, {
  headers: {
    Authorization: `Bearer ${getToken()}`,
    "Content-Type": "application/json",
  },
  });
  return data;
};

const getMyTendersQuery = async () => {
  const { data } = await axios.get(`${BASE_URL}/user/getmytender`, {
  headers: {
    Authorization: `Bearer ${getToken()}`,
    "Content-Type": "application/json",
  },
  });
  return data;
};

const getalltenderquery = async () => {
  const { data } = await axios.get(`${BASE_URL}/user/getalltender`, {
  headers: {
    Authorization: `Bearer ${getToken()}`,
    "Content-Type": "application/json",
  },
  });
  return data;
};

const tenderdetailsquery = async (tenderId) => {
  const { data } = await axios.get(`${BASE_URL}/user/tenderdetails/${tenderId}`, {
  headers: {
    Authorization: `Bearer ${getToken()}`,
    "Content-Type": "application/json",
  },
  });

  return data;
};

const searchTendersQuery = async (searchQuery) => {
  const { data } = await axios.get(`${BASE_URL}/user/searchtender?name=${searchQuery}`, {
  headers: {
    Authorization: `Bearer ${getToken()}`,
    "Content-Type": "application/json",
  },
  });
  return data;
};

const getallcategoryquery = async () => {
  const { data } = await axios.get(`${BASE_URL}/user/getcategory`, {
  headers: {
    Authorization: `Bearer ${getToken()}`,
    "Content-Type": "application/json",
  },
  });
  return data;
};

export {
  createTender,
  updateTender,
  reviewTender,
  deleteTender,
  getalltenderquery,
  getMyTendersQuery,
  tenderdetailsquery,
  searchTendersQuery,
  getallcategoryquery,
};
