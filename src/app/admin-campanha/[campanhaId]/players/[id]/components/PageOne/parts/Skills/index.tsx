import React, { useEffect } from 'react';
import { Zap } from 'lucide-react';
import styles from './styles.module.css';

export default function Skills({ data, attributes, isEditing, onChange }: any) {
  
  // Calcula os valores automaticamente sempre que os atributos ou dados mudam
  useEffect(() => {
    if (!attributes || !data || !Array.isArray(data)) return;
    
    let changed = false;
    const nextData = data.map((skill: any) => {
      const defaultAttr = skill.attr ? skill.attr.toLowerCase() : 'int';
      const attrKey = skill.attrKey || defaultAttr;
      const attrVal = Number(attributes[attrKey]) || 0;
      
      // Metade do atributo arredondado para baixo
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

    if (changed) {
      onChange(nextData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attributes]);

  const handleSkillChange = (index: number, field: string, val: string) => {
    const newData = [...data];
    const skill = { ...newData[index] };
    
    // Se for trocar FOR/DES guarda string, senão guarda número
    skill[field] = field === 'attrKey' ? val : Number(val);
    
    // Recalcula o total na hora
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
        {data?.map((s: any, idx: number) => {
          const defaultAttr = s.attr ? s.attr.toLowerCase() : 'int';
          const currentAttrKey = s.attrKey || defaultAttr;
          
          const attrVal = Number(attributes?.[currentAttrKey]) || 0;
          const attrBonus = Math.floor(attrVal / 2);
          const displayTotal = s.total !== undefined ? s.total : (Number(s.pontos) || 0) + attrBonus + (Number(s.other) || 0);

          return (
            <div key={idx} className={styles.row}>
              <div className={styles.nameCell}>{s.name}</div>
              
              <div className={styles.calcCell}>
                
                {/* TOTAL (Agora é automático, apenas exibe o valor) */}
                <div className={styles.totalBox}>+{displayTotal}</div>
                
                <span className={styles.mathSym}>=</span>
                
                {/* PONTOS (Substitui a antiga linha vazia) */}
                {isEditing ? (
                   <input 
                     type="number" 
                     className={styles.inputAttr} 
                     style={{ flex: 1, margin: '0 2px' }} /* Usa flex para ocupar o espaço da linha */
                     value={s.pontos || ''} 
                     onChange={e => handleSkillChange(idx, 'pontos', e.target.value)}
                   />
                ) : (
                  <div style={{ flex: 1, textAlign: 'center', color: '#ccc', fontSize: '0.75rem', borderBottom: '1px solid #444', margin: '0 3px', paddingBottom: '2px' }}>
                    {s.pontos || 0}
                  </div>
                )}
                
                <span className={styles.mathSym}>+</span>
                
                {/* ATRIBUTO */}
                {isEditing && defaultAttr === 'for' ? (
                   <select 
                     className={styles.inputAttr} 
                     /* Esconde a seta padrão para ficar igual a um input normal */
                     style={{ padding: 0, cursor: 'pointer', appearance: 'none', WebkitAppearance: 'none', textAlign: 'center' }}
                     value={currentAttrKey} 
                     onChange={e => handleSkillChange(idx, 'attrKey', e.target.value)}
                   >
                     <option value="for">FOR</option>
                     <option value="des">DES</option>
                   </select>
                ) : (
                  <div className={styles.attrBox} title={`Atributo: ${currentAttrKey.toUpperCase()}`}>
                    {attrBonus}
                  </div>
                )}
                
                <span className={styles.mathSym}>+</span>
                
                {/* OUTROS (Substitui a antiga linha vazia) */}
                {isEditing ? (
                   <input 
                     type="number" 
                     className={styles.inputAttr} 
                     style={{ flex: 1, margin: '0 2px' }} 
                     value={s.other || ''} 
                     onChange={e => handleSkillChange(idx, 'other', e.target.value)}
                   />
                ) : (
                  <div style={{ flex: 1, textAlign: 'center', color: '#ccc', fontSize: '0.75rem', borderBottom: '1px solid #444', margin: '0 3px', paddingBottom: '2px' }}>
                    {s.other || 0}
                  </div>
                )}
                
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}