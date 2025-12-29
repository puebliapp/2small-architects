import ProjectGrid from '@/components/ProjectGrid';
import { getProjects } from '@/lib/db';
import styles from './page.module.css';

export const revalidate = 0; // Ensure fresh data on every request (or use a revalidate time like 60). for now 0 to debug.

export default async function Home() {
  const projects = await getProjects();

  return (
    <div className={styles.main}>
      <ProjectGrid projects={projects} />
    </div>
  );
}
