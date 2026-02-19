'use client';

import React, { useState } from 'react';
import SheetHeader from '@/app/admin-campanha/players/[id]/components/SheetHeader';
import PageOne     from '@/app/admin-campanha/players/[id]/components/PageOne';
import PageTwo     from '@/app/admin-campanha/players/[id]/components/PageTwo';
import PageThree   from '@/app/admin-campanha/players/[id]/components/PageThree';
import { FULL_PLAYER_DATA } from '@/app/admin-campanha/players/[id]/mockData';
import styles from './styles.module.css';

type FichaPage = 1 | 2 | 3;

const PAGES: { id: FichaPage; label: string }[] = [
  { id: 1, label: 'Atributos' },
  { id: 2, label: 'Jutsus'    },
  { id: 3, label: 'História'  },
];

export default function FichaTab() {
  const [currentPage, setCurrentPage] = useState<FichaPage>(1);

  return (
    <div className={styles.fichaContainer}>
      {/* Cabeçalho do personagem — só aceita data e onChange */}
      <SheetHeader data={FULL_PLAYER_DATA} />

      {/* Navegação de páginas — gerenciada aqui, fora do SheetHeader */}
      <div className={styles.pageNav}>
        {PAGES.map(p => (
          <button
            key={p.id}
            className={`${styles.pageBtn} ${currentPage === p.id ? styles.pageBtnActive : ''}`}
            onClick={() => setCurrentPage(p.id)}
          >
            {p.id}. {p.label}
          </button>
        ))}
      </div>

      <div className={styles.pageContent}>
        {currentPage === 1 && <PageOne   data={FULL_PLAYER_DATA} />}
        {currentPage === 2 && <PageTwo   data={FULL_PLAYER_DATA} />}
        {currentPage === 3 && <PageThree data={FULL_PLAYER_DATA} />}
      </div>
    </div>
  );
}