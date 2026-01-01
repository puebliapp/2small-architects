'use client'; // Needs client for context
import Link from 'next/link';
import { useUI } from '@/context/UIContext';
import styles from './header.module.css';

export default function Header() {
    const { toggleAbout, isAboutOpen } = useUI();

    return (
        <header className={`${styles.header} ${isAboutOpen ? styles.inverted : ''}`}>
            <nav className={styles.nav}>
                <div className={`${styles.left} ${isAboutOpen ? styles.hidden : ''}`}>
                    {/* Projects link removed as requested */}
                </div>

                {/* If drawer is open, we handle dots inside the drawer for precise positioning relative to blue panel
            or we keep them here but change color. 
            The requester said "arriba hay 3 puntos blancos ... distribuidos de la forma que aparecen".
            It's safer to hide Global dots and let Drawer render its own specific dots layout.
        */}
                <div className={`${styles.center} ${isAboutOpen ? styles.hidden : ''}`}>
                    <Link href="/" className={styles.dotsLink}>
                        <span className={styles.dot}></span>
                        <span className={styles.dot}></span>
                    </Link>
                </div>

                <div className={styles.right}>
                    <button onClick={toggleAbout} className={styles.logoBtn}>SM all</button>
                </div>
            </nav>
        </header>
    );
}
