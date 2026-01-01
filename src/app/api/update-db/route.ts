import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Add press_link column
        await sql`
      ALTER TABLE projects 
      ADD COLUMN IF NOT EXISTS press_link TEXT;
    `;
        return NextResponse.json({ message: 'Database updated successfully (press_link added)' });
    } catch (error) {
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
