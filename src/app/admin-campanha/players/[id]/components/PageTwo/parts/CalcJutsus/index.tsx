import React from 'react';
import { Scroll } from 'lucide-react';
import styles from './styles.module.css';

const DATA = [
  { jutsu: 'Rasengan', custo: 20, nv: 1, dur: '-', elem: '-', bonus: 10, base: '10d10' },
  { jutsu: 'Bola de Fogo', custo: 10, nv: 1, dur: '-', elem: 5, bonus: 2, base: '6d6' },
];

export default function CalcJutsus() {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <Scroll size={20} color="#fff" /> <span>CALCULADORA DE DANO - JUTSUS</span>
      </div>
      <table className={styles.table}>
        <thead>
        <tr>
            <th align="left">JUTSU</th>
            <th style={{ width: '60px' }}>CUSTO</th>
            <th style={{ width: '60px' }}>NV. USADO</th>
            <th style={{ width: '60px' }}>DUREZA</th>
            <th style={{ width: '80px' }}>DANO ELEM.</th>
            <th style={{ width: '80px' }}>BÔNUS</th>
            <th style={{ width: '100px' }}>DANO BASE</th>
        </tr>
        </thead>
        <tbody>
          {DATA.map((j, i) => (
            <tr key={i}>
              <td className={styles.jutsuName}>{j.jutsu}</td>
              <td align="center">{j.custo}</td>
              <td align="center">{j.nv}</td>
              <td align="center">{j.dur}</td>
              <td align="center">{j.elem}</td>
              <td align="center">+{j.bonus}</td>
              <td align="center" className={styles.base}>{j.base}</td>
            </tr>
          ))}
          {[...Array(2)].map((_, i) => (
            <tr key={`e-${i}`}><td colSpan={7}>&nbsp;</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}