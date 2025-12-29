import ProjectForm from '@/components/ProjectForm';
import styles from './page.module.css';

export default function NewProjectPage() {
    return (
        <div className={styles.container}>
            <h1>New Project</h1>
            <ProjectForm />
        </div>
    );
}
