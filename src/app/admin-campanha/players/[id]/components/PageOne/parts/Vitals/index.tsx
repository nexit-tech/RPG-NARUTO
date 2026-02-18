import React, { useState } from 'react';
import { Heart, Flame, Minus, Plus, Check } from 'lucide-react';
import styles from './styles.module.css';

export default function Vitals({ data, isEditing, onChange }: any) {
  const { vitCurrent, vitTotal, chaCurrent, chaTotal } = data;

  // Atualiza o TOTAL (Max HP/CP) diretamente
  const handleTotalChange = (field: string, val: string) => {
    onChange({ ...data, [field]: Number(val) });
  };

  // Componente interno para gerenciar a matemática (Dano/Cura)
  const StatCalculator = ({ current, field, color }: any) => {
    const [operation, setOperation] = useState<'sub' | 'add'>('sub'); // Padrão: Dano/Gasto (-)
    const [amount, setAmount] = useState('');

    const handleConfirm = () => {
      const val = Number(amount);
      if (!val) return;

      const newCurrent = operation === 'add' ? current + val : current - val;
      
      // Atualiza o pai e limpa o input
      onChange({ ...data, [field]: newCurrent });
      setAmount('');
    };

    return (
      <div className={styles.calcContainer}>
        {/* MOSTRA O VALOR ATUAL AQUI */}
        <span className={styles.currentDisplay}>{current}</span>

        <div className={styles.calcWrapper}>
          <div className={styles.calcControls}>
            {/* Botão Menos (Dano/Gasto) */}
            <button 
              className={`${styles.opBtn} ${operation === 'sub' ? styles.activeSub : ''}`}
              onClick={() => setOperation('sub')}
              title="Causar Dano / Gastar"
            >
              <Minus size={14} strokeWidth={4} />
            </button>

            {/* Botão Mais (Cura/Recuperar) */}
            <button 
              className={`${styles.opBtn} ${operation === 'add' ? styles.activeAdd : ''}`}
              onClick={() => setOperation('add')}
              title="Curar / Recuperar"
            >
              <Plus size={14} strokeWidth={4} />
            </button>
          </div>

          <div className={styles.inputGroup}>
            <input 
              type="number" 
              placeholder="Qtd"
              className={styles.calcInput}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
            />
            <button className={styles.confirmBtn} onClick={handleConfirm} style={{color: color}}>
              <Check size={16} strokeWidth={4} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const hpPercent = Math.min((vitCurrent / vitTotal) * 100, 100);
  const cpPercent = Math.min((chaCurrent / chaTotal) * 100, 100);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span>STATUS VITAIS</span>
      </div>
      
      <div className={styles.container}>
        {/* Bloco HP */}
        <div className={styles.block}>
          <div className={styles.labelRow}>
            <span className={styles.labelHp}><Heart size={12}/> VITALIDADE</span>
            
            {isEditing ? (
               <div className={styles.editArea}>
                 <StatCalculator current={vitCurrent} field="vitCurrent" color="#ff4444" />
                 {/* Input do Total (Max HP) fica discreto ao lado */}
                 <div className={styles.maxInputWrapper}>
                    <span className={styles.slash}>/</span>
                    <input type="number" value={vitTotal} onChange={e => handleTotalChange('vitTotal', e.target.value)} className={styles.inputMax} />
                 </div>
               </div>
            ) : (
              <span className={styles.value}>{vitCurrent} <small>/ {vitTotal}</small></span>
            )}
          </div>
          <div className={styles.track}>
            <div className={styles.fillHp} style={{width: `${hpPercent}%`}}></div>
          </div>
        </div>

        <div className={styles.divider}></div>

        {/* Bloco Chakra */}
        <div className={styles.block}>
          <div className={styles.labelRow}>
            <span className={styles.labelCp}><Flame size={12}/> CHAKRA</span>
            
            {isEditing ? (
               <div className={styles.editArea}>
                 <StatCalculator current={chaCurrent} field="chaCurrent" color="#00ccff" />
                 <div className={styles.maxInputWrapper}>
                    <span className={styles.slash}>/</span>
                    <input type="number" value={chaTotal} onChange={e => handleTotalChange('chaTotal', e.target.value)} className={styles.inputMax} />
                 </div>
               </div>
            ) : (
              <span className={styles.value}>{chaCurrent} <small>/ {chaTotal}</small></span>
            )}
          </div>
          <div className={styles.track}>
            <div className={styles.fillCp} style={{width: `${cpPercent}%`}}></div>
          </div>
        </div>
      </div>
    </div>
  );
}