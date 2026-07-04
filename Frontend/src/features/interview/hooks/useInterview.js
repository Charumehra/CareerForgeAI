import {
  generateInterviewReport,
  getInterviewReportById,
  getAllInterviewReports,
  generateResumePdf,
} from "../services/interview.api";
import { useContext, useEffect } from "react";
import { InterviewContext } from "../interview.context";
import { useParams } from "react-router";

export const useInterview = () => {
  const context = useContext(InterviewContext);
  const { interviewId } = useParams();
  if (!context) {
    throw new Error("useInterview must be used within an InterviewProvider");
  }
  const { Loading, setLoading, report, setReport, reports, setReports } =
    context;

  const generateReport = async ({
    selfDescription,
    resumeFile,
    jobDescription,
  }) => {
    setLoading(true);
    try {
      const response = await generateInterviewReport({
        selfDescription,
        resumeFile,
        jobDescription,
      });
      setReport(response.interviewReport);
      return response.interviewReport;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getReportById = async (reportId) => {
    setLoading(true);
    try {
      const response = await getInterviewReportById(reportId);
      setReport(response.interviewReport);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getReports = async () => {
    setLoading(true);
    try {
      const response = await getAllInterviewReports();
      setReports(response.interviewReports);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const getResumePdf = async (interviewId) => {
    setLoading(true);

    try {
      const pdfBlob = await generateResumePdf(interviewId);

      const url = window.URL.createObjectURL(pdfBlob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `resume_${interviewId}.pdf`;

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (interviewId) {
      getReportById(interviewId);
    } else {
      getReports();
    }
  }, [interviewId]);

  return {
    Loading,
    report,
    reports,
    generateReport,
    getReportById,
    getReports,
    getResumePdf,
  };
};
