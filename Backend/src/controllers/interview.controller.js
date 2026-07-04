const pdfParser = require("pdf-parse");
const { generateInterviewReport,generateResumePdf } = require("../services/ai.service");
const interviewReportModel = require("../models/interviewReport.model");
const mongoose = require("mongoose");

/**
 * @description generate new interview report on the basis of user self description , resume pdf and job description
 */

async function generateInterViewReportController(req, res) {
  try {
    const { jobDescription, selfDescription } = req.body;
    const normalizedJobDescription = jobDescription?.trim();
    const normalizedSelfDescription = selfDescription?.trim();

    if (!normalizedJobDescription) {
      return res.status(400).json({
        message: "Job description is required",
      });
    }

    let resumeText = "";

    if (req.file) {
      if (req.file.mimetype !== "application/pdf") {
        return res.status(400).json({
          message: "Only PDF resume files are supported",
        });
      }

      const resumeContent = await new pdfParser.PDFParse(
        Uint8Array.from(req.file.buffer),
      ).getText();
      resumeText = resumeContent.text || "";
    }

    if (!resumeText && !normalizedSelfDescription) {
      return res.status(400).json({
        message: "Provide at least one input: resume or self description",
      });
    }

    const interviewReportByAi = await generateInterviewReport({
      resume: resumeText,
      jobDescription: normalizedJobDescription,
      selfDescription: normalizedSelfDescription || "",
    });

    const interviewReport = await interviewReportModel.create({
      user: req.user.id,
      title: interviewReportByAi.title || "Generated Interview Plan",
      resume: resumeText,
      selfDescription: normalizedSelfDescription || "",
      jobDescription: normalizedJobDescription,
      matchScore: Number(interviewReportByAi.matchScore) || 0,
      technicalQuestions: interviewReportByAi.technicalQuestions || [],
      behavioralQuestions: interviewReportByAi.behavioralQuestions || [],
      skillGaps: interviewReportByAi.skillGaps || [],
      preparationPlan: interviewReportByAi.preparationPlan || [],
    });

    return res.status(201).json({
      message: "Interview report generated successfully",
      interviewReport,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to generate interview report",
    });
  }
}

/**
 * @description get interview report by id
 */

async function getInterviewReportById(req, res) {
  try {
    const { interviewId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(interviewId)) {
      return res.status(400).json({
        message: "Invalid interview report id",
      });
    }

    const interviewReport = await interviewReportModel.findOne({
      _id: interviewId,
      user: req.user.id,
    });

    if (!interviewReport) {
      return res.status(404).json({
        message: "Interview report not found",
      });
    }

    return res.status(200).json({
      message: "Interview report found",
      interviewReport,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch interview report",
    });
  }
}

/**
 * @description get all interview reports of user
 */

async function getAllInterviewReportsController(req, res) {
  try {
    const interviewReports = await interviewReportModel
      .find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .select(
        "-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan"
      );

    return res.status(200).json({
      message: "Interview reports found",
      interviewReports,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch interview reports",
    });
  }
}

/**
 * @description generate resume pdf on the basis of user self description , resume pdf and job description
 */
async function generateResumePdfController(req, res) {
  try {
    const { interviewReportId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(interviewReportId)) {
      return res.status(400).json({
        message: "Invalid interview report id",
      });
    }

    const interviewReport = await interviewReportModel.findOne({
      _id: interviewReportId,
      user: req.user.id,
    });

    if (!interviewReport) {
      return res.status(404).json({
        message: "Interview report not found",
      });
    }

    const { resume, jobDescription, selfDescription } = interviewReport;
    const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription });

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`,
    });

    return res.send(pdfBuffer);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to generate resume pdf",
    });
  }

}

module.exports = {
  generateInterViewReportController,
  getInterviewReportById,
  getAllInterviewReportsController,
  generateResumePdfController,
};

