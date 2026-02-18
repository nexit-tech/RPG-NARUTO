'use client';

import React, { useState } from 'react';
import SheetHeader from '@/app/admin-campanha/players/[id]/components/SheetHeader';
import PageOne     from '@/app/admin-campanha/players/[id]/components/PageOne';
import PageTwo     from '@/app/admin-campanha/players/[id]/components/PageTwo';
import PageThree   from '@/app/admin-campanha/players/[id]/components/PageThree';
import { FULL_PLAYER_DATA } from '@/app/admin-campanha/players/[id]/mockData';
import styles from './styles.module.css';

type FichaPage = 1 | 2 | 3;

export default function FichaTab() {
  const [currentPage, setCurrentPage] = useState<FichaPage>(1);

  return (
    <div className={styles.fichaContainer}>
      <SheetHeader
        currentPage={currentPage}
        onPageChange={(p) => setCurrentPage(p as FichaPage)}
        data={FULL_PLAYER_DATA}
      />

      <div className={styles.pageContent}>
        {currentPage === 1 && <PageOne data={FULL_PLAYER_DATA} />}
        {currentPage === 2 && <PageTwo data={FULL_PLAYER_DATA} />}
        {currentPage === 3 && <PageThree data={FULL_PLAYER_DATA} />}
      </div>
    </div>
  );
}