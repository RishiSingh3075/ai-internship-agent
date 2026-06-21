import api from "@/lib/api";
import { ApiResponse, ParsedResume, JobMatch, SemanticJobMatch } from "@/types";

export const aiService = {
    async testConnection() {
        const res = await api.get<ApiResponse<{ status: string }>>("/api/ai/test");
        return res.data;
    },

    async parseResume(resumeId: number) {
        const res = await api.post<ApiResponse<ParsedResume>>("/api/ai", {
            resumeId,
        });
        return res.data;
    },

    async matchJobs(resumeId: number) {
        const res = await api.post<ApiResponse<JobMatch[]>>("/api/ai/match-jobs", {
            resumeId,
        });
        return res.data;
    },

    async semanticMatchJobs(resumeId: number, minSimilarity?: number) {
        const res = await api.post<ApiResponse<SemanticJobMatch[]>>("/api/ai/semanticmatchjobs", {
            resumeId,
            ...(minSimilarity !== undefined && { minSimilarity }),
        });
        return res.data;
    },

    async generateCoverLetter(resumeId: number, jobId: number) {
        const res = await api.post<ApiResponse<string>>(
            "/api/ai/generate-cover-letter",
            { resumeId, jobId }
        );
        return res.data;
    },
};

