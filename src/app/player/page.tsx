'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Scroll, Users, ChevronRight, Search, Shield } from 'lucide-react';
import styles from './styles.module.css';

interface Campanha {
  id: number;
  nome: string;
  descricao: string;
  mestre: string;
  jogadores: number;
  status: 'ativa' | 'pausada' | 'encerrada';
  banner: string;
}

const CAMPANHAS: Campanha[] = [
  {
    id: 1,
    nome: 'A Sombra de Akatsuki',
    descricao: 'Uma ameaça cresce nas sombras. Os ninjas devem se unir para enfrentar o clã mais perigoso do mundo.',
    mestre: 'Sensei Kakashi',
    jogadores: 4,
    status: 'ativa',
    banner: 'https://images7.alphacoders.com/611/611138.png',
  },
  {
    id: 2,
    nome: 'O Torneio dos Kage',
    descricao: 'Uma competição entre aldeias. Apenas os mais fortes representarão Konoha nos campos de batalha.',
    mestre: 'Sensei Yamato',
    jogadores: 3,
    status: 'ativa',
    banner: 'https://i.pinimg.com/originals/99/3a/05/993a059c03db26993952dc67b931920d.jpg',
  },
  {
    id: 3,
    nome: 'Lendas do Passado',
    descricao: 'Uma missão no tempo. Os jogadores revivem os acontecimentos da Grande Guerra Ninja.',
    mestre: 'Sensei Jiraiya',
    jogadores: 5,
    status: 'pausada',
    banner: 'https://images7.alphacoders.com/611/611138.png',
  },
];

const STATUS_LABEL = { ativa: 'Em andamento', pausada: 'Pausada', encerrada: 'Encerrada' };
const STATUS_CLASS = { ativa: styles.statusAtiva, pausada: styles.statusPausada, encerrada: styles.statusEncerrada };

export default function PlayerPage() {
  const [search, setSearch] = useState('');

  const filtered = CAMPANHAS.filter(c =>
    c.nome.toLowerCase().includes(search.toLowerCase()) ||
    c.mestre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className={styles.container}>
      {/* HEADER */}
      <header className={styles.header}>
        <div className={styles.logo}>
          <Shield size={28} className={styles.logoIcon} />
          <div>
            <h1 className={styles.logoTitle}>Portal do Ninja</h1>
            <p className={styles.logoSub}>Escolha sua campanha</p>
          </div>
        </div>
      </header>

      {/* SEARCH */}
      <div className={styles.searchBar}>
        <Search size={18} className={styles.searchIcon} />
        <input
          className={styles.searchInput}
          placeholder="Buscar campanha ou mestre..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* GRID DE CAMPANHAS */}
      <div className={styles.grid}>
        {filtered.map(campanha => (
          <Link
            key={campanha.id}
            href={campanha.status !== 'encerrada' ? `/player/${campanha.id}` : '#'}
            className={`${styles.card} ${campanha.status === 'encerrada' ? styles.cardDisabled : ''}`}
          >
            {/* BANNER */}
            <div className={styles.banner}>
              <img src={campanha.banner} alt={campanha.nome} />
              <div className={styles.bannerOverlay} />
              <span className={`${styles.statusBadge} ${STATUS_CLASS[campanha.status]}`}>
                {STATUS_LABEL[campanha.status]}
              </span>
            </div>

            {/* INFO */}
            <div className={styles.cardBody}>
              <h2 className={styles.cardTitle}>{campanha.nome}</h2>
              <p className={styles.cardDesc}>{campanha.descricao}</p>

              <div className={styles.cardMeta}>
                <span className={styles.metaItem}>
                  <Scroll size={14} /> {campanha.mestre}
                </span>
                <span className={styles.metaItem}>
                  <Users size={14} /> {campanha.jogadores} jogadores
                </span>
              </div>
            </div>

            {/* ENTER */}
            {campanha.status !== 'encerrada' && (
              <div className={styles.cardEnter}>
                Entrar na campanha <ChevronRight size={16} />
              </div>
            )}
          </Link>
        ))}

        {filtered.length === 0 && (
          <div className={styles.emptyState}>
            <Scroll size={40} />
            <p>Nenhuma campanha encontrada</p>
          </div>
        )}
      </div>
    </main>
  );
}