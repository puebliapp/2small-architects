'use client';
import styles from './contact-button.module.css';

export default function ContactButton() {
    const handleClick = () => {
        const footer = document.querySelector('footer');
        if (footer) {
            footer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <button
            className={styles.contactButton}
            onClick={handleClick}
            aria-label="Scroll to contact section"
        >
            Contact
        </button>
    );
}
