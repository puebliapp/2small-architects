'use client';
import { deleteProject } from '@/app/actions';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DeleteProjectButton({ id, title }: { id: string, title: string }) {
    const [pending, setPending] = useState(false);
    const router = useRouter();

    async function handleDelete() {
        if (!confirm(`¿Seguro que quieres borrar el proyecto "${title}"? Esta acción no se puede deshacer.`)) return;

        setPending(true);
        const res = await deleteProject(id);
        if (res.success) {
            router.refresh();
        } else {
            alert('Error deleting project: ' + res.error);
        }
        setPending(false);
    }

    return (
        <button
            onClick={handleDelete}
            disabled={pending}
            style={{
                background: 'none',
                border: '1px solid #ff4444',
                color: '#ff4444',
                padding: '4px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
            }}
        >
            {pending ? 'Borrando...' : 'Borrar'}
        </button>
    );
}
