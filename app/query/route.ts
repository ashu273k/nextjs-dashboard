import postgres from 'postgres';
import { seedDatabase } from '../lib/seed-database';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function listInvoices() {
	const data = await sql`
    SELECT invoices.amount, customers.name
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE invoices.amount = 666;
  `;

	return data;
}

export async function GET() {
  try {
    return Response.json(await listInvoices());
  } catch (error) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === '42P01'
    ) {
      try {
        await seedDatabase(sql);
        return Response.json(await listInvoices());
      } catch (seedError) {
        return Response.json(
          {
            error:
              seedError instanceof Error
                ? seedError.message
                : 'Failed to initialize the database.',
          },
          { status: 500 },
        );
      }
    }

    return Response.json(
      {
        error:
          error instanceof Error ? error.message : 'Unexpected database error.',
      },
      { status: 500 },
    );
  }
}
