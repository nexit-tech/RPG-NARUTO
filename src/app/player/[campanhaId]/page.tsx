'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, User, ChevronRight, Swords } from 'lucide-react';
import styles from './styles.module.css';

interface Personagem {
  id: number;
  nome: string;
  aldeia: string;
  rank: string;
  avatar: string;
}

// Mock — futuramente virá do banco
const PERSONAGENS: Personagem[] = [
  { id: 1, nome: 'Naruto Uzumaki',  aldeia: 'Konoha',   rank: 'Genin',    avatar: 'https://i.pinimg.com/originals/d2/b3/b4/d2b3b47c30e4fba17e6f2d35af651a35.jpg' },
  { id: 2, nome: 'Sasuke Uchiha',   aldeia: 'Konoha',   rank: 'Genin',    avatar: 'https://i.pinimg.com/736x/8e/4b/c8/8e4bc8f5b4cf1e22e7f5c7a40a8da8ef.jpg' },
  { id: 3, nome: 'Sakura Haruno',   aldeia: 'Konoha',   rank: 'Genin',    avatar: 'https://i.pinimg.com/736x/fa/98/1b/fa981b6e0e4e2b0f50a46b12b26dfc44.jpg' },
  { id: 4, nome: 'Rock Lee',        aldeia: 'Konoha',   rank: 'Genin',    avatar: 'https://i.pinimg.com/736x/5e/bb/b8/5ebbb85fc3a4b7de72d6ee22c8c1b32b.jpg' },
];

const RANK_COLORS: Record<string, string> = {
  Genin: '#44ff88', Chunin: '#ffcc00', Jonin: '#00ccff',
  Kage: '#ff6600', Anbu: '#aa44ff',
};

export default function CampanhaPersonagensPage({ params }: { params: { campanhaId: string } }) {
  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <Link href="/player" className={styles.backLink}>
          <ArrowLeft size={20} /> Campanhas
        </Link>
        <div className={styles.titleArea}>
          <h1 className={styles.pageTitle}>Escolha seu Personagem</h1>
          <p className={styles.subTitle}>Selecione o ninja que você irá interpretar</p>
        </div>
        <div style={{ width: 120 }} />
      </header>

      <div className={styles.grid}>
        {PERSONAGENS.map(p => {
          const rankColor = RANK_COLORS[p.rank] || '#888';
          return (
            <Link key={p.id} href={`/player/${params.campanhaId}/${p.id}`} className={styles.card}>
              {/* AVATAR */}
              <div className={styles.avatarWrap}>
                <img src={p.avatar} alt={p.nome} className={styles.avatar} />
                <div className={styles.avatarGlow} style={{ boxShadow: `0 0 30px ${rankColor}33` }} />
              </div>

              {/* INFO */}
              <div className={styles.cardInfo}>
                <h2 className={styles.cardName}>{p.nome}</h2>
                <div className={styles.cardMeta}>
                  <span className={styles.aldeia}><Swords size={12} /> {p.aldeia}</span>
                  <span className={styles.rank} style={{ color: rankColor, borderColor: rankColor }}>
                    {p.rank}
                  </span>
                </div>
              </div>

              <div className={styles.cardEnter}>
                <ChevronRight size={20} />
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}