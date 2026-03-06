import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
    headers: {
        "Content-Type": "application/json",
    },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

// Handle 401 responses by redirecting to login
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (
            error.response?.status === 401 &&
            typeof window !== "undefined" &&
            !window.location.pathname.includes("/login")
        ) {
            localStorage.removeItem("token");
            localStorage.removeItem("refreshtoken");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default api;
