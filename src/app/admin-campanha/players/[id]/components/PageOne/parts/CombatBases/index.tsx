import React, { useEffect } from 'react';
import { Sword } from 'lucide-react';
import styles from './styles.module.css';

export default function CombatBases({ data, attributes, isEditing, onChange }: any) {
  
  // Efeito para recalcular as bases automaticamente caso os atributos mudem lá no topo da ficha
  useEffect(() => {
    if (!attributes || !data) return;
    
    let changed = false;
    const nextData = { ...data };

    const checkAndUpdate = (key: string, defaultAttrKey: string) => {
      const attrKey = nextData[key]?.attrKey || defaultAttrKey;
      const attrVal = Number(attributes[attrKey]) || 0;
      const baseVal = Number(nextData[key]?.base) || 0;
      const otherVal = Number(nextData[key]?.other) || 0;
      const total = baseVal + attrVal + otherVal;

      // Só dispara o onChange se houver diferença, evitando loops infinitos
      if (nextData[key]?.attr !== attrVal || nextData[key]?.total !== total) {
        nextData[key] = { ...nextData[key], attr: attrVal, total, attrKey };
        changed = true;
      }
    };

    checkAndUpdate('cc', 'for'); // Combate Corporal
    checkAndUpdate('cd', 'des'); // Combate à Distância
    checkAndUpdate('esquiva', 'agi'); // Esquiva
    checkAndUpdate('lim', 'per'); // Ler Movimentos

    if (changed) {
      onChange(nextData);
    }
  }, [attributes]); // Roda sempre que "attributes" sofrer modificação

  // Lida com as edições manuais (Base, Outros ou troca de Atributo no CC)
  const handleFieldChange = (baseKey: string, field: string, val: string) => {
    const currentObj = data[baseKey];
    // Se for attrKey (ex: trocar FOR por DES), salva como string. Senão, converte pra número.
    const updatedObj = { ...currentObj, [field]: field === 'attrKey' ? val : Number(val) };
    
    const aKey = updatedObj.attrKey || (baseKey === 'cc' ? 'for' : baseKey === 'cd' ? 'des' : baseKey === 'esquiva' ? 'agi' : 'per');
    const attrValue = Number(attributes[aKey]) || 0;

    updatedObj.attr = attrValue;
    updatedObj.total = Number(updatedObj.base) + attrValue + Number(updatedObj.other);

    onChange({
      ...data,
      [baseKey]: updatedObj
    });
  };

  const renderItem = (label: string, key: string, defaultAttrKey: string, options?: {label: string, val: string}[]) => {
    const currentAttrKey = data[key]?.attrKey || defaultAttrKey;
    const attrValue = attributes ? Number(attributes[currentAttrKey]) || 0 : data[key]?.attr || 0;
    const baseVal = data[key]?.base || 0;
    const otherVal = data[key]?.other || 0;
    const total = baseVal + attrValue + otherVal;

    return (
      <div className={styles.item}>
        <div className={styles.info}>
          <span className={styles.label}>{label}</span>
          <div className={styles.formulaContainer}>
             {isEditing ? (
               <>
                 <input 
                   className={styles.miniInput} 
                   type="number"
                   value={baseVal} 
                   onChange={e => handleFieldChange(key, 'base', e.target.value)} 
                   title="Base"
                 />
                 <span>+</span>
                 
                 {/* Se tiver opções (como no Combate Corporal), renderiza um dropdown */}
                 {options ? (
                   <select 
                     className={styles.miniSelect}
                     value={currentAttrKey}
                     onChange={e => handleFieldChange(key, 'attrKey', e.target.value)}
                     title="Atributo Usado"
                   >
                     {options.map(opt => (
                       <option key={opt.val} value={opt.val}>
                         {opt.label} ({attributes?.[opt.val] || 0})
                       </option>
                     ))}
                   </select>
                 ) : (
                   <span className={styles.fixedAttr} title={`Atributo: ${defaultAttrKey.toUpperCase()}`}>
                     {attrValue} ({defaultAttrKey.toUpperCase()})
                   </span>
                 )}

                 <span>+</span>
                 <input 
                   className={styles.miniInput} 
                   type="number"
                   value={otherVal} 
                   onChange={e => handleFieldChange(key, 'other', e.target.value)} 
                   title="Outro (Bônus/Penalidade)"
                 />
               </>
             ) : (
               <small className={styles.formula}>
                 {baseVal} (BASE) + {attrValue} ({currentAttrKey.toUpperCase()}) + {otherVal} (OUTRO)
               </small>
             )}
          </div>
        </div>
        <div className={styles.valueDisplay}>{total}</div>
      </div>
    );
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <Sword size={20} /> <span>BASES DE COMBATE</span>
      </div>
      <div className={styles.list}>
        {renderItem('COMBATE CORPORAL', 'cc', 'for', [
          { label: 'FOR', val: 'for' },
          { label: 'DES', val: 'des' }
        ])}
        {renderItem('COMBATE DISTÂNCIA', 'cd', 'des')}
        {renderItem('ESQUIVA TOTAL', 'esquiva', 'agi')}
        {renderItem('LER MOVIMENTOS', 'lim', 'per')}
      </div>
    </div>
  );
}