"use client";

import { useState, useEffect, FormEvent } from "react";
import { Resume } from "@/types";
import { resumeService } from "@/services/resume.service";

export default function ResumesPage() {
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showCreate, setShowCreate] = useState(false);
    const [editResume, setEditResume] = useState<Resume | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    // Create form
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const fetchResumes = async () => {
        try {
            setLoading(true);
            const res = await resumeService.getResumes();
            setResumes(res.data || []);
        } catch {
            setError("Failed to load resumes");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResumes();
    }, []);

    const handleCreate = async (e: FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) return;
        setSubmitting(true);
        try {
            await resumeService.createResume(title, content);
            setTitle("");
            setContent("");
            setShowCreate(false);
            fetchResumes();
        } catch {
            setError("Failed to create resume");
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdate = async (e: FormEvent) => {
        e.preventDefault();
        if (!editResume) return;
        setSubmitting(true);
        try {
            await resumeService.updateResume(editResume.id, {
                title: editResume.title,
                content: editResume.content,
            });
            setEditResume(null);
            fetchResumes();
        } catch {
            setError("Failed to update resume");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (deleteId === null) return;
        setSubmitting(true);
        try {
            await resumeService.deleteResume(deleteId);
            setDeleteId(null);
            fetchResumes();
        } catch {
            setError("Failed to delete resume");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div>
            <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                    <h1 className="page-title">📄 Resumes</h1>
                    <p className="page-subtitle">Manage your resumes for applications</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
                    + New Resume
                </button>
            </div>

            {error && <div className="alert alert-error">⚠ {error}</div>}

            {loading ? (
                <div className="loading-container"><div className="spinner spinner-lg" /></div>
            ) : resumes.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">📄</div>
                    <div className="empty-state-text">No resumes yet</div>
                    <div className="empty-state-sub">Create your first resume to start applying</div>
                </div>
            ) : (
                <div className="grid-2">
                    {resumes.map((resume) => (
                        <div className="card" key={resume.id}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                                <h3 style={{ fontSize: 18, fontWeight: 700 }}>{resume.title}</h3>
                                <div style={{ display: "flex", gap: 8 }}>
                                    <button className="btn btn-secondary btn-sm" onClick={() => setEditResume({ ...resume })}>
                                        Edit
                                    </button>
                                    <button className="btn btn-danger btn-sm" onClick={() => setDeleteId(resume.id)}>
                                        Delete
                                    </button>
                                </div>
                            </div>
                            <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 12, whiteSpace: "pre-wrap", maxHeight: 120, overflow: "hidden" }}>
                                {resume.content}
                            </p>
                            {resume.parseSkills && resume.parseSkills.length > 0 && (
                                <div className="skill-tags">
                                    {resume.parseSkills.map((skill, i) => (
                                        <span className="skill-tag" key={i}>{skill}</span>
                                    ))}
                                </div>
                            )}
                            <div style={{ marginTop: 12, fontSize: 12, color: "var(--text-muted)" }}>
                                Created {new Date(resume.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Modal */}
            {showCreate && (
                <div className="modal-overlay" onClick={() => setShowCreate(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h2 className="modal-title">Create Resume</h2>
                        <form onSubmit={handleCreate}>
                            <div className="form-group">
                                <label className="form-label">Title</label>
                                <input
                                    className="form-input"
                                    placeholder="e.g. Full Stack Developer"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Content</label>
                                <textarea
                                    className="form-input"
                                    placeholder="Paste your resume content here..."
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    required
                                    style={{ minHeight: 200 }}
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-ghost" onClick={() => setShowCreate(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={submitting}>
                                    {submitting ? <span className="spinner" /> : "Create"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {editResume && (
                <div className="modal-overlay" onClick={() => setEditResume(null)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h2 className="modal-title">Edit Resume</h2>
                        <form onSubmit={handleUpdate}>
                            <div className="form-group">
                                <label className="form-label">Title</label>
                                <input
                                    className="form-input"
                                    value={editResume.title}
                                    onChange={(e) => setEditResume({ ...editResume, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Content</label>
                                <textarea
                                    className="form-input"
                                    value={editResume.content}
                                    onChange={(e) => setEditResume({ ...editResume, content: e.target.value })}
                                    required
                                    style={{ minHeight: 200 }}
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-ghost" onClick={() => setEditResume(null)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={submitting}>
                                    {submitting ? <span className="spinner" /> : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            {deleteId !== null && (
                <div className="modal-overlay" onClick={() => setDeleteId(null)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h2 className="modal-title">Delete Resume</h2>
                        <p style={{ color: "var(--text-secondary)", marginBottom: 8 }}>
                            Are you sure you want to delete this resume? This action cannot be undone.
                        </p>
                        <div className="modal-actions">
                            <button className="btn btn-ghost" onClick={() => setDeleteId(null)}>Cancel</button>
                            <button className="btn btn-danger" onClick={handleDelete} disabled={submitting}>
                                {submitting ? <span className="spinner" /> : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
