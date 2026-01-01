import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './project-card.module.css';

// ... (ProjectData interface remains same)
export interface ProjectData {
    id: string;
    title: string;
    slug: string;
    type: string;
    location: string;
    imageUrl: string;
    images?: string[];
    description?: string;
    description2?: string;
    description3?: string;
    pressLink?: string;
    dotsIconUrl?: string;
}

interface Props {
    project: ProjectData;
    isExpanded?: boolean;
    isHidden?: boolean;
    onClose?: () => void;
}

export default function ProjectCard({ project, isExpanded, isHidden, onClose }: Props) {
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    const gallery = project.images && project.images.length > 0
        ? project.images
        : [project.imageUrl];

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isHovered && gallery.length > 1) {
            interval = setInterval(() => {
                setActiveImageIndex(prev => (prev + 1) % gallery.length);
            }, 2000);
        } else {
            setActiveImageIndex(0);
        }
        return () => clearInterval(interval);
    }, [isHovered, isExpanded, gallery.length]);

    // Handle clicks on image when Expanded
    const handleImageClick = (e: React.MouseEvent) => {
        if (isExpanded && onClose) {
            e.preventDefault();
            e.stopPropagation();
            onClose(); // Close immediately to start layout transition
        }
    };

    // Shared content for Left Column (Image + Info)
    const leftColumnContent = (
        <motion.div layout className={styles.leftColumn}>
            <motion.div
                layout
                className={styles.imageContainer}
                onClick={handleImageClick}
                style={{ position: 'relative' }}
            >
                <Image
                    key={activeImageIndex}
                    src={gallery[activeImageIndex]}
                    alt={project.title}
                    fill
                    className={styles.image}
                    sizes={isExpanded ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 25vw"}
                    priority={isExpanded || isHovered}
                    style={{ objectFit: 'cover' }}
                />
            </motion.div>
            <motion.div layout className={styles.info}>
                <h3 className={styles.title}>{project.title}</h3>
                <p className={styles.meta}>{project.location} &mdash; {project.type}</p>
            </motion.div>
        </motion.div>
    );

    const transitionConfig = { duration: 1.2, ease: [0.25, 1, 0.5, 1] as const };

    return (
        <motion.div
            layout
            transition={transitionConfig}
            className={`${styles.card} ${isExpanded ? styles.expanded : ''} ${isHidden ? styles.desktopHidden : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className={styles.innerWrapper}>
                {isExpanded ? (
                    <div style={{ display: 'flex', width: '100%', height: '100%', flexDirection: 'row', gap: '1rem' }}>
                        {leftColumnContent}
                    </div>
                ) : (
                    <Link
                        href={`/?project=${project.slug}`}
                        scroll={false}
                        className={styles.linkWrapper}
                    >
                        {leftColumnContent}
                    </Link>
                )}

                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            key="expanded-content"
                            initial={{ x: "20%", opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: "20%", opacity: 0 }}
                            transition={transitionConfig}
                            className={styles.expandedContent}
                        >
                            <div className={styles.dotsIcon}>
                                {project.dotsIconUrl ? (
                                    <div style={{ position: 'relative', width: '38px', height: '38px' }}>
                                        <Image
                                            src={project.dotsIconUrl}
                                            alt="Dots"
                                            fill
                                            style={{ objectFit: 'contain' }}
                                        />
                                    </div>
                                ) : (
                                    <svg width="38" height="38" viewBox="0 0 24 24" fill="black">
                                        <circle cx="12" cy="4" r="2.5" />
                                        <circle cx="12" cy="12" r="2.5" />
                                        <circle cx="12" cy="20" r="2.5" />
                                        <circle cx="4" cy="12" r="2.5" />
                                        <circle cx="20" cy="12" r="2.5" />
                                    </svg>
                                )}
                            </div>

                            <div className={styles.textContent}>
                                <div
                                    className={styles.description}
                                    dangerouslySetInnerHTML={{ __html: project.description || '' }}
                                />
                                {project.description2 && (
                                    <div
                                        className={styles.description}
                                        style={{ opacity: 0.3, marginTop: '1rem' }}
                                        dangerouslySetInnerHTML={{ __html: project.description2 }}
                                    />
                                )}
                                {project.description3 && (
                                    <div
                                        className={styles.description}
                                        style={{ opacity: 0.3, marginTop: '1rem' }}
                                        dangerouslySetInnerHTML={{ __html: project.description3 }}
                                    />
                                )}

                                {project.pressLink && (
                                    <div className={styles.press}>
                                        <p className={styles.pressLabel}>Press</p>
                                        <a href={project.pressLink} target="_blank" className={styles.pressLink}>Enlace al articulo</a>
                                    </div>
                                )}
                            </div>

                            <div
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (onClose) onClose();
                                }}
                                className={styles.closeArea}
                                style={{ cursor: 'pointer' }}
                                aria-label="Close"
                            ></div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
