'use client';

import { useState, useEffect } from 'react';
import { updateGalleryOrder, removeImageFromProject } from '@/app/actions';
import styles from './gallery-reorder.module.css';

interface GalleryReorderProps {
    projectId: string;
    initialImages: string[];
}

export default function GalleryReorder({ projectId, initialImages }: GalleryReorderProps) {
    const [items, setItems] = useState<{ url: string, order: number }[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Initialize with default 1-based ordering
        setItems(initialImages.map((url, i) => ({ url, order: i + 1 })));
    }, [initialImages]);

    const isVideo = (url: string) => {
        const videoExtensions = ['.mp4', '.webm', '.mov', '.avi', '.m4v'];
        return videoExtensions.some(ext => url.toLowerCase().endsWith(ext));
    };

    const handleOrderChange = (url: string, newOrder: string) => {
        const val = parseInt(newOrder) || 0;
        setItems(prev => prev.map(item => item.url === url ? { ...item, order: val } : item));
    };

    // Sort items for display whenever they change
    const sortedItems = [...items].sort((a, b) => a.order - b.order);

    async function handleSaveOrder() {
        setIsSaving(true);
        setMessage('');

        // Use the displayed (sorted) URLs for the update
        const sortedUrls = sortedItems.map(item => item.url);

        const res = await updateGalleryOrder(projectId, sortedUrls);
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

        const res = await removeImageFromProject(projectId, url);
        if (res.success) {
            setItems(prev => prev.filter(i => i.url !== url));
        } else {
            alert('Error removing item: ' + res.error);
        }
    }

    const hasChanged = JSON.stringify(sortedItems.map(i => i.url)) !== JSON.stringify(initialImages);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <label>Gallery (Set positions 1, 2, 3...)</label>
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

            <div className={styles.grid}>
                {sortedItems.map((item) => (
                    <div key={item.url} className={styles.item}>
                        <div className={styles.mediaWrapper}>
                            {isVideo(item.url) ? (
                                <video src={item.url} className={styles.media} />
                            ) : (
                                <img src={item.url} className={styles.media} alt="" />
                            )}
                            <button
                                type="button"
                                onClick={() => handleRemove(item.url)}
                                className={styles.removeBtn}
                            >
                                ×
                            </button>
                        </div>
                        <div className={styles.orderInputWrapper}>
                            <input
                                type="number"
                                value={item.order}
                                onChange={(e) => handleOrderChange(item.url, e.target.value)}
                                className={styles.orderInput}
                                min="1"
                            />
                        </div>
                    </div>
                ))}
            </div>
            <p className={styles.hint}>Change the numbers to reorder. The list updates instantly.</p>
        </div>
    );
}
