import ProjectForm from '@/components/ProjectForm';
import { getProjectById } from '@/lib/db';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';

export default async function EditProjectPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const id = (await params).id
    const project = await getProjectById(id);

    if (!project) {
        return <div>Project not found</div>;
    }

    return (
        <div className={styles.container}>
            <h1>Edit Project: {project.title}</h1>
            <ProjectForm initialData={project} />
        </div>
    );
}
