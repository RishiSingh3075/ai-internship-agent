import prisma from '../config/prisma.js';
import { ApplicationStatus } from "@prisma/client";
import asyncHandler from '../middleware/asyncHandler.js';
import apiResponse from "../utils/apiResponse.js";

const applyForJob=asyncHandler(async(req,res)=>{
    // take userId from req.user.id next time when finalising the code as we must go through
    const userId=req.user.id;
    let {jobId,resumeId}=req.body;// the input comes in terms of string so make sure 
    // to change it to corresponding type like number,Int,Array,etc and take inputs inn req.body 
    // user req.query only when filtering 
    jobId=Number(jobId);
    resumeId=Number(resumeId);

    if(isNaN(jobId)||isNaN(resumeId)){// as what if jobId='abc' and not null so we must know if it is number or not
        return res.status(400).json(
            apiResponse(400,null,"Provide proper resumeID and job ID to apply")
        )
    }
    const resume=await prisma.resume.findFirst({// don't use findMany as it returns array and [] is truthy in js
        where:{
            id:resumeId,
            userId,
        }
    })
    if(!resume){
        return res.status(400).json(
            apiResponse(400,null,"No such resume exist for the user")
        )
    }
    // checking if job exists
    const job = await prisma.job.findUnique({
  where: { id: jobId }
});

if (!job) {
  return res.status(404).json(
    apiResponse(404, null, "Job not found")
  );
}
    // add condition for duplicate apply 409
    const duplicate=await prisma.application.findFirst({// don't use findMany as it returns array and [] is truthy in js
        where:{
            userId,
            jobId,
        }
    })
    if(duplicate){
        return res.status(409).json(
            apiResponse(409,null,"User already applied")
        )
    }
    const application=await prisma.application.create({
        data:{
            userId:userId,
            jobId:jobId,
            resumeId:resumeId,
            notes:resume.content,
        }
    })
    return res.status(200).json(
        apiResponse(200,
            application,
            "applied successfully"
        )
    )

})
// const { ApplicationStatus } = require("@prisma/client");
const updateApplication = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const applicationId = Number(req.params.id);
  const rawStatus = req.body.status;

  if (!rawStatus) {
    return res.status(400).json(
      apiResponse(400, null, "No status provided")
    );
  }

  const formattedStatus = rawStatus.toUpperCase();// applied to APPLIED

  if (!Object.values(ApplicationStatus).includes(formattedStatus)) {
    return res.status(400).json(
      apiResponse(400, null, "Invalid application status")
    );
  }
// to use update use id_userId but first make sure u migrate dev this feature
  const result = await prisma.application.updateMany({
  where: {
    id: applicationId,
    userId: userId
  },
  data: {
    status: formattedStatus
  }
});

if (result.count === 0) {
  return res.status(404).json(
    apiResponse(404, null, "Application not found")
  );
}
const application=await prisma.application.findUnique({
        where:{
        id:applicationId
        }
})

  return res.status(200).json(
    apiResponse(200, application, "Application Status Updated")
  );
});
const applications=asyncHandler(async(req,res)=>{
    const userId=req.user.id;
    const applications=await prisma.application.findMany({
        where:{
            userId,
        }
    })
    if(!applications){
        res.status(404).json(
            apiResponse(404,"No application for this user exits")
        )
    }
return res.status(200).json(
    apiResponse(200, applications, "all applications")
  );
})




export {
    applyForJob,
    updateApplication,
    applications
};