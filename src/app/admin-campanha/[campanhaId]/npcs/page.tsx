'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, Shield, MapPin, Plus, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import styles from './styles.module.css';
import CreateNpcModal from './components/CreateNpcModal';

// Definimos a interface para o Next.js 15
export default function NpcsPage({ params }: { params: Promise<{ campanhaId: string }> }) {
  const router = useRouter();
  
  // 1. DESEMPACOTANDO PARAMS (Resolve o erro "params is a Promise")
  const resolvedParams = use(params);
  const campanhaId = resolvedParams.campanhaId;

  const [npcs, setNpcs] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (campanhaId) {
      fetchNpcs();
    }
  }, [campanhaId]);

  async function fetchNpcs() {
    setLoading(true);
    const { data, error } = await supabase
      .from('npcs')
      .select('*')
      .eq('campanha_id', campanhaId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar NPCs:', error);
    } else if (data) {
      setNpcs(data);
    }
    setLoading(false);
  }

  const handleCreate = async (name: string) => {
    setCreating(true);
    
    // 2. INSERINDO NO BANCO COM DADOS ZERADOS
    const { data, error } = await supabase
      .from('npcs')
      .insert({
        campanha_id: campanhaId,
        nome: name,
        img: 'https://via.placeholder.com/150?text=Sem+Foto',
        tipo: 'aliado',
        hp: 100, max_hp: 100, cp: 100, max_cp: 100,
        atk: 10, def: 10, esq: 10, cd: 10,
        habilidades: {} // Inicializa a ficha JSONB vazia
      })
      .select('id')
      .single();

    if (error) {
      console.error('Erro ao criar NPC:', error);
      setCreating(false);
      return;
    }

    if (data?.id) {
      setIsModalOpen(false);
      // 3. REDIRECIONAMENTO COM CAMINHO CORRETO
      // Incluímos o campanhaId para que ele caia na pasta dinâmica certa
      router.push(`/admin-campanha/${campanhaId}/npcs/${data.id}`);
    } else {
      setCreating(false);
      console.error("ID não retornado pelo banco.");
    }
  };

  const filteredNpcs = npcs.filter(npc => 
    npc.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <Link href={`/admin-campanha/${campanhaId}`} className={styles.backLink}>
            <ArrowLeft size={20} /> Painel
          </Link>
          <button className={styles.createBtn} onClick={() => setIsModalOpen(true)} disabled={creating}>
            {creating ? <Loader2 size={18} className={styles.spinner} /> : <Plus size={18} />}
            <span>{creating ? 'Invocando...' : 'Novo NPC'}</span>
          </button>
        </div>
        
        <div className={styles.titleArea}>
          <h1 className={styles.pageTitle}>Livro Bingo</h1>
          <p className={styles.subTitle}>Registro de Ninjas e Renegados</p>
        </div>

        <div className={styles.searchBar}>
          <Search className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Buscar ninja..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>
          <Loader2 size={40} className={styles.spinner} />
        </div>
      ) : (
        <div className={styles.grid}>
          {filteredNpcs.length === 0 ? (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: '#666' }}>
              Nenhum registro encontrado.
            </div>
          ) : (
            filteredNpcs.map((npc) => (
              <Link href={`/admin-campanha/${campanhaId}/npcs/${npc.id}`} key={npc.id} className={styles.card}>
                <div className={styles.imageContainer}>
                  <img src={npc.img || 'https://via.placeholder.com/150'} alt={npc.nome} className={styles.image} />
                  <div className={`${styles.statusBadge} ${npc.tipo === 'inimigo' ? styles.enemy : styles.ally}`}>
                    {npc.tipo}
                  </div>
                </div>
                
                <div className={styles.cardContent}>
                  <h3 className={styles.name}>{npc.nome}</h3>
                  <div className={styles.infoRow}>
                    <MapPin size={14} className={styles.icon} />
                    <span>{npc.aldeia || 'Desconhecida'}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <Shield size={14} className={styles.icon} />
                    <span>Rank {npc.rank || 'N/A'}</span>
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

      <CreateNpcModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onCreate={handleCreate} 
      />
    </main>
  );
}