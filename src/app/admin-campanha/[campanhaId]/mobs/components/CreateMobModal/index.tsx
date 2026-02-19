'use client';

import React, { useState } from 'react';
import { X, Skull, Loader2 } from 'lucide-react';
import styles from './styles.module.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string) => Promise<void>;
}

export default function CreateMobModal({ isOpen, onClose, onCreate }: Props) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setLoading(true);
    try {
      await onCreate(name);
    } catch (err) {
      console.error('Erro ao criar Mob:', err);
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3><Skull size={18} /> NOVA CRIATURA</h3>
          <button onClick={onClose} className={styles.closeBtn} disabled={loading}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <label>Nome da Criatura</label>
          <input
            autoFocus
            type="text"
            placeholder="Ex: Manda, Rei Cobra"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={styles.input}
            disabled={loading}
          />

          <div className={styles.footer}>
            <button type="button" onClick={onClose} className={styles.cancelBtn} disabled={loading}>
              Cancelar
            </button>
            <button type="submit" className={styles.createBtn} disabled={loading}>
              {loading ? (
                <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> CRIANDO...</>
              ) : (
                'CRIAR FICHA'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}