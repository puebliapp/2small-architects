'use client';

import { useState } from 'react';
import { Reorder } from 'framer-motion';
import { updateProjectsOrder } from '@/app/actions';
import styles from './dashboard.module.css';
import Link from 'next/link';
import DeleteProjectButton from './DeleteProjectButton';

interface Project {
    id: string;
    title: string;
    slug: string;
    imageUrl?: string;
}

interface Props {
    initialProjects: Project[];
}

export default function ProjectReorderList({ initialProjects }: Props) {
    const [projects, setProjects] = useState(initialProjects);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState('');

    async function handleSaveOrder() {
        setIsSaving(true);
        setMessage('');
        const ids = projects.map(p => p.id);
        const res = await updateProjectsOrder(ids);
        setIsSaving(false);
        if (res.success) {
            setMessage('Order saved successfully!');
            setTimeout(() => setMessage(''), 3000);
        } else {
            alert('Error saving order: ' + res.error);
        }
    }

    const hasChanged = JSON.stringify(projects.map(p => p.id)) !== JSON.stringify(initialProjects.map(p => p.id));

    return (
        <div className={styles.reorderContainer}>
            <div className={styles.reorderHeader}>
                <h2>Manage Project Order</h2>
                <p>Drag items to reorder them.</p>
                {hasChanged && (
                    <button
                        onClick={handleSaveOrder}
                        disabled={isSaving}
                        className={styles.saveOrderBtn}
                    >
                        {isSaving ? 'Saving...' : 'Save New Order'}
                    </button>
                )}
                {message && <span className={styles.successMsg}>{message}</span>}
            </div>

            <Reorder.Group axis="y" values={projects} onReorder={setProjects} className={styles.list}>
                {projects.map((p) => (
                    <Reorder.Item key={p.id} value={p} className={styles.item}>
                        <div className={styles.dragHandle}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="9" cy="5" r="1" fill="currentColor" />
                                <circle cx="9" cy="12" r="1" fill="currentColor" />
                                <circle cx="9" cy="19" r="1" fill="currentColor" />
                                <circle cx="15" cy="5" r="1" fill="currentColor" />
                                <circle cx="15" cy="12" r="1" fill="currentColor" />
                                <circle cx="15" cy="19" r="1" fill="currentColor" />
                            </svg>
                        </div>
                        <div className={styles.info}>
                            <h3 className={styles.projectTitle}>{p.title}</h3>
                            <p className={styles.projectSlug}>{p.slug}</p>
                        </div>
                        <div className={styles.actions}>
                            <Link href={`/admin/project/${p.id}`} className={styles.editBtn}>Edit</Link>
                            <DeleteProjectButton id={p.id} title={p.title} />
                        </div>
                    </Reorder.Item>
                ))}
            </Reorder.Group>
        </div>
    );
}
