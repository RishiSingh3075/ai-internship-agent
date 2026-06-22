// src/validators/resume.validator.js
// Validation rules live here, separate from routes — keeps routes readable
// and makes these rules reusable/testable on their own.

import { body, param } from 'express-validator';

const createResumeValidator = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required'),
];

const updateResumeValidator = [
  param('id').isInt().withMessage('Resume ID must be an integer').toInt(),
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty if provided'),
  body('content').optional().notEmpty().withMessage('Content cannot be empty if provided'),
];

const deleteResumeValidator = [
  param('id').isInt().withMessage('Resume ID must be an integer').toInt(),
];

export {createResumeValidator,updateResumeValidator,deleteResumeValidator};