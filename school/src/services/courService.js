import axios from "axios";

const API_URL = "https://school-school-backend.onrender.com";

export const getCoursGrouped = () => {
  return axios.get('API_URL/grouped-by-niveau');
};


export const getCoursPaged = (params) => axios.get(API_URL, params);


export const getClasses = () => axios.get('https://school-school-backend.onrender.com'); // Pour le menu déroulant

export const getCours = () => axios.get(API_URL);
export const createCour = (data) => axios.post(API_URL, data);
export const deleteCours = (id) => axios.delete(`${API_URL}/${id}`);
