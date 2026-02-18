import React from 'react';
import { Sword } from 'lucide-react';
import styles from './styles.module.css';

export default function CombatBases({ data, isEditing, onChange }: any) {
  
  // Atualiza um subcampo (ex: cc.base) e recalcula o total
  const handleChange = (baseKey: string, field: string, val: string) => {
    const newVal = Number(val);
    const currentObj = data[baseKey];
    
    // Novo objeto com o valor atualizado
    const updatedObj = { ...currentObj, [field]: newVal };
    
    // Recalcular total (Base + Attr + Other)
    updatedObj.total = updatedObj.base + updatedObj.attr + updatedObj.other;

    onChange({
      ...data,
      [baseKey]: updatedObj
    });
  };

  const renderItem = (label: string, key: string, attrName: string) => (
    <div className={styles.item}>
      <div className={styles.info}>
        <span className={styles.label}>{label}</span>
        <div className={styles.formulaContainer}>
           {isEditing ? (
             <>
               <input className={styles.miniInput} value={data[key].base} onChange={e => handleChange(key, 'base', e.target.value)} placeholder="Base"/>
               <span>+</span>
               <input className={styles.miniInput} value={data[key].attr} onChange={e => handleChange(key, 'attr', e.target.value)} placeholder={attrName}/>
               <span>+</span>
               <input className={styles.miniInput} value={data[key].other} onChange={e => handleChange(key, 'other', e.target.value)} placeholder="Outro"/>
             </>
           ) : (
             <small className={styles.formula}>
               {data[key].base} (BASE) + {data[key].attr} ({attrName}) + {data[key].other}
             </small>
           )}
        </div>
      </div>
      <div className={styles.valueDisplay}>{data[key].total}</div>
    </div>
  );

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <Sword size={20} /> <span>BASES DE COMBATE</span>
      </div>
      <div className={styles.list}>
        {renderItem('COMBATE CORPORAL', 'cc', 'FOR')}
        {renderItem('COMBATE DISTÂNCIA', 'cd', 'DES')}
        {renderItem('ESQUIVA TOTAL', 'esquiva', 'AGI')}
        {renderItem('LER MOVIMENTOS', 'lim', 'PER')}
      </div>
    </div>
  );
}