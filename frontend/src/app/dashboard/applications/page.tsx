"use client";

import { useState, useEffect } from "react";
import { Application, ApplicationStatus } from "@/types";
import { applicationService } from "@/services/application.service";

const statusOptions = Object.values(ApplicationStatus);

function getStatusBadgeClass(status: string): string {
    switch (status) {
        case "APPLIED": return "badge badge-applied";
        case "INTERVIEW": return "badge badge-interview";
        case "REJECTED": return "badge badge-rejected";
        case "OFFER": return "badge badge-offer";
        case "GHOSTED": return "badge badge-ghosted";
        default: return "badge";
    }
}

export default function ApplicationsPage() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updatingId, setUpdatingId] = useState<number | null>(null);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const res = await applicationService.getApplications();
            setApplications(res.data || []);
        } catch {
            setError("Failed to load applications");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    const handleStatusChange = async (appId: number, newStatus: string) => {
        setUpdatingId(appId);
        try {
            await applicationService.updateApplicationStatus(appId, newStatus);
            fetchApplications();
        } catch {
            setError("Failed to update status");
        } finally {
            setUpdatingId(null);
        }
    };

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">📋 Applications</h1>
                <p className="page-subtitle">Track your internship applications</p>
            </div>

            {error && <div className="alert alert-error">⚠ {error}</div>}

            {loading ? (
                <div className="loading-container"><div className="spinner spinner-lg" /></div>
            ) : applications.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">📋</div>
                    <div className="empty-state-text">No applications yet</div>
                    <div className="empty-state-sub">Apply for jobs to see them here</div>
                </div>
            ) : (
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Job ID</th>
                                <th>Resume ID</th>
                                <th>Status</th>
                                <th>Applied</th>
                                <th>Update Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applications.map((app) => (
                                <tr key={app.id}>
                                    <td style={{ fontWeight: 600 }}>#{app.id}</td>
                                    <td>{app.jobId}</td>
                                    <td>{app.resumeId}</td>
                                    <td>
                                        <span className={getStatusBadgeClass(app.status)}>
                                            {app.status}
                                        </span>
                                    </td>
                                    <td style={{ color: "var(--text-secondary)", fontSize: 13 }}>
                                        {new Date(app.appliedAt).toLocaleDateString()}
                                    </td>
                                    <td>
                                        <select
                                            className="form-input"
                                            style={{ width: "auto", padding: "6px 32px 6px 10px", fontSize: 13 }}
                                            value={app.status}
                                            onChange={(e) => handleStatusChange(app.id, e.target.value)}
                                            disabled={updatingId === app.id}
                                        >
                                            {statusOptions.map((s) => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                        {updatingId === app.id && <span className="spinner" style={{ marginLeft: 8, width: 16, height: 16 }} />}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
