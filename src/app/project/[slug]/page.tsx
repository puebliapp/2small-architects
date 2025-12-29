import ProjectGrid from '@/components/ProjectGrid';
import { PROJECTS, getProjectBySlug } from '@/lib/data';
import { notFound } from 'next/navigation';
import styles from '../../page.module.css'; // Re-use home styles

// Needed for static generation
export async function generateStaticParams() {
    return PROJECTS.map((project) => ({
        slug: project.slug,
    }));
}

export default async function ProjectPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const slug = (await params).slug
    const project = getProjectBySlug(slug);

    if (!project) {
        notFound();
    }

    // We render the SAME grid as home, but tell it which one is active
    return (
        <div className={styles.main}>
            <ProjectGrid projects={PROJECTS} activeSlug={slug} />
        </div>
    );
}
