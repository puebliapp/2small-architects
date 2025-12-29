'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { LayoutGroup } from 'framer-motion';
import { Suspense } from 'react';
import styles from './project-grid.module.css';
import ProjectCard, { ProjectData } from './ProjectCard';

interface Props {
    projects: ProjectData[];
    // activeSlug?: string; // We use search params now
}

function GridContent({ projects }: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const activeSlug = searchParams.get('project');

    const handleClose = () => {
        router.push('/', { scroll: false });
    };

    // Calculate hidden indices for "Sliding Window" behavior on Desktop (4 cols)
    const hiddenMap = new Set<string>();

    // We assume projects are ordered as they appear in the grid
    const activeIndex = projects.findIndex(p => p.slug === activeSlug);

    if (activeIndex !== -1) {
        // Desktop Grid has 4 columns.
        const ROW_SIZE = 4;
        const rowIndex = Math.floor(activeIndex / ROW_SIZE);
        const colIndex = activeIndex % ROW_SIZE; // 0, 1, 2, 3

        const rowStartIndex = rowIndex * ROW_SIZE;

        // If 3rd card (Index 2) OR 4th card (Index 3) is active -> Hide 1st card (Index 0 of row)
        // This ensures the row width is maintained: 
        // 1 Hidden (0 cols) + 2 Normal (2 cols) + 1 Expanded (2 cols) = 4 Cols Total.
        // This prevents the next row from jumping up.
        if (colIndex === 2 || colIndex === 3) {
            const indexToHide = rowStartIndex + 0;
            if (projects[indexToHide]) hiddenMap.add(projects[indexToHide].id);
        }
    }

    return (
        <LayoutGroup>
            <div className={styles.grid}>
                {projects.map((project) => (
                    <ProjectCard
                        key={project.id}
                        project={project}
                        isExpanded={project.slug === activeSlug}
                        isHidden={hiddenMap.has(project.id)}
                        onClose={handleClose}
                    />
                ))}
            </div>
        </LayoutGroup>
    );
}

export default function ProjectGrid(props: Props) {
    return (
        <Suspense fallback={<div className={styles.grid}>Loading projects...</div>}>
            <GridContent {...props} />
        </Suspense>
    );
}
