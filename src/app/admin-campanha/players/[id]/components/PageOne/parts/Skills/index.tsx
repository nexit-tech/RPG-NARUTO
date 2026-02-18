import React from 'react';
import { Zap } from 'lucide-react';
import styles from './styles.module.css';

export default function Skills({ data, isEditing, onChange }: any) {
  
  const handleSkillChange = (index: number, field: string, val: string) => {
    const newData = [...data];
    // Se for total, converte pra numero. Se for attr, mantem string
    newData[index] = { 
      ...newData[index], 
      [field]: field === 'total' ? Number(val) : val 
    };
    onChange(newData);
  };

  const ColumnHeader = () => (
    <div className={styles.subHeader}>
      <div className={styles.colName}>PERÍCIA</div>
      <div className={styles.colData}>
        <span style={{width: '35px'}}>TOT</span>
        <span style={{flex:1}}>PTS</span>
        <span style={{width: '30px'}}>ATR</span>
        <span style={{flex:1}}>OUT</span>
      </div>
    </div>
  );

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <Zap size={20} /> <span>PERÍCIAS GERAIS</span>
      </div>
      
      <div className={styles.headerRow}>
        <ColumnHeader />
        <div className={styles.desktopOnly}><ColumnHeader /></div>
      </div>

      <div className={styles.gridList}>
        {data.map((s: any, idx: number) => (
          <div key={idx} className={styles.row}>
            <div className={styles.nameCell}>{s.name}</div>
            
            <div className={styles.calcCell}>
              {isEditing ? (
                 <input 
                   type="number" 
                   className={styles.inputTotal} 
                   value={s.total} 
                   onChange={e => handleSkillChange(idx, 'total', e.target.value)}
                 />
              ) : (
                <div className={styles.totalBox}>+{s.total}</div>
              )}
              
              <span className={styles.mathSym}>=</span>
              <div className={styles.lineInput}></div>
              <span className={styles.mathSym}>+</span>
              
              {isEditing ? (
                 <input 
                   type="text" 
                   className={styles.inputAttr} 
                   value={s.attr} 
                   onChange={e => handleSkillChange(idx, 'attr', e.target.value)}
                   maxLength={3}
                 />
              ) : (
                <div className={styles.attrBox}>{s.attr}</div>
              )}
              
              <span className={styles.mathSym}>+</span>
              <div className={styles.lineInput}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}