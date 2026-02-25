// require("dotenv").config();
import jwt from "jsonwebtoken";
import prisma from '../config/prisma.js';
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};
const generateRefreshToken=async (userId)=>{
  const refreshToken=jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "1d" }
  )
  const user=await prisma.user.update({
    where:{
      id:userId,
    },
    data:{
      refreshToken:refreshToken
    }
  })
  console.log(refreshToken);
  return refreshToken;
}

export { generateToken, generateRefreshToken };