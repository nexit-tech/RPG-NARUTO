import React from 'react';
import Link from 'next/link';
import styles from './styles.module.css';

export default function CreateCampaignBtn() {
  return (
    <Link href="/admin-campanha" className={styles.scrollButton}>
      <div className={styles.icon}>📜</div>
      <span className={styles.text}>Criar Nova Campanha</span>
      <div className={styles.subtext}>Comece uma nova lenda ninja</div>
    </Link>
  );
}