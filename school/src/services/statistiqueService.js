import axios from "axios";

const API_URL = "http://localhost:3000/api/statistiques";

export const getMoyennes = () => axios.get(`${API_URL}/moyennes`);