import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Allow duplicate slugs as per user request
        await sql`
            ALTER TABLE projects 
            DROP CONSTRAINT IF EXISTS projects_slug_key;
        `;

        // Add missing columns if they don't exist
        await sql`
            ALTER TABLE projects 
            ADD COLUMN IF NOT EXISTS press_link TEXT,
            ADD COLUMN IF NOT EXISTS dots_icon_url TEXT,
            ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}',
            ADD COLUMN IF NOT EXISTS description_2 TEXT,
            ADD COLUMN IF NOT EXISTS description_3 TEXT;
        `;
        return NextResponse.json({ message: 'Database updated successfully (uniqueness removed)' });
    } catch (error) {
        console.error('Migration failed', error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
