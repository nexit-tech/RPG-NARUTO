'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, Skull, Swords, Plus, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import styles from './styles.module.css';
import CreateMobModal from './components/CreateMobModal';

export default function MobsPage({ params }: { params: Promise<{ campanhaId: string }> }) {
  const router = useRouter();
  
  const resolvedParams = use(params);
  const campanhaId = resolvedParams.campanhaId;

  const [mobs, setMobs] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (campanhaId) {
      fetchMobs();
    }
  }, [campanhaId]);

  async function fetchMobs() {
    setLoading(true);
    const { data, error } = await supabase
      .from('mobs')
      .select('*')
      .eq('campanha_id', campanhaId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar Mobs:', error);
    } else if (data) {
      setMobs(data);
    }
    setLoading(false);
  }

  const handleCreate = async (name: string): Promise<void> => {
    const { data, error } = await supabase
      .from('mobs')
      .insert({
        campanha_id: campanhaId,
        nome: name,
        img: 'https://via.placeholder.com/150?text=Sem+Foto',
        tipo: 'comum',
        hp_base: 50, cp_base: 30,
        atk: 8, def: 6, esq: 8, cd: 6,
        habilidades: {}
      })
      .select('id')
      .single();

    if (error) {
      console.error('Erro ao criar Mob:', error);
      throw error;
    }

    if (data?.id) {
      setIsModalOpen(false);
      await new Promise(resolve => setTimeout(resolve, 50));
      router.push(`/admin-campanha/${campanhaId}/mobs/${data.id}`);
    } else {
      throw new Error('ID não retornado pelo banco.');
    }
  };

  const filteredMobs = mobs.filter(mob =>
    mob.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (mob.tipo && mob.tipo.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <Link href={`/admin-campanha/${campanhaId}`} className={styles.backLink}>
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
            placeholder="Buscar por nome ou tipo..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>
          <Loader2 size={40} className={styles.spinner} />
        </div>
      ) : (
        <div className={styles.grid}>
          {filteredMobs.length === 0 ? (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: '#666' }}>
              Nenhum monstro encontrado.
            </div>
          ) : (
            filteredMobs.map((mob) => (
              <Link href={`/admin-campanha/${campanhaId}/mobs/${mob.id}`} key={mob.id} className={styles.card}>
                <div className={styles.imageContainer}>
                  <img src={mob.img || 'https://via.placeholder.com/150'} alt={mob.nome} className={styles.image} />
                  <div className={`${styles.rankBadge} ${styles['rank' + (mob.habilidades?.info?.shinobiLevel || 'D')]}`}>
                    Nível {mob.nivel || 1}
                  </div>
                </div>

                <div className={styles.cardContent}>
                  <h3 className={styles.name}>{mob.nome}</h3>
                  <div className={styles.infoRow}>
                    <Swords size={14} className={styles.icon} />
                    <span style={{ textTransform: 'capitalize' }}>{mob.tipo || 'comum'}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <Skull size={14} className={styles.icon} />
                    <span>{mob.hp_base || 50} PV</span>
                  </div>
                </div>

                <div className={styles.cardFooter}>
                  Editar Ficha
                </div>
              </Link>
            ))
          )}
        </div>
      )}

      <CreateMobModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreate}
      />
    </main>
  );
}