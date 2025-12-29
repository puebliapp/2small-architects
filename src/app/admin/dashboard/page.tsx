import Link from 'next/link';
import { getProjects } from '@/lib/db';
import styles from './dashboard.module.css';

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
    const projects = await getProjects();

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>Dashboard</h1>
                <Link href="/admin/project/new" className={styles.addButton}>
                    + New Project
                </Link>
            </header>

            <div className={styles.list}>
                {projects.length === 0 ? (
                    <p className={styles.empty}>No projects found. Create one!</p>
                ) : (
                    projects.map((p) => (
                        <div key={p.id} className={styles.item}>
                            <div className={styles.info}>
                                <h3>{p.title}</h3>
                                <p>{p.slug}</p>
                            </div>
                            <div className={styles.actions}>
                                <Link href={`/admin/project/${p.id}`} className={styles.editBtn}>Edit</Link>
                                {/* Delete would need a client component or server action form */}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
