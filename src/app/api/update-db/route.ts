import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Ensure UUID extension exists
        await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`;

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
            ADD COLUMN IF NOT EXISTS description_3 TEXT,
            ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;
        `;

        // Create team_members table
        await sql`
            CREATE TABLE IF NOT EXISTS team_members (
                id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                description_es TEXT,
                description_en TEXT,
                sort_order INTEGER DEFAULT 0,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `;

        // Create site_settings table
        await sql`
            CREATE TABLE IF NOT EXISTS site_settings (
                id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
                logo_url TEXT,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `;

        // Ensure there is at least one row in site_settings
        const settingsCount = await sql`SELECT count(*) FROM site_settings`;
        if (parseInt(settingsCount.rows[0].count) === 0) {
            await sql`INSERT INTO site_settings (logo_url) VALUES (NULL)`;
        }

        return NextResponse.json({ message: 'Database updated successfully (team_members and site_settings confirmed)' });
    } catch (error) {
        console.error('Migration failed', error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
