import Link from 'next/link';
import styles from './footer.module.css';
import { getSiteSettings } from '@/lib/db';

export default async function Footer() {
    const settings = await getSiteSettings();

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                {/* 1. Logo Block */}
                <div className={styles.logoStack}>
                    {settings?.logoUrl ? (
                        <img
                            src={settings.logoUrl}
                            alt="Two Small Architects"
                            className={styles.logoSvg}
                        />
                    ) : (
                        <svg width="120" height="160" viewBox="0 0 120 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.logoSvg}>
                            <text x="0" y="40" className={styles.svgTextLarge}>2</text>
                            <text x="0" y="85" className={styles.svgTextLarge}>SM</text>
                            <text x="0" y="125" className={styles.svgTextLarge}>ALL</text>
                            <text x="0" y="155" className={styles.svgTextSmall}>ARCHITECTS</text>
                        </svg>
                    )}
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
