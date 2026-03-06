import api from "@/lib/api";
import { ApiResponse, Resume } from "@/types";

export const resumeService = {
    async getResumes() {
        const res = await api.get<ApiResponse<Resume[]>>("/api/resumes");
        return res.data;
    },

    async createResume(title: string, content: string) {
        const res = await api.post<ApiResponse<Resume>>("/api/resumes", {
            title,
            content,
        });
        return res.data;
    },

    async updateResume(id: number, data: { title?: string; content?: string }) {
        const res = await api.put<ApiResponse<Resume[]>>(`/api/resumes/${id}`, data);
        return res.data;
    },

    async deleteResume(id: number) {
        const res = await api.delete<ApiResponse<null>>(`/api/resumes/${id}`);
        return res.data;
    },
};
