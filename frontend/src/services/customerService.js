import axios from "axios";

const api = axios.create({
  // Point explicitly to the Django backend API during local development
  baseURL: "http://localhost:8000/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

const unwrapApiResponse = (payload) => {
  if (payload == null) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.results)) return payload.results;
  if (Array.isArray(payload?.data?.results)) return payload.data.results;
  if (payload.data !== undefined && payload.results === undefined) {
    return payload.data;
  }
  return payload;
};

const getResponseData = (response) => {
  return unwrapApiResponse(response?.data ?? response);
};

// ===================== Customers =====================

export const fetchCustomers = async () => {
  const response = await api.get("customers/");
  return getResponseData(response);
};

export const createCustomer = async (payload) => {
  const response = await api.post("customers/", payload);
  return getResponseData(response);
};

export const updateCustomer = async (id, payload) => {
  const response = await api.put(`customers/${id}/`, payload);
  return getResponseData(response);
};

export const deleteCustomer = async (id) => {
  return await api.delete(`customers/${id}/`);
};

export default api;