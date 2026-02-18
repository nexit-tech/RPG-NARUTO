import React from 'react';
import { Briefcase, Coins, Battery, BatteryWarning } from 'lucide-react';
import styles from './styles.module.css';

// Dados Hardcoded
const RES = {
  comp: '12 / 20',
  ryos: 150000,
  ppTotal: 50,
  ppGastos: 45
};

export default function Resources() {
  return (
    <div className={styles.wrapper}>
      
      {/* 1. COMP. USADOS */}
      <div className={styles.pillBox}>
        <div className={styles.iconArea}><Briefcase size={18} /></div>
        <div className={styles.content}>
          <label>COMP. USADOS</label>
          <span>{RES.comp}</span>
        </div>
      </div>

      {/* 2. RYOS */}
      <div className={styles.pillBox}>
        <div className={styles.iconArea}><Coins size={18} /></div>
        <div className={styles.content}>
          <label>RYOS</label>
          <span>¥ {RES.ryos.toLocaleString()}</span>
        </div>
      </div>

      {/* 3. PONTOS DE PODER */}
      <div className={styles.rectBox}>
        <div className={styles.rectHeader}><Battery size={16}/> PONTOS DE PODER</div>
        <div className={styles.rectValue}>{RES.ppTotal}</div>
      </div>

      {/* 4. PP GASTOS */}
      <div className={styles.rectBox} style={{borderColor: '#ff4444'}}>
        <div className={styles.rectHeader} style={{color: '#ff4444'}}>
          <BatteryWarning size={16}/> PP GASTOS
        </div>
        <div className={styles.rectValue} style={{color: '#ff4444'}}>{RES.ppGastos}</div>
      </div>

    </div>
  );
}