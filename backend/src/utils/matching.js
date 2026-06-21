// utils/matching.js
// Cosine similarity search using pgvector's native <=> operator.
// No external library needed — pgvector computes this directly inside
// Postgres, so we only ever pull back the ranked results, not raw vectors.

import prisma from '../config/prisma.js';

/**
 * Finds jobs semantically similar to a given resume, ranked by similarity.
 * @param {number} resumeId - The resume to match against
 * @param {number|null} minSimilarity - Optional threshold (0 to 1). 
 *   If provided, only jobs scoring at or above this are returned.
 *   If omitted/null, ALL jobs are returned, ranked, down to the lowest score.
 * @returns {Promise<Array>} - Ranked jobs with similarity scores
 */
async function findMatchingJobs(resumeId, minSimilarity = null) {
  if (!resumeId || isNaN(resumeId)) {
    throw new Error('findMatchingJobs requires a valid resumeId.');
  }

  // <=> is pgvector's cosine DISTANCE operator — smaller means more similar.
  // We flip it to similarity (1 - distance) so higher numbers feel intuitive
  // on the frontend (1.0 = perfect match, 0 = unrelated).
  //
  // The HAVING clause only filters when minSimilarity is actually provided —
  // passing NULL makes the condition always true, so no filtering happens
  // and every job comes back, same behavior as the existing keyword matcher.
  const results = await prisma.$queryRawUnsafe(
    `
    SELECT 
      j.id,
      j.title,
      j.company,
      j.location,
      1 - (r.embedding <=> j.embedding) AS similarity
    FROM "Resume" r, "Job" j
    WHERE r.id = $1
      AND r.embedding IS NOT NULL
      AND j.embedding IS NOT NULL
    ORDER BY similarity DESC
    `,
    resumeId
  );

  // Filtering done in JS rather than SQL HAVING — simpler to reason about
  // here since "similarity" is a computed alias, not a real column, and
  // some Postgres versions are picky about referencing computed aliases
  // in HAVING without repeating the full expression.
  if (minSimilarity !== null && minSimilarity !== undefined) {
    return results.filter((job) => job.similarity >= minSimilarity);
  }

  return results;
}

export { findMatchingJobs };