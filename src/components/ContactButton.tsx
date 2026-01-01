'use client';
import { useEffect, useState } from 'react';
import styles from './contact-button.module.css';

export default function ContactButton() {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            // Get footer element
            const footer = document.querySelector('footer');
            if (!footer) return;

            // Get footer position
            const footerRect = footer.getBoundingClientRect();
            const viewportHeight = window.innerHeight;

            // Hide button when footer is visible in viewport
            if (footerRect.top < viewportHeight) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Check initial state

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleClick = () => {
        const footer = document.querySelector('footer');
        if (footer) {
            footer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <button
            className={`${styles.contactButton} ${!isVisible ? styles.hidden : ''}`}
            onClick={handleClick}
            aria-label="Scroll to contact section"
        >
            Contact
        </button>
    );
}
