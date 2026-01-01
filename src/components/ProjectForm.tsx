'use client';
import { createProject, updateProject, removeImageFromProject } from '@/app/actions';
import styles from './form.module.css';
import { ProjectData } from './ProjectCard';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
    initialData?: ProjectData;
}

export default function ProjectForm({ initialData }: Props) {
    const serverAction = initialData ? updateProject.bind(null, initialData.id) : createProject;
    const [pending, setPending] = useState(false);
    const router = useRouter();

    async function handleRemoveImage(imageUrl: string) {
        if (!initialData?.id || !confirm('¿Seguro que quieres eliminar esta imagen de la galería?')) return;

        setPending(true);
        const res = await removeImageFromProject(initialData.id, imageUrl);
        if (res.success) {
            router.refresh();
            setPending(false);
        } else {
            setPending(false);
            alert('Error al borrar imagen: ' + res.error);
        }
    }

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
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                        {initialData.images.map((img, i) => (
                            <div key={i} style={{ position: 'relative' }}>
                                <img src={img} height={80} style={{ borderRadius: '8px', border: '1px solid #ddd' }} alt="" />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveImage(img)}
                                    style={{
                                        position: 'absolute', top: -5, right: -5,
                                        background: '#ef4444', color: 'white', border: '2px solid white',
                                        borderRadius: '50%', width: 22, height: 22, cursor: 'pointer',
                                        fontSize: 14, fontWeight: 'bold'
                                    }}
                                >×</button>
                            </div>
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
