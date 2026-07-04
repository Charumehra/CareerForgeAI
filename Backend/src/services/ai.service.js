const { GoogleGenAI } = require("@google/genai");
const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");
const PDFDocument = require("pdfkit");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

async function generateInterviewReport({
  resume,
  selfDescription,
  jobDescription,
}) {
  const prompt = `
Analyze the candidate's resume, self-description, and job description.

Return ONLY valid JSON.

The JSON must exactly match this format.

{
  "matchScore": number,
  "technicalQuestions": [
    {
      "question": string,
      "intention": string,
      "answer": string
    }
  ],
  "behavioralQuestions": [
    {
      "question": string,
      "intention": string,
      "answer": string
    }
  ],
  "skillGaps": [
    {
      "skill": string,
      "severity": "low" | "medium" | "high"
    }
  ],
  "preparationPlan": [
    {
      "day": number,
      "focus": string,
      "tasks": [string]
    }
  ],
  title: string
}

Rules:

- Return ONLY valid JSON.
- Do NOT wrap JSON inside markdown.
- Do NOT include explanations.
- Do NOT include reportTitle.
- Do NOT include candidate.
- Do NOT include candidateAssessment.
- Do NOT include interviewQuestions.
- Do NOT include any extra fields.
- Every technicalQuestions item MUST be an object.
- Every behavioralQuestions item MUST be an object.
- Every skillGaps item MUST be an object.
- Every preparationPlan item MUST be an object.

Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
    },
  });

  const report = JSON.parse(response.text);

  return report;
}

async function generatePdfFromHtml(htmlContent) {
  const browser = await puppeteer.launch({
    args: [...chromium.args, "--no-sandbox", "--disable-setuid-sandbox"],
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
  });

  try {
    const page = await browser.newPage();

    await page.setContent(htmlContent, {
      waitUntil: "networkidle0",
    });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: {
        top: "15mm",
        right: "15mm",
        bottom: "15mm",
        left: "15mm",
      },
    });

    return pdf;
  } finally {
    await browser.close();
  }
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
  const prompt = `
You are an expert ATS resume writer.

Your task is to rewrite the candidate's resume specifically for the provided job description.

Return ONLY a complete HTML document.

STRICT RULES:

- Return ONLY HTML.
- Do NOT return JSON.
- Do NOT wrap inside markdown.
- Start with <!DOCTYPE html>.
- End with </html>.
- Use only inline CSS inside one <style> tag.
- Use a clean single-column ATS-friendly layout.
- Do NOT use icons, tables, images, columns or graphics.
- Use professional spacing.
- Use Arial, Helvetica or Calibri.
- Make it recruiter-friendly.
- Optimize the resume for ATS.
- Add relevant keywords from the job description naturally.
- Never invent experience.
- Improve wording.
- Rewrite bullets with action verbs.
- Quantify achievements only if supported.
- Keep the resume concise.

Sections:

Header
Professional Summary
Core Skills
Professional Experience
Projects
Education
Certifications (if available)

Candidate Resume:
${resume}

Candidate Self Description:
${selfDescription}

Target Job Description:
${jobDescription}
`;

  let response;
  let html;

  try {
    response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0.3,
        maxOutputTokens: 16384,
      },
    });

    console.log("========== GEMINI RAW RESPONSE ==========");
    console.log(response.text);

    html = response.text?.trim();

    // Remove markdown if Gemini adds it
    html = html
      .replace(/```html/gi, "")
      .replace(/```/g, "")
      .trim();

    if (!html || !/<html/i.test(html) || !/<body/i.test(html)) {
      throw new Error("Gemini did not return a valid HTML document.");
    }

    console.log("✅ AI Resume HTML Generated");
  } catch (error) {
    console.error("========== RESUME AI ERROR ==========");
    console.error(error);

    if (response?.text) {
      console.log("Gemini Response:");
      console.log(response.text);
    }

    html = buildFallbackResumeHtml({
      resume,
      selfDescription,
      jobDescription,
    });
  }

  try {
    console.log("Generating PDF...");

    const pdfBuffer = await generatePdfFromHtml(html);

    console.log("✅ Resume PDF Generated");

    return pdfBuffer;
  } catch (error) {
    console.error("========== PUPPETEER ERROR ==========");
    console.error(error);

    return await buildFallbackResumePdf({
      resume,
      selfDescription,
      jobDescription,
    });
  }
}

function buildFallbackResumeHtml({ resume, selfDescription, jobDescription }) {
  const escapeHtml = (text = "") =>
    String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");

  const safeResume = escapeHtml(resume || "Not provided").replace(
    /\n/g,
    "<br />",
  );
  const safeSelfDescription = escapeHtml(
    selfDescription || "Not provided",
  ).replace(/\n/g, "<br />");
  const safeJobDescription = escapeHtml(
    jobDescription || "Not provided",
  ).replace(/\n/g, "<br />");

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Generated Resume</title>
    <style>
      body { font-family: Arial, Helvetica, sans-serif; margin: 0; padding: 20mm 15mm; color: #1f2937; }
      h1 { margin: 0 0 8px; font-size: 22px; }
      h2 { margin: 18px 0 8px; font-size: 14px; border-bottom: 1px solid #d1d5db; padding-bottom: 4px; }
      p { margin: 0; font-size: 11px; line-height: 1.6; }
      .meta { color: #4b5563; margin-bottom: 14px; font-size: 10px; }
      .box { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 10px; }
    </style>
  </head>
  <body>
    <h1>Generated Resume Draft</h1>
    <p class="meta">This fallback resume was generated because the AI formatter was temporarily unavailable.</p>

    <h2>Profile Summary</h2>
    <div class="box"><p>${safeSelfDescription}</p></div>

    <h2>Experience Details</h2>
    <div class="box"><p>${safeResume}</p></div>

    <h2>Target Job Description</h2>
    <div class="box"><p>${safeJobDescription}</p></div>
  </body>
</html>`;
}

async function buildFallbackResumePdf({
  resume,
  selfDescription,
  jobDescription,
}) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margin: 48,
      });

      const chunks = [];
      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      doc.fontSize(20).text("Generated Resume Draft", { align: "left" });
      doc.moveDown(0.5);
      doc
        .fontSize(10)
        .fillColor("#4b5563")
        .text(
          "Fallback PDF generated because browser-based PDF rendering is unavailable.",
        );

      doc.moveDown(1.2);
      doc.fillColor("#111827").fontSize(13).text("Profile Summary");
      doc.moveDown(0.3);
      doc
        .fontSize(10.5)
        .fillColor("#1f2937")
        .text(selfDescription || "Not provided", {
          lineGap: 2,
        });

      doc.moveDown(1);
      doc.fontSize(13).fillColor("#111827").text("Experience Details");
      doc.moveDown(0.3);
      doc
        .fontSize(10.5)
        .fillColor("#1f2937")
        .text(resume || "Not provided", {
          lineGap: 2,
        });

      doc.moveDown(1);
      doc.fontSize(13).fillColor("#111827").text("Target Job Description");
      doc.moveDown(0.3);
      doc
        .fontSize(10.5)
        .fillColor("#1f2937")
        .text(jobDescription || "Not provided", {
          lineGap: 2,
        });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = {
  generateInterviewReport,
  generateResumePdf,
};
