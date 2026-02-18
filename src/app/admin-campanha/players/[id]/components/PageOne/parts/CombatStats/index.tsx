import React, { useEffect } from 'react';
import styles from './styles.module.css';

export default function CombatStats({ data, attributes, skills, bases, isEditing, onChange }: any) {
  
  // --- CÁLCULO AUTOMÁTICO ---
  useEffect(() => {
    if (!attributes || !skills || !bases) return;

    // 1. Iniciativa = Prontidão (Skill) + Agilidade (Attr)
    const prontidaoSkill = skills.find((s: any) => 
      s.name.toLowerCase().includes('prontidão') || s.name.toLowerCase().includes('prontidao')
    );
    const prontidaoVal = prontidaoSkill ? prontidaoSkill.total : 0;
    const calcIniciativa = prontidaoVal + (attributes.agi || 0);

    // 2. Esquiva (Reação) = Base Esquiva + 9
    const calcEsquiva = (bases.esquiva?.total || 0) + 9;

    // 3. Deslocamento = 10 + (Agilidade / 2)
    const calcDeslocamento = 10 + ((attributes.agi || 0) / 2);

    // Só atualiza se mudou algo (para evitar loop infinito)
    if (
      data.iniciativa !== calcIniciativa ||
      data.esquiva !== calcEsquiva ||
      data.deslocamento !== calcDeslocamento
    ) {
      onChange({
        ...data,
        iniciativa: calcIniciativa,
        esquiva: calcEsquiva,
        deslocamento: calcDeslocamento
      });
    }
  }, [attributes, skills, bases, onChange, data]); // Dependências: recalculam se algo mudar


  // Função de edição manual (caso queira sobrescrever)
  const handleChange = (key: string, val: string) => {
    onChange({ ...data, [key]: Number(val) });
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span>ESTATÍSTICAS</span>
      </div>

      <div className={styles.statsList}>
        
        {/* INICIATIVA */}
        <div className={styles.statItem}>
          <div className={styles.info}>
            <span className={styles.label}>INICIATIVA</span>
            <small className={styles.formula}>PRONTIDÃO + AGI</small>
          </div>
          {isEditing ? (
            <input 
              type="number" 
              className={styles.inputNinja} 
              value={data.iniciativa} 
              onChange={e => handleChange('iniciativa', e.target.value)} 
            />
          ) : (
            <div className={styles.valueDisplay}>{data?.iniciativa || 0}</div>
          )}
        </div>

        {/* ESQUIVA */}
        <div className={styles.statItem}>
          <div className={styles.info}>
            <span className={styles.label}>REAÇÃO (ESQ)</span>
            <small className={styles.formula}>ESQUIVA + 9</small>
          </div>
          {isEditing ? (
            <input 
              type="number" 
              className={styles.inputNinja} 
              value={data.esquiva} 
              onChange={e => handleChange('esquiva', e.target.value)} 
            />
          ) : (
            <div className={styles.valueDisplay}>{data?.esquiva || 0}</div>
          )}
        </div>

        {/* DESLOCAMENTO */}
        <div className={styles.statItem}>
          <div className={styles.info}>
            <span className={styles.label}>DESLOCAMENTO</span>
            <small className={styles.formula}>10M + AGI/2</small>
          </div>
          <div className={styles.valueWrapper}>
            {isEditing ? (
                <input 
                type="number" 
                className={styles.inputNinja} 
                value={data.deslocamento} 
                onChange={e => handleChange('deslocamento', e.target.value)} 
                />
            ) : (
                <div className={styles.valueDisplay}>{data?.deslocamento || 0}</div>
            )}
            <span className={styles.unit}>m</span>
          </div>
        </div>

      </div>
    </div>
  );
}