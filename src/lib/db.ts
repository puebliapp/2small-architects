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
               description_2 as "description_2", description_3 as "description_3",
               image_url as "image_url", dots_icon_url as "dots_icon_url", images,
               sort_order as "sort_order"
        FROM projects 
        ORDER BY sort_order ASC, created_at DESC
      `;
    return (rows || []).map(row => ({
      id: row.id,
      title: row.title,
      slug: row.slug,
      location: row.location,
      type: row.type,
      description: row.description,
      description2: row.description_2,
      description3: row.description_3,
      imageUrl: row.image_url,
      dotsIconUrl: row.dots_icon_url,
      images: row.images,
      sortOrder: row.sort_order
    })) as any[];
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

export interface TeamMember {
  id: string;
  name: string;
  description_es: string;
  description_en: string;
  sort_order: number;
}

export async function getTeamMembers() {
  try {
    const { rows } = await sql`
        SELECT id, name, description_es, description_en, sort_order
        FROM team_members 
        ORDER BY sort_order ASC, created_at ASC
      `;
    return rows.map(row => ({
      id: row.id,
      name: row.name,
      description_es: row.description_es,
      description_en: row.description_en,
      sort_order: row.sort_order
    })) as TeamMember[];
  } catch (e) {
    console.error("DB Error fetching team members:", e);
    return [];
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
