import axios from "axios";

const API = "https://school-school-backend.onrender.com";

export const getSemestres = () => axios.get(API/notes);
export const getSemestreById = (id) => axios.get(`${API}/notes/${id}`);
export const createSemestre = (data) => axios.post(API/notes, data);
export const updateSemestre = (id, data) => axios.put(`${API}/notes/${id}`, data);
export const deleteSemestre = (id) => axios.delete(`${API}/notes/${id}`);
