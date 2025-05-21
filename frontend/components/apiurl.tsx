import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const apiUrl = axios.create({
    baseURL: process.env.API_URL|| "http://localhost:3000",
    withCredentials: true,
  });