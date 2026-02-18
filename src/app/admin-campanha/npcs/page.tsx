'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, Shield, MapPin, Plus } from 'lucide-react';
import styles from './styles.module.css';
import CreateNpcModal from './components/CreateNpcModal';

// Mock Inicial
const NPCS = [
  { id: 101, name: 'Kakashi Hatake', village: 'Konoha', rank: 'Hokage', status: 'Aliado', img: 'https://imgs.search.brave.com/EGIZ5oD2mBtZXBrZ10deMReBz4i7m7d4UFKtcrv98Oo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMud2lraWEubm9j/b29raWUubmV0L3Bf/Xy9pbWFnZXMvNi82/ZS9LYWthc2hpX2lu/Zm9ib3hfaW1hZ2Uu/cG5nL3JldmlzaW9u/L2xhdGVzdC9zY2Fs/ZS10by13aWR0aC1k/b3duLzI2OD9jYj0y/MDE4MDQxNzIzNTEz/NCZwYXRoLXByZWZp/eD1wcm90YWdvbmlz/dA' },
];

export default function NpcsPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreate = (name: string) => {
    // Aqui você salvaria no banco real e pegaria o ID
    // Simulando:
    const newId = Math.floor(Math.random() * 10000);
    console.log(`Criando NPC: ${name} com ID ${newId}`);
    
    // Redireciona para a ficha editável
    router.push(`/admin-campanha/npcs/${newId}?name=${encodeURIComponent(name)}`);
  };

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <Link href="/admin-campanha" className={styles.backLink}>
            <ArrowLeft size={20} /> Painel
          </Link>
          <button className={styles.createBtn} onClick={() => setIsModalOpen(true)}>
            <Plus size={18} /> Novo NPC
          </button>
        </div>
        
        <div className={styles.titleArea}>
          <h1 className={styles.pageTitle}>Livro Bingo</h1>
          <p className={styles.subTitle}>Registro de Ninjas, Aliados e Renegados</p>
        </div>

        <div className={styles.searchBar}>
          <Search className={styles.searchIcon} />
          <input type="text" placeholder="Buscar por nome, vila ou rank..." />
        </div>
      </header>

      <div className={styles.grid}>
        {NPCS.map((npc) => (
          <Link href={`/admin-campanha/npcs/${npc.id}`} key={npc.id} className={styles.card}>
            <div className={styles.imageContainer}>
              <img src={npc.img} alt={npc.name} className={styles.image} />
              <div className={`${styles.statusBadge} ${npc.status === 'Inimigo' ? styles.enemy : styles.ally}`}>
                {npc.status}
              </div>
            </div>
            
            <div className={styles.cardContent}>
              <h3 className={styles.name}>{npc.name}</h3>
              <div className={styles.infoRow}>
                <MapPin size={14} className={styles.icon} />
                <span>{npc.village}</span>
              </div>
              <div className={styles.infoRow}>
                <Shield size={14} className={styles.icon} />
                <span>{npc.rank}</span>
              </div>
            </div>
            
            <div className={styles.cardFooter}>
               Editar Ficha
            </div>
          </Link>
        ))}
      </div>

      <CreateNpcModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onCreate={handleCreate} 
      />
    </main>
  );
}