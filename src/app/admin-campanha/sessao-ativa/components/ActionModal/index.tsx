import React, { useState, useEffect, useRef } from 'react';
import { Sword, Heart, Shield, X, Check } from 'lucide-react';
import styles from './styles.module.css';

interface ActionModalProps {
  isOpen: boolean;
  type: 'attack' | 'heal' | null;
  attackerName?: string;
  targetName: string;
  onClose: () => void;
  onConfirm: (value: number, isHit: boolean) => void;
}

export default function ActionModal({ isOpen, type, attackerName, targetName, onClose, onConfirm }: ActionModalProps) {
  const [step, setStep] = useState<'confirm' | 'value'>('confirm');
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Reseta o estado quando abre
  useEffect(() => {
    if (isOpen) {
      setStep(type === 'heal' ? 'value' : 'confirm'); // Se for cura, vai direto pro valor
      setInputValue('');
      // Foca no input se estiver na etapa de valor
      if (type === 'heal') setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, type]);

  useEffect(() => {
    if (step === 'value') setTimeout(() => inputRef.current?.focus(), 100);
  }, [step]);

  if (!isOpen || !type) return null;

  const handleHitConfirm = (hit: boolean) => {
    if (!hit) {
      onConfirm(0, false); // Errou
    } else {
      setStep('value'); // Acertou, pede dano
    }
  };

  const handleValueSubmit = () => {
    const val = Number(inputValue);
    if (!isNaN(val) && val > 0) {
      onConfirm(val, true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleValueSubmit();
    if (e.key === 'Escape') onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3>
            {type === 'attack' ? <><Sword size={18}/> REALIZAR ATAQUE</> : <><Heart size={18}/> JUTSU MÉDICO</>}
          </h3>
          <button onClick={onClose} className={styles.closeBtn}><X size={18}/></button>
        </div>

        <div className={styles.content}>
          {step === 'confirm' && type === 'attack' && (
            <>
              <p className={styles.text}>
                <strong>{attackerName}</strong> está atacando <strong>{targetName}</strong>.
                <br/>O ataque superou a defesa?
              </p>
              <div className={styles.actions}>
                <button className={styles.btnMiss} onClick={() => handleHitConfirm(false)}>
                  <Shield size={16}/> ERROU
                </button>
                <button className={styles.btnHit} onClick={() => handleHitConfirm(true)}>
                  <Sword size={16}/> ACERTOU
                </button>
              </div>
            </>
          )}

          {step === 'value' && (
            <>
              <p className={styles.text}>
                {type === 'attack' 
                  ? `Quanto de DANO ${targetName} sofreu?` 
                  : `Quanto de VIDA recuperar em ${targetName}?`
                }
              </p>
              <div className={styles.inputGroup}>
                <input 
                  ref={inputRef}
                  type="number" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="0"
                  className={styles.numInput}
                />
                <button className={styles.btnConfirm} onClick={handleValueSubmit}>
                  <Check size={20} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}