import React from 'react';
import { Users } from 'lucide-react';
import styles from './styles.module.css';

const LABELS: Record<string, string> = {
  atuacao: 'ATUAÇÃO',
  intimidar: 'INTIMIDAR',
  barganhar: 'BARGANHAR',
  blefar: 'BLEFAR',
  obterInfo: 'OBTER INFORMAÇÕES',
  mudarAtitude: 'MUDAR ATITUDE',
};

export default function Social({ data, isEditing, onChange }: any) {
  const { carisma, manipulacao, ...others } = data;

  const handleChange = (key: string, val: string) => {
    onChange({ ...data, [key]: Number(val) });
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <Users size={20} /> <span>ATRIBUTOS SOCIAIS</span>
      </div>

      <div className={styles.container}>
        <div className={styles.bigRow}>
          <div className={styles.bigBox}>
            <label>CARISMA</label>
            {isEditing ? <input type="number" className={styles.inputBig} value={carisma} onChange={e => handleChange('carisma', e.target.value)} /> : <strong>{carisma}</strong>}
          </div>
          <div className={styles.bigBox}>
            <label>MANIPULAÇÃO</label>
            {isEditing ? <input type="number" className={styles.inputBig} value={manipulacao} onChange={e => handleChange('manipulacao', e.target.value)} /> : <strong>{manipulacao}</strong>}
          </div>
        </div>

        <div className={styles.gridList}>
          {Object.entries(others).map(([key, val]: any) => {
            if (!LABELS[key]) return null; 
            return (
              <div key={key} className={styles.smallRow}>
                <span className={styles.label}>{LABELS[key]}</span>
                {isEditing ? (
                  <input type="number" className={styles.inputSmall} value={val} onChange={e => handleChange(key, e.target.value)} />
                ) : (
                  <span className={styles.valueDisplay}>{val}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}