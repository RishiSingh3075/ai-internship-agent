import prisma from '../config/prisma.js';
import asyncHandler from '../middleware/asyncHandler.js';
import apiResponse from "../utils/apiResponse.js";



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




export {
    listjobs,
    
};