'use client';

import React from 'react';
import { BookOpen, Settings, Move } from 'lucide-react';
import styles from './styles.module.css';

interface PlayerControlsProps {
  interactionMode: string;
  setInteractionMode: (mode: any) => void;
  combatActive: boolean;
  isMyTurn: boolean;
  onOpenSheet: () => void;
}

export default function PlayerControls({
  interactionMode,
  setInteractionMode,
  combatActive,
  isMyTurn,
  onOpenSheet,
}: PlayerControlsProps) {
  
  // Regra: Movimentação e AoE só funcionam se não houver combate ou se for o turno do Nathan
  const canAct = !combatActive || isMyTurn;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Settings size={18} /><span>COMANDOS</span>
      </div>

      {/* BOTÃO DA FICHA - Sempre ativo */}
      <div className={styles.group}>
        <button className={styles.btnFicha} onClick={onOpenSheet}>
          <BookOpen size={18} /> VER MINHA FICHA
        </button>
      </div>

      {/* MOVIMENTAÇÃO - Bloqueada fora do turno */}
      <div className={styles.group}>
        <label>AÇÃO</label>
        <button
          className={`${styles.btn} ${interactionMode === 'move' ? styles.active : ''}`}
          onClick={() => setInteractionMode('move')}
          disabled={!canAct}
          title={!canAct ? "Aguarde seu turno!" : ""}
        >
          <Move size={16} /> SE MOVER
        </button>
      </div>

      {/* ÁREA DE EFEITO - Bloqueada fora do turno */}
      <div className={styles.group}>
        <label>ÁREA DE EFEITO</label>
        <div className={styles.grid3}>
          <button
            className={`${styles.iconBtn} ${interactionMode === 'aoe_cone' ? styles.activeAoE : ''}`}
            onClick={() => setInteractionMode('aoe_cone')}
            disabled={!canAct}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22L22 2H2L12 22Z" />
            </svg>
          </button>
          <button
            className={`${styles.iconBtn} ${interactionMode === 'aoe_circle' ? styles.activeAoE : ''}`}
            onClick={() => setInteractionMode('aoe_circle')}
            disabled={!canAct}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
            </svg>
          </button>
          <button
            className={`${styles.iconBtn} ${interactionMode === 'aoe_line' ? styles.activeAoE : ''}`}
            onClick={() => setInteractionMode('aoe_line')}
            disabled={!canAct}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="2" x2="12" y2="22" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}