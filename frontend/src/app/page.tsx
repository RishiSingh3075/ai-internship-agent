"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { user, loading } = useAuth();

  return (
    <div className="landing-hero">
      <h1 className="landing-title">
        Your AI-Powered<br />
        <span>Internship Assistant</span>
      </h1>
      <p className="landing-desc">
        Discover internships, manage your resumes, track applications, and leverage AI
        to match you with the perfect opportunities.
      </p>
      <div className="landing-actions">
        {loading ? (
          <div className="spinner" />
        ) : user ? (
          <Link href="/dashboard" className="btn btn-primary btn-lg">
            Go to Dashboard →
          </Link>
        ) : (
          <>
            <Link href="/login" className="btn btn-primary btn-lg">
              Sign In
            </Link>
            <Link href="/register" className="btn btn-ghost btn-lg">
              Create Account
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
