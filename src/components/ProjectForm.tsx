'use client';
import { createProject, updateProject } from '@/app/actions';
import styles from './form.module.css';
import { ProjectData } from './ProjectCard';
import { useState } from 'react';

interface Props {
    initialData?: ProjectData;
}

export default function ProjectForm({ initialData }: Props) {
    const serverAction = initialData ? updateProject.bind(null, initialData.id) : createProject;
    const [pending, setPending] = useState(false);

    async function handleSubmit(formData: FormData) {
        setPending(true);
        try {
            await serverAction(formData);
            // If success, usually redirect happens and component unmounts.
            // But if we want to be safe or if redirect is handled differently:
            // setPending(false); // Only if we stay on page
        } catch (error) {
            console.error(error);
            setPending(false);
            alert('Something went wrong. Please check the logs.');
        }
    }

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
                <label>Gallery Images (Select Multiple)</label>
                {initialData?.images && initialData.images.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        {initialData.images.map((img, i) => (
                            <img key={i} src={img} height={40} />
                        ))}
                    </div>
                )}
                <input
                    name="galleryFiles"
                    type="file"
                    accept="image/*"
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
                <label>Description (HTML allowed)</label>
                <textarea
                    name="description"
                    rows={5}
                    defaultValue={initialData?.description}
                    placeholder="<p>El proyecto...</p>"
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
