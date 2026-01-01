import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Add dots_icon_url column if it doesn't exist
        await sql`
      ALTER TABLE projects 
      ADD COLUMN IF NOT EXISTS dots_icon_url TEXT;
    `;
        return NextResponse.json({ message: 'Database updated successfully' });
    } catch (error) {
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
