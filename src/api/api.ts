import axios from "axios";

const api = axios.create({
  baseURL:
    process.env.KAMELEON_API || "https://api.newkameleondev.bluepanda.pt/",
});

export default api;
