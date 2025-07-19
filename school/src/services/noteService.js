import axios from "axios";

const API = "https://school-school-backend.onrender.com";

export const getNotes = () => axios.get(API);
export const createNote = (data) => axios.post(API, data);
export const updateNote = (id, data) => axios.put(`${API}/${id}`, data);
export const deleteNote = (id) => axios.delete(`${API}/${id}`);
