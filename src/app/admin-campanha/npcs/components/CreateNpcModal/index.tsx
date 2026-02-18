'use client';

import React, { useState } from 'react';
import { X, UserPlus } from 'lucide-react';
import styles from './styles.module.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
}

export default function CreateNpcModal({ isOpen, onClose, onCreate }: Props) {
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreate(name);
    setName('');
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3><UserPlus size={18} /> NOVO NPC</h3>
          <button onClick={onClose} className={styles.closeBtn}><X size={18}/></button>
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
          />
          
          <div className={styles.footer}>
            <button type="button" onClick={onClose} className={styles.cancelBtn}>Cancelar</button>
            <button type="submit" className={styles.createBtn}>CRIAR FICHA</button>
          </div>
        </form>
      </div>
    </div>
  );
}