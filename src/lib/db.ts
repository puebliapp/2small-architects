import { sql } from '@vercel/postgres';

export async function createTable() {
  try {
    // Ensure UUID extension exists FIRST
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`;

    await sql`
      CREATE TABLE IF NOT EXISTS projects (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        location VARCHAR(255),
        type VARCHAR(255),
        slug VARCHAR(255) UNIQUE NOT NULL,
        image_url TEXT,
        description TEXT,
        images TEXT[], -- Array of strings for gallery
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
  } catch (error) {
    console.error('Failed to create table:', error);
    throw error;
  }
}

import { PROJECTS } from './data';

// Helper to fetch all (replacing static data eventually)
export async function getProjects() {
  try {
    const { rows } = await sql`
        SELECT id, title, slug, location, type, description, image_url as "imageUrl", images 
        FROM projects 
        ORDER BY created_at DESC
      `;
    // If we have rows, return them. If empty, return empty (so user sees their empty DB).
    // Only return mock data if there is an ERROR connecting (and maybe only in dev).
    return rows as any[];
  } catch (e) {
    console.error("DB Error:", e);
    // In production, we might prefer to show empty state + error rather than mock data
    // to avoid confusion "I deleted everything but it's still there".
    // But for safety let's return empty array if error occurs in prod?
    // Or keep mock data only if locally developing.
    if (process.env.NODE_ENV === 'development') {
      return PROJECTS;
    }
    // In prod, return empty array so at least site loads (but blank).
    // Or re-throw? Re-throwing 500s the site.
    // Let's return empty array so user knows connection worked (or failed safely).
    return [];
  }
}


