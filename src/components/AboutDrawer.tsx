'use client';
import { useUI } from '@/context/UIContext';
import styles from './about-drawer.module.css';

export default function AboutDrawer() {
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
                        <div className={styles.member}>
                            <h3>Gerardo Santos Diez</h3>
                            <p>Estudió en París, donde trabajó más de 20 años especializándose en iluminación arquitectónica. Uno de sus hitos fue la creación de una maqueta-escultura para un proyecto de iluminación de la Sagrada Familia, inspirado en su admiración por Gaudí.</p>
                            <p><br /></p>
                            <p>He studied in Paris, where he worked for over 20 years specializing in architectural lighting. One of his milestones was creating a model-sculpture for a lighting project of the Sagrada Familia, inspired by his admiration for Gaudí.</p>
                        </div>

                        <div className={styles.member}>
                            <h3>Erik Gutiérrez Mora</h3>
                            <p>Después de tres años en la Universidad Nacional Autónoma de México, se trasladó a Barcelona, donde ha trabajado en varios estudios de arquitectura. En 2014, fundó su propio estudio de visualización arquitectónica, Egmor. Se especializa en infografía arquitectónica.</p>
                            <p><br /></p>
                            <p>After the National Autonomous University of Mexico, he moved to Barcelona, where he has worked in several architecture firms. In 2014, he founded his own architectural visualization studio, Egmor, specialized in architectural infographics.</p>
                        </div>

                        <div className={styles.member}>
                            <h3>Rafael de Balanzó Joue</h3>
                            <p>Doctorado en Ciencias de la Sostenibilidad</p>
                        </div>

                        <div className={styles.member}>
                            <h3>David Vidal Vera</h3>
                            <p>CEO de Okiba Soluciones</p>
                        </div>

                        <div className={styles.member}>
                            <h3>Olivier de Lagarde</h3>
                            <p>Collège de Paris Président</p>
                        </div>

                        <div className={styles.member}>
                            <h3>Mónica Torres Álvarez</h3>
                            <p>Filóloga y docente</p>
                        </div>

                        <div className={styles.member}>
                            <h3>Dorian Lacombe</h3>
                            <p>Carrière internationale UE, ONU</p>
                        </div>

                        <div className={styles.member}>
                            <h3>Celia Santos Villaverde</h3>
                            <p>Graphic and motion designer</p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
