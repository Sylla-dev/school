import axios from "axios";

const API_URL = "https://school-school-backend.onrender.com";

export const getMoyennes = () => axios.get(`${API_URL}/moyennes`);
