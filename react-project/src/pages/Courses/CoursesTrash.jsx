import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCourses } from '../../context/CourseContext';

function Toast({ message, onDone }) {
    useEffect(() => {
        const t = setTimeout(onDone, 2800);
        return () => clearTimeout(t);
    }, [onDone]);
    return (
        <div style={{
            position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)',
            background: '#0d1c2e', color: '#fff', fontSize: 13, fontWeight: 600,
            fontFamily: 'Inter,sans-serif', padding: '12px 22px', borderRadius: 8,
            zIndex: 9999, boxShadow: '0 4px 20px rgba(0,0,0,0.22)',
            animation: 'toastIn 0.22s ease', whiteSpace: 'nowrap'
        }}>
            {message}
        </div>
    );
}

function ConfirmModal({ title, message, confirmLabel, onConfirm, onCancel, danger = true }) {
    return (
        <div style={{
            position: 'fixed', inset: 0, background: 'rgba(13,28,46,0.45)',
            zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24
        }}>
            <div style={{
                background: '#fff', borderRadius: 16, padding: 28,
                maxWidth: 420, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.18)'
            }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0d1c2e', margin: '0 0 8px', fontFamily: 'Inter,sans-serif' }}>{title}</h2>
                <p style={{ fontSize: 13, color: '#444653', margin: '0 0 20px', fontFamily: 'Inter,sans-serif', lineHeight: 1.5 }}>{message}</p>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                    <button
                        onClick={onCancel}
                        style={{ padding: '9px 18px', border: '1.5px solid #c4c5d5', borderRadius: 8, background: '#fff', fontSize: 13, fontWeight: 600, color: '#444653', fontFamily: 'Inter,sans-serif', cursor: 'pointer' }}
                    >Cancel</button>
                    <button
                        onClick={onConfirm}
                        style={{
                            padding: '9px 18px', border: 'none', borderRadius: 8,
                            background: danger ? '#ba1a1a' : '#00288e',
                            fontSize: 13, fontWeight: 700, color: '#fff',
                            fontFamily: 'Inter,sans-serif', cursor: 'pointer'
                        }}
                    >{confirmLabel}</button>
                </div>
            </div>
        </div>
    );
}

export default function CoursesTrash() {
    const navigate = useNavigate();
    const { deletedCourses, restoreCourses, permanentDeleteCourses, emptyTrash, daysRemaining } = useCourses();

    const [selected, setSelected] = useState([]);
    const [modal, setModal] = useState(null); // { type: 'restore'|'delete'|'empty', ids: [] }
    const [toast, setToast] = useState('');

    // Auto-clear selection if a course disappears
    useEffect(() => {
        const validIds = deletedCourses.map(c => c.id);
        setSelected(prev => prev.filter(id => validIds.includes(id)));
    }, [deletedCourses]);

    const toggleSelect = (id) => {
        setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };
    const toggleAll = () => {
        setSelected(prev => prev.length === deletedCourses.length ? [] : deletedCourses.map(c => c.id));
    };

    const daysColor = (days) => {
        if (days <= 3) return '#ba1a1a';
        if (days <= 7) return '#d97706';
        return '#059669';
    };

    const handleConfirm = () => {
        if (!modal) return;
        const { type, ids } = modal;
        if (type === 'restore') {
            restoreCourses(ids);
            setToast(`${ids.length} course${ids.length > 1 ? 's' : ''} restored.`);
        } else if (type === 'delete') {
            permanentDeleteCourses(ids);
            setToast(`${ids.length} course${ids.length > 1 ? 's' : ''} permanently deleted.`);
        } else if (type === 'empty') {
            emptyTrash();
            setToast('Recycle Bin emptied.');
        }
        setModal(null);
    };

    const styles = {
        page: { maxWidth: 1000, margin: '0 auto', padding: '40px 24px 60px' },
        header: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28, flexWrap: 'wrap' },
        backBtn: {
            display: 'flex', alignItems: 'center', gap: 4, color: '#444653', fontSize: 13,
            fontWeight: 600, fontFamily: 'Inter,sans-serif', textDecoration: 'none',
            padding: '6px 10px', borderRadius: 7, border: '1.5px solid #c4c5d5', background: '#fff', transition: 'all .15s'
        },
        title: { fontSize: 22, fontWeight: 700, color: '#0d1c2e', margin: 0, fontFamily: 'Inter,sans-serif' },
        actionBar: { display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 },
        btn: (v) => ({
            display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px',
            borderRadius: 8, fontSize: 13, fontWeight: 700, fontFamily: 'Inter,sans-serif',
            cursor: v === 'disabled' ? 'not-allowed' : 'pointer',
            border: '1.5px solid transparent', transition: 'all .15s',
            opacity: v === 'disabled' ? 0.45 : 1,
            ...(v === 'restore'  ? { background: '#fff', color: '#059669', borderColor: '#059669' } :
                v === 'delete'   ? { background: '#fff', color: '#ba1a1a', borderColor: '#ba1a1a' } :
                v === 'empty'    ? { background: '#ba1a1a', color: '#fff', borderColor: '#ba1a1a' } :
                v === 'disabled' ? { background: '#f0f0f0', color: '#999', borderColor: '#ddd' } :
                                   { background: '#fff', color: '#444653', borderColor: '#c4c5d5' })
        }),
        table: { width: '100%', borderCollapse: 'separate', borderSpacing: 0, background: '#fff', borderRadius: 12, border: '1.5px solid #c4c5d5', overflow: 'hidden', boxShadow: '0 4px 20px rgba(30,64,175,.05)' },
        th: { padding: '12px 16px', fontSize: 12, fontWeight: 700, color: '#50616b', fontFamily: 'Inter,sans-serif', textAlign: 'left', background: '#f8f9ff', borderBottom: '1.5px solid #e6eeff', textTransform: 'uppercase', letterSpacing: '0.06em' },
        td: { padding: '14px 16px', fontSize: 13, color: '#0d1c2e', fontFamily: 'Inter,sans-serif', borderBottom: '1px solid #f0f4ff' },
        empty: { textAlign: 'center', padding: '60px 24px', color: '#50616b' },
    };

    return (
        <main className="flex-grow bg-background">
            <div style={styles.page}>
                {/* ── Header ───────────────────────────────────────────── */}
                <div style={styles.header}>
                    <Link to="/courses" style={styles.backBtn}>
                        <span className="material-symbols-outlined" style={{ fontSize: 17 }}>arrow_back</span>
                        Back to Courses
                    </Link>
                    <h1 style={styles.title}>
                        <span className="material-symbols-outlined" style={{ verticalAlign: 'middle', marginRight: 6, fontSize: 26, color: '#ba1a1a' }}>recycling</span>
                        Recycle Bin
                    </h1>
                    {deletedCourses.length > 0 && (
                        <span style={{ background: '#ffdad6', color: '#93000a', borderRadius: 9999, padding: '2px 10px', fontSize: 12, fontWeight: 700, fontFamily: 'Inter,sans-serif' }}>
                            {deletedCourses.length} item{deletedCourses.length !== 1 ? 's' : ''}
                        </span>
                    )}
                </div>

                <p style={{ fontSize: 13, color: '#50616b', fontFamily: 'Inter,sans-serif', margin: '0 0 20px' }}>
                    Deleted courses are kept for 30 days before being permanently removed.
                </p>

                {/* ── Action Bar ────────────────────────────────────────── */}
                {deletedCourses.length > 0 && (
                    <div style={styles.actionBar}>
                        <button
                            style={styles.btn(selected.length > 0 ? 'restore' : 'disabled')}
                            disabled={selected.length === 0}
                            onClick={() => setModal({ type: 'restore', ids: selected })}
                        >
                            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>restore</span>
                            Restore Selected
                        </button>
                        <button
                            style={styles.btn(selected.length > 0 ? 'delete' : 'disabled')}
                            disabled={selected.length === 0}
                            onClick={() => setModal({ type: 'delete', ids: selected })}
                        >
                            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete_forever</span>
                            Delete Permanently
                        </button>
                        <button
                            style={styles.btn('empty')}
                            onClick={() => setModal({ type: 'empty', ids: [] })}
                        >
                            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete_sweep</span>
                            Empty Trash
                        </button>
                    </div>
                )}

                {/* ── Table ────────────────────────────────────────────── */}
                {deletedCourses.length === 0 ? (
                    <div style={{ ...styles.empty, border: '2px dashed #c4c5d5', borderRadius: 12 }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 52, color: '#c4c5d5', display: 'block', marginBottom: 12 }}>recycling</span>
                        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0d1c2e', margin: '0 0 6px', fontFamily: 'Inter,sans-serif' }}>Recycle Bin is Empty</h3>
                        <p style={{ margin: 0, fontFamily: 'Inter,sans-serif', fontSize: 13 }}>Deleted custom courses will appear here.</p>
                    </div>
                ) : (
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={{ ...styles.th, width: 40 }}>
                                    <input
                                        type="checkbox"
                                        checked={selected.length === deletedCourses.length && deletedCourses.length > 0}
                                        onChange={toggleAll}
                                        style={{ accentColor: '#00288e' }}
                                        title="Select all"
                                    />
                                </th>
                                <th style={styles.th}>Course Name</th>
                                <th style={styles.th}>Questions</th>
                                <th style={styles.th}>Deleted Date</th>
                                <th style={styles.th}>Days Remaining</th>
                                <th style={styles.th}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {deletedCourses.map((course, idx) => {
                                const days = daysRemaining(course.deletedAt);
                                const isLast = idx === deletedCourses.length - 1;
                                return (
                                    <tr key={course.id} style={{ background: selected.includes(course.id) ? '#f0f4ff' : 'transparent' }}>
                                        <td style={{ ...styles.td, borderBottom: isLast ? 'none' : undefined }}>
                                            <input
                                                type="checkbox"
                                                checked={selected.includes(course.id)}
                                                onChange={() => toggleSelect(course.id)}
                                                style={{ accentColor: '#00288e' }}
                                            />
                                        </td>
                                        <td style={{ ...styles.td, borderBottom: isLast ? 'none' : undefined, fontWeight: 600 }}>
                                            {course.name}
                                            {course.description && (
                                                <p style={{ fontSize: 11, color: '#50616b', margin: '2px 0 0', fontWeight: 400 }}>{course.description}</p>
                                            )}
                                        </td>
                                        <td style={{ ...styles.td, borderBottom: isLast ? 'none' : undefined }}>
                                            {course.questions?.length || 0}
                                        </td>
                                        <td style={{ ...styles.td, borderBottom: isLast ? 'none' : undefined }}>
                                            {new Date(course.deletedAt).toLocaleDateString()}
                                        </td>
                                        <td style={{ ...styles.td, borderBottom: isLast ? 'none' : undefined }}>
                                            <span style={{
                                                display: 'inline-flex', alignItems: 'center', gap: 4,
                                                padding: '3px 8px', borderRadius: 9999, fontSize: 12, fontWeight: 700,
                                                background: days <= 3 ? '#ffdad6' : days <= 7 ? '#fef3c7' : '#d1fae5',
                                                color: daysColor(days), fontFamily: 'Inter,sans-serif'
                                            }}>
                                                <span className="material-symbols-outlined" style={{ fontSize: 13 }}>timer</span>
                                                {days} day{days !== 1 ? 's' : ''} remaining
                                            </span>
                                        </td>
                                        <td style={{ ...styles.td, borderBottom: isLast ? 'none' : undefined }}>
                                            <div style={{ display: 'flex', gap: 6 }}>
                                                <button
                                                    onClick={() => setModal({ type: 'restore', ids: [course.id] })}
                                                    style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 10px', border: '1.5px solid #059669', borderRadius: 6, background: '#fff', color: '#059669', fontSize: 12, fontWeight: 700, fontFamily: 'Inter,sans-serif', cursor: 'pointer' }}
                                                >
                                                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>restore</span>
                                                    Restore
                                                </button>
                                                <button
                                                    onClick={() => setModal({ type: 'delete', ids: [course.id] })}
                                                    style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 10px', border: '1.5px solid #ba1a1a', borderRadius: 6, background: '#fff', color: '#ba1a1a', fontSize: 12, fontWeight: 700, fontFamily: 'Inter,sans-serif', cursor: 'pointer' }}
                                                >
                                                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>delete_forever</span>
                                                    Delete Forever
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            {/* ── Modals ─────────────────────────────────────────────────── */}
            {modal?.type === 'restore' && (
                <ConfirmModal
                    title="Restore Course"
                    message={`Restore ${modal.ids.length} course${modal.ids.length > 1 ? 's' : ''} back to My Courses?`}
                    confirmLabel="Restore"
                    danger={false}
                    onConfirm={handleConfirm}
                    onCancel={() => setModal(null)}
                />
            )}
            {modal?.type === 'delete' && (
                <ConfirmModal
                    title="Delete Permanently"
                    message={`Permanently delete ${modal.ids.length} course${modal.ids.length > 1 ? 's' : ''}? This action cannot be undone.`}
                    confirmLabel="Delete Forever"
                    danger={true}
                    onConfirm={handleConfirm}
                    onCancel={() => setModal(null)}
                />
            )}
            {modal?.type === 'empty' && (
                <ConfirmModal
                    title="Empty Recycle Bin"
                    message="Permanently delete all items in the Recycle Bin? This action cannot be undone."
                    confirmLabel="Empty Trash"
                    danger={true}
                    onConfirm={handleConfirm}
                    onCancel={() => setModal(null)}
                />
            )}

            {/* ── Toast ──────────────────────────────────────────────────── */}
            {toast && <Toast message={toast} onDone={() => setToast('')} />}
        </main>
    );
}
