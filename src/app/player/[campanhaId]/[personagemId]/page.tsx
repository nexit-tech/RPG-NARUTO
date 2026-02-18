'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Map, BookOpen } from 'lucide-react';
import SessaoTab from './tabs/SessaoTab';
import FichaTab from './tabs/SessaoTab/components/FichaTab';
import styles from './styles.module.css';

type Tab = 'sessao' | 'ficha';

export default function PersonagemPage({ params }: { params: { campanhaId: string; personagemId: string } }) {
  const [activeTab, setActiveTab] = useState<Tab>('sessao');

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <Link href={`/player/${params.campanhaId}`} className={styles.backLink}>
          <ArrowLeft size={20} /> Personagens
        </Link>
        <div className={styles.tabsBar}>
          <button
            className={`${styles.tab} ${activeTab === 'sessao' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('sessao')}
          >
            <Map size={18} /> SESSÃO
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'ficha' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('ficha')}
          >
            <BookOpen size={18} /> FICHA
          </button>
        </div>
        <div style={{ width: 120 }} />
      </header>

      <div className={styles.content}>
        {activeTab === 'sessao' && <SessaoTab />}
        {activeTab === 'ficha'  && <FichaTab />}
      </div>
    </main>
  );
}