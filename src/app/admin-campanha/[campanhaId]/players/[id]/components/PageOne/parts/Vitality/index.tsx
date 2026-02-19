import React from 'react';
import { Heart } from 'lucide-react';
import styles from './styles.module.css';

export default function Vitality({ current, total }: { current: number, total: number }) {
  const percent = Math.min((current / total) * 100, 100);
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <Heart size={18} /> <span>VITALIDADE (HP)</span>
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