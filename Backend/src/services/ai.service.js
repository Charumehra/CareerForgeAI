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

  const raw = response.text?.trim();

  const clean = raw
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  const report = JSON.parse(clean);

  return report;
}

async function generatePdfFromHtml(htmlContent) {
  const isProduction = process.env.NODE_ENV === "production";

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: isProduction
      ? await chromium.executablePath()
      : "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", // Windows Chrome
    args: isProduction
      ? [...chromium.args, "--no-sandbox", "--disable-setuid-sandbox"]
      : [],
    defaultViewport: chromium.defaultViewport,
  });

  try {
    const page = await browser.newPage();

    await page.setContent(htmlContent, {
      waitUntil: "networkidle0",
    });

    return await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "15mm",
        right: "15mm",
        bottom: "15mm",
        left: "15mm",
      },
    });
  } finally {
    await browser.close();
  }
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {

  const prompt = `
You are a senior resume writer, ATS optimization specialist, and technical recruiter with years of experience reviewing resumes for top technology companies.

Your goal is to transform the candidate's information into a professional, natural, ATS-friendly resume that looks like it was written by an experienced human resume writer—not by AI.

========================
OUTPUT REQUIREMENTS
========================

Return ONLY a complete HTML document.

Do NOT:
- Return JSON.
- Wrap the response inside markdown.
- Add explanations.
- Add comments.
- Add placeholders that were not provided.
- Invent companies, projects, dates, achievements, certifications, or experience.

The response MUST:
- Start with <!DOCTYPE html>
- End with </html>
- Contain only one <style> tag
- Use semantic HTML
- Be ready for PDF generation without modification

========================
DESIGN REQUIREMENTS
========================

The resume must be:

- ATS friendly
- Professional
- Clean
- Elegant
- Minimal
- Easy to scan
- Recruiter friendly

Use:

- Arial, Helvetica or Calibri
- White background
- Black/Dark Gray text
- Single-column layout
- Consistent spacing
- Proper margins (approximately 15–15mm)
- Professional typography
- Balanced whitespace
- Clear visual hierarchy

Do NOT use:

- Tables
- Icons
- Images
- Graphics
- Progress bars
- Ratings
- Columns
- Background colors
- Fancy designs

Use subtle section separators and clean headings.

========================
CONTENT REQUIREMENTS
========================

Rewrite every section professionally.

Do not simply copy the original wording.

Instead:

- Improve grammar.
- Improve readability.
- Remove repetition.
- Use concise language.
- Use strong action verbs.
- Make every bullet impactful.
- Keep the writing natural.
- Make it sound like an experienced professional wrote it.

Avoid generic AI phrases such as:

- Passionate professional
- Highly motivated individual
- Hardworking person
- Dynamic team player
- Results-oriented professional

Instead, write naturally and specifically.

========================
ATS OPTIMIZATION
========================

Carefully analyze the job description.

Naturally incorporate relevant keywords into:

- Professional Summary
- Skills
- Experience
- Projects

Do NOT keyword stuff.

Keywords should appear naturally.

========================
LINK HANDLING
========================

If the candidate provides:

- LinkedIn
- GitHub
- Portfolio
- Personal Website
- Email

Display them clearly in the header.

Use proper HTML links.

Example:

<a href="https://linkedin.com/in/username">
linkedin.com/in/username
</a>

Display the complete URL.

Never hide, shorten, or remove links.

If project links exist, include them directly beneath the project title.

========================
PROJECTS
========================

For every project:

Include:

Project Name

Technologies Used

3–5 concise bullet points describing:

- what was built
- technologies used
- key features
- measurable impact (only if provided)

If GitHub or Live Demo links are available, display them.

========================
EXPERIENCE
========================

Write professional accomplishment-oriented bullet points.

Use action verbs like:

Built
Designed
Developed
Implemented
Optimized
Integrated
Automated
Collaborated
Improved
Created

Never exaggerate or invent achievements.

========================
PROFESSIONAL SUMMARY
========================

Write a concise summary (3–5 lines).

It should:

- Match the target role
- Highlight relevant strengths
- Mention important technologies
- Sound natural
- Avoid clichés

========================
SKILLS
========================

Group skills logically.

Example:

Languages

Frontend

Backend

Databases

Frameworks

Tools

Cloud

Version Control

========================
SECTION ORDER
========================

1. Header

- Name
- Job Title (if applicable)
- Phone
- Email
- LinkedIn
- GitHub
- Portfolio

2. Professional Summary

3. Technical Skills

4. Professional Experience

5. Projects

6. Education

7. Certifications (if available)

========================
FINAL QUALITY CHECK
========================

Before returning HTML ensure:

✓ ATS compatible

✓ Human-written tone

✓ Professional spacing

✓ Proper margins

✓ Consistent typography

✓ No unnecessary empty space

✓ No fake information

✓ No duplicated content

✓ Clean HTML

✓ Print-ready PDF layout

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


    html = response.text?.trim();

    // Remove markdown if Gemini adds it
    html = html
      .replace(/```html/gi, "")
      .replace(/```/g, "")
      .trim();

    if (!html || !/<html/i.test(html) || !/<body/i.test(html)) {
      throw new Error("Gemini did not return a valid HTML document.");
    }

  } catch (error) {

    

    html = buildFallbackResumeHtml({
      resume,
      selfDescription,
      jobDescription,
    });
  }

  try {

    const pdfBuffer = await generatePdfFromHtml(html);


    return pdfBuffer;
  } catch (error) {

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
