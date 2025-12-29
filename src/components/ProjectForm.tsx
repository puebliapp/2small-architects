'use client';
import { createProject } from '@/app/actions';
import styles from './form.module.css';

export default function ProjectForm() {
    return (
        <form action={createProject} className={styles.form}>
            <div className={styles.group}>
                <label>Title</label>
                <input name="title" required placeholder="e.g. Casa Agustin" />
            </div>

            <div className={styles.group}>
                <label>Slug</label>
                <input name="slug" required placeholder="e.g. casa-agustin" />
            </div>

            <div className={styles.group}>
                <label>Location</label>
                <input name="location" placeholder="e.g. Asturias" />
            </div>

            <div className={styles.group}>
                <label>Type</label>
                <input name="type" placeholder="e.g. Residential" />
            </div>

            <div className={styles.group}>
                <label>Image URL (Main)</label>
                <input name="imageUrl" placeholder="https://..." />
            </div>

            <div className={styles.group}>
                <label>Description (HTML allowed)</label>
                <textarea name="description" rows={5} placeholder="<p>El proyecto...</p>"></textarea>
            </div>

            <button type="submit" className={styles.submit}>Save Project</button>
        </form>
    );
}
