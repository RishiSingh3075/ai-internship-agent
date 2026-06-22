
import apiResponse from "../utils/apiResponse.js";
import { validationResult } from 'express-validator';


export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(
        apiResponse(400,errors.array(),"Validation Failed"));
  }
  next();
};