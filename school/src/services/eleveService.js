import axios from "axios";

const API = "https://school-school-backend.onrender.com";

export const getEleves = () => axios.get(API/eleves);

export const getEleveById = (id) => axios.get(`${API}/eleves/${id}`);

// ⚠️ Detecte si le data est un FormData ou non
export const createEleve = (data) => {
    if (data instanceof FormData) {
        return axios.post(API/eleves, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }
    return axios.post(API, data); // fallback (non utilisé normalement ici)
};

export const updateEleve = (id, data) => {
    if (data instanceof FormData) {
        return axios.put(`${API}/eleves/${id}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }
    return axios.put(`${API}/eleves/${id}`, data); // fallback (non utilisé normalement ici)
};

export const deleteEleve = (id) => axios.delete(`${API}/eleves/${id}`);
