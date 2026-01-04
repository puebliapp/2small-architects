'use client';

import { useState } from 'react';
import { Reorder } from 'framer-motion';
import { updateProjectsOrder } from '@/app/actions';
import styles from './project-reorder.module.css';
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
                <div className={styles.titleGroup}>
                    <h2>Manage Projects</h2>
                    {message && <span className={styles.successMsg}>{message}</span>}
                </div>
                <div className={styles.headerActions}>
                    {hasChanged && (
                        <button
                            onClick={handleSaveOrder}
                            disabled={isSaving}
                            className={styles.saveOrderBtn}
                        >
                            {isSaving ? 'Saving...' : 'Save New Order'}
                        </button>
                    )}
                    <Link href="/admin/project/new" className={styles.addBtn}>
                        + Add New Project
                    </Link>
                </div>
            </div>

            <Reorder.Group axis="y" values={projects} onReorder={setProjects} className={styles.list}>
                {projects.map((p) => (
                    <Reorder.Item key={p.id} value={p} className={styles.item}>
                        <div className={styles.dragHandle}>☰</div>
                        <div className={styles.info}>
                            <h3 className={styles.projectTitle}>{p.title}</h3>
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
