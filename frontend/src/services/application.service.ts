import api from "@/lib/api";
import { ApiResponse, Application } from "@/types";

export const applicationService = {
    async getApplications() {
        const res = await api.get<ApiResponse<Application[]>>("/api/application");
        return res.data;
    },

    async applyForJob(jobId: number, resumeId: number) {
        const res = await api.post<ApiResponse<Application>>("/api/application", {
            jobId,
            resumeId,
        });
        return res.data;
    },

    async updateApplicationStatus(id: number, status: string) {
        const res = await api.patch<ApiResponse<Application>>(
            `/api/application/${id}`,
            { status }
        );
        return res.data;
    },
};
