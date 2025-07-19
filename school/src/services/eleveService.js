import axios from "axios";

const API = "https://school-school-backend.onrender.com";

export const getEleves = () => axios.get(API);

export const getEleveById = (id) => axios.get(`${API}/${id}`);

// ⚠️ Detecte si le data est un FormData ou non
export const createEleve = (data) => {
    if (data instanceof FormData) {
        return axios.post(API, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }
    return axios.post(API, data); // fallback (non utilisé normalement ici)
};

export const updateEleve = (id, data) => {
    if (data instanceof FormData) {
        return axios.put(`${API}/${id}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }
    return axios.put(`${API}/${id}`, data); // fallback (non utilisé normalement ici)
};

export const deleteEleve = (id) => axios.delete(`${API}/${id}`);
