import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './project-card.module.css';

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
    dotsIconUrl?: string; // from DB (snake_case mapped to camelCase in db.ts? need to check db.ts)
}

interface Props {
    project: ProjectData;
    isExpanded?: boolean;
    isHidden?: boolean;
    onClose?: () => void;
}

export default function ProjectCard({ project, isExpanded, isHidden, onClose }: Props) {
    const [isClosing, setIsClosing] = useState(false);
    const [imagesLoaded, setImagesLoaded] = useState<Set<number>>(new Set([0]));
    const [videoReady, setVideoReady] = useState<Set<number>>(new Set());

    const gallery = project.images && project.images.length > 0
        ? project.images
        : [project.imageUrl];

    // Helper function to detect if URL is a video
    const isVideo = (url: string) => {
        const videoExtensions = ['.mp4', '.webm', '.mov', '.avi', '.m4v'];
        return videoExtensions.some(ext => url.toLowerCase().endsWith(ext));
    };

    // Preload all images on mount (videos will load on demand)
    useEffect(() => {
        if (gallery.length > 1) {
            gallery.forEach((src, index) => {
                if (!isVideo(src)) {
                    const img = new window.Image();
                    img.src = src;
                    img.onload = () => {
                        setImagesLoaded(prev => new Set([...prev, index]));
                    };
                }
            });
        }
    }, [gallery]);

    // Reset closing state when expanded changes 
    useEffect(() => {
        if (!isExpanded) setIsClosing(false);
    }, [isExpanded]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        const currentIsVideo = isVideo(gallery[activeImageIndex]);

        // If it's a video, we don't start the 2s interval. 
        // We'll rely on the video's onEnded event to advance.
        if (isHovered && gallery.length > 1 && !currentIsVideo) {
            interval = setInterval(() => {
                setActiveImageIndex(prev => (prev + 1) % gallery.length);
            }, 2000);
        } else if (!isHovered) {
            setActiveImageIndex(0);
        }

        return () => clearInterval(interval);
    }, [isHovered, isExpanded, gallery.length, activeImageIndex, gallery]);

    const handleVideoEnded = () => {
        if (isHovered && gallery.length > 1) {
            setActiveImageIndex(prev => (prev + 1) % gallery.length);
        }
    };

    // Handle clicks on image when Expanded
    const handleImageClick = (e: React.MouseEvent) => {
        if (isExpanded && onClose) {
            e.preventDefault();
            e.stopPropagation();
            setIsClosing(true);
            // Trigger close immediately so grid reorganization happens in parallel with animation
            onClose();
        }
    };

    const handleAnimationEnd = () => {
        // Animation end handler for potential future use
        // Currently not needed as we close immediately
    };

    // Shared content for Left Column (Image + Info)
    const leftColumnContent = (
        <motion.div layout className={styles.leftColumn}>
            <motion.div
                layout
                className={styles.imageContainer}
                onClick={handleImageClick}
                style={{ position: 'relative', backgroundColor: 'white' }}
            >
                {isVideo(gallery[activeImageIndex]) ? (
                    <video
                        key={activeImageIndex}
                        src={gallery[activeImageIndex]}
                        className={styles.image}
                        autoPlay
                        muted
                        playsInline
                        onCanPlay={() => setVideoReady(prev => new Set([...prev, activeImageIndex]))}
                        onEnded={handleVideoEnded}
                        preload="auto"
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            opacity: videoReady.has(activeImageIndex) ? 1 : 0,
                            transition: 'opacity 0.3s ease'
                        }}
                    />
                ) : (
                    <>
                        {/* Hidden images for preloading - Next.js will optimize and cache them */}
                        {gallery.map((src, idx) => (
                            idx !== activeImageIndex && !isVideo(src) && (
                                <Image
                                    key={`preload-${idx}`}
                                    src={src}
                                    alt=""
                                    fill
                                    className={styles.image}
                                    sizes={isExpanded ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 25vw"}
                                    priority={idx === 0 || idx === 1} // Prioritize first two images
                                    style={{
                                        objectFit: 'cover',
                                        opacity: 0,
                                        pointerEvents: 'none',
                                        position: 'absolute'
                                    }}
                                />
                            )
                        ))}

                        {/* Visible active image */}
                        <Image
                            key={activeImageIndex}
                            src={gallery[activeImageIndex]}
                            alt={project.title}
                            fill
                            className={styles.image}
                            sizes={isExpanded ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 25vw"}
                            priority={true}
                            style={{ objectFit: 'cover' }}
                        />
                    </>
                )}
            </motion.div>
            <motion.div layout className={styles.info}>
                <h3 className={styles.title}>{project.title}</h3>
                <p className={styles.meta}>{project.location} &mdash; {project.type}</p>
            </motion.div>
        </motion.div>
    );

    // Common transition for layout changes to match the CSS animation duration of 1.2s
    // Defines a cubic-bezier(0.25, 1, 0.5, 1) using array syntax for Framer Motion
    const transitionConfig = { duration: 1.2, ease: [0.25, 1, 0.5, 1] as const };

    return (
        <motion.div
            layout
            transition={transitionConfig}
            className={`${styles.card} ${isExpanded ? styles.expanded : ''} ${isClosing ? styles.closing : ''} ${isHidden ? styles.desktopHidden : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className={styles.innerWrapper}>
                {isExpanded ? (
                    <>
                        {leftColumnContent}
                        {/* Expanded Content Panel */}
                        <div
                            className={styles.expandedContent}
                            onAnimationEnd={handleAnimationEnd}
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
                                    if (onClose) {
                                        setIsClosing(true);
                                        onClose();
                                    }
                                }}
                                className={styles.closeArea}
                                aria-label="Close"
                            ></div>
                        </div>
                    </>
                ) : (
                    /* When collapsed, wrap content in Link for navigation */
                    /* Note: Link wraps the inner content but constrained by parent grid cell */
                    <Link
                        href={`/?project=${project.slug}`}
                        scroll={false}
                        className={styles.linkWrapper}
                    >
                        {leftColumnContent}
                    </Link>
                )}
            </div>
        </motion.div>
    );
}
