import prisma from '../config/prisma.js';
import asyncHandler from '../middleware/asyncHandler.js';
import apiResponse from "../utils/apiResponse.js";

import { getEmbedding,embedAndStore } from '../utils/embedding.js';

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
const createResume = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { title, content } = req.body;
    if (!title || !content) {
        return res.status(400).json(
            apiResponse(400, null, "provide title and content")
        )
    }
    const newResume = await prisma.resume.create({
        data: {
            userId: userId,
            content: content,
            title: title,
        }
    })

    // Embedding failure won't fail this request — resume is already
    // saved; embedAndStore handles its own try/catch internally.
    await embedAndStore('Resume', newResume.id, `${title}. ${content}`);

    return res.status(201).json(
        apiResponse(201, newResume, `Resume is created for ${userId}`)
    )
})

const updateResume = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const resumeId = Number(req.params.id);
    const { title, content } = req.body;
    if (isNaN(resumeId)) {
        return res.status(400).json(
            apiResponse(400, null, "provide resumeId or correct userId")
        )
    }
    const updateResumes = await prisma.resume.updateMany({
        where: {
            id: resumeId,
            userId: userId,
        },
        data: {
            ...(content && { content: content }),
            ...(title && { title: title }),
        }
    })
    if (updateResumes.count === 0) {
        return res.status(404).json(
            apiResponse(404, null, "resume not found")
        )
    }

    // Only re-embed if content changed — title-only edits don't
    // shift the resume's semantic meaning enough to justify the call.
    if (content) {
        await embedAndStore('Resume', resumeId, `${title || ''}. ${content}`);
    }

    const updatedResume = await prisma.resume.findMany({
        where: {
            id: resumeId,
            userId: userId,
        }
    })
    return res.status(200).json(
        apiResponse(200, updatedResume, `Resume ${resumeId} is updated for ${userId}`)
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




export {
    getResumes,
    createResume,
    updateResume,
    deleteResume,
};