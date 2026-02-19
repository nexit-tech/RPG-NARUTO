'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

// Reutilizando os componentes da ficha administrativa para manter o padrão
import SheetHeader from '@/app/admin-campanha/[campanhaId]/players/[id]/components/SheetHeader';
import PageOne     from '@/app/admin-campanha/[campanhaId]/players/[id]/components/PageOne';
import PageTwo     from '@/app/admin-campanha/[campanhaId]/players/[id]/components/PageTwo';
import PageThree   from '@/app/admin-campanha/[campanhaId]/players/[id]/components/PageThree';

import styles from './styles.module.css';

interface FichaTabProps {
  campanhaId: string;
  personagemId: string;
}

const BLANK_DATA = {
  info: { name: '', img: '' },
  attributes: { for: 0, des: 0, agi: 0, per: 0, int: 0, vig: 0, esp: 0 },
  combatStats: { vitTotal: 100, vitCurrent: 100, chaTotal: 100, chaCurrent: 100, iniciativa: 0, esquiva: 0, deslocamento: 0 },
  defenses: { dureza: 0, absorcao: 0 },
  skills: [], 
  bases: { cc: { total: 0 }, cd: { total: 0 }, esquiva: { total: 0 }, lim: { total: 0 }, defesa: { total: 0 } },
  social: { carisma: 0, manipulacao: 0, atuacao: 0, intimidar: 0, barganhar: 0, blefar: 0, obterInfo: 0, mudarAtitude: 0 },
  inventory: [], powers: [], economy: { comp: '0/0', ryos: 0, ppTotal: 0, ppGastos: 0 }, aptitudes: [], attacks: [], jutsus: []
};

export default function FichaTab({ campanhaId, personagemId }: FichaTabProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // 1. Carrega os dados reais do Nathan ao abrir a aba
  useEffect(() => {
    if (personagemId) {
      fetchPlayerData();
    }
  }, [personagemId]);

  async function fetchPlayerData() {
    setLoading(true);
    try {
      const { data: dbData } = await supabase
        .from('personagens')
        .select('*')
        .eq('id', personagemId)
        .single();

      if (dbData) {
        const hab = dbData.ficha_data || {};
        
        // Mapeia chaves alternativas para garantir que Social e Perícias apareçam
        const skillsSource = hab.skills || hab.pericias || BLANK_DATA.skills;
        const socialSource = hab.social || hab.social_stats || hab.atributos_sociais || BLANK_DATA.social;

        const merged = {
          ...BLANK_DATA,
          ...hab,
          skills: skillsSource,
          social: socialSource,
          info: { ...BLANK_DATA.info, ...hab.info, name: dbData.nome, img: dbData.img },
          combatStats: {
            ...BLANK_DATA.combatStats,
            ...hab.combatStats,
            vitCurrent: dbData.hp ?? hab.combatStats?.vitCurrent,
            vitTotal: dbData.max_hp ?? hab.combatStats?.vitTotal,
            chaCurrent: dbData.cp ?? hab.combatStats?.chaCurrent,
            chaTotal: dbData.max_cp ?? hab.combatStats?.chaTotal,
          }
        };
        setData(merged);
      }
    } catch (err) {
      console.error("Erro ao buscar dados do personagem:", err);
    } finally {
      setLoading(false);
    }
  }

  // 2. Função de Salvamento (Persistência no DB)
  const handleDataChange = async (newData: any) => {
    setData(newData);

    const atk = newData.bases?.cc?.total || 0;
    const def = newData.defenses?.absorcao || newData.bases?.defesa?.total || 0;
    const esq = newData.bases?.esquiva?.total || 0;
    const cd = newData.bases?.cd?.total || 0;

    const updatePayload = {
      ficha_data: newData,
      hp: newData.combatStats.vitCurrent,
      max_hp: newData.combatStats.vitTotal,
      cp: newData.combatStats.chaCurrent,
      max_cp: newData.combatStats.chaTotal,
      atk, def, esq, cd,
      updated_at: new Date()
    };

    // Atualiza a ficha principal
    await supabase.from('personagens').update(updatePayload).eq('id', personagemId);

    // Sincroniza com o token da sessão ativa (se houver)
    await supabase.from('sessao_tokens')
      .update({
        hp: updatePayload.hp,
        max_hp: updatePayload.max_hp,
        cp: updatePayload.cp,
        max_cp: updatePayload.max_cp,
        atk, def, esq, cd
      })
      .eq('personagem_id', personagemId);
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Loader2 size={50} className="animate-spin" color="#ff6600" />
        <p>Invocando sua ficha...</p>
      </div>
    );
  }

  const PAGES = [
    { id: 1, label: 'Atributos & Perícias' },
    { id: 2, label: 'Inventário' },
    { id: 3, label: 'Jutsus' },
  ];

  return (
    <div className={styles.fichaContainer}>
      {/* Cabeçalho Editável */}
      <SheetHeader data={data} onChange={handleDataChange} />

      {/* Navegação de páginas */}
      <div className={styles.pageNav}>
        {PAGES.map(p => (
          <button
            key={p.id}
            className={`${styles.pageBtn} ${currentPage === p.id ? styles.pageBtnActive : ''}`}
            onClick={() => setCurrentPage(p.id as any)}
          >
            {p.id}. {p.label}
          </button>
        ))}
      </div>

      <div className={styles.pageContent}>
        {currentPage === 1 && <PageOne   data={data} setData={handleDataChange} />}
        {currentPage === 2 && <PageTwo   data={data} setData={handleDataChange} />}
        {currentPage === 3 && <PageThree data={data} setData={handleDataChange} />}
      </div>
    </div>
  );
}