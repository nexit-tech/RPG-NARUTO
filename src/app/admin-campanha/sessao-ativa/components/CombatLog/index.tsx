import React, { useEffect, useRef } from 'react';
import { Scroll } from 'lucide-react';
import styles from './styles.module.css';

export default function CombatLog({ logs }: { logs: string[] }) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Scroll size={18} />
        <span>HISTÓRICO DE BATALHA</span>
      </div>
      <div className={styles.logList}>
        {logs.map((log, i) => (
          <div key={i} className={styles.logItem}>
            <span className={styles.time}>[{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}]</span>
            <p>{log}</p>
          </div>
        ))}
        <div ref={endRef} />
      </div>
    </div>
  );
}