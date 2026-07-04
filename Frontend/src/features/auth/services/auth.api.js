import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
  withCredentials: true,
});

export async function register({ username, email, password }) {
  try {
    const res = await api.post("/api/auth/register", {
      username,
      email,
      password,
    });
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function login({ email, password }) {
  try {
    const res = await api.post("/api/auth/login", {
      email,
      password,
    });
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function logout() {
  try {
    const res = await api.get("/api/auth/logout");
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function getProfile() {
  try {
    const res = await api.get("/api/auth/profile");
    return res.data;
  } catch (error) {
    throw error;
  }
    
}
