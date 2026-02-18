import React from 'react';
import { Star } from 'lucide-react';
import styles from './styles.module.css';

const DATA = [
  { nome: 'Ninja Briguento', nv: 'NV.1', custo: 2 },
  { nome: 'Vontade do Fogo', nv: 'NV.1', custo: 5 },
  { nome: 'Genio do Trabalho', nv: 'NV.2', custo: 3 },
  { nome: 'Herdeiro do Clã', nv: 'NV.1', custo: 4 },
  { nome: 'Mestre de Armas', nv: 'NV.3', custo: 6 },
  { nome: 'Estrategista', nv: 'NV.1', custo: 3 },
];

export default function Aptitudes() {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <Star size={20} color="#000" /> <span>APTIDÕES</span>
      </div>
      
      {/* Cabeçalho da Tabela Grid */}
      <div className={styles.gridHeader}>
        <div className={styles.col}>NOME/NV.</div>
        <div className={styles.col}>PTS. GASTOS</div>
        <div className={styles.col}>NOME/NV.</div>
        <div className={styles.col}>PTS. GASTOS</div>
        <div className={styles.col}>NOME/NV.</div>
        <div className={styles.col}>PTS. GASTOS</div>
      </div>

      <div className={styles.gridBody}>
        {DATA.map((item, i) => (
          <React.Fragment key={i}>
            <div className={styles.cellName}>
              <span className={styles.aptName}>{item.nome}</span>
              <span className={styles.aptNv}>{item.nv}</span>
            </div>
            <div className={styles.cellCost}>{item.custo}</div>
          </React.Fragment>
        ))}
        {/* Preenchimento visual se necessário */}
        {[...Array(3)].map((_, i) => (
           <React.Fragment key={`e-${i}`}>
             <div className={styles.cellName}></div><div className={styles.cellCost}></div>
           </React.Fragment>
        ))}
      </div>
    </div>
  );
}