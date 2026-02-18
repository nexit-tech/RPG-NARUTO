import React, { useState, useEffect } from 'react';
import { X, Check, Shield, Sword } from 'lucide-react';
import styles from './styles.module.css';
import { Token } from '../BattleMap';

interface AoEActionModalProps {
  isOpen: boolean;
  targets: Token[];
  shape: string;
  onClose: () => void;
  // Alterado: Agora retorna um objeto com ID e Dano Individual
  onConfirm: (damages: Record<string, number>) => void;
}

export default function AoEActionModal({ isOpen, targets, shape, onClose, onConfirm }: AoEActionModalProps) {
  const [step, setStep] = useState<'select' | 'damage'>('select');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Estado para armazenar danos individuais: { 'id_do_naruto': '10', 'id_do_sasuke': '5' }
  const [individualDamages, setIndividualDamages] = useState<Record<string, string>>({});

  // Reset ao abrir
  useEffect(() => {
    if (isOpen) {
      setStep('select');
      setSelectedIds(targets.map(t => t.id)); // Todos selecionados por padrão
      setIndividualDamages({});
    }
  }, [isOpen, targets]);

  if (!isOpen) return null;

  // Toggle de Seleção (Quem falhou na esquiva)
  const toggleTarget = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(tid => tid !== id) : [...prev, id]
    );
  };

  const handleNextStep = () => {
    if (selectedIds.length === 0) {
      onClose();
      return;
    }
    // Inicializa os danos com vazio ou 0
    const initialDamages: Record<string, string> = {};
    selectedIds.forEach(id => {
      initialDamages[id] = '';
    });
    setIndividualDamages(initialDamages);
    setStep('damage');
  };

  const handleDamageChange = (id: string, value: string) => {
    setIndividualDamages(prev => ({ ...prev, [id]: value }));
  };

  const handleFinalConfirm = () => {
    // Converte string para number e filtra apenas os válidos
    const finalDamages: Record<string, number> = {};
    
    selectedIds.forEach(id => {
      const val = Number(individualDamages[id]);
      if (!isNaN(val) && val > 0) {
        finalDamages[id] = val;
      }
    });

    onConfirm(finalDamages);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        
        <div className={styles.header}>
          <h3><Sword size={18} /> AÇÃO EM ÁREA</h3>
          <button onClick={onClose} className={styles.closeBtn}><X size={18}/></button>
        </div>

        <div className={styles.content}>
          
          {/* ETAPA 1: SELEÇÃO */}
          {step === 'select' && (
            <>
              <p className={styles.desc}>
                O ataque <strong>{shape.replace('aoe_', '').toUpperCase()}</strong> pegou {targets.length} alvos.
                <br/>Selecione quem <strong>ACERTOU</strong> (Falhou na defesa):
              </p>
              
              <div className={styles.targetList}>
                {targets.map(target => {
                  const isSelected = selectedIds.includes(target.id);
                  return (
                    <div 
                      key={target.id} 
                      className={`${styles.targetItem} ${isSelected ? styles.hit : styles.dodge}`}
                      onClick={() => toggleTarget(target.id)}
                    >
                      <div className={styles.avatarWrapper}>
                        <img src={target.img} alt={target.name} />
                        {isSelected ? (
                          <div className={styles.statusIconHit}><Sword size={12}/></div>
                        ) : (
                          <div className={styles.statusIconDodge}><Shield size={12}/></div>
                        )}
                      </div>
                      <span className={styles.targetName}>{target.name}</span>
                      <span className={styles.statusLabel}>{isSelected ? 'ACERTOU' : 'DESVIOU'}</span>
                    </div>
                  );
                })}
              </div>

              <button className={styles.nextBtn} onClick={handleNextStep}>
                DEFINIR DANOS <Check size={16} />
              </button>
            </>
          )}

          {/* ETAPA 2: DANOS INDIVIDUAIS */}
          {step === 'damage' && (
            <>
              <div className={styles.damageSummary}>
                Defina o dano para cada alvo atingido:
              </div>

              <div className={styles.damageList}>
                {targets.filter(t => selectedIds.includes(t.id)).map(target => (
                  <div key={target.id} className={styles.damageRow}>
                    <div className={styles.damageUserInfo}>
                      <img src={target.img} className={styles.miniAvatar} alt="" />
                      <span className={styles.miniName}>{target.name}</span>
                    </div>
                    <input 
                      type="number"
                      placeholder="0"
                      className={styles.miniInput}
                      value={individualDamages[target.id] || ''}
                      onChange={(e) => handleDamageChange(target.id, e.target.value)}
                    />
                  </div>
                ))}
              </div>

              <div className={styles.actions}>
                <button className={styles.backBtn} onClick={() => setStep('select')}>Voltar</button>
                <button className={styles.confirmBtn} onClick={handleFinalConfirm}>
                  APLICAR DANOS
                </button>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}