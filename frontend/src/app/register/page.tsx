"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);
        try {
            await register(name, email, password);
            setSuccess("Account created! Redirecting to login...");
            setTimeout(() => router.push("/login"), 1500);
        } catch (err: unknown) {
            const msg =
                err instanceof Error
                    ? err.message
                    : (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Registration failed";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1 className="auth-title">Create Account</h1>
                <p className="auth-subtitle">Start your internship journey with AI</p>
                {error && <div className="alert alert-error">⚠ {error}</div>}
                {success && <div className="alert alert-success">✓ {success}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="name">Full Name</label>
                        <input
                            className="form-input"
                            id="name"
                            type="text"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="email">Email</label>
                        <input
                            className="form-input"
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="password">Password</label>
                        <input
                            className="form-input"
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button className="btn btn-primary btn-lg" type="submit" disabled={loading} style={{ width: "100%" }}>
                        {loading ? <span className="spinner" /> : "Create Account"}
                    </button>
                </form>
                <p className="auth-link">
                    Already have an account? <Link href="/login">Sign in</Link>
                </p>
            </div>
        </div>
    );
}
