"use client";

import { useState, useEffect } from "react";
import { Resume, ParsedResume, JobMatch, Job } from "@/types";
import { resumeService } from "@/services/resume.service";
import { aiService } from "@/services/ai.service";
import { jobService } from "@/services/job.service";

export default function AIPage() {
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [jobs, setJobs] = useState<Job[]>([]);
    const [selectedResume, setSelectedResume] = useState<number | "">("");
    const [selectedJob, setSelectedJob] = useState<number | "">("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Parse Resume
    const [parsedResume, setParsedResume] = useState<ParsedResume | null>(null);
    const [parseLoading, setParseLoading] = useState(false);

    // Match Jobs
    const [jobMatches, setJobMatches] = useState<JobMatch[]>([]);
    const [matchLoading, setMatchLoading] = useState(false);

    // Cover Letter
    const [coverLetter, setCoverLetter] = useState("");
    const [coverLoading, setCoverLoading] = useState(false);

    // Active tab
    const [activeTab, setActiveTab] = useState<"parse" | "match" | "cover">("parse");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [resumeRes, jobRes] = await Promise.all([
                    resumeService.getResumes(),
                    jobService.listJobs()
                ]);
                setResumes(resumeRes.data || []);
                setJobs(jobRes.data || []);
            } catch {
                setError("Failed to load data");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleParseResume = async () => {
        if (!selectedResume) return;
        setParseLoading(true);
        setError("");
        setParsedResume(null);
        try {
            const res = await aiService.parseResume(Number(selectedResume));
            if (res.success) {
                setParsedResume(res.data);
            } else {
                setError(res.message);
            }
        } catch {
            setError("AI parsing failed. AI service error. Please try again..");
        } finally {
            setParseLoading(false);
        }
    };

    const handleMatchJobs = async () => {
        if (!selectedResume) return;
        setMatchLoading(true);
        setError("");
        setJobMatches([]);
        try {
            const res = await aiService.matchJobs(Number(selectedResume));
            if (res.success) {
                setJobMatches(res.data || []);
            } else {
                setError(res.message);
            }
        } catch {
            setError("Job matching failed. AI service error. Please try again..");
        } finally {
            setMatchLoading(false);
        }
    };

    const handleGenerateCoverLetter = async () => {
        if (!selectedResume || !selectedJob) return;
        setCoverLoading(true);
        setError("");
        setCoverLetter("");
        try {
            const res = await aiService.generateCoverLetter(Number(selectedResume), Number(selectedJob));
            if (res.success) {
                setCoverLetter(typeof res.data === "string" ? res.data : JSON.stringify(res.data));
            } else {
                setError(res.message);
            }
        } catch {
            setError("Cover letter generation failed. AI service error. Please try again..");
        } finally {
            setCoverLoading(false);
        }
    };

    const getScoreClass = (score: number) => {
        if (score >= 70) return "high";
        if (score >= 40) return "medium";
        return "low";
    };

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">🤖 AI Tools</h1>
                <p className="page-subtitle">Leverage AI to enhance your job search</p>
            </div>

            {error && <div className="alert alert-error">⚠ {error}</div>}

            {/* Resume Selector */}
            <div className="card" style={{ marginBottom: 24 }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Select Resume</label>
                    {loading ? (
                        <div className="spinner" />
                    ) : resumes.length === 0 ? (
                        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>No resumes found. Create one first.</p>
                    ) : (
                        <select
                            className="form-input"
                            value={selectedResume}
                            onChange={(e) => setSelectedResume(Number(e.target.value))}
                            style={{ maxWidth: 400 }}
                        >
                            <option value="">Choose a resume...</option>
                            {resumes.map((r) => (
                                <option key={r.id} value={r.id}>{r.title}</option>
                            ))}
                        </select>
                    )}
                </div>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", gap: 4, marginBottom: 24 }}>
                <button
                    className={`btn ${activeTab === "parse" ? "btn-primary" : "btn-ghost"}`}
                    onClick={() => setActiveTab("parse")}
                >
                    🔍 Parse Resume
                </button>
                <button
                    className={`btn ${activeTab === "match" ? "btn-primary" : "btn-ghost"}`}
                    onClick={() => setActiveTab("match")}
                >
                    🎯 Match Jobs
                </button>
                <button
                    className={`btn ${activeTab === "cover" ? "btn-primary" : "btn-ghost"}`}
                    onClick={() => setActiveTab("cover")}
                >
                    ✉️ Cover Letter
                </button>
            </div>

            {/* Parse Resume Tab */}
            {activeTab === "parse" && (
                <div className="card">
                    <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Parse Resume</h3>
                    <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 20 }}>
                        Extract skills, positions, and preferred roles from your resume using AI.
                    </p>
                    <button
                        className="btn btn-primary"
                        onClick={handleParseResume}
                        disabled={!selectedResume || parseLoading}
                        style={{ marginBottom: 20 }}
                    >
                        {parseLoading ? <><span className="spinner" /> Analyzing...</> : "Parse Resume"}
                    </button>

                    {parsedResume && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                            <div>
                                <h4 style={{ fontSize: 14, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                    Skills
                                </h4>
                                <div className="skill-tags">
                                    {parsedResume.skills?.map((skill, i) => (
                                        <span className="skill-tag" key={i}>{skill}</span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h4 style={{ fontSize: 14, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                    Position
                                </h4>
                                <div className="skill-tags">
                                    {parsedResume.position?.map((pos, i) => (
                                        <span className="skill-tag" key={i}>{pos}</span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h4 style={{ fontSize: 14, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                    Preferred Roles
                                </h4>
                                <div className="skill-tags">
                                    {parsedResume.preferred_roles?.map((role, i) => (
                                        <span className="skill-tag" key={i}>{role}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Match Jobs Tab */}
            {activeTab === "match" && (
                <div className="card">
                    <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Match Jobs</h3>
                    <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 20 }}>
                        Find jobs that match your skills. Jobs are ranked by match score.
                    </p>
                    <button
                        className="btn btn-primary"
                        onClick={handleMatchJobs}
                        disabled={!selectedResume || matchLoading}
                        style={{ marginBottom: 20 }}
                    >
                        {matchLoading ? <><span className="spinner" /> Matching...</> : "Find Matching Jobs"}
                    </button>

                    {jobMatches.length > 0 && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            {jobMatches.map((match) => (
                                <div key={match.jobId} className="card" style={{ background: "var(--bg-input)" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
                                        <div className={`match-score ${getScoreClass(match.matchScore)}`}>
                                            {match.matchScore}%
                                        </div>
                                        <div>
                                            <h4 style={{ fontSize: 16, fontWeight: 700 }}>{match.title}</h4>
                                            <p style={{ fontSize: 13, color: "var(--text-muted)" }}>Job #{match.jobId}</p>
                                        </div>
                                    </div>
                                    {match.matchedSkills.length > 0 && (
                                        <div style={{ marginBottom: 8 }}>
                                            <span style={{ fontSize: 12, color: "var(--text-muted)", marginRight: 8 }}>Matched:</span>
                                            <span className="skill-tags" style={{ display: "inline-flex" }}>
                                                {match.matchedSkills.map((s, i) => (
                                                    <span className="skill-tag matched" key={i}>{s}</span>
                                                ))}
                                            </span>
                                        </div>
                                    )}
                                    {match.missingSkills.length > 0 && (
                                        <div>
                                            <span style={{ fontSize: 12, color: "var(--text-muted)", marginRight: 8 }}>Missing:</span>
                                            <span className="skill-tags" style={{ display: "inline-flex" }}>
                                                {match.missingSkills.map((s, i) => (
                                                    <span className="skill-tag missing" key={i}>{s}</span>
                                                ))}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Cover Letter Tab */}
            {activeTab === "cover" && (
                <div className="card">
                    <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Generate Cover Letter</h3>
                    <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 20 }}>
                        Generate a tailored cover letter based on your resume and a job posting.
                    </p>

                    <div className="form-group" style={{ marginBottom: 20 }}>
                        <label className="form-label">Select Job Posting</label>
                        {loading ? (
                            <div className="spinner" />
                        ) : jobs.length === 0 ? (
                            <p style={{ color: "var(--text-muted)", fontSize: 14 }}>No jobs found.</p>
                        ) : (
                            <select
                                className="form-input"
                                value={selectedJob}
                                onChange={(e) => setSelectedJob(Number(e.target.value))}
                                style={{ maxWidth: 400 }}
                            >
                                <option value="">Choose a job...</option>
                                {jobs.map((j) => (
                                    <option key={j.id} value={j.id}>{j.company} - {j.title}</option>
                                ))}
                            </select>
                        )}
                    </div>

                    <button
                        className="btn btn-primary"
                        onClick={handleGenerateCoverLetter}
                        disabled={!selectedResume || !selectedJob || coverLoading}
                        style={{ marginBottom: 20 }}
                    >
                        {coverLoading ? <><span className="spinner" /> Generating...</> : "Generate Cover Letter"}
                    </button>

                    {coverLetter && (
                        <div className="cover-letter-box">{coverLetter}</div>
                    )}
                </div>
            )}
        </div>
    );
}
