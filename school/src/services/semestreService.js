import axios from "axios";

const API = "http://localhost:3000/api/semestres";

export const getSemestres = () => axios.get(API);
export const getSemestreById = (id) => axios.get(`${API}/${id}`);
export const createSemestre = (data) => axios.post(API, data);
export const updateSemestre = (id, data) => axios.put(`${API}/${id}`, data);
export const deleteSemestre = (id) => axios.delete(`${API}/${id}`);