import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // adjust to your backend
  withCredentials: true,
});

// Prompts API
export const fetchPrompts = (params) => API.get("/prompts", { params });
export const createPrompt = (data) => API.post("/prompts", data);
export const deletePrompt = (id) => API.delete(`/prompts/${id}`);
export const updatePrompt = (id, data) => API.put(`/prompts/${id}`, data);
export const sharePrompt = (id, data) => API.post(`/prompts/${id}/share`, data);
export const togglePublic = (id) => API.patch(`/prompts/${id}/toggle-public`);
export const toggleFavorite = (id) => API.patch(`/prompts/${id}/toggle-favorite`);
