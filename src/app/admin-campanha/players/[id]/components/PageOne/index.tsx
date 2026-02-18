import React, { useState, useEffect } from 'react';
import { Edit, Save } from 'lucide-react';
import styles from './styles.module.css';

// Importando Partes
import Attributes from './parts/Attributes';
import Vitals from './parts/Vitals';
import Armors from './parts/Armors';
import CombatStats from './parts/CombatStats';
import CombatBases from './parts/CombatBases';
import Social from './parts/Social';
import Skills from './parts/Skills';

export default function PageOne({ data }: { data: any }) {
  // Estado local para permitir edição sem afetar o banco imediatamente
  const [localData, setLocalData] = useState(data);
  const [isEditing, setIsEditing] = useState(false);

  // Atualiza se a prop mudar (ex: carregou do banco)
  useEffect(() => {
    setLocalData(data);
  }, [data]);

  // Função Genérica para atualizar seções do objeto
  const updateSection = (sectionKey: string, newData: any) => {
    setLocalData((prev: any) => ({
      ...prev,
      [sectionKey]: newData
    }));
  };

  return (
    <div className={styles.container}>
      {/* BARRA DE CONTROLE DE EDIÇÃO */}
      <div className={styles.editBar}>
        <button 
          className={`${styles.editBtn} ${isEditing ? styles.saveBtn : ''}`}
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? (
            <><Save size={18} /> SALVAR FICHA</>
          ) : (
            <><Edit size={18} /> EDITAR FICHA</>
          )}
        </button>
      </div>

      {/* Topo: Atributos */}
      <Attributes 
        data={localData.attributes} 
        isEditing={isEditing} 
        onChange={(d: any) => updateSection('attributes', d)} 
      />

      {/* Grid Principal */}
      <div className={styles.mainGrid}>
        
        {/* --- LINHA 1: COMBATE --- */}
        <Vitals 
          data={localData.combatStats} // Passando objeto inteiro agora
          isEditing={isEditing}
          onChange={(d: any) => updateSection('combatStats', d)}
        />
        
        <Armors 
          data={localData.defenses} 
          isEditing={isEditing}
          onChange={(d: any) => updateSection('defenses', d)}
        />
        
        {/* Passando TUDO que o CombatStats precisa para calcular */}
        <CombatStats 
          data={localData.combatStats} 
          attributes={localData.attributes}
          skills={localData.skills}
          bases={localData.bases}
          isEditing={isEditing}
          onChange={(d: any) => updateSection('combatStats', d)}
        />
        
        <CombatBases 
          data={localData.bases} 
          isEditing={isEditing}
          onChange={(d: any) => updateSection('bases', d)}
        />

        {/* --- LINHA 2: TÉCNICA --- */}
        <div className={styles.span2}>
          <Social 
            data={localData.social} 
            isEditing={isEditing}
            onChange={(d: any) => updateSection('social', d)}
          />
        </div>
        
        <div className={styles.span2}>
          <Skills 
            data={localData.skills} 
            isEditing={isEditing}
            onChange={(d: any) => updateSection('skills', d)}
          />
        </div>

      </div>
    </div>
  );
}