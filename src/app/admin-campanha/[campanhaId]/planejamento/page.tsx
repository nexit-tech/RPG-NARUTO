'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Map, FileText, Scroll } from 'lucide-react';
import MapasSection from './components/MapasSection';
import AnotacoesSection from './components/AnotacoesSection';
import RoteirosSection from './components/RoteirosSection';
import styles from './styles.module.css';

type Tab = 'mapas' | 'anotacoes' | 'roteiros';

export default function SalaEstrategiaPage() {
  const [activeTab, setActiveTab] = useState<Tab>('mapas');

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <Link href="/admin-campanha" className={styles.backLink}>
          <ArrowLeft size={20} /> Painel
        </Link>
        <div className={styles.titleArea}>
          <h1 className={styles.pageTitle}>Sala de Estratégia</h1>
          <p className={styles.subTitle}>Mapas, anotações e roteiros da campanha</p>
        </div>
        <div style={{ width: 120 }} />
      </header>

      <div className={styles.tabsBar}>
        <button
          className={`${styles.tab} ${activeTab === 'mapas' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('mapas')}
        >
          <Map size={18} /> MAPAS
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'anotacoes' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('anotacoes')}
        >
          <FileText size={18} /> ANOTAÇÕES
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'roteiros' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('roteiros')}
        >
          <Scroll size={18} /> ROTEIROS
        </button>
      </div>

      <div className={styles.content}>
        {activeTab === 'mapas' && <MapasSection />}
        {activeTab === 'anotacoes' && <AnotacoesSection />}
        {activeTab === 'roteiros' && <RoteirosSection />}
      </div>
    </main>
  );
}