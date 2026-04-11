import api from "@/lib/api";
import { ApiResponse, Job, JobFilters } from "@/types";
//commit using vscode   terminal
export const jobService = {
    async listJobs(filters: JobFilters = {}) {
        const params = new URLSearchParams();
        if (filters.search) params.set("search", filters.search);
        if (filters.location) params.set("location", filters.location);
        if (filters.salary) params.set("salary", filters.salary);
        if (filters.jobType) params.set("jobType", filters.jobType);
        if (filters.page) params.set("page", String(filters.page));
        if (filters.limit) params.set("limit", String(filters.limit));

        const res = await api.post<ApiResponse<Job[]>>(
            `/api/jobs?${params.toString()}`
        );
        return res.data;
    },
};
