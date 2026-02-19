import React, { useState, useEffect } from 'react';
import { Edit, Save } from 'lucide-react';
import styles from './styles.module.css';

import Inventory from './parts/Inventory';
import Powers from './parts/Powers';
import Resources from './parts/Resources';
import Aptitudes from './parts/Aptitudes';
import CalcJutsus from './parts/CalcJutsus';
import CalcWeapons from './parts/CalcWeapons';

export default function PageTwo({ data }: { data: any }) {
  const [localData, setLocalData] = useState(data || {});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setLocalData(data || {});
  }, [data]);

  const updateSection = (sectionKey: string, newData: any) => {
    setLocalData((prev: any) => ({
      ...prev,
      [sectionKey]: newData
    }));
  };

  return (
    <div className={styles.container}>
      
      {/* BARRA DE CONTROLE DE EDIÇÃO */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: isEditing ? '#22c55e' : '#333',
            color: '#fff', border: 'none', padding: '8px 16px',
            borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold'
          }}
        >
          {isEditing ? <><Save size={18} /> SALVAR FICHA</> : <><Edit size={18} /> EDITAR FICHA</>}
        </button>
      </div>

      {/* 1. Inventário (Topo) */}
      <Inventory 
        data={localData.inventory || []} 
        isEditing={isEditing} 
        onChange={(d: any) => updateSection('inventory', d)} 
      />

      {/* 2. Meio: Poderes (Esq) + Recursos (Dir) */}
      <div className={styles.middleSection}>
        <div className={styles.leftCol}>
          <Powers 
            data={localData.powers || []} 
            isEditing={isEditing} 
            onChange={(d: any) => updateSection('powers', d)} 
          />
        </div>
        <div className={styles.rightCol}>
          <Resources 
            data={localData.economy || {}} 
            isEditing={isEditing} 
            onChange={(d: any) => updateSection('economy', d)} 
          />
        </div>
      </div>

      {/* 3. Aptidões */}
      <Aptitudes 
        data={localData.aptitudes || []} 
        isEditing={isEditing} 
        onChange={(d: any) => updateSection('aptitudes', d)} 
      />

      {/* 4. Calculadoras de Dano */}
      <CalcJutsus 
        data={localData.jutsus || []} 
        isEditing={isEditing} 
        onChange={(d: any) => updateSection('jutsus', d)} 
      />
      <CalcWeapons 
        data={localData.attacks || []} 
        isEditing={isEditing} 
        onChange={(d: any) => updateSection('attacks', d)} 
      />

    </div>
  );
}