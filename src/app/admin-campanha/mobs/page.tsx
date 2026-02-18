'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, Skull, Swords, Plus } from 'lucide-react';
import styles from './styles.module.css';
import CreateMobModal from './components/CreateMobModal';

// Mock Inicial
const MOBS = [
  { id: 1, name: 'Zetsu Branco', type: 'Minion', rank: 'D', hp: 40, img: 'https://imgs.search.brave.com/hAIyZtVgluqvO_176cybig8JoSIDDzB1ZBt-gyR6spQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jcml0/aWNhbGhpdHMuY29t/LmJyL3dwLWNvbnRl/bnQvdXBsb2Fkcy8y/MDIwLzEyL1NoaXJv/X1pldHN1LTkxMHg1/MTguanBn' },
  { id: 2, name: 'Manda (Rei Cobra)', type: 'Boss', rank: 'S', hp: 2000, img: 'https://i.pinimg.com/736x/c5/44/2c/c5442c5543c74577823521d8ff275990.jpg' },
];

export default function MobsPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = MOBS.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.type.toLowerCase().includes(search.toLowerCase()) ||
    m.rank.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = (name: string) => {
    const newId = Math.floor(Math.random() * 10000);
    console.log(`Criando Mob: ${name} com ID ${newId}`);
    router.push(`/admin-campanha/mobs/${newId}?name=${encodeURIComponent(name)}`);
  };

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <Link href="/admin-campanha" className={styles.backLink}>
            <ArrowLeft size={20} /> Painel
          </Link>
          <button className={styles.createBtn} onClick={() => setIsModalOpen(true)}>
            <Plus size={18} /> Novo Mob
          </button>
        </div>

        <div className={styles.titleArea}>
          <h1 className={styles.pageTitle}>Bestiário</h1>
          <p className={styles.subTitle}>Catálogo de Ameaças e Invocações</p>
        </div>

        <div className={styles.searchBar}>
          <Search className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar por nome, tipo ou rank..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </header>

      <div className={styles.grid}>
        {filtered.map((mob) => (
          <Link href={`/admin-campanha/mobs/${mob.id}`} key={mob.id} className={styles.card}>
            <div className={styles.imageContainer}>
              <img src={mob.img} alt={mob.name} className={styles.image} />
              <div className={`${styles.rankBadge} ${styles['rank' + mob.rank]}`}>
                Rank {mob.rank}
              </div>
            </div>

            <div className={styles.cardContent}>
              <h3 className={styles.name}>{mob.name}</h3>
              <div className={styles.infoRow}>
                <Swords size={14} className={styles.icon} />
                <span>{mob.type}</span>
              </div>
              <div className={styles.infoRow}>
                <Skull size={14} className={styles.icon} />
                <span>{mob.hp} PV</span>
              </div>
            </div>

            <div className={styles.cardFooter}>
              Ver Ficha
            </div>
          </Link>
        ))}
      </div>

      <CreateMobModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreate}
      />
    </main>
  );
}