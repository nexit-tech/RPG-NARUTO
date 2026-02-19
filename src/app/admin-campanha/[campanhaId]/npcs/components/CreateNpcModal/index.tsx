'use client';

import React, { useState } from 'react';
import { X, UserPlus, Loader2 } from 'lucide-react';
import styles from './styles.module.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string) => Promise<void>; // ← Agora é async
}

export default function CreateNpcModal({ isOpen, onClose, onCreate }: Props) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setLoading(true);
    try {
      await onCreate(name); // ← Aguarda o redirect acontecer
    } catch (err) {
      console.error('Erro ao criar NPC:', err);
      setLoading(false);
    }
    // Não reseta o nome nem o loading aqui pois vai redirecionar
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3><UserPlus size={18} /> NOVO NPC</h3>
          <button onClick={onClose} className={styles.closeBtn} disabled={loading}>
            <X size={18}/>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <label>Nome do Personagem</label>
          <input 
            autoFocus
            type="text" 
            placeholder="Ex: Zabuza Momochi" 
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