import React from 'react';
import { Heart, Flame, Shield, Sword, Wind, Crosshair } from 'lucide-react';
import styles from './styles.module.css';
import { Token } from '../BattleMap';

export default function CurrentTurnPanel({ character }: { character: Token }) {
  if (!character) return null;

  return (
    <div className={styles.panel}>
      {/* 1. Avatar e Nome */}
      <div className={styles.identity}>
        <div className={styles.avatarWrapper}>
          <img src={character.img} alt={character.name} className={styles.avatar} />
          <div className={styles.lvlBadge}>NV. {character.level || 1}</div>
        </div>
        <div className={styles.nameBox}>
          <h3>{character.name}</h3>
          <span>{character.class || 'Guerreiro'}</span>
        </div>
      </div>

      {/* 2. Barras Vitais (HP e CP) */}
      <div className={styles.vitals}>
        <div className={styles.barGroup}>
          <div className={styles.labelRow}>
            <span className={styles.hpLabel}><Heart size={12}/> PV</span>
            <span className={styles.values}>{character.hp}/{character.maxHp}</span>
          </div>
          <div className={styles.track}>
            <div 
              className={styles.fillHp} 
              style={{ width: `${(character.hp / character.maxHp) * 100}%` }}
            />
          </div>
        </div>

        <div className={styles.barGroup}>
          <div className={styles.labelRow}>
            <span className={styles.cpLabel}><Flame size={12}/> CP</span>
            <span className={styles.values}>{character.cp}/{character.maxCp}</span>
          </div>
          <div className={styles.track}>
            <div 
              className={styles.fillCp} 
              style={{ width: `${(character.cp / character.maxCp) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3. Atributos de Combate Rápido */}
      <div className={styles.statsGrid}>
        <StatBox icon={<Sword size={14}/>} label="ATK" value={character.stats?.atk || 0} />
        <StatBox icon={<Shield size={14}/>} label="DEF" value={character.stats?.def || 0} />
        <StatBox icon={<Wind size={14}/>} label="ESQ" value={character.stats?.esq || 0} />
        <StatBox icon={<Crosshair size={14}/>} label="CD" value={character.stats?.cd || 0} />
      </div>
    </div>
  );
}

function StatBox({ icon, label, value }: any) {
  return (
    <div className={styles.statBox}>
      <span className={styles.statLabel}>{icon} {label}</span>
      <strong className={styles.statValue}>{value}</strong>
    </div>
  );
}