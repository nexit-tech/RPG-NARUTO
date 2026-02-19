'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, Backpack, Scroll, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import styles from './styles.module.css';

import SheetHeader from '../../players/[id]/components/SheetHeader';
import PageOne from '../../players/[id]/components/PageOne';
import PageTwo from '../../players/[id]/components/PageTwo';
import PageThree from '../../players/[id]/components/PageThree';

// ✅ Estrutura alinhada com o que SheetHeader, PageOne, PageTwo e PageThree esperam
const BLANK_NPC_DATA = {
  // SheetHeader usa data.info
  info: {
    name: '',
    clan: '',
    shinobiLevel: '',
    campaignLevel: 1,
    age: 0,
    gender: '',
    originVillage: '',
    activeVillage: '',
    alignment: '',
    heightWeight: '',
    img: 'https://via.placeholder.com/150?text=Sem+Foto'
  },

  // PageOne > Attributes usa data.attributes
  attributes: {
    for: 0, des: 0, agi: 0, per: 0, int: 0, vig: 0, esp: 0
  },

  // PageOne > Vitals usa data.combatStats.vitCurrent/vitTotal/chaCurrent/chaTotal
  combatStats: {
    vitTotal: 100, vitCurrent: 100,
    chaTotal: 100, chaCurrent: 100,
    iniciativa: 0,
    esquiva: 0,
    deslocamento: 0
  },

  // PageOne > Armors usa data.defenses
  defenses: {
    dureza: 0,
    absorcao: 0
  },

  // PageOne > Social usa data.social
  social: {
    carisma: 0, manipulacao: 0, atuacao: 0, intimidar: 0,
    barganhar: 0, blefar: 0, obterInfo: 0, mudarAtitude: 0
  },

  // PageOne > Skills usa data.skills (array)
  skills: [
    { name: 'Acrobacia',         attr: 'AGI', pontos: 0, other: 0, total: 0 },
    { name: 'Arte',              attr: 'INT', pontos: 0, other: 0, total: 0 },
    { name: 'Atletismo',         attr: 'FOR', pontos: 0, other: 0, total: 0 },
    { name: 'Ciências Naturais', attr: 'INT', pontos: 0, other: 0, total: 0 },
    { name: 'Concentração',      attr: 'INT', pontos: 0, other: 0, total: 0 },
    { name: 'Cultura',           attr: 'INT', pontos: 0, other: 0, total: 0 },
    { name: 'Disfarce',          attr: 'PER', pontos: 0, other: 0, total: 0 },
    { name: 'Escapar',           attr: 'DES', pontos: 0, other: 0, total: 0 },
    { name: 'Furtividade',       attr: 'AGI', pontos: 0, other: 0, total: 0 },
    { name: 'Lidar com Animais', attr: 'PER', pontos: 0, other: 0, total: 0 },
    { name: 'Mecanismo',         attr: 'INT', pontos: 0, other: 0, total: 0 },
    { name: 'Medicina',          attr: 'INT', pontos: 0, other: 0, total: 0 },
    { name: 'Ocultismo',         attr: 'INT', pontos: 0, other: 0, total: 0 },
    { name: 'Prestidigitação',   attr: 'DES', pontos: 0, other: 0, total: 0 },
    { name: 'Procurar',          attr: 'PER', pontos: 0, other: 0, total: 0 },
    { name: 'Prontidão',         attr: 'PER', pontos: 0, other: 0, total: 0 },
    { name: 'Rastrear',          attr: 'PER', pontos: 0, other: 0, total: 0 },
    { name: 'Venefício',         attr: 'INT', pontos: 0, other: 0, total: 0 },
  ],

  // PageOne > CombatBases usa data.bases
  bases: {
    cc:      { base: 0, attr: 0, other: 0, total: 0, attrKey: 'for' },
    cd:      { base: 0, attr: 0, other: 0, total: 0, attrKey: 'des' },
    esquiva: { base: 0, attr: 0, other: 0, total: 0, attrKey: 'agi' },
    lim:     { base: 0, attr: 0, other: 0, total: 0, attrKey: 'per' },
  },

  // PageTwo
  inventory: [],
  powers: [],
  economy: { comp: '0/0', ryos: 0, ppTotal: 0, ppGastos: 0 },
  aptitudes: [],
  attacks: [],
  jutsus: [],
};

export default function NpcSheetPage({ params }: { params: Promise<{ campanhaId: string, id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);

  const campanhaId = resolvedParams.campanhaId;
  const npcId = resolvedParams.id;

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [npcData, setNpcData] = useState<any>(null);

  useEffect(() => {
    if (npcId) fetchNpcData();
  }, [npcId]);

  async function fetchNpcData() {
    setLoading(true);

    const { data, error } = await supabase
      .from('npcs')
      .select('*')
      .eq('id', npcId)
      .single();

    if (error || !data) {
      console.error('Erro ao buscar NPC:', error);
      router.push(`/admin-campanha/${campanhaId}/npcs`);
      return;
    }

    const habilidades = data.habilidades;
    const fichaJaExiste =
      habilidades &&
      typeof habilidades === 'object' &&
      !Array.isArray(habilidades) &&
      habilidades.info; // chave que confirma que é nossa estrutura

    let mergedData: any;

    if (fichaJaExiste) {
      // ✅ Ficha já existe no JSONB — carrega com fallback para BLANK
      mergedData = {
        ...BLANK_NPC_DATA,
        ...habilidades,
        // Sempre sincroniza as colunas diretas do DB (fonte de verdade)
        info: {
          ...BLANK_NPC_DATA.info,
          ...habilidades.info,
          name:          data.nome   ?? habilidades.info?.name          ?? '',
          img:           data.img    ?? habilidades.info?.img           ?? BLANK_NPC_DATA.info.img,
          shinobiLevel:  data.rank   ?? habilidades.info?.shinobiLevel  ?? '',
          activeVillage: data.aldeia ?? habilidades.info?.activeVillage ?? '',
          campaignLevel: data.nivel  ?? habilidades.info?.campaignLevel ?? 1,
        },
        combatStats: {
          ...BLANK_NPC_DATA.combatStats,
          ...habilidades.combatStats,
          vitCurrent: data.hp     ?? habilidades.combatStats?.vitCurrent ?? 100,
          vitTotal:   data.max_hp ?? habilidades.combatStats?.vitTotal   ?? 100,
          chaCurrent: data.cp     ?? habilidades.combatStats?.chaCurrent ?? 100,
          chaTotal:   data.max_cp ?? habilidades.combatStats?.chaTotal   ?? 100,
        },
        attributes: habilidades.attributes ?? BLANK_NPC_DATA.attributes,
        defenses:   habilidades.defenses   ?? BLANK_NPC_DATA.defenses,
        bases:      habilidades.bases      ?? BLANK_NPC_DATA.bases,
        skills:     habilidades.skills     ?? BLANK_NPC_DATA.skills,
        social:     habilidades.social     ?? BLANK_NPC_DATA.social,
      };
    } else {
      // ✅ Primeiro acesso — monta ficha zerada com dados das colunas diretas
      mergedData = {
        ...BLANK_NPC_DATA,
        info: {
          ...BLANK_NPC_DATA.info,
          name:          data.nome   ?? '',
          img:           data.img    ?? BLANK_NPC_DATA.info.img,
          shinobiLevel:  data.rank   ?? '',
          activeVillage: data.aldeia ?? '',
          campaignLevel: data.nivel  ?? 1,
        },
        combatStats: {
          ...BLANK_NPC_DATA.combatStats,
          vitCurrent: data.hp     ?? 100,
          vitTotal:   data.max_hp ?? 100,
          chaCurrent: data.cp     ?? 100,
          chaTotal:   data.max_cp ?? 100,
        },
      };
    }

    setNpcData(mergedData);
    setLoading(false);
  }

  // ✅ Salva TODA a ficha no Supabase — chamado pelos botões internos dos componentes
  const handleSave = async (dataToSave: any) => {
    if (!dataToSave) return;

    try {
      const updatePayload = {
        // Colunas diretas do DB
        nome:       dataToSave.info?.name          ?? '',
        img:        dataToSave.info?.img           ?? null,
        rank:       dataToSave.info?.shinobiLevel  ?? null,
        aldeia:     dataToSave.info?.activeVillage ?? null,
        nivel:      dataToSave.info?.campaignLevel ?? 1,
        hp:         dataToSave.combatStats?.vitCurrent ?? 100,
        max_hp:     dataToSave.combatStats?.vitTotal   ?? 100,
        cp:         dataToSave.combatStats?.chaCurrent ?? 100,
        max_cp:     dataToSave.combatStats?.chaTotal   ?? 100,
        atk:        dataToSave.bases?.cc?.total        ?? 0,
        def:        dataToSave.defenses?.dureza        ?? 0,
        esq:        dataToSave.bases?.esquiva?.total   ?? 0,
        cd:         dataToSave.bases?.cd?.total        ?? 0,
        // Ficha completa no JSONB
        habilidades: dataToSave,
      };

      const { error } = await supabase
        .from('npcs')
        .update(updatePayload)
        .eq('id', npcId);

      if (error) throw error;

      alert('✅ Ficha salva com sucesso!');
    } catch (err: any) {
      console.error('Erro ao salvar NPC:', err);
      alert('❌ Erro ao salvar: ' + (err?.message ?? 'Erro desconhecido'));
    }
  };

  // ✅ Recebe as alterações do SheetHeader ("Editar Cabeçalho") e salva
  const handleHeaderChange = async (updatedData: any) => {
    setNpcData(updatedData);
    await handleSave(updatedData);
  };

  // ✅ Recebe as alterações do PageOne/Two/Three ("Editar Ficha") e salva
  const handlePageDataChange = async (updatedData: any) => {
    setNpcData(updatedData);
    await handleSave(updatedData);
  };

  if (loading || !npcData) {
    return (
      <div className={styles.container} style={{
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        height: '100vh', color: '#ff6600'
      }}>
        <Loader2 size={50} style={{ animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  return (
    <main className={styles.container}>
      {/* Barra Superior — SEM botão "Salvar Ficha" */}
      <nav className={styles.topNav}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href={`/admin-campanha/${campanhaId}/npcs`} className={styles.backLink}>
            <ArrowLeft size={18} /> Voltar para Bingo Book
          </Link>
          <span className={styles.modeLabel}>MODO MESTRE — NPC</span>
        </div>
      </nav>

      {/*
        ✅ SheetHeader recebe onChange — quando o usuário clica em "SALVAR CABEÇALHO"
        dentro do componente, ele chama onChange com os dados atualizados,
        que dispara handleHeaderChange → salva no DB automaticamente.
      */}
      <SheetHeader data={npcData} onChange={handleHeaderChange} />

      {/* Abas de navegação */}
      <div className={styles.tabsContainer}>
        <div className={styles.tabsWrapper}>
          <button onClick={() => setPage(1)} className={`${styles.tab} ${page === 1 ? styles.active : ''}`}>
            <User size={18} /> <span>DADOS GERAIS</span>
          </button>
          <button onClick={() => setPage(2)} className={`${styles.tab} ${page === 2 ? styles.active : ''}`}>
            <Backpack size={18} /> <span>EQUIP & PODERES</span>
          </button>
          <button onClick={() => setPage(3)} className={`${styles.tab} ${page === 3 ? styles.active : ''}`}>
            <Scroll size={18} /> <span>GRIMÓRIO (JUTSUS)</span>
          </button>
        </div>
      </div>

      <div className={styles.contentArea}>
        {/*
          ✅ setData aqui é um wrapper que chama handlePageDataChange.
          Quando o usuário clica em "SALVAR FICHA" dentro do PageOne/Two/Three,
          o estado local do componente atualiza e dispara setData com os novos dados,
          que salva no DB automaticamente.

          NOTA: PageOne/PageTwo/PageThree têm botões internos "Editar Ficha" / "Salvar Ficha"
          que controlam o modo de edição local. O setData é chamado quando o usuário
          confirma as mudanças (ao clicar em "Salvar" dentro do componente).
        */}
        {page === 1 && (
          <PageOneWrapper
            data={npcData}
            onSave={handlePageDataChange}
          />
        )}
        {page === 2 && (
          <PageTwoWrapper
            data={npcData}
            onSave={handlePageDataChange}
          />
        )}
        {page === 3 && (
          <PageThreeWrapper
            data={npcData}
            onSave={handlePageDataChange}
          />
        )}
      </div>
    </main>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Wrappers que interceptam o setData dos componentes filhos
// e propagam o save para o banco quando o usuário confirma
// ─────────────────────────────────────────────────────────────────────────────

function PageOneWrapper({ data, onSave }: { data: any; onSave: (d: any) => Promise<void> }) {
  const [localData, setLocalData] = useState(data);

  useEffect(() => { setLocalData(data); }, [data]);

  // setData é chamado pelo PageOne quando qualquer seção é alterada
  const handleSetData = (updatedData: any) => {
    setLocalData(updatedData);
    // Salva no DB imediatamente (PageOne tem botão "Salvar Ficha" que reflete isso)
    onSave(updatedData);
  };

  return (
    // @ts-ignore
    <PageOne data={localData} setData={handleSetData} />
  );
}

function PageTwoWrapper({ data, onSave }: { data: any; onSave: (d: any) => Promise<void> }) {
  const [localData, setLocalData] = useState(data);

  useEffect(() => { setLocalData(data); }, [data]);

  const handleSetData = (updatedData: any) => {
    setLocalData(updatedData);
    onSave(updatedData);
  };

  return (
    // @ts-ignore
    <PageTwo data={localData} setData={handleSetData} />
  );
}

function PageThreeWrapper({ data, onSave }: { data: any; onSave: (d: any) => Promise<void> }) {
  const [localData, setLocalData] = useState(data);

  useEffect(() => { setLocalData(data); }, [data]);

  const handleSetData = (updatedData: any) => {
    setLocalData(updatedData);
    onSave(updatedData);
  };

  return (
    // @ts-ignore
    <PageThree data={localData} setData={handleSetData} />
  );
}