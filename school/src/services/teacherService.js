import axios from "axios";

const API_URL = "https://school-school-backend.onrender.com";

// 🔹 Liste des enseignants groupés par spécialité
export const getTeachers = (spécialité) => axios.get(API_URL/enseignants, spécialité);

// 🔹 Liste des enseignants avec leurs matières enseignées
export const getTeachersWithSubjects = (matieres) => axios.get(API_URL/enseignants, matieres);

export const getTeachersGroupedBySubject = (parmatiere) => axios.get(API_URL/enseignants, parmatiere);


export const getTeacherById = (id) => axios.get(`${API_URL}/enseignants/${id}`);
export const createTeacher = (data) => axios.post(API_URL/enseignants, data);
export const updateTeacher = (id, data) => axios.put(`${API_URL}/enseignants/${id}`, data);
export const deleteTeacher = (id) => axios.delete(`${API_URL}/enseignants/${id}`);
