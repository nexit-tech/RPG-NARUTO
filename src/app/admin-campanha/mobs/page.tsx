'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Skull, Filter, Plus, Swords } from 'lucide-react';
import styles from './styles.module.css';

// Mock de Mobs
const MOBS = [
  { id: 1, name: 'Zetsu Branco', rank: 'D', type: 'Minion', hp: 40, img: 'https://imgs.search.brave.com/hAIyZtVgluqvO_176cybig8JoSIDDzB1ZBt-gyR6spQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jcml0/aWNhbGhpdHMuY29t/LmJyL3dwLWNvbnRl/bnQvdXBsb2Fkcy8y/MDIwLzEyL1NoaXJv/X1pldHN1LTkxMHg1/MTguanBn' },
  { id: 2, name: 'Lobo Gigante', rank: 'C', type: 'Invocação', hp: 120, img: 'https://i.pinimg.com/736x/c5/44/2c/c5442c5543c74577823521d8ff275990.jpg' },
  { id: 3, name: 'Ninja Renegado (Chunin)', rank: 'C', type: 'Humano', hp: 80, img: 'https://cdn-icons-png.flaticon.com/512/1353/1353866.png' },
  { id: 4, name: 'Manda (Rei Cobra)', rank: 'S', type: 'Boss', hp: 2000, img: 'https://imgs.search.brave.com/MandaSnakeImg/rs:fit:500:0:0/g:ce/aHR0cHM6Ly92aWdu/ZXR0ZS53aWtpYS5u/b2Nvb2tpZS5uZXQv/bmFydXRvL2ltYWdl/cy8yLzJlL01hbmRh/LnBuZy9yZXZpc2lv/bi9sYXRlc3Qvc2Nh/bGUtdG8td2lkdGgt/ZG93bi8zMDA' },
  { id: 5, name: 'Marionete de Areia', rank: 'D', type: 'Constructo', hp: 30, img: 'https://pm1.aminoapps.com/6457/45e7e600863071b56955743849142c672909f193_00.jpg' },
];

export default function MobsPage() {
  const [filterRank, setFilterRank] = useState('ALL');

  const filteredMobs = filterRank === 'ALL' 
    ? MOBS 
    : MOBS.filter(m => m.rank === filterRank);

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <Link href="/admin-campanha" className={styles.backLink}>
            <ArrowLeft size={20} /> Painel
          </Link>
          <button className={styles.createBtn}>
            <Plus size={18} /> Criar Criatura
          </button>
        </div>
        
        <div className={styles.titleArea}>
          <h1 className={styles.pageTitle}>Bestiário</h1>
          <p className={styles.subTitle}>Catálogo de ameaças e invocações</p>
        </div>

        {/* Filtros de Rank */}
        <div className={styles.filterBar}>
          <Filter size={16} className={styles.filterIcon} />
          {['ALL', 'S', 'A', 'B', 'C', 'D'].map(rank => (
            <button 
              key={rank}
              className={`${styles.filterBtn} ${filterRank === rank ? styles.active : ''}`}
              onClick={() => setFilterRank(rank)}
            >
              {rank === 'ALL' ? 'Todos' : `Rank ${rank}`}
            </button>
          ))}
        </div>
      </header>

      <div className={styles.grid}>
        {filteredMobs.map((mob) => (
          <div key={mob.id} className={styles.card}>
            <div className={styles.imageWrapper}>
              <img src={mob.img} alt={mob.name} className={styles.image} />
              <div className={`${styles.rankBadge} ${styles['rank'+mob.rank]}`}>Rank {mob.rank}</div>
            </div>
            
            <div className={styles.content}>
              <h3 className={styles.name}>{mob.name}</h3>
              <div className={styles.meta}>
                <span className={styles.type}>{mob.type}</span>
                <span className={styles.hp}><Skull size={12}/> {mob.hp} PV</span>
              </div>
            </div>

            <div className={styles.actions}>
               <button className={styles.actionBtn}>Editar</button>
               <button className={styles.actionBtn}><Swords size={14}/> Testar</button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}