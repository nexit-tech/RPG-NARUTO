import React from 'react';
import { Flame } from 'lucide-react';
import styles from './styles.module.css';

export default function Chakra({ current, total }: { current: number, total: number }) {
  const percent = Math.min((current / total) * 100, 100);
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <Flame size={18} /> <span>CHAKRA (CP)</span>
      </div>
      <div className={styles.content}>
        <div className={styles.numbers}>
          <strong>{current}</strong> <small>/ {total}</small>
        </div>
        <div className={styles.track}>
          <div className={styles.fill} style={{width: `${percent}%`}}></div>
        </div>
      </div>
    </div>
  );
}