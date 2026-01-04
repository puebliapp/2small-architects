'use client';
import { useUI } from '@/context/UIContext';
import styles from './about-drawer.module.css';
import { TeamMember } from '@/lib/db';

interface Props {
    initialMembers: TeamMember[];
}

export default function AboutDrawer({ initialMembers }: Props) {
    const { isAboutOpen, closeAbout } = useUI();

    return (
        <>
            {/* Backdrop */}
            <div
                className={`${styles.backdrop} ${isAboutOpen ? styles.active : ''}`}
                onClick={closeAbout}
            />

            {/* Drawer */}
            <aside
                className={`${styles.drawer} ${isAboutOpen ? styles.open : ''}`}
                data-cursor="white"
            >
                <div className={styles.content}>
                    <section className={styles.intro}>
                        <h2>Quienes lo hacen posible &nbsp; <span>Those who make it happen</span> &nbsp; <span>Ceux qui le rendent possible</span></h2>
                    </section>

                    <div className={styles.teamGrid}>
                        {initialMembers.length > 0 ? (
                            initialMembers.map((member) => (
                                <div key={member.id} className={styles.member}>
                                    <h3>{member.name}</h3>
                                    {member.description_es && <p style={{ marginBottom: '1rem' }}>{member.description_es}</p>}
                                    {member.description_en && <p className={styles.descriptionEn}>{member.description_en}</p>}
                                </div>
                            ))
                        ) : (
                            <p style={{ opacity: 0.5 }}>Cargando equipo... / Loading team...</p>
                        )}
                    </div>
                </div>
            </aside>
        </>
    );
}
