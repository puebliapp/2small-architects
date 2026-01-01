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
        slug VARCHAR(255) NOT NULL,
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
        SELECT id, title, slug, location, type, description, 
               description_2 as "description2", description_3 as "description3",
               image_url as "imageUrl", dots_icon_url as "dotsIconUrl", images 
        FROM projects 
        ORDER BY created_at DESC
      `;
    return rows as any[];
  } catch (e) {
    console.error("DB Error:", e);
    if (process.env.NODE_ENV === 'development') {
      return PROJECTS;
    }
    return [];
  }
}

// Fetch single project by ID (for admin edit)
export async function getProjectById(id: string) {
  try {
    const { rows } = await sql`
        SELECT id, title, slug, location, type, description,
               description_2 as "description2", description_3 as "description3",
               image_url as "imageUrl", dots_icon_url as "dotsIconUrl", images, press_link as "pressLink"
        FROM projects 
        WHERE id = ${id}
      `;
    return rows[0] as any;
  } catch (e) {
    console.error("DB Error fetching project:", e);
    return null;
  }
}

export async function getSiteSettings() {
  try {
    const { rows } = await sql`SELECT id, logo_url as "logoUrl" FROM site_settings LIMIT 1`;
    return rows[0] as { id: string, logoUrl: string | null };
  } catch (e) {
    console.error("DB Error fetching settings:", e);
    return { id: '', logoUrl: null };
  }
}
