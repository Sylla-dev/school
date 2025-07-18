import axios from "axios";

const API_URL = "http://localhost:3000/api/enseignants";

// 🔹 Liste des enseignants groupés par spécialité
export const getTeachers = (spécialité) => axios.get(API_URL, spécialité);

// 🔹 Liste des enseignants avec leurs matières enseignées
export const getTeachersWithSubjects = (matieres) => axios.get(API_URL, matieres);

export const getTeachersGroupedBySubject = (parmatiere) => axios.get(API_URL, parmatiere);


export const getTeacherById = (id) => axios.get(`${API_URL}/${id}`);
export const createTeacher = (data) => axios.post(API_URL, data);
export const updateTeacher = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const deleteTeacher = (id) => axios.delete(`${API_URL}/${id}`);
