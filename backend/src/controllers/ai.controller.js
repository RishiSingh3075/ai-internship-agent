import prisma from '../config/prisma.js';
import asyncHandler from '../middleware/asyncHandler.js';
import apiResponse from "../utils/apiResponse.js";
import groq from "../config/groq.js";
import { findMatchingJobs } from '../utils/matching.js';


// helper — what this does: sends a prompt to Groq and returns raw text
const askGroq = async (prompt) => {
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
  });
  return completion.choices[0].message.content;
};

const aiIntegration = asyncHandler(async (req, res) => {
  const rawOutput = await askGroq('Reply ONLY with this exact JSON: { "status": "AI connected" }');

  let parsedOutput;
  try {
    parsedOutput = JSON.parse(rawOutput);
  } catch (error) {
    parsedOutput = { error: "Invalid JSON from AI", raw: rawOutput };
  }

  return res.status(200).json(
    apiResponse(200, parsedOutput, "AI integrated successfully")
  );
});

const parseResume = asyncHandler(async (req, res) => {
  const { resumeId } = req.body;
  const userId = req.user.id;

  const resume = await prisma.resume.findFirst({
    where: { id: resumeId, userId }
  });

  if (!resume) {
    return res.status(404).json(apiResponse(404, null, "Resume not found"));
  }

  const prompt = `
Return ONLY valid JSON in this format:

{
  "skills": [],
  "position": [],
  "preferred_roles": []
}

Extract:
- skills from resume content
- position from resume title
- preferred_roles from resume content

Resume Title: ${resume.title}
Resume Content: ${resume.content}
`;

  const rawOutput = await askGroq(prompt);

  let parsedOutput;
  try {
    const jsonMatch = rawOutput.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found");
    parsedOutput = JSON.parse(jsonMatch[0]);
  } catch (error) {
    parsedOutput = { error: "Invalid JSON from AI", raw: rawOutput };
  }

  return res.status(200).json(
    apiResponse(200, parsedOutput, "Resume parsed successfully")
  );
});

const matchJobs = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { resumeId } = req.body;

  let resume = await prisma.resume.findFirst({
    where: { id: resumeId, userId }
  });

  if (!resume) {
    return res.status(404).json(apiResponse(404, null, "Resume not found"));
  }

  if (!Array.isArray(resume.parseSkills) || resume.parseSkills.length === 0) {
    const prompt = `
Return ONLY valid JSON in this format:

{
  "skills": []
}

Extract skills from resume content:
${resume.content}
`;

    const rawOutputskills = await askGroq(prompt);

    let parsedOutputskills;
    try {
      const jsonMatch = rawOutputskills.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON found");
      parsedOutputskills = JSON.parse(jsonMatch[0]);
    } catch (error) {
      parsedOutputskills = { error: "Invalid JSON from AI", raw: rawOutputskills };
    }

    if (Array.isArray(parsedOutputskills.skills)) {
      resume = await prisma.resume.update({
        where: { id: resumeId },
        data: { parseSkills: parsedOutputskills.skills }
      });
    } else {
      return res.status(500).json(
        apiResponse(500, null, "Failed to extract skills from resume")
      );
    }
  }

  const resumeSkills = Array.isArray(resume.parseSkills) ? resume.parseSkills : [];
  const jobs = await prisma.job.findMany();

  const results = jobs.map(job => {
    const jobDesc = job.description.toLowerCase();
    const matchedSkills = resumeSkills.filter(skill => jobDesc.includes(skill.toLowerCase()));
    const missingSkills = resumeSkills.filter(skill => !jobDesc.includes(skill.toLowerCase()));
    const score = resumeSkills.length > 0
      ? Math.round((matchedSkills.length / resumeSkills.length) * 100)
      : 0;

    return { jobId: job.id, title: job.title, matchScore: score, matchedSkills, missingSkills };
  });

  results.sort((a, b) => b.matchScore - a.matchScore);

  return res.status(200).json(
    apiResponse(200, results, "All jobs checked and scores calculated")
  );
});
const matchJobsSemantic = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { resumeId, minSimilarity } = req.body;

  const resume = await prisma.resume.findFirst({
    where: { id: resumeId, userId }
  });

  if (!resume) {
    return res.status(404).json(apiResponse(404, null, "Resume not found"));
  }

  // minSimilarity is optional — if the user doesn't send it, we pass null
  // so findMatchingJobs returns ALL jobs ranked, same "show everything"
  // behavior as the existing keyword-based matchJobs function.
  const threshold = (minSimilarity !== undefined && !isNaN(parseFloat(minSimilarity)))
    ? parseFloat(minSimilarity)
    : null;

  const results = await findMatchingJobs(resumeId, threshold);

  return res.status(200).json(
    apiResponse(200, results, "Semantic job matches calculated")
  );
});


const generatecoverletter = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { resumeId, jobId } = req.body;

  const resume = await prisma.resume.findFirst({
    where: { id: resumeId, userId }
  });

  if (!resume) {
    return res.status(404).json(apiResponse(404, null, "Resume not found"));
  }

  const job = await prisma.job.findUnique({ where: { id: jobId } });

  if (!job) {
    return res.status(404).json(apiResponse(404, null, "Job not found"));
  }

  const prompt = `
Write a professional 150-200 word internship cover letter.

Candidate Resume:
${resume.content}

Job Title:
${job.title}

Job Description:
${job.description}

Instructions:
- Tailor the letter specifically to this job.
- Highlight relevant skills.
- Be confident and concise.
- Do NOT include explanations.
- Return only the cover letter text.
- Candidate Name: ${req.user.name || "The Candidate"}
- Company Name: ${job.company || job.title}
`;

  const letter = await askGroq(prompt);

  return res.status(200).json(
    apiResponse(200, letter.trim(), "Cover letter generated")
  );
});

export { aiIntegration, parseResume, generatecoverletter, matchJobs, matchJobsSemantic };
