import React, { useEffect } from 'react';
import { Zap } from 'lucide-react';
import styles from './styles.module.css';

// Lista EXATA das perícias do seu sistema
const DEFAULT_SKILLS = [
  { name: 'Acrobacia', attr: 'agi', pontos: 0, other: 0, total: 0 },
  { name: 'Arte', attr: 'int', pontos: 0, other: 0, total: 0 },
  { name: 'Atletismo', attr: 'for', pontos: 0, other: 0, total: 0 },
  { name: 'Ciências Naturais', attr: 'int', pontos: 0, other: 0, total: 0 },
  { name: 'Concentração', attr: 'esp', pontos: 0, other: 0, total: 0 },
  { name: 'Cultura', attr: 'int', pontos: 0, other: 0, total: 0 },
  { name: 'Disfarce', attr: 'int', pontos: 0, other: 0, total: 0 },
  { name: 'Escapar', attr: 'des', pontos: 0, other: 0, total: 0 },
  { name: 'Furtividade', attr: 'agi', pontos: 0, other: 0, total: 0 },
  { name: '*Lidar com Animais', attr: 'int', pontos: 0, other: 0, total: 0 },
  { name: '*Mecanismo', attr: 'int', pontos: 0, other: 0, total: 0 },
  { name: '*Medicina', attr: 'int', pontos: 0, other: 0, total: 0 },
  { name: '*Ocultismo', attr: 'int', pontos: 0, other: 0, total: 0 },
  { name: 'Prestidigitação', attr: 'des', pontos: 0, other: 0, total: 0 },
  { name: 'Procurar', attr: 'per', pontos: 0, other: 0, total: 0 },
  { name: 'Prontidão', attr: 'per', pontos: 0, other: 0, total: 0 },
  { name: 'Rastrear', attr: 'per', pontos: 0, other: 0, total: 0 },
  { name: '**Venefício', attr: 'int', pontos: 0, other: 0, total: 0 }
];

export default function Skills({ data, attributes, isEditing, onChange }: any) {
  // Se a ficha vier vazia, assume a lista padrão. Se tiver, usa a do banco.
  const currentData = (data && data.length > 0) ? data : DEFAULT_SKILLS;

  useEffect(() => {
    if (!attributes) return;

    let changed = false;
    const nextData = currentData.map((skill: any) => {
      const defaultAttr = skill.attr ? skill.attr.toLowerCase() : 'int';
      const attrKey = skill.attrKey || defaultAttr;
      const attrVal = Number(attributes[attrKey]) || 0;
      const attrBonus = Math.floor(attrVal / 2);

      const pontosVal = Number(skill.pontos) || 0;
      const otherVal = Number(skill.other) || 0;
      const total = pontosVal + attrBonus + otherVal;

      if (skill.attrValue !== attrBonus || skill.total !== total || skill.attrKey !== attrKey) {
        changed = true;
        return { ...skill, attrKey, attrValue: attrBonus, total };
      }
      return skill;
    });

    if (changed || (!data || data.length === 0)) {
      if (onChange) onChange(nextData);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attributes, data]);

  const handleSkillChange = (index: number, field: string, val: string) => {
    const newData = [...currentData];
    const skill = { ...newData[index] };
    
    skill[field] = field === 'attrKey' ? val : Number(val);
    
    const defaultAttr = skill.attr ? skill.attr.toLowerCase() : 'int';
    const currentAttrKey = skill.attrKey || defaultAttr;
    const attrVal = Number(attributes?.[currentAttrKey]) || 0;
    const attrBonus = Math.floor(attrVal / 2);
    
    skill.attrValue = attrBonus;
    skill.total = (Number(skill.pontos) || 0) + attrBonus + (Number(skill.other) || 0);

    newData[index] = skill;
    onChange(newData);
  };

  const ColumnHeader = () => (
    <div className={styles.subHeader}>
      <div className={styles.colName}>PERÍCIA</div>
      <div className={styles.colData}>
        <span>TOT</span>
        <span>PTS</span>
        <span>ATR</span>
        <span>OUT</span>
      </div>
    </div>
  );

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <Zap size={20} color="#ff6600" /> <span>PERÍCIAS GERAIS</span>
      </div>
      
      <div className={styles.headerRow}>
        <ColumnHeader />
        <div className={styles.desktopOnly}><ColumnHeader /></div>
      </div>

      <div className={styles.gridList}>
        {currentData.map((s: any, idx: number) => {
          const defaultAttr = s.attr ? s.attr.toLowerCase() : 'int';
          const currentAttrKey = s.attrKey || defaultAttr;
          
          const attrVal = Number(attributes?.[currentAttrKey]) || 0;
          const attrBonus = Math.floor(attrVal / 2);
          const displayTotal = s.total !== undefined ? s.total : (Number(s.pontos) || 0) + attrBonus + (Number(s.other) || 0);

          return (
            <div key={idx} className={styles.row}>
              <div className={styles.nameCell}>{s.name}</div>
              
              <div className={styles.calcCell}>
                <div className={styles.totalBox}>+{displayTotal}</div>
                <span className={styles.mathSym}>=</span>
                
                {isEditing ? (
                   <input 
                     type="number" 
                     className={styles.inputAttr} 
                     value={s.pontos || ''} 
                     onChange={e => handleSkillChange(idx, 'pontos', e.target.value)}
                   />
                ) : (
                  <div className={styles.staticValue}>{s.pontos || 0}</div>
                )}
                
                <span className={styles.mathSym}>+</span>
                
                {/* Agora você pode alterar qual atributo é usado em TODAS as perícias */}
                {isEditing ? (
                   <select 
                     className={styles.inputAttr} 
                     value={currentAttrKey} 
                     onChange={e => handleSkillChange(idx, 'attrKey', e.target.value)}
                     style={{ padding: 0, cursor: 'pointer', appearance: 'none', WebkitAppearance: 'none' }}
                   >
                     <option value="for">FOR</option>
                     <option value="des">DES</option>
                     <option value="agi">AGI</option>
                     <option value="per">PER</option>
                     <option value="int">INT</option>
                     <option value="vig">VIG</option>
                     <option value="esp">ESP</option>
                   </select>
                ) : (
                  <div className={styles.attrBox} title={`Atributo: ${currentAttrKey.toUpperCase()}`}>
                    {attrBonus}
                  </div>
                )}
                
                <span className={styles.mathSym}>+</span>
                
                {isEditing ? (
                   <input 
                     type="number" 
                     className={styles.inputAttr} 
                     value={s.other || ''} 
                     onChange={e => handleSkillChange(idx, 'other', e.target.value)}
                   />
                ) : (
                  <div className={styles.staticValue}>{s.other || 0}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}