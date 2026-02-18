import React from 'react';
import { Edit2, Trash2, Users, Map } from 'lucide-react';
import styles from './styles.module.css';

// Interface para tipar nossos dados (Clean Code)
export interface Campaign {
  id: number;
  name: string;
  level: string;
  players: number;
  imageUrl?: string; // Novo campo opcional
}

interface CampaignCardProps {
  data: Campaign;
  onEdit: (e: React.MouseEvent, camp: Campaign) => void;
  onDelete: (e: React.MouseEvent, camp: Campaign) => void;
  onClick: () => void;
}

export default function CampaignCard({ data, onEdit, onDelete, onClick }: CampaignCardProps) {
  return (
    <div className={styles.card} onClick={onClick}>
      {/* 1. Área da Imagem (Esquerda) */}
      <div className={styles.imageWrapper}>
        <img 
          src={data.imageUrl || "https://via.placeholder.com/300x200?text=Sem+Imagem"} 
          alt={data.name} 
          className={styles.image}
        />
        <div className={styles.levelBadge}>{data.level}</div>
      </div>

      {/* 2. Conteúdo (Direita) */}
      <div className={styles.content}>
        <h3 className={styles.title}>{data.name}</h3>
        
        <div className={styles.metaData}>
          <div className={styles.tag}>
            <Users size={14} />
            <span>{data.players} Jogadores</span>
          </div>
          <div className={styles.tag}>
            <Map size={14} />
            <span>Em Andamento</span>
          </div>
        </div>

        {/* 3. Ações (Botões) */}
        <div className={styles.actions}>
           <button 
             className={styles.iconBtn} 
             title="Editar" 
             onClick={(e) => onEdit(e, data)}
           >
             <Edit2 size={16} />
           </button>
           <button 
             className={`${styles.iconBtn} ${styles.deleteBtn}`} 
             title="Excluir" 
             onClick={(e) => onDelete(e, data)}
           >
             <Trash2 size={16} />
           </button>
        </div>
      </div>
    </div>
  );
}