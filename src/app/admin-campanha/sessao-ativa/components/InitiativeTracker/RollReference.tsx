import React from 'react';
import styles from './styles.module.css';

export default function RollReference() {
  return (
    <div className={styles.rollRefContainer}>
      <div className={styles.rollHeader}>TABELA DE DANO (2D8)</div>
      
      {/* Linha de Números */}
      <div className={styles.rollGrid}>
        <div className={`${styles.rollCell} ${styles.red}`}>2-3</div>
        <div className={`${styles.rollCell} ${styles.yellow}`}>4-8</div>
        <div className={`${styles.rollCell} ${styles.yellow}`}>9-11</div>
        <div className={`${styles.rollCell} ${styles.yellow}`}>12-14</div>
        <div className={`${styles.rollCell} ${styles.green}`}>15+</div>
      </div>
      
      {/* Linha de Graus */}
      <div className={styles.rollGrid}>
        <div className={styles.rollCellText}>FALHA</div>
        <div className={styles.rollCellText}>GRAU 1</div>
        <div className={styles.rollCellText}>GRAU 2</div>
        <div className={styles.rollCellText}>GRAU 3</div>
        <div className={styles.rollCellText}>GRAU 4</div>
      </div>
    </div>
  );
}