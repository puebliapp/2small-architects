'use client';

import { useState } from 'react';
import { TeamMember } from '@/lib/db';
import { createTeamMember, updateTeamMember, deleteTeamMember, updateTeamOrder } from '@/app/actions';
import styles from './people-manager.module.css';
import { Reorder } from 'framer-motion';

interface Props {
    initialMembers: TeamMember[];
}

export default function PeopleManager({ initialMembers }: Props) {
    const [members, setMembers] = useState<TeamMember[]>(initialMembers);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    async function handleReorder(newOrder: TeamMember[]) {
        setMembers(newOrder);
        await updateTeamOrder(newOrder.map(m => m.id));
    }

    async function handleDelete(id: string) {
        if (!confirm('Are you sure you want to delete this member?')) return;
        const res = await deleteTeamMember(id);
        if (res.success) {
            setMembers(members.filter(m => m.id !== id));
        }
    }

    return (
        <section className={styles.section}>
            <div className={styles.header}>
                <h2>Manage People</h2>
                <button
                    className={styles.addBtn}
                    onClick={() => {
                        setIsAdding(true);
                        setEditingId(null);
                    }}
                >
                    + Add New Member
                </button>
            </div>

            {(isAdding || editingId) && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h3>{editingId ? 'Edit Member' : 'Add Member'}</h3>
                        <form action={async (formData) => {
                            const res = editingId
                                ? await updateTeamMember(editingId, formData)
                                : await createTeamMember(formData);

                            if (res.success) {
                                window.location.reload(); // Simple reload to get new data
                            } else {
                                alert('Error saving: ' + res.error);
                            }
                        }}>
                            <div className={styles.group}>
                                <label>Name / Role</label>
                                <input
                                    name="name"
                                    required
                                    defaultValue={members.find(m => m.id === editingId)?.name}
                                />
                            </div>
                            <div className={styles.group}>
                                <label>Description (ES)</label>
                                <textarea
                                    name="description_es"
                                    rows={4}
                                    defaultValue={members.find(m => m.id === editingId)?.description_es}
                                />
                            </div>
                            <div className={styles.group}>
                                <label>Description (EN)</label>
                                <textarea
                                    name="description_en"
                                    rows={4}
                                    defaultValue={members.find(m => m.id === editingId)?.description_en}
                                />
                            </div>
                            <div className={styles.actions}>
                                <button type="button" onClick={() => { setIsAdding(false); setEditingId(null); }}>Cancel</button>
                                <button type="submit" className={styles.saveBtn}>Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <Reorder.Group axis="y" values={members} onReorder={handleReorder} className={styles.list}>
                {members.map((member) => (
                    <Reorder.Item key={member.id} value={member} className={styles.item}>
                        <div className={styles.dragHandle}>☰</div>
                        <div className={styles.info}>
                            <strong>{member.name}</strong>
                            <p className={styles.preview}>{member.description_es?.substring(0, 60)}...</p>
                        </div>
                        <div className={styles.itemActions}>
                            <button onClick={() => setEditingId(member.id)}>Edit</button>
                            <button onClick={() => handleDelete(member.id)} className={styles.deleteBtn}>Remove</button>
                        </div>
                    </Reorder.Item>
                ))}
            </Reorder.Group>
            {members.length === 0 && <p className={styles.empty}>No members added yet.</p>}
        </section>
    );
}
