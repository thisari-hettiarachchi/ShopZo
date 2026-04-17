import axios from "axios";
import { CLIENT_API_BASE_URL } from "./base";


const API = axios.create({
  baseURL: `${CLIENT_API_BASE_URL}/categories`,
});

export const getCategories = () => API.get("/");
