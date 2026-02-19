'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation'; // Adicionando o useParams
import { ArrowLeft, Map, FileText, Scroll } from 'lucide-react';
import MapasSection from './components/MapasSection';
import AnotacoesSection from './components/AnotacoesSection';
import RoteirosSection from './components/RoteirosSection';
import styles from './styles.module.css';

type Tab = 'mapas' | 'anotacoes' | 'roteiros';

export default function SalaEstrategiaPage() {
  const params = useParams();
  const campanhaId = params.campanhaId as string; // Pegando o ID da URL

  const [activeTab, setActiveTab] = useState<Tab>('mapas');

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        {/* Atualizando o link de voltar para ir ao painel da campanha correta */}
        <Link href={`/admin-campanha/${campanhaId}`} className={styles.backLink}>
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
        {/* Passando o campanhaId para os componentes */}
        {activeTab === 'mapas' && <MapasSection campanhaId={campanhaId} />}
        {activeTab === 'anotacoes' && <AnotacoesSection campanhaId={campanhaId} />}
        {activeTab === 'roteiros' && <RoteirosSection campanhaId={campanhaId} />}
      </div>
    </main>
  );
}