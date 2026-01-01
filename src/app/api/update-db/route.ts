import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Add missing columns
        await sql`
            ALTER TABLE projects 
            ADD COLUMN IF NOT EXISTS press_link TEXT,
            ADD COLUMN IF NOT EXISTS dots_icon_url TEXT,
            ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}',
            ADD COLUMN IF NOT EXISTS description_2 TEXT,
            ADD COLUMN IF NOT EXISTS description_3 TEXT;
        `;
        return NextResponse.json({ message: 'Database updated successfully (columns added/verified)' });
    } catch (error) {
        console.error('Migration failed', error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
