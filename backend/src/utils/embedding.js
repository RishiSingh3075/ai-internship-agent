// utils/embedding.js
// Single reusable function for generating embeddings via Gemini.
// Imported by: backfillEmbeddings.js (one-time job backfill) and
// the resume upload route (for new resumes going forward).
// Keeping this in one place means we only ever fix/update the logic once.

import prisma from '../config/prisma.js';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

/**
 * Generates a 768-dimension embedding vector for a given text string.
//  * @param {string} text - The text to embed (job description, resume content, etc.)
//  * @returns {Promise<number[]>} - Array of 768 floats
//  */
async function getEmbedding(text) {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY not found in environment variables.');
  }

  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    throw new Error('getEmbedding requires a non-empty string input.');
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${GEMINI_API_KEY}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'models/gemini-embedding-001',
      content: {
        parts: [{ text }],
      },
      // Locked to 768 — MUST match the vector(768) column in Postgres.
      // If you ever change this, every existing embedding becomes
      // incompatible and would need to be regenerated.
      outputDimensionality: 768,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errorBody}`);
  }

  const data = await response.json();

  if (!data.embedding || !Array.isArray(data.embedding.values)) {
    throw new Error('Unexpected response shape from Gemini embedding API.');
  }

  return data.embedding.values;
}
// utils/embedding.js — add this alongside getEmbedding

async function embedAndStore(model, id, text) {
  try {
    const vector = await getEmbedding(text);
    const vectorLiteral = `[${vector.join(',')}]`;
    await prisma.$executeRawUnsafe(
      `UPDATE "${model}" SET "embedding" = $1::vector WHERE "id" = $2`,
      vectorLiteral,
      id
    );
  } catch (err) {
    console.error(`Embedding failed for ${model} #${id}:`, err.message);
  }
}

export { getEmbedding, embedAndStore };


// export { getEmbedding };