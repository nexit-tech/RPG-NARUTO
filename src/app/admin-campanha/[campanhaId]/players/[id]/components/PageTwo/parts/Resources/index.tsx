import React from 'react';
import { Briefcase, Coins, Battery, BatteryWarning } from 'lucide-react';
import styles from './styles.module.css';

export default function Resources({ data, isEditing, onChange }: any) {
  
  const handleChange = (field: string, val: string) => {
    onChange({ ...data, [field]: val });
  };

  // Fundo escuro forçado para não ficar branco no navegador
  const inputStyle = {
    background: 'rgba(0, 0, 0, 0.6)', 
    border: '1px solid #555', 
    color: '#fff',
    textAlign: 'center' as const, 
    width: '100%', 
    borderRadius: '4px',
    padding: '4px', 
    fontWeight: 'bold',
    outline: 'none'
  };

  return (
    <div className={styles.wrapper}>
      
      {/* 1. COMP. USADOS */}
      <div className={styles.pillBox}>
        <div className={styles.iconArea}><Briefcase size={18} /></div>
        <div className={styles.content}>
          <label>COMP. USADOS</label>
          {isEditing ? (
            <input style={inputStyle} value={data?.comp || ''} onChange={e => handleChange('comp', e.target.value)} />
          ) : (
            <span>{data?.comp || '0 / 0'}</span>
          )}
        </div>
      </div>

      {/* 2. RYOS */}
      <div className={styles.pillBox}>
        <div className={styles.iconArea}><Coins size={18} /></div>
        <div className={styles.content}>
          <label>RYOS</label>
          {isEditing ? (
            <input type="number" style={inputStyle} value={data?.ryos || 0} onChange={e => handleChange('ryos', e.target.value)} />
          ) : (
            <span>¥ {Number(data?.ryos || 0).toLocaleString()}</span>
          )}
        </div>
      </div>

      {/* 3. PONTOS DE PODER */}
      <div className={styles.rectBox}>
        <div className={styles.rectHeader}><Battery size={16}/> PONTOS DE PODER</div>
        <div className={styles.rectValue}>
          {isEditing ? (
            <input type="number" style={{...inputStyle, fontSize: '1.5rem', width: '80px'}} value={data?.ppTotal || 0} onChange={e => handleChange('ppTotal', e.target.value)} />
          ) : (
            data?.ppTotal || 0
          )}
        </div>
      </div>

      {/* 4. PP GASTOS */}
      <div className={styles.rectBox} style={{borderColor: '#ff4444'}}>
        <div className={styles.rectHeader} style={{color: '#ff4444'}}>
          <BatteryWarning size={16}/> PP GASTOS
        </div>
        <div className={styles.rectValue} style={{color: '#ff4444'}}>
          {isEditing ? (
            <input type="number" style={{...inputStyle, color: '#ff4444', fontSize: '1.5rem', width: '80px', borderColor: '#ff4444'}} value={data?.ppGastos || 0} onChange={e => handleChange('ppGastos', e.target.value)} />
          ) : (
            data?.ppGastos || 0
          )}
        </div>
      </div>

    </div>
  );
}