import React from 'react';
import { Sword } from 'lucide-react';
import styles from './styles.module.css';

const DATA = [
  { nome: 'Soco Inglês', dano: '1d6', bonus: 10, alcance: 'Toque', crit: '20/x2', dureza: 5, base: 10 },
  { nome: 'Kunai', dano: '1d4', bonus: 8, alcance: '9m', crit: '19/x2', dureza: 2, base: 8 },
];

export default function CalcWeapons() {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <Sword size={20} color="#fff" /> <span>CALCULADORA DE DANO - ATAQUES</span>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th align="left">NOME</th>
            <th>DANO</th>
            <th>BÔNUS</th>
            <th>ALCANCE</th>
            <th>CRÍTICO</th>
            <th>DUREZA</th>
            <th>DANO BASE</th>
          </tr>
        </thead>
        <tbody>
          {DATA.map((w, i) => (
            <tr key={i}>
              <td className={styles.wName}>{w.nome}</td>
              <td align="center">{w.dano}</td>
              <td align="center">+{w.bonus}</td>
              <td align="center">{w.alcance}</td>
              <td align="center">{w.crit}</td>
              <td align="center">{w.dureza}</td>
              <td align="center" className={styles.base}>{w.base}</td>
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