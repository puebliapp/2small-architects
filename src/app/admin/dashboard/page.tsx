import Link from 'next/link';
import { getProjects, getSiteSettings, getTeamMembers } from '@/lib/db';
import styles from './dashboard.module.css';
import SiteSettingsForm from '@/components/SiteSettingsForm';
import ProjectReorderList from '@/components/ProjectReorderList';
import PeopleManager from '@/components/PeopleManager';

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
    const projects = await getProjects();
    const settings = await getSiteSettings();
    const teamMembers = await getTeamMembers();

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>Dashboard</h1>
                <Link href="/admin/project/new" className={styles.addButton}>
                    + New Project
                </Link>
            </header>

            <SiteSettingsForm currentLogo={settings?.logoUrl} />

            <PeopleManager initialMembers={teamMembers} />

            {projects.length === 0 ? (
                <div className={styles.list}>
                    <p className={styles.empty}>No projects found. Create one!</p>
                </div>
            ) : (
                <ProjectReorderList initialProjects={projects} />
            )}
        </div>
    );
}
