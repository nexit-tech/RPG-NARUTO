import React from 'react';
import { Zap } from 'lucide-react';
import styles from './styles.module.css';

const DATA = [
  { poder: 'Manto da Kurama', nivel: 1, efeitos: '+50 Chakra, +2 Força, Aura Visível' },
  { poder: 'Cura Acelerada', nivel: 2, efeitos: 'Recupera 1 HP por turno' },
  { poder: 'Sentidos Aguçados', nivel: 1, efeitos: '+2 em Percepção' },
];

export default function Powers() {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <Zap size={20} color="#fff" /> <span>PODERES</span>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th align="left">PODER</th>
            <th align="center" style={{ width: '80px' }}>NÍVEL</th>
            <th align="left">EFEITOS</th>
          </tr>
        </thead>
        <tbody>
          {DATA.map((p, i) => (
            <tr key={i}>
              <td className={styles.name}>{p.poder}</td>
              <td align="center" className={styles.level}>{p.nivel}</td>
              <td className={styles.effect}>{p.efeitos}</td>
            </tr>
          ))}
          {[...Array(4)].map((_, i) => (
            <tr key={`empty-${i}`}><td colSpan={3}>&nbsp;</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}