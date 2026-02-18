import React from 'react';
import { Activity, Plus, Minus } from 'lucide-react';
import styles from './styles.module.css';

const ATTR_MAP: Record<string, string> = {
  for: 'FORÇA',
  des: 'DESTREZA',
  agi: 'AGILIDADE',
  per: 'PERCEPÇÃO',
  int: 'INTELIGÊNCIA',
  vig: 'VIGOR',
  esp: 'ESPÍRITO'
};

export default function Attributes({ data, isEditing, onChange }: any) {
  
  // Atualiza via input direto
  const handleChange = (key: string, value: string) => {
    onChange({
      ...data,
      [key]: Number(value)
    });
  };

  // Atualiza via botões (+/-)
  const handleStep = (key: string, currentVal: number, step: number) => {
    const newVal = currentVal + step;
    if (newVal < 0) return; // Evita negativos se não quiser
    onChange({
      ...data,
      [key]: newVal
    });
  };

  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <Activity size={20} /> <span>ATRIBUTOS PRINCIPAIS</span>
      </div>
      <div className={styles.grid}>
        {Object.entries(data).map(([key, val]: any) => (
          <div key={key} className={styles.attrBox}>
            <label>{ATTR_MAP[key] || key}</label>
            
            {isEditing ? (
              <div className={styles.stepper}>
                {/* Botão Menos */}
                <button 
                  className={styles.stepBtn} 
                  onClick={() => handleStep(key, val, -1)}
                  tabIndex={-1} // Pula no tab pra focar no input
                >
                  <Minus size={14} strokeWidth={4} />
                </button>

                {/* Input Central */}
                <input 
                  type="number" 
                  className={styles.inputEdit} 
                  value={val} 
                  onChange={(e) => handleChange(key, e.target.value)}
                />

                {/* Botão Mais */}
                <button 
                  className={styles.stepBtn} 
                  onClick={() => handleStep(key, val, 1)}
                  tabIndex={-1}
                >
                  <Plus size={14} strokeWidth={4} />
                </button>
              </div>
            ) : (
              <strong className={styles.valueDisplay}>{val}</strong>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}