'use server';
import { sql } from '@vercel/postgres';
import { put } from '@vercel/blob';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createProject(formData: FormData) {
    const title = formData.get('title') as string;
    const slug = formData.get('slug') as string;
    const location = formData.get('location') as string;
    const type = formData.get('type') as string;
    const description = formData.get('description') as string;

    // File Uploads
    const imageFile = formData.get('imageFile') as File;
    const dotsIconFile = formData.get('dotsIconFile') as File;

    let imageUrl = '';
    let dotsIconUrl = '';

    try {
        if (imageFile && imageFile.size > 0) {
            const blob = await put(imageFile.name, imageFile, {
                access: 'public',
            });
            imageUrl = blob.url;
        }

        if (dotsIconFile && dotsIconFile.size > 0) {
            const blob = await put(dotsIconFile.name, dotsIconFile, {
                access: 'public',
            });
            dotsIconUrl = blob.url;
        }

        await sql`
            INSERT INTO projects (title, slug, location, type, description, image_url, dots_icon_url)
            VALUES (${title}, ${slug}, ${location}, ${type}, ${description}, ${imageUrl}, ${dotsIconUrl})
        `;

        revalidatePath('/admin/dashboard');
        revalidatePath('/');
    } catch (error) {
        console.error('Failed to create project', error);
        // We could return error state here if we converted this to useFormState
        return;
    }

    redirect('/admin/dashboard');
}

export async function updateProject(id: string, formData: FormData) {
    // Similar update logic...
}
