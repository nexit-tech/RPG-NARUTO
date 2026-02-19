'use client';

import React, { useState } from 'react';
import { FileText, Plus, Edit3, Trash2, Check, X } from 'lucide-react';
import styles from './styles.module.css';

interface Note {
  id: number;
  title: string;
  content: string;
  color: string;
  createdAt: string;
}

const NOTE_COLORS  = ['#1a1a2e', '#1a2e1a', '#2e1a1a', '#1a2a2e', '#2e2a1a'];
const NOTE_ACCENTS = ['#4444ff', '#44ff88', '#ff4444', '#00ccff', '#ffcc00'];

const INITIAL_NOTES: Note[] = [
  { id: 1, title: 'Segredos da Akatsuki', content: 'Madara está por trás de tudo. Os membros não sabem do plano real...', color: NOTE_COLORS[2], createdAt: '18/02/2026' },
  { id: 2, title: 'Aliados de Konoha',    content: 'Tsunade pode ser convocada em caso de emergência. Jiraiya está em missão espiã.', color: NOTE_COLORS[0], createdAt: '18/02/2026' },
];

export default function AnotacoesSection() {
  const [notes, setNotes] = useState<Note[]>(INITIAL_NOTES);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [newNote, setNewNote] = useState({ title: '', content: '', color: NOTE_COLORS[0] });
  const [editData, setEditData] = useState({ title: '', content: '' });

  const handleAdd = () => {
    if (!newNote.title.trim()) return;
    const today = new Date().toLocaleDateString('pt-BR');
    setNotes(prev => [...prev, { id: Date.now(), ...newNote, createdAt: today }]);
    setNewNote({ title: '', content: '', color: NOTE_COLORS[0] });
    setShowNew(false);
  };

  const startEdit = (note: Note) => {
    setEditingId(note.id);
    setEditData({ title: note.title, content: note.content });
  };

  const saveEdit = (id: number) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, ...editData } : n));
    setEditingId(null);
  };

  const deleteNote = (id: number) => setNotes(prev => prev.filter(n => n.id !== id));

  return (
    <div className={styles.section}>
      {/* HEADER */}
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}><FileText size={20} /> Anotações</h2>
        <button className={styles.addBtn} onClick={() => setShowNew(!showNew)}>
          <Plus size={16} /> Nova Anotação
        </button>
      </div>

      {/* FORM */}
      {showNew && (
        <div className={styles.formCard}>
          <div className={styles.formGroup}>
            <label>Título</label>
            <input
              className={styles.input}
              placeholder="Título da anotação..."
              value={newNote.title}
              onChange={e => setNewNote({ ...newNote, title: e.target.value })}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Conteúdo</label>
            <textarea
              className={styles.textarea}
              placeholder="Escreva aqui suas anotações secretas do mestre..."
              value={newNote.content}
              onChange={e => setNewNote({ ...newNote, content: e.target.value })}
              rows={4}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Cor</label>
            <div className={styles.colorPicker}>
              {NOTE_COLORS.map((c, i) => (
                <button
                  key={c}
                  className={`${styles.colorBtn} ${newNote.color === c ? styles.colorSelected : ''}`}
                  style={{ background: c, borderColor: NOTE_ACCENTS[i] }}
                  onClick={() => setNewNote({ ...newNote, color: c })}
                />
              ))}
            </div>
          </div>
          <div className={styles.formActions}>
            <button className={styles.cancelBtn} onClick={() => setShowNew(false)}>Cancelar</button>
            <button className={styles.confirmBtn} onClick={handleAdd}>Salvar Nota</button>
          </div>
        </div>
      )}

      {/* GRID */}
      <div className={styles.notesGrid}>
        {notes.map((note) => {
          const accent = NOTE_ACCENTS[NOTE_COLORS.indexOf(note.color)] || '#ff6600';
          const isEditing = editingId === note.id;

          return (
            <div key={note.id} className={styles.noteCard} style={{ background: note.color, borderColor: accent }}>
              <div className={styles.noteHeader}>
                {isEditing ? (
                  <input
                    className={styles.noteEditTitle}
                    value={editData.title}
                    onChange={e => setEditData({ ...editData, title: e.target.value })}
                  />
                ) : (
                  <h3 className={styles.noteTitle} style={{ color: accent }}>{note.title}</h3>
                )}
                <div className={styles.noteActions}>
                  {isEditing ? (
                    <>
                      <button onClick={() => saveEdit(note.id)} className={styles.actionBtn} style={{ color: '#44ff88' }}><Check size={14} /></button>
                      <button onClick={() => setEditingId(null)} className={styles.actionBtn}><X size={14} /></button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => startEdit(note)} className={styles.actionBtn}><Edit3 size={14} /></button>
                      <button onClick={() => deleteNote(note.id)} className={styles.actionBtn} style={{ color: '#ff4444' }}><Trash2 size={14} /></button>
                    </>
                  )}
                </div>
              </div>

              {isEditing ? (
                <textarea
                  className={styles.noteEditContent}
                  value={editData.content}
                  onChange={e => setEditData({ ...editData, content: e.target.value })}
                  rows={5}
                />
              ) : (
                <p className={styles.noteContent}>{note.content}</p>
              )}

              <span className={styles.noteDate}>{note.createdAt}</span>
            </div>
          );
        })}

        {notes.length === 0 && (
          <div className={styles.emptyState}>
            <FileText size={40} />
            <p>Nenhuma anotação ainda</p>
          </div>
        )}
      </div>
    </div>
  );
}