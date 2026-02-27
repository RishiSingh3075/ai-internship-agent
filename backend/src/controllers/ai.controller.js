import prisma from '../config/prisma.js';
import axios from "axios";
import asyncHandler from '../middleware/asyncHandler.js';
import apiResponse from "../utils/apiResponse.js";

const aiIntegration = asyncHandler(async (req, res) => {

  const response = await axios.post(
    "http://127.0.0.1:11434/api/generate",
    {
      model: "llama3",
      prompt: 'Reply ONLY with this exact JSON: { "status": "AI connected" }',
      stream: false
    }
  );

  const rawOutput = response.data.response;

  let parsedOutput;

  try {
    parsedOutput = JSON.parse(rawOutput);
  } catch (error) {
    parsedOutput = {
      error: "Invalid JSON from AI",
      raw: rawOutput
    };
  }

  return res.status(200).json(
    apiResponse(200, parsedOutput, "AI integrated successfully")
  );

});
const parseResume = asyncHandler(async (req, res) => {

  const { resumeId } = req.body;
  const userId = req.user.id;

  console.log("Request Body:", req.body);
  console.log("User ID from token:", userId);
  console.log("Resume ID received:", resumeId);

  const resume = await prisma.resume.findFirst({
    where: {
      id: resumeId,
      userId: userId
    }
  });

  console.log("Fetched Resume:", resume);

  if (!resume) {
    return res.status(404).json(
      apiResponse(404, null, "Resume not found")
    );
  }

  const resumeTitle = resume.title;
  const resumeText = resume.content;

  console.log("Resume Title:", resumeTitle);
  console.log("Resume Content:", resumeText);

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

Resume Title: ${resumeTitle}
Resume Content: ${resumeText}
`;

  const response = await axios.post(
    "http://127.0.0.1:11434/api/generate",
    {
      model: "llama3",
      prompt,
      stream: false
    }
  );

  const rawOutput = response.data.response;

let parsedOutput;

try {
  // used regex for decoding proper json structure 
  const jsonMatch = rawOutput.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    throw new Error("No JSON found");
  }

  parsedOutput = JSON.parse(jsonMatch[0]);

} catch (error) {
  parsedOutput = {
    error: "Invalid JSON from AI",
    raw: rawOutput
  };
}

  return res.status(200).json(
    apiResponse(200, parsedOutput, "Resume parsed successfully")
  );
});

export {
    aiIntegration,
    parseResume
}