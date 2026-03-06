"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { User } from "@/types";
import { authService } from "@/services/auth.service";

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = useCallback(async () => {
        try {
            const storedToken = localStorage.getItem("token");
            if (!storedToken) {
                setLoading(false);
                return;
            }
            setToken(storedToken);
            const res = await authService.getMe();
            if (res.success) {
                setUser(res.user);
            }
        } catch {
            localStorage.removeItem("token");
            localStorage.removeItem("refreshtoken");
            setToken(null);
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const login = async (email: string, password: string) => {
        const res = await authService.login(email, password);
        if (res.success && res.data) {
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("refreshtoken", res.data.refreshtoken);
            setToken(res.data.token);
            await fetchUser();
        } else {
            throw new Error(res.message || "Login failed");
        }
    };

    const register = async (name: string, email: string, password: string) => {
        const res = await authService.register(name, email, password);
        if (!res.success) {
            throw new Error(res.message || "Registration failed");
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
        } catch {
            // Ignore errors during logout
        }
        localStorage.removeItem("token");
        localStorage.removeItem("refreshtoken");
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
