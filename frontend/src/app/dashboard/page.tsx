"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { resumeService } from "@/services/resume.service";
import { applicationService } from "@/services/application.service";
import Link from "next/link";

export default function DashboardPage() {
    const { user } = useAuth();
    const [resumeCount, setResumeCount] = useState(0);
    const [appCount, setAppCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [resumes, apps] = await Promise.all([
                    resumeService.getResumes(),
                    applicationService.getApplications(),
                ]);
                setResumeCount(resumes.data?.length || 0);
                setAppCount(apps.data?.length || 0);
            } catch {
                // silently fail stats
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">
                    Welcome back, {user?.name || "User"} 👋
                </h1>
                <p className="page-subtitle">
                    Here&apos;s an overview of your internship journey
                </p>
            </div>

            {loading ? (
                <div className="loading-container"><div className="spinner spinner-lg" /></div>
            ) : (
                <>
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-label">Resumes</div>
                            <div className="stat-value">{resumeCount}</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-label">Applications</div>
                            <div className="stat-value">{appCount}</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-label">AI Tools</div>
                            <div className="stat-value">3</div>
                        </div>
                    </div>

                    <div className="grid-3">
                        <Link href="/dashboard/resumes" style={{ textDecoration: "none" }}>
                            <div className="card">
                                <div style={{ fontSize: 32, marginBottom: 12 }}>📄</div>
                                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>Resumes</h3>
                                <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
                                    Create, edit, and manage your resumes
                                </p>
                            </div>
                        </Link>
                        <Link href="/dashboard/jobs" style={{ textDecoration: "none" }}>
                            <div className="card">
                                <div style={{ fontSize: 32, marginBottom: 12 }}>💼</div>
                                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>Jobs</h3>
                                <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
                                    Discover and search for internship opportunities
                                </p>
                            </div>
                        </Link>
                        <Link href="/dashboard/applications" style={{ textDecoration: "none" }}>
                            <div className="card">
                                <div style={{ fontSize: 32, marginBottom: 12 }}>📋</div>
                                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>Applications</h3>
                                <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
                                    Track the status of your applications
                                </p>
                            </div>
                        </Link>
                        <Link href="/dashboard/ai" style={{ textDecoration: "none" }}>
                            <div className="card">
                                <div style={{ fontSize: 32, marginBottom: 12 }}>🤖</div>
                                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>AI Tools</h3>
                                <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
                                    Parse resumes, match jobs, generate cover letters
                                </p>
                            </div>
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
}
