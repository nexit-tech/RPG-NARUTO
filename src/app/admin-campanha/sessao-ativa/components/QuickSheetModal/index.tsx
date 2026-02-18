import React, { useState } from 'react';
import { X, User, Backpack, Scroll, Shield } from 'lucide-react';
import styles from './styles.module.css';
import { FULL_PLAYER_DATA } from '../../../players/[id]/mockData'; // Certifique-se que o caminho está certo
import PageOne from '../../../players/[id]/components/PageOne';
import PageTwo from '../../../players/[id]/components/PageTwo';
import PageThree from '../../../players/[id]/components/PageThree';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  characterName: string;
}

export default function QuickSheetModal({ isOpen, onClose, characterName }: Props) {
  const [tab, setTab] = useState(1);

  if (!isOpen) return null;

  // Em produção, buscar dados reais pelo ID/Nome
  const data = FULL_PLAYER_DATA; 

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.titleInfo}>
            <Shield className={styles.icon} size={20} />
            <h3>FICHA TÁTICA: <span className={styles.charName}>{characterName}</span></h3>
          </div>
          
          <div className={styles.tabs}>
            <button onClick={() => setTab(1)} className={tab === 1 ? styles.active : ''}><User size={14}/> STATUS</button>
            <button onClick={() => setTab(2)} className={tab === 2 ? styles.active : ''}><Backpack size={14}/> ITENS</button>
            <button onClick={() => setTab(3)} className={tab === 3 ? styles.active : ''}><Scroll size={14}/> JUTSUS</button>
          </div>
          
          <button onClick={onClose} className={styles.closeBtn}><X size={22}/></button>
        </div>
        
        <div className={styles.content}>
          {/* Zoom ajustado para caber no modal sem scroll horizontal excessivo */}
          <div style={{ zoom: 0.85 }}>
            {tab === 1 && <PageOne data={data} />}
            {tab === 2 && <PageTwo data={data} />}
            {tab === 3 && <PageThree data={data} />}
          </div>
        </div>
      </div>
    </div>
  );
}