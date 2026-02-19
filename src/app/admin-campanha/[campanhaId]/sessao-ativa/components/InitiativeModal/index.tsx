import React, { useState, useEffect } from 'react';
import { X, Play, ArrowDownUp, CheckSquare, Square } from 'lucide-react';
import styles from './styles.module.css';
import { Token } from '../BattleMap';

interface InitiativeModalProps {
  isOpen: boolean;
  tokens: Token[];
  onClose: () => void;
  onConfirm: (updates: { id: string, initiative: number, inCombat: boolean }[]) => void;
}

export default function InitiativeModal({ isOpen, tokens, onClose, onConfirm }: InitiativeModalProps) {
  const [initiatives, setInitiatives] = useState<{ id: string, val: string, active: boolean }[]>([]);

  // Sincroniza ao abrir
  useEffect(() => {
    if (isOpen) {
      setInitiatives(tokens.map(t => ({
        id: t.id,
        val: t.initiative?.toString() || '0',
        active: t.inCombat !== false // Default true se undefined
      })));
    }
  }, [isOpen, tokens]);

  if (!isOpen) return null;

  const handleChange = (id: string, val: string) => {
    setInitiatives(prev => prev.map(i => i.id === id ? { ...i, val } : i));
  };

  const toggleActive = (id: string) => {
    setInitiatives(prev => prev.map(i => i.id === id ? { ...i, active: !i.active } : i));
  };

  const handleSave = () => {
    const updates = initiatives.map(i => ({
      id: i.id,
      initiative: Number(i.val) || 0,
      inCombat: i.active
    }));
    onConfirm(updates);
  };

  // Pega dados visuais do token original
  const getToken = (id: string) => tokens.find(t => t.id === id);

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3><ArrowDownUp size={18}/> ORDEM DE TURNO</h3>
          <button onClick={onClose} className={styles.closeBtn}><X size={18}/></button>
        </div>

        <div className={styles.listHeader}>
          <span>TOKEN</span>
          <span>COMBATE?</span>
          <span>INICIATIVA</span>
        </div>

        <div className={styles.list}>
          {initiatives.map(item => {
            const token = getToken(item.id);
            if (!token) return null;
            return (
              <div key={item.id} className={`${styles.row} ${!item.active ? styles.inactive : ''}`}>
                <div className={styles.tokenInfo}>
                  <img src={token.img} alt="" className={styles.avatar} />
                  <span className={styles.name}>{token.name}</span>
                </div>
                
                <button className={styles.checkBtn} onClick={() => toggleActive(item.id)}>
                  {item.active ? <CheckSquare size={20} color="#ff6600"/> : <Square size={20} color="#444"/>}
                </button>

                <input 
                  type="number" 
                  className={styles.inputInit} 
                  value={item.val}
                  onChange={(e) => handleChange(item.id, e.target.value)}
                  placeholder="0"
                />
              </div>
            );
          })}
        </div>

        <div className={styles.footer}>
          <button className={styles.confirmBtn} onClick={handleSave}>
            <Play size={16} fill="currentColor" /> DEFINIR ORDEM & INICIAR
          </button>
        </div>
      </div>
    </div>
  );
}