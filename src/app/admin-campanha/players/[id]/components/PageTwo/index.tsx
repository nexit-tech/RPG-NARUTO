import React from 'react';
import styles from './styles.module.css';

import Inventory from './parts/Inventory';
import Powers from './parts/Powers';
import Resources from './parts/Resources';
import Aptitudes from './parts/Aptitudes';
import CalcJutsus from './parts/CalcJutsus';
import CalcWeapons from './parts/CalcWeapons';

// Adicionada a prop { data } para aceitar os dados da ficha
export default function PageTwo({ data }: { data: any }) {
  return (
    <div className={styles.container}>
      
      {/* 1. Inventário (Topo) */}
      <Inventory />

      {/* 2. Meio: Poderes (Esq) + Recursos (Dir) */}
      <div className={styles.middleSection}>
        <div className={styles.leftCol}>
          <Powers />
        </div>
        <div className={styles.rightCol}>
          <Resources />
        </div>
      </div>

      {/* 3. Aptidões */}
      <Aptitudes />

      {/* 4. Calculadoras de Dano */}
      <CalcJutsus />
      <CalcWeapons />

    </div>
  );
}