import postgres from 'postgres';
import { seedDatabase } from '../lib/seed-database';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function GET() {
  try {
    await seedDatabase(sql);

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to seed database.',
      },
      { status: 500 },
    );
  }
}
