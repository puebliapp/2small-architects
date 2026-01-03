'use client';

import { useState, useEffect } from 'react';
import { Reorder } from 'framer-motion';
import { updateGalleryOrder, removeImageFromProject } from '@/app/actions';
import styles from './gallery-reorder.module.css';

interface GalleryReorderProps {
    projectId: string;
    initialImages: string[];
}

export default function GalleryReorder({ projectId, initialImages }: GalleryReorderProps) {
    const [items, setItems] = useState(initialImages);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState('');

    // Update items if initialImages changes (e.g., after a deletion or upload)
    useEffect(() => {
        setItems(initialImages);
    }, [initialImages]);

    const isVideo = (url: string) => {
        const videoExtensions = ['.mp4', '.webm', '.mov', '.avi', '.m4v'];
        return videoExtensions.some(ext => url.toLowerCase().endsWith(ext));
    };

    async function handleSaveOrder() {
        setIsSaving(true);
        setMessage('');
        const res = await updateGalleryOrder(projectId, items);
        setIsSaving(false);
        if (res.success) {
            setMessage('Order saved!');
            setTimeout(() => setMessage(''), 3000);
        } else {
            alert('Error saving gallery order: ' + res.error);
        }
    }

    async function handleRemove(url: string) {
        if (!confirm('Are you sure you want to remove this item?')) return;

        // Optimistic UI update
        const newItems = items.filter(i => i !== url);
        setItems(newItems);

        const res = await removeImageFromProject(projectId, url);
        if (!res.success) {
            alert('Error removing item: ' + res.error);
            setItems(items); // Revert
        }
    }

    const hasChanged = JSON.stringify(items) !== JSON.stringify(initialImages);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <label>Gallery Reorder & Management</label>
                {hasChanged && (
                    <button
                        type="button"
                        onClick={handleSaveOrder}
                        disabled={isSaving}
                        className={styles.saveBtn}
                    >
                        {isSaving ? 'Saving...' : 'Save New Order'}
                    </button>
                )}
                {message && <span className={styles.success}>{message}</span>}
            </div>

            <Reorder.Group
                axis="x"
                values={items}
                onReorder={setItems}
                className={styles.grid}
                layoutScroll
                style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', overflowX: 'auto', padding: '1rem 0' }}
            >
                {items.map((url) => (
                    <Reorder.Item
                        key={url}
                        value={url}
                        className={styles.item}
                        style={{ position: 'relative', cursor: 'grab' }}
                    >
                        {isVideo(url) ? (
                            <video src={url} className={styles.media} />
                        ) : (
                            <img src={url} className={styles.media} alt="" />
                        )}
                        <button
                            type="button"
                            onClick={() => handleRemove(url)}
                            className={styles.removeBtn}
                        >
                            ×
                        </button>
                    </Reorder.Item>
                ))}
            </Reorder.Group>
            <p className={styles.hint}>Drag thumbnails to reorder the gallery.</p>
        </div>
    );
}
