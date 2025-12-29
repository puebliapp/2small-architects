import Link from 'next/link';
import styles from './footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                {/* 1. Large Logo Stack */}
                <div className={styles.logoStack}>
                    <span className={styles.number}>2</span>
                    <span className={styles.small}>SM</span>
                    <span className={styles.small}>ALL</span>
                    <span className={styles.architects}>ARCHITECTS</span>
                </div>

                {/* 2. Inquiry Text (Mixed Languages) */}
                <div className={styles.inquiryBlock}>
                    <p className={styles.primaryLang}>Para consultas sobre nuevos proyectos</p>
                    <p className={styles.secondaryLang}>Pour les demandes de nouveaux projets</p>
                    <p className={styles.secondaryLang}>For new project inquiries</p>
                </div>

                {/* 3. Email */}
                <div className={styles.emailBlock}>
                    <a href="mailto:santosdiez@gmail.com" className={styles.email}>
                        santosdiez@gmail.com
                    </a>
                </div>

                {/* 4. Contact Label */}
                <div className={styles.contactBlock}>
                    <span>Contact</span>
                </div>
            </div>
        </footer>
    );
}
