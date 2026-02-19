'use client';

import React from 'react';
import { Swords, Shield, Move, Settings, ListOrdered, Play, Square } from 'lucide-react';
import styles from './styles.module.css';

export default function PlayerControls({
  interactionMode,
  setInteractionMode,
  combatActive,
  onOpenInitiative,
}: {
  interactionMode: string;
  setInteractionMode: (mode: any) => void;
  combatActive: boolean;
  onOpenInitiative: () => void;
}) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Settings size={18} /><span>COMANDOS</span>
      </div>

      {/* AÇÃO TÁTICA — sem Derrubar */}
      <div className={styles.group}>
        <label>AÇÃO TÁTICA</label>
        <div className={styles.verticalActions}>
          <button
            className={`${styles.btn} ${interactionMode === 'move' ? styles.active : ''}`}
            onClick={() => setInteractionMode('move')}
          >
            <Move size={16} /> MOVER
          </button>
          <button
            className={`${styles.btn} ${interactionMode === 'attack' ? styles.activeAttack : ''}`}
            onClick={() => setInteractionMode('attack')}
          >
            <Swords size={16} /> ATACAR
          </button>
          <button
            className={`${styles.btn} ${interactionMode === 'heal' ? styles.activeHeal : ''}`}
            onClick={() => setInteractionMode('heal')}
          >
            <Shield size={16} /> CURAR
          </button>
        </div>
      </div>

      {/* COMBATE */}
      <div className={styles.group}>
        <label>COMBATE</label>
        <div className={styles.verticalActions}>
          <button onClick={onOpenInitiative} className={styles.btn}>
            <ListOrdered size={16} /> ORDEM DE TURNO
          </button>
          <button
            className={`${styles.btn} ${combatActive ? styles.combatOn : styles.combatOff}`}
            disabled
            title="Apenas o Mestre pode controlar o combate"
          >
            {combatActive
              ? <><Square size={14} fill="currentColor" /> EM COMBATE</>
              : <><Play size={14} fill="currentColor" /> AGUARDANDO</>
            }
          </button>
        </div>
      </div>

      {/* ÁREA DE EFEITO */}
      <div className={styles.group}>
        <label>ÁREA DE EFEITO</label>
        <div className={styles.grid3}>
          <button
            className={`${styles.iconBtn} ${interactionMode === 'aoe_cone' ? styles.activeAoE : ''}`}
            onClick={() => setInteractionMode('aoe_cone')}
            title="Cone"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22L22 2H2L12 22Z" />
            </svg>
          </button>
          <button
            className={`${styles.iconBtn} ${interactionMode === 'aoe_circle' ? styles.activeAoE : ''}`}
            onClick={() => setInteractionMode('aoe_circle')}
            title="Círculo"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
            </svg>
          </button>
          <button
            className={`${styles.iconBtn} ${interactionMode === 'aoe_line' ? styles.activeAoE : ''}`}
            onClick={() => setInteractionMode('aoe_line')}
            title="Linha"
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