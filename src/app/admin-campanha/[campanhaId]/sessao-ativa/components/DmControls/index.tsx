import React from 'react';
import { Grid, Image as ImageIcon, Swords, Shield, PlusCircle, Move, Settings, Skull, ListOrdered, Play, Square } from 'lucide-react';
import styles from './styles.module.css';

export default function DmControls({ 
  onToggleGrid, gridEnabled, onChangeMap, onAddLog, 
  interactionMode, setInteractionMode, 
  snapToGrid, setSnapToGrid,
  gridScale, setGridScale,
  onOpenMobModal, onOpenInitiative,
  combatActive, onToggleCombat
}: any) {
  
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Settings size={18} /><span>COMANDOS</span>
      </div>

      {/* AÇÃO TÁTICA (Agora com Derrubar) */}
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
          <button 
            className={`${styles.btn} ${interactionMode === 'down' ? styles.activeDown : ''}`}
            onClick={() => setInteractionMode('down')}
          >
            <Skull size={16} /> DERRUBAR
          </button>
        </div>
      </div>

      {/* FERRAMENTAS DE COMBATE */}
      <div className={styles.group}>
        <label>COMBATE</label>
        <div className={styles.verticalActions}>
          <button onClick={onOpenInitiative} className={styles.btn}>
            <ListOrdered size={16} /> ORDEM DE TURNO
          </button>
          <button 
            onClick={onToggleCombat} 
            className={`${styles.btn} ${combatActive ? styles.combatOn : styles.combatOff}`}
          >
            {combatActive ? <><Square size={14} fill="currentColor"/> FINALIZAR COMBATE</> : <><Play size={14} fill="currentColor"/> INICIAR COMBATE</>}
          </button>
        </div>
      </div>

      {/* ... (ÁREA DE EFEITO E MAPA MANTÉM IGUAL) ... */}
      <div className={styles.group}>
        <label>ÁREA DE EFEITO</label>
        <div className={styles.grid3}>
          <button className={`${styles.iconBtn} ${interactionMode === 'aoe_cone' ? styles.activeAoE : ''}`} onClick={() => setInteractionMode('aoe_cone')} title="Cone">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22L22 2H2L12 22Z" /></svg>
          </button>
          <button className={`${styles.iconBtn} ${interactionMode === 'aoe_circle' ? styles.activeAoE : ''}`} onClick={() => setInteractionMode('aoe_circle')} title="Círculo">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /></svg>
          </button>
          <button className={`${styles.iconBtn} ${interactionMode === 'aoe_line' ? styles.activeAoE : ''}`} onClick={() => setInteractionMode('aoe_line')} title="Linha">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="2" x2="12" y2="22" /></svg>
          </button>
        </div>
      </div>

      <div className={styles.group}>
        <label>MAPA & GRID</label>
        <button onClick={onOpenMobModal} className={styles.btn}><PlusCircle size={16} /> Invocar Mob</button>
        <button onClick={onChangeMap} className={styles.btn}><ImageIcon size={16} /> Alterar Mapa</button>
        
        <div className={styles.row}>
          <button onClick={onToggleGrid} className={`${styles.btn} ${gridEnabled ? styles.active : ''}`} style={{flex:1}}>
            <Grid size={16} /> Grid
          </button>
          <button onClick={() => setSnapToGrid(!snapToGrid)} className={`${styles.btn} ${snapToGrid ? styles.active : ''}`} style={{flex:1}}>
            Snap: {snapToGrid ? 'ON' : 'OFF'}
          </button>
        </div>
        <div className={styles.inputRow}>
          <span>Escala (m):</span>
          <input type="number" value={gridScale} onChange={(e) => setGridScale(Number(e.target.value))} className={styles.numInput} />
        </div>
      </div>
    </div>
  );
}