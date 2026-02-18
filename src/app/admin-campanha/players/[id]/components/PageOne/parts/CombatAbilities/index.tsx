import React from 'react';
import { Target } from 'lucide-react';
import styles from './styles.module.css';

export default function CombatAbilities({ data }: { data: any[] }) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <Target size={20} /> <span>HABILIDADES DE COMBATE</span>
      </div>
      <ul className={styles.list}>
        {data?.map((h: any, i: number) => (
          <li key={i}>
            <span className={styles.abilityName}>{h.name}</span>
            <div className={styles.badge}>NÍVEL {h.nivel}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}