'use server';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createProject(formData: FormData) {
    const title = formData.get('title') as string;
    const slug = formData.get('slug') as string;
    const location = formData.get('location') as string;
    const type = formData.get('type') as string;
    const description = formData.get('description') as string;
    const imageUrl = formData.get('imageUrl') as string; // Ideally file upload, but text URL for MVP

    try {
        await sql`
      INSERT INTO projects (title, slug, location, type, description, image_url)
      VALUES (${title}, ${slug}, ${location}, ${type}, ${description}, ${imageUrl})
    `;
        revalidatePath('/admin/dashboard');
        revalidatePath('/');
    } catch (error) {
        console.error('Failed to create project', error);
        return;
    }

    redirect('/admin/dashboard');
}

export async function updateProject(id: string, formData: FormData) {
    // Similar update logic...
}
