import ProjectGrid from '@/components/ProjectGrid';
import { getProjects } from '@/lib/db';
import { notFound } from 'next/navigation';
import styles from '../../page.module.css'; // Re-use home styles

// Ensure this page is treated as dynamic so it fetches fresh data from DB on load
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ProjectPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const slug = (await params).slug
    const allProjects = await getProjects();
    const project = allProjects.find((p: any) => p.slug === slug);

    if (!project) {
        notFound();
    }

    // We render the SAME grid as home, but tell it which one is active
    return (
        <div className={styles.main}>
            <ProjectGrid projects={allProjects} activeSlug={slug} />
        </div>
    );
}
