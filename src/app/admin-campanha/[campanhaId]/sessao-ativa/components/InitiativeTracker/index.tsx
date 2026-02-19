import React, { useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import styles from './styles.module.css';
import RollReference from './RollReference';

interface Props {
  order: any[];
  currentIndex: number;
  onNext: () => void;
  onPrev: () => void;
  onOpenSheet: () => void;
}

export default function InitiativeTracker({ order, currentIndex, onNext, onPrev, onOpenSheet }: Props) {
  const activeChar = order[currentIndex];
  
  // Auto-scroll para manter o ativo visível
  const activeRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [currentIndex]);

  return (
    <div className={styles.wrapper}>
      
      {/* 1. COLINHA ESQUERDA (Tabela 2D8) */}
      <RollReference />

      {/* 2. TRACKER CENTRAL */}
      <div className={styles.trackContainer}>
        <button onClick={onPrev} className={styles.navBtn} title="Voltar Turno">
          <ChevronLeft size={20}/>
        </button>
        
        <div className={styles.track}>
          {order.map((char, idx) => {
            const isActive = idx === currentIndex;
            return (
              <div 
                key={idx} 
                ref={isActive ? activeRef : null}
                className={`${styles.token} ${isActive ? styles.active : ''}`}
              >
                <div className={styles.imgWrapper}>
                  <img src={char.img} alt={char.name} />
                  {isActive && <div className={styles.turnLabel}>TURNO</div>}
                </div>
                <span className={styles.name}>{char.name}</span>
              </div>
            );
          })}
        </div>

        <button onClick={onNext} className={`${styles.navBtn} ${styles.nextBtn}`} title="Próximo Turno">
          PRÓXIMO <ChevronRight size={16} style={{marginLeft:4}}/>
        </button>
      </div>

      {/* 3. COLINHA DIREITA (Botão Ficha) */}
      <div className={styles.sheetContainer}>
        <button className={styles.sheetBtn} onClick={onOpenSheet}>
          <div className={styles.sheetContent}>
            <div className={styles.sheetIcon}><FileText size={22}/></div>
            <div className={styles.sheetText}>
              <span className={styles.sheetLabel}>FICHA RÁPIDA</span>
              <span className={styles.sheetName}>{activeChar?.name || 'Selecione'}</span>
            </div>
          </div>
          <ChevronRight size={16} className={styles.sheetArrow}/>
        </button>
      </div>

    </div>
  );
}