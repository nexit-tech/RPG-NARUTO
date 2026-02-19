'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Users, Swords, Map, BookOpen, Settings, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import styles from './styles.module.css';

interface Campanha {
  id: string;
  nome: string;
  descricao: string;
  mestre: string;
  rank: string;
  nivel: number;
  jogadores: number;
  status: string;
  banner_url: string;
}

export default function AdminCampanhaPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [campanha, setCampanha] = useState<Campanha | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchCampanha();
  }, [id]);

  async function fetchCampanha() {
    const { data, error } = await supabase
      .from('campanhas')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      router.push('/adminpage');
      return;
    }

    setCampanha(data);
    setLoading(false);
  }

  if (loading) {
    return (
      <div className={styles.loadingScreen}>
        <Loader2 size={40} className={styles.spinner} />
        <span>Carregando campanha...</span>
      </div>
    );
  }

  if (!campanha) return null;

  const menuItems = [
    { icon: <Users size={28} />, label: 'Jogadores', sub: 'Fichas e personagens', href: `/admin-campanha/${id}/players` },
    { icon: <Swords size={28} />, label: 'Sessão Ativa', sub: 'Mapa e combate', href: `/admin-campanha/${id}/sessao-ativa` },
    { icon: <Map size={28} />, label: 'Estratégia', sub: 'Mapas e anotações', href: `/admin-campanha/${id}/estrategia` },
    { icon: <BookOpen size={28} />, label: 'NPCs', sub: 'Personagens do mestre', href: `/admin-campanha/${id}/npcs` },
    { icon: <Settings size={28} />, label: 'Mobs', sub: 'Inimigos e criaturas', href: `/admin-campanha/${id}/mobs` },
  ];

  return (
    <main className={styles.container}>
      {/* BANNER HERO */}
      <div className={styles.hero}>
        {campanha.banner_url && (
          <img src={campanha.banner_url} alt={campanha.nome} className={styles.heroBg} />
        )}
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <Link href="/adminpage" className={styles.backLink}>
            <ArrowLeft size={18} /> Missões
          </Link>
          <div className={styles.badges}>
            <span className={styles.badge}>{campanha.rank}</span>
            <span className={styles.badge}>Nível {campanha.nivel}</span>
            <span className={`${styles.badge} ${styles.badgeStatus}`}>{campanha.status}</span>
          </div>
          <h1 className={styles.heroTitle}>{campanha.nome}</h1>
          {campanha.descricao && (
            <p className={styles.heroDesc}>{campanha.descricao}</p>
          )}
          <div className={styles.heroMeta}>
            <span><Users size={14} /> {campanha.jogadores} Jogadores</span>
            {campanha.mestre && <span>Mestre: {campanha.mestre}</span>}
          </div>
        </div>
      </div>

      {/* MENU DE SEÇÕES */}
      <section className={styles.menuGrid}>
        {menuItems.map((item) => (
          <Link key={item.label} href={item.href} className={styles.menuCard}>
            <div className={styles.menuIcon}>{item.icon}</div>
            <div className={styles.menuText}>
              <span className={styles.menuLabel}>{item.label}</span>
              <span className={styles.menuSub}>{item.sub}</span>
            </div>
            <ArrowLeft size={16} className={styles.menuArrow} />
          </Link>
        ))}
      </section>
    </main>
  );
}