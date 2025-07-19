// src/services/bulletinService.js
import axios from 'axios';

// 1️⃣ Configuration d'une instance Axios avec l'URL de base
const api = axios.create({
  baseURL: 'https://school-school-backend.onrender.com', // Adapter selon la config serveur
  headers: {
    'Content-Type': 'application/json'
  },
});

// 2️⃣ Fonction pour récupérer le bulletin d’un élève donné par ID
export const getBulletinSemestres = async (id) => {
  try {
    const response = await api.get(`/bulletins/${id}`);
    return response.data; // contient { notes, rangs, appreciations }
  } catch (error) {
    console.error('Erreur getBulletinSemestres:', error.response?.data || error.message);
    throw error;
  }
};

// 3️⃣ Créer une appréciation
export const createAppreciation = async (eleve_id, semestre_id, appreciation) => {
  try {
    const response = await api.post(`/appreciations`, { eleve_id, semestre_id, appreciation });
    return response.data;
  } catch (error) {
    console.error('Erreur createAppreciation:', error.response?.data || error.message);
    throw error;
  }
};

// 4️⃣ Mettre à jour une appréciation existante
export const updateAppreciation = async (id, appreciation) => {
  try {
    const response = await api.put(`/appreciations/${id}`, { appreciation });
    return response.data;
  } catch (error) {
    console.error('Erreur updateAppreciation:', error.response?.data || error.message);
    throw error;
  }
};
