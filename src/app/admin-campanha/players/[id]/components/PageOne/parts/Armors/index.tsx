import React from 'react';
import { Shield } from 'lucide-react';
import styles from './styles.module.css';

export default function Armors({ data, isEditing, onChange }: any) {
  
  const handleChange = (key: string, val: string) => {
    onChange({ ...data, [key]: Number(val) });
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <Shield size={20} /> <span>ARMADURAS</span>
      </div>
      <div className={styles.grid}>
        <div className={styles.armorBox}>
          <label>DUREZA</label>
          {isEditing ? (
            <input 
              type="number" 
              className={styles.inputNinja} 
              value={data.dureza} 
              onChange={e => handleChange('dureza', e.target.value)} 
            />
          ) : (
            <strong>{data.dureza}</strong>
          )}
        </div>
        <div className={styles.armorBox}>
          <label>ABSORÇÃO</label>
          {isEditing ? (
            <input 
              type="number" 
              className={styles.inputNinja} 
              value={data.absorcao} 
              onChange={e => handleChange('absorcao', e.target.value)} 
            />
          ) : (
            <strong>{data.absorcao}</strong>
          )}
        </div>
      </div>
    </div>
  );
}