'use server';
import { sql } from '@vercel/postgres';
import { put } from '@vercel/blob';
import { revalidatePath } from 'next/cache';


function slugify(text: string) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')     // Replace spaces with -
        .replace(/[^\w-]+/g, '')  // Remove all non-word chars
        .replace(/--+/g, '-');    // Replace multiple - with single -
}

export async function createProject(formData: FormData) {
    const title = formData.get('title') as string;
    const slug = slugify(title); // Automated
    const location = formData.get('location') as string;
    const type = formData.get('type') as string;
    const description = formData.get('description') as string;
    const description2 = formData.get('description2') as string;
    const description3 = formData.get('description3') as string;
    const pressLink = formData.get('pressLink') as string;

    // File Uploads
    const imageFile = formData.get('imageFile') as File;
    const dotsIconFile = formData.get('dotsIconFile') as File;
    const galleryFiles = formData.getAll('galleryFiles') as File[];

    let imageUrl = '';
    let dotsIconUrl = '';
    let galleryUrls: string[] = [];

    try {
        // Upload Gallery first to pick the first one as cover if needed
        for (const file of galleryFiles) {
            if (file && file.size > 0) {
                const blob = await put(file.name, file, {
                    access: 'public',
                    addRandomSuffix: true
                });
                galleryUrls.push(blob.url);
            }
        }

        if (imageFile && imageFile.size > 0) {
            const blob = await put(imageFile.name, imageFile, {
                access: 'public',
                addRandomSuffix: true
            });
            imageUrl = blob.url;
        } else if (galleryUrls.length > 0) {
            imageUrl = galleryUrls[0]; // Auto-pick first as cover
        }

        if (dotsIconFile && dotsIconFile.size > 0) {
            const blob = await put(dotsIconFile.name, dotsIconFile, {
                access: 'public',
                addRandomSuffix: true
            });
            dotsIconUrl = blob.url;
        }

        await sql`
            INSERT INTO projects (title, slug, location, type, description, description_2, description_3, image_url, dots_icon_url, images, press_link)
            VALUES (${title}, ${slug}, ${location}, ${type}, ${description}, ${description2}, ${description3}, ${imageUrl}, ${dotsIconUrl}, ${galleryUrls as any}, ${pressLink})
        `;

        revalidatePath('/admin/dashboard');
        revalidatePath('/');
        return { success: true };
    } catch (error: any) {
        console.error('Failed to create project - Full Error:', error);
        if (error.message?.includes('projects_slug_key')) {
            return { success: false, error: 'El proyecto ya existe (título similar). Por favor, cambia el título.' };
        }
        return { success: false, error: `Upload error: ${error.message || String(error)}` };
    }
}

export async function updateProject(id: string, formData: FormData) {
    const title = formData.get('title') as string;
    const slug = slugify(title); // Maintain automated slug sync
    const location = formData.get('location') as string;
    const type = formData.get('type') as string;
    const description = formData.get('description') as string;
    const description2 = formData.get('description2') as string;
    const description3 = formData.get('description3') as string;
    const pressLink = formData.get('pressLink') as string;

    const imageFile = formData.get('imageFile') as File;
    const dotsIconFile = formData.get('dotsIconFile') as File;
    const galleryFiles = formData.getAll('galleryFiles') as File[];

    try {
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
            await sql`UPDATE projects SET images = array_cat(images, ${newGalleryUrls as any}) WHERE id = ${id}`;
        }

        // Execute main fields update
        await sql`UPDATE projects SET 
            title = ${title}, 
            slug = ${slug}, 
            location = ${location}, 
            type = ${type}, 
            description = ${description},
            description_2 = ${description2},
            description_3 = ${description3},
            press_link = ${pressLink}
            WHERE id = ${id}
        `;

        // Safety: ensure image_url is set if it was somehow cleared, by pointing to first image
        await sql`UPDATE projects SET image_url = (SELECT images[1] FROM projects WHERE id = ${id}) WHERE id = ${id} AND (image_url IS NULL OR image_url = '')`;

        revalidatePath('/admin/dashboard');
        revalidatePath(`/admin/project/${id}`);
        revalidatePath('/');
        return { success: true };
    } catch (e: any) {
        console.error('Update failed - Full Error:', e);
        return { success: false, error: `Update upload error: ${e.message || String(e)}` };
    }
}

export async function deleteProject(id: string) {
    try {
        await sql`DELETE FROM projects WHERE id = ${id}`;
        revalidatePath('/admin/dashboard');
        revalidatePath('/');
        return { success: true };
    } catch (e) {
        console.error('Delete failed', e);
        return { success: false, error: String(e) };
    }
}

export async function removeImageFromProject(id: string, imageUrl: string) {
    try {
        await sql`UPDATE projects SET images = array_remove(images, ${imageUrl}) WHERE id = ${id}`;
        // Revalidate project edit page to see reflected change
        revalidatePath(`/admin/project/${id}`);
        revalidatePath('/');
        return { success: true };
    } catch (e) {
        console.error('Image removal failed', e);
        return { success: false, error: String(e) };
    }
}

export async function updateSiteLogo(formData: FormData) {
    const logoFile = formData.get('logoFile') as File;

    if (!logoFile || logoFile.size === 0) {
        return { success: false, error: 'No se ha seleccionado ningún archivo' };
    }

    try {
        const blob = await put(logoFile.name, logoFile, {
            access: 'public',
            addRandomSuffix: true
        });

        await sql`UPDATE site_settings SET logo_url = ${blob.url}`;

        revalidatePath('/admin/dashboard');
        revalidatePath('/');
        return { success: true };
    } catch (e) {
        console.error('Logo update failed', e);
        return { success: false, error: String(e) };
    }
}

export async function updateProjectsOrder(projectIds: string[]) {
    try {
        // Update each project's sort_order based on its index in the array
        const updates = projectIds.map((id, index) =>
            sql`UPDATE projects SET sort_order = ${index} WHERE id = ${id}`
        );

        await Promise.all(updates);

        revalidatePath('/admin/dashboard');
        revalidatePath('/');
        return { success: true };
    } catch (e) {
        console.error('Order update failed', e);
        return { success: false, error: String(e) };
    }
}

export async function updateGalleryOrder(projectId: string, imageUrls: string[]) {
    try {
        await sql`UPDATE projects SET images = ${imageUrls as any} WHERE id = ${projectId}`;

        revalidatePath(`/admin/project/${projectId}`);
        revalidatePath('/');
        return { success: true };
    } catch (e) {
        console.error('Gallery order update failed', e);
        return { success: false, error: String(e) };
    }
}
