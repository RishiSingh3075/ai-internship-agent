import api from "@/lib/api";
import { ApiResponse, LoginResponse, RegisterResponse, User } from "@/types";

export const authService = {
    async register(name: string, email: string, password: string) {
        const res = await api.post<ApiResponse<RegisterResponse>>(
            "/api/auth/register",
            { name, email, password }
        );
        return res.data;
    },

    async login(email: string, password: string) {
        const res = await api.post<ApiResponse<LoginResponse>>(
            "/api/auth/login",
            { email, password }
        );
        return res.data;
    },

    async logout() {
        const res = await api.post<ApiResponse<null>>("/api/auth/logout");
        return res.data;
    },

    async getMe() {
        const res = await api.get<{ success: boolean; user: User }>("/api/auth/me");
        return res.data;
    },

    async refreshToken(refreshtoken: string) {
        const res = await api.post<ApiResponse<{ token: string }>>(
            "/api/auth/token",
            { refreshtoken }
        );
        return res.data;
    },
};
