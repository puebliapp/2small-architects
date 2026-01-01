import { createProject, updateProject } from '@/app/actions';
import styles from './form.module.css';
import { ProjectData } from './ProjectCard';
import { useFormStatus } from 'react-dom';

interface Props {
    initialData?: ProjectData;
}

function SubmitButton({ isEditing }: { isEditing: boolean }) {
    const { pending } = useFormStatus();

    return (
        <button type="submit" className={styles.submit} disabled={pending}>
            {pending ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Project' : 'Create Project')}
        </button>
    );
}

export default function ProjectForm({ initialData }: Props) {
    const action = initialData ? updateProject.bind(null, initialData.id) : createProject;
    const isEditing = !!initialData;

    return (
        <form action={action} className={styles.form}>
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

            <SubmitButton isEditing={isEditing} />
        </form>
    );
}
