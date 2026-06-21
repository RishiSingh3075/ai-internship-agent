// backfillEmbeddings.js
// ONE-TIME script — run manually, not part of the app's normal request flow.
// Purpose: your 10 seeded jobs already exist in Postgres but have
// embedding = NULL (the column didn't exist when they were created).
// This script finds those rows, generates an embedding for each,
// and writes it back using raw SQL (Prisma's normal .update() can't
// write to an Unsupported("vector(768)") column).

// require('dotenv').config();
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { getEmbedding } from './src/utils/embedding.js';

const prisma = new PrismaClient();

async function backfillJobEmbeddings() {
  // Only fetch jobs that don't have an embedding yet — running this
  // script twice should be safe and not re-embed everything.
  // prisma.findMAny can't wprk with embeddings
  const jobs = await prisma.$queryRawUnsafe(
  `SELECT id, title, description FROM "Job" WHERE embedding IS NULL`
);

  console.log(`Found ${jobs.length} job(s) without embeddings.\n`);

  for (const job of jobs) {
    try {
      // Combine title + description so the embedding captures both —
      // a job titled "Backend Engineer" with a generic description
      // benefits from the title's signal too.
      const textToEmbed = `${job.title}. ${job.description}`;

      const vector = await getEmbedding(textToEmbed);

      // Prisma can't write Unsupported columns directly, so we use
      // $executeRaw with an explicit ::vector cast. The vector is
      // passed as a Postgres array literal string, e.g. '[0.1,0.2,...]'.
      const vectorLiteral = `[${vector.join(',')}]`;

      await prisma.$executeRawUnsafe(
        `UPDATE "Job" SET "embedding" = $1::vector WHERE "id" = $2`,
        vectorLiteral,
        job.id
      );

      console.log(`Embedded job #${job.id} — ${job.title}`);
    } catch (err) {
      // Log and continue — one bad job shouldn't kill the whole backfill.
      console.error(`Failed on job #${job.id} (${job.title}):`, err.message);
    }
  }

  console.log('\nBackfill complete.');
}

backfillJobEmbeddings()
  .catch((err) => {
    console.error('Backfill script crashed:', err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });