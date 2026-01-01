'use server';
import { sql } from '@vercel/postgres';
import { put } from '@vercel/blob';
import { revalidatePath } from 'next/cache';


export async function createProject(formData: FormData) {
    const title = formData.get('title') as string;
    const slug = formData.get('slug') as string;
    const location = formData.get('location') as string;
    const type = formData.get('type') as string;
    const description = formData.get('description') as string;
    const pressLink = formData.get('pressLink') as string;

    // File Uploads
    const imageFile = formData.get('imageFile') as File;
    const dotsIconFile = formData.get('dotsIconFile') as File;
    const galleryFiles = formData.getAll('galleryFiles') as File[];

    let imageUrl = '';
    let dotsIconUrl = '';
    let galleryUrls: string[] = [];

    try {
        if (imageFile && imageFile.size > 0) {
            const blob = await put(imageFile.name, imageFile, {
                access: 'public',
                addRandomSuffix: true
            });
            imageUrl = blob.url;
        }

        if (dotsIconFile && dotsIconFile.size > 0) {
            const blob = await put(dotsIconFile.name, dotsIconFile, {
                access: 'public',
                addRandomSuffix: true
            });
            dotsIconUrl = blob.url;
        }

        // Upload Gallery
        for (const file of galleryFiles) {
            if (file && file.size > 0) {
                const blob = await put(file.name, file, {
                    access: 'public',
                    addRandomSuffix: true
                });
                galleryUrls.push(blob.url);
            }
        }

        // If main image exists, add it to gallery 0 index if desired, or keep separate?
        // ProjectCard logic: `project.images && project.images.length > 0 ? project.images : [project.imageUrl]`
        // So `images` takes precedence. If we want carousel, we must save `images`.
        // Let's prepend main image to gallery if not empty? Or just save gallery.
        // If user uploads gallery, we save it.

        await sql`
            INSERT INTO projects (title, slug, location, type, description, image_url, dots_icon_url, images, press_link)
            VALUES (${title}, ${slug}, ${location}, ${type}, ${description}, ${imageUrl}, ${dotsIconUrl}, ${galleryUrls as any}, ${pressLink})
        `;

        revalidatePath('/admin/dashboard');
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Failed to create project', error);
        return { success: false, error: String(error) };
    }
}

export async function updateProject(id: string, formData: FormData) {
    const title = formData.get('title') as string;
    const slug = formData.get('slug') as string;
    const location = formData.get('location') as string;
    const type = formData.get('type') as string;
    const description = formData.get('description') as string;
    const pressLink = formData.get('pressLink') as string;

    const imageFile = formData.get('imageFile') as File;
    const dotsIconFile = formData.get('dotsIconFile') as File;
    const galleryFiles = formData.getAll('galleryFiles') as File[];

    try {
        // Construct generic update parts
        // For files, we only update if new file provided.
        // For gallery, we APPEND new files to existing array (using Postgres array_cat or just fetch/update).
        // Simpler: array_cat(images, ${newUrls}).

        let updateQuery = sql`UPDATE projects SET 
            title = ${title}, 
            slug = ${slug}, 
            location = ${location}, 
            type = ${type}, 
            description = ${description},
            press_link = ${pressLink}
        `;

        // Handle Image Update
        if (imageFile && imageFile.size > 0) {
            const blob = await put(imageFile.name, imageFile, {
                access: 'public',
                addRandomSuffix: true
            });
            await sql`UPDATE projects SET image_url = ${blob.url} WHERE id = ${id}`;
        }

        // Handle Dots Icon Update
        if (dotsIconFile && dotsIconFile.size > 0) {
            const blob = await put(dotsIconFile.name, dotsIconFile, {
                access: 'public',
                addRandomSuffix: true
            });
            await sql`UPDATE projects SET dots_icon_url = ${blob.url} WHERE id = ${id}`;
        }

        // Handle Gallery Append
        const newGalleryUrls: string[] = [];
        for (const file of galleryFiles) {
            if (file && file.size > 0) {
                const blob = await put(file.name, file, {
                    access: 'public',
                    addRandomSuffix: true
                });
                newGalleryUrls.push(blob.url);
            }
        }

        if (newGalleryUrls.length > 0) {
            // Append to existing array. usage: array_cat code is slightly specific.
            // Standard SQL: images || newArray
            // Postgres: array_cat(images, ${newGalleryUrls})
            await sql`UPDATE projects SET images = array_cat(images, ${newGalleryUrls as any}) WHERE id = ${id}`;
        }

        // Execute main fields update
        await sql`UPDATE projects SET 
            title = ${title}, 
            slug = ${slug}, 
            location = ${location}, 
            type = ${type}, 
            description = ${description},
            press_link = ${pressLink}
            WHERE id = ${id}
        `;

        revalidatePath('/admin/dashboard');
        revalidatePath('/');
        return { success: true };
    } catch (e) {
        console.error('Update failed', e);
        return { success: false, error: String(e) };
    }
}
