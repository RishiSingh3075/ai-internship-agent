"use client";

import { useState, useEffect } from "react";
import { Job, Resume, JobFilters } from "@/types";
import { jobService } from "@/services/job.service";
import { resumeService } from "@/services/resume.service";
import { applicationService } from "@/services/application.service";

export default function JobsPage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filters, setFilters] = useState<JobFilters>({ page: 1, limit: 5 });

    // Apply modal
    const [applyJob, setApplyJob] = useState<Job | null>(null);
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [selectedResume, setSelectedResume] = useState<number | "">("");
    const [applyLoading, setApplyLoading] = useState(false);
    const [applyMsg, setApplyMsg] = useState("");

    const fetchJobs = async () => {
        try {
            setLoading(true);
            setError("");
            const res = await jobService.listJobs(filters);
            setJobs(res.data || []);
        } catch {
            setError("Failed to load jobs");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters.page]);

    const handleSearch = () => {
        setFilters({ ...filters, page: 1 });
        fetchJobs();
    };

    const openApplyModal = async (job: Job) => {
        setApplyJob(job);
        setApplyMsg("");
        setSelectedResume("");
        try {
            const res = await resumeService.getResumes();
            setResumes(res.data || []);
        } catch {
            setResumes([]);
        }
    };

    const handleApply = async () => {
        if (!applyJob || !selectedResume) return;
        setApplyLoading(true);
        setApplyMsg("");
        try {
            const res = await applicationService.applyForJob(applyJob.id, Number(selectedResume));
            if (res.success) {
                setApplyMsg("✓ Applied successfully!");
                setTimeout(() => setApplyJob(null), 1500);
            } else {
                setApplyMsg(res.message || "Failed to apply");
            }
        } catch (err: unknown) {
            const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to apply";
            setApplyMsg(msg);
        } finally {
            setApplyLoading(false);
        }
    };

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">💼 Jobs</h1>
                <p className="page-subtitle">Discover internship opportunities</p>
            </div>

            {/* Filter Bar */}
            <div className="filter-bar">
                <input
                    className="form-input"
                    placeholder="Search keywords..."
                    value={filters.search || ""}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <input
                    className="form-input"
                    placeholder="Location"
                    value={filters.location || ""}
                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <input
                    className="form-input"
                    placeholder="Min salary"
                    type="number"
                    value={filters.salary || ""}
                    onChange={(e) => setFilters({ ...filters, salary: e.target.value })}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <input
                    className="form-input"
                    placeholder="Job type"
                    value={filters.jobType || ""}
                    onChange={(e) => setFilters({ ...filters, jobType: e.target.value })}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <button className="btn btn-primary" onClick={handleSearch}>
                    Search
                </button>
            </div>

            {error && <div className="alert alert-error">⚠ {error}</div>}

            {loading ? (
                <div className="loading-container"><div className="spinner spinner-lg" /></div>
            ) : jobs.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">💼</div>
                    <div className="empty-state-text">No jobs found</div>
                    <div className="empty-state-sub">Try adjusting your search filters</div>
                </div>
            ) : (
                <>
                    <div className="grid-2">
                        {jobs.map((job) => (
                            <div className="card" key={job.id}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                                    <div>
                                        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{job.title}</h3>
                                        <p style={{ color: "var(--accent-primary-hover)", fontSize: 14, fontWeight: 600 }}>{job.company}</p>
                                    </div>
                                    <button className="btn btn-primary btn-sm" onClick={() => openApplyModal(job)}>
                                        Apply
                                    </button>
                                </div>
                                <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 12, fontSize: 13, color: "var(--text-secondary)" }}>
                                    <span>📍 {job.location}</span>
                                    {job.salary && <span>💰 ₹{job.salary.toLocaleString()}</span>}
                                </div>
                                <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.6, maxHeight: 80, overflow: "hidden" }}>
                                    {job.description}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="pagination">
                        <button
                            className="btn btn-secondary btn-sm"
                            disabled={(filters.page || 1) <= 1}
                            onClick={() => setFilters({ ...filters, page: (filters.page || 1) - 1 })}
                        >
                            ← Previous
                        </button>
                        <span className="pagination-info">Page {filters.page || 1}</span>
                        <button
                            className="btn btn-secondary btn-sm"
                            disabled={jobs.length < (filters.limit || 5)}
                            onClick={() => setFilters({ ...filters, page: (filters.page || 1) + 1 })}
                        >
                            Next →
                        </button>
                    </div>
                </>
            )}

            {/* Apply Modal */}
            {applyJob && (
                <div className="modal-overlay" onClick={() => setApplyJob(null)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h2 className="modal-title">Apply for {applyJob.title}</h2>
                        <p style={{ color: "var(--text-secondary)", marginBottom: 4, fontSize: 14 }}>
                            <strong>{applyJob.company}</strong> — {applyJob.location}
                        </p>
                        {applyMsg && (
                            <div className={`alert ${applyMsg.startsWith("✓") ? "alert-success" : "alert-error"}`} style={{ marginTop: 12 }}>
                                {applyMsg}
                            </div>
                        )}
                        <div className="form-group" style={{ marginTop: 16 }}>
                            <label className="form-label">Select Resume</label>
                            {resumes.length === 0 ? (
                                <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
                                    No resumes found. Create one first.
                                </p>
                            ) : (
                                <select
                                    className="form-input"
                                    value={selectedResume}
                                    onChange={(e) => setSelectedResume(Number(e.target.value))}
                                >
                                    <option value="">Choose a resume...</option>
                                    {resumes.map((r) => (
                                        <option key={r.id} value={r.id}>{r.title}</option>
                                    ))}
                                </select>
                            )}
                        </div>
                        <div className="modal-actions">
                            <button className="btn btn-ghost" onClick={() => setApplyJob(null)}>Cancel</button>
                            <button
                                className="btn btn-primary"
                                onClick={handleApply}
                                disabled={!selectedResume || applyLoading}
                            >
                                {applyLoading ? <span className="spinner" /> : "Submit Application"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
