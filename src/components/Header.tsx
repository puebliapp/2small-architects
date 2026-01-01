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
                        {/* Blue dots - always visible base layer */}
                        <span className={styles.dot}></span>
                        <span className={styles.dot}></span>

                        {/* White dots - revealed by drawer mask */}
                        <span className={`${styles.dotWhite} ${isAboutOpen ? styles.revealed : ''}`}></span>
                        <span className={`${styles.dotWhite} ${isAboutOpen ? styles.revealed : ''}`}></span>
                    </Link>
                </div>

                <div className={styles.right}>
                    <button onClick={toggleAbout} className={styles.logoBtn}>SM all</button>
                </div>
            </nav>
        </header>
    );
}
