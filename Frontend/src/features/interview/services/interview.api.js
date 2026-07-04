import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
  withCredentials: true,
});

/**
 * @description Generates an interview report based on the provided self-description, resume file, and job description.
 */
export const generateInterviewReport = async ({
  selfDescription,
  resumeFile,
  jobDescription,
}) => {
  const formData = new FormData();

  formData.append("selfDescription", selfDescription);
  formData.append("resume", resumeFile);
  formData.append("jobDescription", jobDescription);
  try {
    const response = await api.post("/api/interview", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * @description Retrieves an interview report by its ID.
 */
export const getInterviewReportById = async (interviewId) => {
  const response = await api.get(`/api/interview/report/${interviewId}`);
  return response.data;
};

/**
 * @description Retrieves all interview reports associated with the authenticated user.
 */
export const getAllInterviewReports = async () => {
  const response = await api.get("/api/interview");
  return response.data;
};

/**
 * @description Generates a PDF of the interview report for the given interview ID.
 */

export const generateResumePdf = async (interviewId) => {
  const response = await api.get(`/api/interview/resume/pdf/${interviewId}`, {
    responseType: "blob",
  });
  return response.data;
};
