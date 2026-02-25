import prisma from '../config/prisma.js';
import { ApplicationStatus } from "@prisma/client";
import bcrypt from 'bcryptjs';
import {generateRefreshToken,generateToken} from '../utils/generateToken.js';
import asyncHandler from '../middleware/asyncHandler.js';
import apiResponse from "../utils/apiResponse.js";


const saltrounds=10;
const registerUser=asyncHandler(async(req,res)=>{
    const email=req.body.email;
    const password=req.body.password;
    const name=req.body.name;
    if(!email||!password||!name){
        return res.status(400).json(
            apiResponse(400,null,"Please provide email, password and name")
    );}
    const user=await prisma.user.findUnique({
        where:{
            email:email,
        }
    });
    if(user){
        return res.status(400).json(
            apiResponse(400,null,"User already exists")
    );}
    const newUser=await prisma.user.create({
            data:{
                email:email,
                name:name,
                password:await bcrypt.hash(password,saltrounds),
            }
    });
    return res.status(201).json(
            apiResponse(201,{
                id:newUser.id,
                email:newUser.email,
            },"User created successfully")
    );

});
const loginUser=asyncHandler(async(req,res)=>{
    const {email,password}=req.body;
    // throw new Error("Test error handling");
    if(!email||!password){
        return res.status(400).json(
            apiResponse(400,null,"Please provide email and password")
    );}
    const user=await prisma.user.findUnique({
        where:{
            email:email,
        }
    })
    if(!user){
        return res.status(401).json(
            apiResponse(401,null,"Invalid credentials")
        );
    }
    const hashpassword= await bcrypt.compare(password,user.password);//always use wait and this returns true or false
    if(!hashpassword){
        return res.status(401).json(
            apiResponse(401,null,"Invalid credentials")
        );
    }
    return res.status(200).json(
        apiResponse(200,{token:generateToken(user.id),refreshtoken:await generateRefreshToken(user.id)},"Login successful")
        // apiResponse(200,{id:user.id,name:user.name,email:user.email},"Login successful")
    );
});
const listjobs=asyncHandler(async(req,res)=>{
    const {search,location,salary,jobType,page=1,limit=5}=req.query;
    let keywords=[];
    const pageNumber=Number(page);
    const limitNumber=Number(limit);
    const skip=(pageNumber-1)*limitNumber;
    if(search){
        keywords=search.split(",");
    }
    const jobs=await prisma.job.findMany({
        where:{
            //... is spread operator it returns in object type that is {undefined}
            ...(search && {OR: keywords.map(word=>({
                description:{
                    contains:word,
                    mode:"insensitive"
                }
            }))}),
            ...(location && {location:{
                contains:location,
                mode:"insensitive"
            }}),
            ...(salary && {salary:{gte:Number(salary)}}),// gte ite
            ...(jobType && {title:{
                contains:jobType,
                mode:"insensitive"
            }})
        },
        orderBy:{
            createdAt:"desc"
        },
        skip:skip,
        take:limitNumber,
    });
    return res.status(200).json(
        apiResponse(200,jobs,"Jobs retrieved successfully")
    );
});
const getResumes=asyncHandler(async(req,res)=>{
    // const {userId}=Number(req.params.id);
    const userId=req.user.id;

    const resumes=await prisma.resume.findMany({
        where:{
            userId:userId,
        },
        orderBy:{
            createdAt:"desc",
        }
    })
    return res.status(200).json(
        apiResponse(200,resumes,"all resumes fetched")
    )
})
const createResume=asyncHandler(async(req,res)=>{
    const userId=req.user.id;//title is like AI,ML,webdev,CYBER
    const {title,content}=req.body;
    if(!title||!content){
        return res.status(400).json(// 400 for bad request
            apiResponse(400,null,"provide title and content")
        )
    }
    const newResume=await prisma.resume.create({
        data:{
            userId:userId,
            content:content,
            title:title,
        }
    })
    return res.status(201).json(//201 fpr creation
        apiResponse(201,newResume,`Resume is created for ${userId}`)
    )

})
const updateResume=asyncHandler(async(req,res)=>{
    const userId=req.user.id;//title is like AI,ML,webdev,CYBER
    const resumeId=Number(req.params.id);
    const {title,content}=req.body;
    if(isNaN(resumeId)){
        return res.status(400).json(// 400 for bad request
            apiResponse(400,null,"provide resumeId or correct userId")
        )
    }
    const updateResumes=await prisma.resume.updateMany({
        where:{
            id:resumeId,
            userId:userId,
        },
        data:{
            ...(content && {content:content}),
            ...(title && {title:title}),
        }
    })
    if(updateResumes.count===0){
        return res.status(404).json(//404 is not found
            apiResponse(404,null,"resume not found")
        )
    }
    const updatedResume=await prisma.resume.findMany({
        where:{
            id:resumeId,
            userId:userId,
        }
    })
    return res.status(200).json(
        apiResponse(200,updatedResume,`Resume ${resumeId} is updated for ${userId}`)
    )

})
const deleteResume=asyncHandler(async(req,res)=>{
    const userId=req.user.id;//title is like AI,ML,webdev,CYBER
    // const {title,content}=req.query;
    const resumeId=Number(req.params.id);
    if(isNaN(resumeId)){
        return res.status(400).json(// 400 for bad request
            apiResponse(400,null,"provide valid ResumeID")
        )
    }
    const deletedResumes=await prisma.resume.deleteMany({
        where:{
            id:resumeId,
            userId:userId,
        }
    })
    if(deletedResumes.count===0){
        return res.status(404).json(
            apiResponse(404,null,"Resume ID not found")
        )
    }
    return res.status(200).json(
        apiResponse(200,null,`Resume is deleted`)
    )

})
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




export {registerUser,
    loginUser,
    listjobs,
    applyForJob,
    updateApplication,
    getResumes,
    createResume,
    updateResume,
    deleteResume,
    applications
};