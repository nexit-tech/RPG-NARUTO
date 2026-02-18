'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, User, Backpack, Scroll } from 'lucide-react';
import { FULL_PLAYER_DATA } from '../../players/[id]/mockData';
import SheetHeader from '../../players/[id]/components/SheetHeader';
import PageOne from '../../players/[id]/components/PageOne';
import PageTwo from '../../players/[id]/components/PageTwo';
import PageThree from '../../players/[id]/components/PageThree';
import styles from './styles.module.css';

export default function MobSheetPage() {
  const [page, setPage] = useState(1);

  return (
    <main className={styles.container}>
      {/* Barra Superior */}
      <nav className={styles.topNav}>
        <Link href="/admin-campanha/mobs" className={styles.backLink}>
          <ArrowLeft size={18} /> Voltar para Bestiário
        </Link>
        <span className={styles.modeLabel}>MODO MESTRE — MOB</span>
      </nav>

      {/* Cabeçalho do Personagem */}
      <SheetHeader data={FULL_PLAYER_DATA} />

      {/* NAVEGAÇÃO DE ABAS */}
      <div className={styles.tabsContainer}>
        <div className={styles.tabsWrapper}>
          <button
            onClick={() => setPage(1)}
            className={`${styles.tab} ${page === 1 ? styles.active : ''}`}
          >
            <User size={18} />
            <span>DADOS GERAIS</span>
          </button>

          <button
            onClick={() => setPage(2)}
            className={`${styles.tab} ${page === 2 ? styles.active : ''}`}
          >
            <Backpack size={18} />
            <span>EQUIP & PODERES</span>
          </button>

          <button
            onClick={() => setPage(3)}
            className={`${styles.tab} ${page === 3 ? styles.active : ''}`}
          >
            <Scroll size={18} />
            <span>GRIMÓRIO (JUTSUS)</span>
          </button>
        </div>
      </div>

      {/* Área de Conteúdo */}
      <div className={styles.contentArea}>
        {page === 1 && <PageOne data={FULL_PLAYER_DATA} />}
        {page === 2 && <PageTwo data={FULL_PLAYER_DATA} />}
        {page === 3 && <PageThree data={FULL_PLAYER_DATA} />}
      </div>
    </main>
  );
}