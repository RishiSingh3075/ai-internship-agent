import jwt from "jsonwebtoken";
import apiResponse from "../utils/apiResponse.js";
import prisma from "../config/prisma.js";
function authenticateToken(req,res,next){
    const authHeader=req.headers['authorization'];
    const token=authHeader && authHeader.split(' ')[1];
    if(!token){
        return res.status(401).json(
            apiResponse(401,null,"No token provided")
        );
    }
    jwt.verify(token,process.env.JWT_SECRET,(err,decoded)=>{
        if(err){
            if(err.name==="TokenExpiredError"){
                return res.status(401).json(
                    apiResponse(401,null,"Token Expired-login again")
                )
            }
            return res.status(401).json(
                apiResponse(401,null,"Invalid token")
            )}
        req.user=decoded;
        next();
    });
}
async function authenticateRefreshToken(req,res,next){
    const refreshtoken=req.body.refreshtoken;
    if(!refreshtoken){
        return res.status(401).json(
            apiResponse(401,null,"No token provided")
        );
    }
    // jwt.verify(refreshtoken,process.env.JWT_REFRESH_SECRET,(err,decoded)=>{
    //     if(err){
    //         return res.status(403).json(
    //             apiResponse(403,null,"Invalid or expired refresh token")
    //         )}
    //     // req.user=decoded;
    //     next();
    // });
    try{
        const decoded=jwt.verify(refreshtoken,process.env.JWT_REFRESH_SECRET);
        const user=await prisma.user.findUnique({
            where:{
                id:decoded.id,
            }
        });
        if(!user||user.refreshToken!==refreshtoken){
            return res.status(403).json(
                apiResponse(403,null,"Invalid or expired refresh token")
            );
        }
        req.user=user;
        next();
    }
    catch(err){
        return res.status(403).json(
            apiResponse(403,null,"Invalid or expired refresh token")
        );
    }
}
async function destroyRefreshToken(req,res,next){
    const userId=req.user.id;
    await prisma.user.update({
        where:{
            id:userId,
        },
        data:{
            refreshToken:null,
        }
    })
    return res.status(200).json(
        apiResponse(200,null,"Logged out successfully")
    );
}

export { authenticateToken, authenticateRefreshToken,destroyRefreshToken };