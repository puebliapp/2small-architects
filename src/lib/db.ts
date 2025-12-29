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
    // If we are in dev without DB, return null or handle gracefully?
    // For now simple wrapper
    try {
        const { rows } = await sql`
        SELECT id, title, slug, location, type, description, image_url as "imageUrl", images 
        FROM projects 
        ORDER BY created_at DESC
      `;
        return rows;
    } catch (e) {
        console.warn("DB not connected or query failed, returning mock data", e);
        return PROJECTS;
    }
}


