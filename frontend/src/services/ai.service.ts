import api from "@/lib/api";
import { ApiResponse, ParsedResume, JobMatch } from "@/types";

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

    async generateCoverLetter(resumeId: number) {
        const res = await api.post<ApiResponse<string>>(
            "/api/ai/generate-cover-letter",
            { resumeId }
        );
        return res.data;
    },
};
