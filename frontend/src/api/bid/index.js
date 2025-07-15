import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const AuthAPI = () => {
  if (typeof window !== "undefined") {
    return axios.create({
      baseURL: `http://localhost:5000/api`,
      headers: {
        authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });
  } else {
    return axios.create({
      baseURL: `http://localhost:5000/api`,
      headers: {
        authorization: `Bearer`,
        "Content-Type": "application/json",
      },
    });
  }
};

const createbid = async (amount, tenderId) => {
  const { data } = await AuthAPI().post(`/user/createbid/${tenderId}`, {
    amount,
  });
  return data;
};
const deletebid = async (bidId) => {
  const { data } = await AuthAPI().delete(`/user/deletebid/${bidId}`);
  return data;
};

const acceptBid = async (bidId) => {
  const { data } = await AuthAPI().put(`/user/acceptbid/${bidId}`);
  return data;
};

const rejectBid = async (bidId) => {
  const { data } = await AuthAPI().put(`/user/rejectbid/${bidId}`);
  return data;
};
const getallbids = async (tenderId) => {
  try {
    const { data } = await AuthAPI().get(`/user/getallbids/${tenderId}`);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getallbidsquery = (tenderId) =>
  useQuery({
    queryKey: ["getallbids", tenderId],
    queryFn: () => getallbids(tenderId),
    select: (data) => {
      return data.data;
    },
  });
export { getallbidsquery, createbid, deletebid, acceptBid, rejectBid };
