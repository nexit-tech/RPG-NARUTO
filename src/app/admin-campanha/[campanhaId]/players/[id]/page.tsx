'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, User, Backpack, Scroll, Loader2 } from 'lucide-react'; 
import SheetHeader from './components/SheetHeader';
import PageOne from './components/PageOne';
import PageTwo from './components/PageTwo';
import PageThree from './components/PageThree';
import styles from './styles.module.css';
import { supabase } from '@/lib/supabase';

export default function PlayerSheetPage() {
  const params = useParams();
  const campanhaId = params.campanhaId as string;
  const id = params.id as string;

  const [page, setPage] = useState(1);
  const [playerData, setPlayerData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    async function fetchPlayer() {
      if (!id) return;
      try {
        // Puxando 100% do banco de dados (tabela personagens)
        const { data, error } = await supabase
          .from('personagens')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        if (data) {
          // Mapeando os dados do banco. 
          // Se as colunas JSON não existirem ainda, joga o valor default pra não quebrar a UI.
          const formattedData = {
            info: data.info || {
              name: data.nome || 'Desconhecido',
              clan: 'Desconhecido',
              shinobiLevel: data.class || 'Ninja em Treinamento',
              campaignLevel: data.level || 1,
              age: 0,
              gender: 'Indefinido',
              originVillage: 'Desconhecida',
              activeVillage: 'Desconhecida',
              alignment: 'Neutro',
              heightWeight: 'Indefinido',
              img: data.img || 'https://via.placeholder.com/400x300?text=Sem+Foto'
            },
            attributes: data.attributes || { for: 10, des: 10, agi: 10, per: 10, int: 10, vig: 10, esp: 10 },
            combatStats: data.combatStats || {
              vitTotal: data.max_hp || 0, vitCurrent: data.hp || 0,
              chaTotal: data.max_cp || 0, chaCurrent: data.cp || 0,
              iniciativa: 0, prontidao: 0, esquiva: 0, deslocamento: 0
            },
            defenses: data.defenses || { armadura: 0, dureza: 0, absorcao: 0 },
            social: data.social || { carisma: 10, manipulacao: 10, atuacao: 10, intimidar: 10, barganhar: 10, blefar: 10, obterInfo: 10, mudarAtitude: 10 },
            skills: data.skills || [],
            bases: data.bases || {
              cc: { base: 0, attr: 0, other: 0, total: 0 },
              cd: { base: 0, attr: 0, other: 0, total: 0 },
              esquiva: { base: 0, attr: 0, other: 0, total: 0 },
              lim: { base: 0, attr: 0, other: 0, total: 0 }
            },
            combatAbilities: data.combatAbilities || [],
            inventory: data.inventory || [],
            powers: data.powers || [],
            economy: data.economy || { kg: 'Nenhum', ryos: 0, compUsados: 0 },
            aptitudes: data.aptitudes || [],
            powerPoints: data.powerPoints || { total: 0, spent: 0 },
            attacks: data.attacks || [],
            jutsus: data.jutsus || []
          };

          setPlayerData(formattedData);
        }
      } catch (err: any) {
        console.error("Erro ao carregar ficha do banco:", err);
        setErrorMsg('Não foi possível carregar a ficha deste shinobi.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchPlayer();
  }, [id]);

  // Loading State
  if (loading) {
    return (
      <div className={styles.container} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <Loader2 size={48} className="animate-spin" style={{ color: '#ff6600' }} />
      </div>
    );
  }

  // Error ou Não Encontrado
  if (errorMsg || !playerData) {
    return (
      <div className={styles.container} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: '20px' }}>
        <h2 style={{ color: '#ff6600', fontFamily: 'NinjaNaruto, sans-serif' }}>{errorMsg || 'Ninja não encontrado!'}</h2>
        <Link href={`/admin-campanha/${campanhaId}/players`} className={styles.backLink}>
          <ArrowLeft size={18} /> Voltar para Lista
        </Link>
      </div>
    );
  }

  return (
    <main className={styles.container}>
      <nav className={styles.topNav}>
        <Link href={`/admin-campanha/${campanhaId}/players`} className={styles.backLink}>
          <ArrowLeft size={18} /> Voltar para Lista
        </Link>
        <span className={styles.modeLabel}>MODO MESTRE</span>
      </nav>

      <SheetHeader data={playerData} />

      <div className={styles.tabsContainer}>
        <div className={styles.tabsWrapper}>
          <button 
            onClick={() => setPage(1)} 
            className={`${styles.tab} ${page === 1 ? styles.active : ''}`}
          >
            <User size={18} />
            <span>DADOS GERAIS</span>
          </button>
          
          <button 
            onClick={() => setPage(2)} 
            className={`${styles.tab} ${page === 2 ? styles.active : ''}`}
          >
            <Backpack size={18} />
            <span>EQUIP & PODERES</span>
          </button>
          
          <button 
            onClick={() => setPage(3)} 
            className={`${styles.tab} ${page === 3 ? styles.active : ''}`}
          >
            <Scroll size={18} />
            <span>GRIMÓRIO (JUTSUS)</span>
          </button>
        </div>
      </div>

      <div className={styles.contentArea}>
        {page === 1 && <PageOne data={playerData} />}
        {page === 2 && <PageTwo data={playerData} />}
        {page === 3 && <PageThree data={playerData} />}
      </div>
    </main>
  );
}