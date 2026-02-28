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
  /* used regex for decoding proper json structure as ai answers in this structure {
  "skills": [],
  "position": [],
  "preferred_roles": []
// }*/
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

const matchJobs=asyncHandler(async(req,res)=>{
  const userId=req.user.id;
  const {resumeId}=req.body;
  let resume=await prisma.resume.findFirst({
    where:{
      id:resumeId,
      userId,
    }
  })
  if (!resume) {
    return res.status(404).json(
      apiResponse(404, null, "Resume not found")
    );
  }

  const resumeTitle = resume.title;
  const resumeText = resume.content;

  console.log("Resume Title:", resumeTitle);
  console.log("Resume Content:", resumeText);
if (!Array.isArray(resume.parseSkills) || resume.parseSkills.length === 0){    // if parseSkills is null or empty
  const prompt =`
Return ONLY valid JSON in this format:

{
  "skills": [],
}  
Extract:
-skills from resume content


resume content:${resumeText}
`
   const response = await axios.post(
    "http://127.0.0.1:11434/api/generate",
    {
      model: "llama3",
      prompt,
      stream: false
    }
  );

  const rawOutputskills = response.data.response;//string 

let parsedOutputskills;

try {
  /* used regex for decoding proper json structure as ai answers in this structure {
  "skills": [],
  "position": [],
  "preferred_roles": []
// }*/
  const jsonMatch = rawOutputskills.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    throw new Error("No JSON found");
  }

  parsedOutputskills = JSON.parse(jsonMatch[0]);// only one json structure will be present

} catch (error) {
  parsedOutputskills = {
    error: "Invalid JSON from AI",
    raw: rawOutputskills
  };
}

// v2 added parsedSKills to resume 
if (Array.isArray(parsedOutputskills.skills)) {
  resume = await prisma.resume.update({
    where: { id: resumeId },
    data: {
      parseSkills: parsedOutputskills.skills
    }
  });
} else {
  return res.status(500).json(
    apiResponse(500, null, "Failed to extract skills from resume")
  );
}}
const resumeSkills = Array.isArray(resume.parseSkills)
  ? resume.parseSkills
  : [];
// to make sure resumeSkills is an array

const jobs = await prisma.job.findMany();

const results = jobs.map(job => {

  const jobDesc = job.description.toLowerCase();

  const matchedSkills = resumeSkills.filter(skill =>
    jobDesc.includes(skill.toLowerCase())
  );
  const missingSkills = resumeSkills.filter(skill =>
  !jobDesc.includes(skill.toLowerCase())
);

  const score = resumeSkills.length > 0
    ? Math.round((matchedSkills.length / resumeSkills.length) * 100)
    : 0;

  return {
    jobId: job.id,
    title: job.title,
    matchScore: score,
    matchedSkills,
    missingSkills
  };
});

results.sort((a, b) => b.matchScore - a.matchScore);
// beacuse javaScript object expects a compare function -postivive means larger so b>a 
// - negative means a>b and 0 means equal
/*JavaScript’s .sort() expects a compare function that returns:

Negative → a comes before b

Positive → b comes before a

0 → no change */
return res.status(200).json(
  apiResponse(200,results,"all jobs checked and scred are calculated")
)
})



export {
    aiIntegration,
    parseResume,
    matchJobs
}