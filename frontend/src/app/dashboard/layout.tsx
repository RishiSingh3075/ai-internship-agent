"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";

const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/dashboard/resumes", label: "Resumes", icon: "📄" },
    { href: "/dashboard/jobs", label: "Jobs", icon: "💼" },
    { href: "/dashboard/applications", label: "Applications", icon: "📋" },
    { href: "/dashboard/ai", label: "AI Tools", icon: "🤖" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user, loading, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [loading, user, router]);

    if (loading) {
        return (
            <div className="loading-container" style={{ minHeight: "100vh" }}>
                <div className="spinner spinner-lg" />
            </div>
        );
    }

    if (!user) return null;

    const handleLogout = async () => {
        await logout();
        router.push("/login");
    };

    return (
        <div>
            <nav className="navbar">
                <div className="navbar-inner">
                    <Link href="/dashboard" className="navbar-brand">InternAI</Link>
                    <div className="navbar-links">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`navbar-link ${pathname === link.href ? "active" : ""}`}
                            >
                                <span style={{ marginRight: 6 }}>{link.icon}</span>
                                {link.label}
                            </Link>
                        ))}
                    </div>
                    <div className="navbar-user">
                        <div className="navbar-avatar">{user.name ? user.name.charAt(0).toUpperCase() : "U"}</div>
                        <span style={{ fontSize: 14, color: "var(--text-secondary)" }}>{user.name || "User"}</span>
                        <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                </div>
            </nav>
            <main className="container" style={{ paddingTop: 8, paddingBottom: 48 }}>
                {children}
            </main>
        </div>
    );
}
