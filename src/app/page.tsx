import ProjectGrid from '@/components/ProjectGrid';
import { PROJECTS } from '@/lib/data';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.main}>
      <ProjectGrid projects={PROJECTS} />
    </div>
  );
}
