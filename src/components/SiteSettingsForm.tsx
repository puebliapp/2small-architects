'use client';
import { useState } from 'react';
import { updateSiteLogo } from '@/app/actions';
import styles from './form.module.css';

interface Props {
    currentLogo?: string | null;
}

export default function SiteSettingsForm({ currentLogo }: Props) {
    const [pending, setPending] = useState(false);
    const [message, setMessage] = useState('');

    async function handleSubmit(formData: FormData) {
        setPending(true);
        setMessage('');
        try {
            const res = await updateSiteLogo(formData);
            if (res.success) {
                setMessage('Logo actualizado correctamente ✨');
            } else {
                setMessage('Error: ' + res.error);
            }
        } catch (error) {
            setMessage('Algo salió mal. Inténtalo de nuevo.');
        } finally {
            setPending(false);
        }
    }

    return (
        <div style={{ background: '#f8fafc', padding: '2rem', borderRadius: '12px', marginBottom: '2rem', border: '1px solid #e2e8f0' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: '#1e293b' }}>Configuración del Sitio</h2>

            <form action={handleSubmit} className={styles.form}>
                <div className={styles.group}>
                    <label>Logo de la web (Archivo SVG)</label>
                    {currentLogo && (
                        <div style={{ marginBottom: '1rem', padding: '1rem', background: 'white', borderRadius: '8px', border: '1px solid #ddd', display: 'inline-block' }}>
                            <img src={currentLogo} alt="Logo actual" style={{ maxHeight: '80px', display: 'block' }} />
                            <p style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.5rem' }}>Logo actual</p>
                        </div>
                    )}
                    <input
                        name="logoFile"
                        type="file"
                        accept=".svg,image/svg+xml"
                        className={styles.input}
                        required
                    />
                    <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.5rem' }}>
                        Sube el archivo SVG que te pasó la diseñadora. Se actualizará en el footer inmediatamente.
                    </p>
                </div>

                <button
                    type="submit"
                    disabled={pending}
                    className={styles.submitBtn}
                >
                    {pending ? 'Actualizando...' : 'Actualizar Logo'}
                </button>

                {message && (
                    <p style={{
                        marginTop: '1rem',
                        padding: '0.75rem',
                        borderRadius: '6px',
                        backgroundColor: message.startsWith('Error') ? '#fef2f2' : '#f0fdf4',
                        color: message.startsWith('Error') ? '#991b1b' : '#166534',
                        fontSize: '0.9rem'
                    }}>
                        {message}
                    </p>
                )}
            </form>
        </div>
    );
}
