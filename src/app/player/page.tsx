'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Scroll, Users, ChevronRight, Search, Shield, Loader2 } from 'lucide-react';
import styles from './styles.module.css';
import { supabase } from '@/lib/supabase';

interface Campanha {
  id: string;
  nome: string;
  descricao: string;
  mestre: string;
  jogadores: number;
  status: 'ativa' | 'pausada' | 'encerrada';
  banner: string;
}

const STATUS_LABEL = { ativa: 'Em andamento', pausada: 'Pausada', encerrada: 'Encerrada' };
const STATUS_CLASS = { ativa: styles.statusAtiva, pausada: styles.statusPausada, encerrada: styles.statusEncerrada };

export default function PlayerPage() {
  const [search, setSearch] = useState('');
  const [campanhas, setCampanhas] = useState<Campanha[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCampanhas();
  }, []);

  async function fetchCampanhas() {
    setLoading(true);

    const { data, error } = await supabase
      .from('campanhas')
      .select('id, nome, descricao, mestre, jogadores, status, banner_url')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar campanhas:', error);
    } else {
      const mapped: Campanha[] = (data ?? []).map((row) => ({
        id: row.id,
        nome: row.nome,
        descricao: row.descricao ?? '',
        mestre: row.mestre ?? 'Sensei',
        jogadores: row.jogadores ?? 0,
        status: row.status ?? 'ativa',
        banner: row.banner_url ?? 'https://images7.alphacoders.com/611/611138.png',
      }));
      setCampanhas(mapped);
    }

    setLoading(false);
  }

  const filtered = campanhas.filter((c) =>
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
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* GRID */}
      <div className={styles.grid}>
        {loading ? (
          <div className={styles.emptyState}>
            <Loader2 size={32} style={{ animation: 'spin 0.8s linear infinite', color: '#ff6600' }} />
            <p>Carregando campanhas...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className={styles.emptyState}>
            <Scroll size={40} />
            <p>Nenhuma campanha encontrada</p>
          </div>
        ) : (
          filtered.map((campanha) => (
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
          ))
        )}
      </div>

      {/* Keyframe pra spinner inline */}
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </main>
  );
}