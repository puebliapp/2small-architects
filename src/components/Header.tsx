'use client'; // Needs client for context
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUI } from '@/context/UIContext';
import styles from './header.module.css';

export default function Header() {
    const { toggleAbout, isAboutOpen } = useUI();
    const pathname = usePathname();

    const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (pathname === '/') {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    };

    return (
        <header className={`${styles.header} ${isAboutOpen ? styles.inverted : ''}`}>
            <nav className={styles.nav}>
                <div className={`${styles.left} ${isAboutOpen ? styles.hidden : ''}`}>
                    {/* Projects link removed as requested */}
                </div>

                <div className={styles.center}>
                    <Link href="/" className={styles.dotsLink} onClick={handleHomeClick}>
                        {/* Blue dots layer (base) */}
                        <div className={styles.dotsLayer}>
                            <span className={styles.dotBlue}></span>
                            <span className={styles.dotBlue}></span>
                        </div>
                        {/* White dots layer (overlay with clip-path mask) */}
                        <div className={`${styles.dotsLayer} ${styles.dotsWhite} ${isAboutOpen ? styles.revealed : ''}`}>
                            <span className={styles.dotWhite}></span>
                            <span className={styles.dotWhite}></span>
                        </div>
                    </Link>
                </div>

                <div className={styles.right}>
                    <button onClick={toggleAbout} className={styles.logoBtn}>SM all</button>
                </div>
            </nav>
        </header>
    );
}
