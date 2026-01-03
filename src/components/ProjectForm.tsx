'use client';
import { createProject, updateProject, removeImageFromProject } from '@/app/actions';
import styles from './form.module.css';
import { ProjectData } from './ProjectCard';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import GalleryReorder from './GalleryReorder';

interface Props {
    initialData?: ProjectData;
}

export default function ProjectForm({ initialData }: Props) {
    const serverAction = initialData ? updateProject.bind(null, initialData.id) : createProject;
    const [pending, setPending] = useState(false);
    const router = useRouter();

    async function handleSubmit(formData: FormData) {
        setPending(true);
        try {
            const res = await serverAction(formData);
            if (res && res.success) {
                router.push('/admin/dashboard');
            } else {
                setPending(false);
                alert('Error saving project: ' + (res?.error || 'Unknown error'));
            }
        } catch (error: any) {
            console.error(error);
            setPending(false);
            alert('Something went wrong. Please check the logs.');
        }
    }

    const isVideo = (url: string) => {
        const videoExtensions = ['.mp4', '.webm', '.mov', '.avi', '.m4v'];
        return videoExtensions.some(ext => url.toLowerCase().endsWith(ext));
    };

    return (
        <form action={handleSubmit} className={styles.form}>
            <div className={styles.group}>
                <label>Title</label>
                <input name="title" required defaultValue={initialData?.title} placeholder="e.g. Casa Agustin" />
            </div>

            <div className={styles.group}>
                <label>Slug</label>
                <input name="slug" required defaultValue={initialData?.slug} placeholder="e.g. casa-agustin" />
            </div>

            <div className={styles.group}>
                <label>Location</label>
                <input name="location" defaultValue={initialData?.location} placeholder="e.g. Asturias" />
            </div>

            <div className={styles.group}>
                <label>Type</label>
                <input name="type" defaultValue={initialData?.type} placeholder="e.g. Residential" />
            </div>

            <div className={styles.group}>
                <label>Project Image (Main)</label>
                {initialData?.imageUrl && (
                    <div style={{ marginBottom: '0.5rem' }}>
                        <img src={initialData.imageUrl} alt="Current" height={50} />
                    </div>
                )}
                <input
                    name="imageFile"
                    type="file"
                    accept="image/*"
                    required={!initialData?.imageUrl}
                    className={styles.input}
                />
            </div>

            <div className={styles.group}>
                {initialData?.id && (
                    <GalleryReorder
                        projectId={initialData.id}
                        initialImages={initialData.images || []}
                    />
                )}

                <label>Add More to Gallery (Images/Videos)</label>
                <input
                    name="galleryFiles"
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    className={styles.input}
                />
            </div>

            <div className={styles.group}>
                <label>Dots Icon (PNG/SVG, Optional)</label>
                {initialData?.dotsIconUrl && (
                    <div style={{ marginBottom: '0.5rem' }}>
                        <img src={initialData.dotsIconUrl} alt="Dots" height={24} />
                    </div>
                )}
                <input
                    name="dotsIconFile"
                    type="file"
                    accept="image/png, image/svg+xml"
                    className={styles.input}
                />
            </div>

            <div className={styles.group}>
                <label>Descripción 1 (Principal)</label>
                <textarea
                    name="description"
                    rows={4}
                    defaultValue={initialData?.description}
                    placeholder="Contenido principal..."
                ></textarea>
            </div>

            <div className={styles.group}>
                <label>Descripción 2 (Opacidad 30%)</label>
                <textarea
                    name="description2"
                    rows={3}
                    defaultValue={initialData?.description2}
                    placeholder="Segunda parte..."
                ></textarea>
            </div>

            <div className={styles.group}>
                <label>Descripción 3 (Opacidad 30%)</label>
                <textarea
                    name="description3"
                    rows={3}
                    defaultValue={initialData?.description3}
                    placeholder="Tercera parte..."
                ></textarea>
            </div>

            <div className={styles.group}>
                <label>Press Link (Optional)</label>
                <input name="pressLink" defaultValue={initialData?.pressLink} placeholder="https://..." />
            </div>

            <button type="submit" className={styles.submit} disabled={pending}>
                {pending
                    ? (initialData ? 'Updating...' : 'Creating...')
                    : (initialData ? 'Update Project' : 'Create Project')
                }
            </button>
        </form>
    );
}
