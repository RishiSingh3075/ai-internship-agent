-- This is an empty migration.
-- Add a 768-dimension vector column to Job for storing job description embeddings
ALTER TABLE "Job" ADD COLUMN "embedding" vector(768);

-- Add a 768-dimension vector column to Resume for storing resume content embeddings
ALTER TABLE "Resume" ADD COLUMN "embedding" vector(768);