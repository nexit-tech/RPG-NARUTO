'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, Backpack, Scroll, Loader2, Save } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import styles from './styles.module.css';

import SheetHeader from '../../players/[id]/components/SheetHeader';
import PageOne from '../../players/[id]/components/PageOne';
import PageTwo from '../../players/[id]/components/PageTwo';
import PageThree from '../../players/[id]/components/PageThree';

const BLANK_NPC_DATA = {
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
  attributes: {
    for: 0, des: 0, agi: 0, per: 0, int: 0, vig: 0, esp: 0
  },
  combatStats: {
    vitTotal: 100, vitCurrent: 100,
    chaTotal: 100, chaCurrent: 100,
    iniciativa: 0,
    esquiva: 0,
    deslocamento: 0
  },
  defenses: {
    dureza: 0,
    absorcao: 0
  },
  social: {
    carisma: 0, manipulacao: 0, atuacao: 0, intimidar: 0,
    barganhar: 0, blefar: 0, obterInfo: 0, mudarAtitude: 0
  },
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
  bases: {
    cc:      { base: 0, attr: 0, other: 0, total: 0, attrKey: 'for' },
    cd:      { base: 0, attr: 0, other: 0, total: 0, attrKey: 'des' },
    esquiva: { base: 0, attr: 0, other: 0, total: 0, attrKey: 'agi' },
    lim:     { base: 0, attr: 0, other: 0, total: 0, attrKey: 'per' }
  },
  inventory: [],
  powers: [],
  economy: { comp: '0/0', ryos: 0, ppTotal: 0, ppGastos: 0 },
  aptitudes: [],
  attacks: [],
  jutsus: []
};

export default function NpcSheetPage({ params }: { params: Promise<{ campanhaId: string, id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);

  const campanhaId = resolvedParams.campanhaId;
  const npcId = resolvedParams.id;

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

    let mergedData: any;

    const habilidades = data.habilidades;
    const fichaJaExiste =
      habilidades &&
      typeof habilidades === 'object' &&
      !Array.isArray(habilidades) &&
      habilidades.info;

    if (fichaJaExiste) {
      // Ficha já foi salva antes — carrega do jsonb com fallbacks seguros
      mergedData = {
        ...BLANK_NPC_DATA,
        ...habilidades,
        info: {
          ...BLANK_NPC_DATA.info,
          ...habilidades.info,
          // Garante sync com colunas diretas do DB
          name:          data.nome             ?? habilidades.info?.name ?? '',
          img:           data.img              ?? habilidades.info?.img  ?? BLANK_NPC_DATA.info.img,
          shinobiLevel:  data.rank             ?? habilidades.info?.shinobiLevel ?? '',
          activeVillage: data.aldeia           ?? habilidades.info?.activeVillage ?? '',
          campaignLevel: data.nivel            ?? habilidades.info?.campaignLevel ?? 1,
        },
        combatStats: {
          ...BLANK_NPC_DATA.combatStats,
          ...habilidades.combatStats,
          // Sync HP/CP com colunas diretas do DB
          vitCurrent: data.hp      ?? habilidades.combatStats?.vitCurrent ?? 100,
          vitTotal:   data.max_hp  ?? habilidades.combatStats?.vitTotal   ?? 100,
          chaCurrent: data.cp      ?? habilidades.combatStats?.chaCurrent ?? 100,
          chaTotal:   data.max_cp  ?? habilidades.combatStats?.chaTotal   ?? 100,
        },
        defenses: habilidades.defenses || BLANK_NPC_DATA.defenses,
        bases:    habilidades.bases    || BLANK_NPC_DATA.bases,
        skills:   habilidades.skills   || BLANK_NPC_DATA.skills,
        social:   habilidades.social   || BLANK_NPC_DATA.social,
      };
    } else {
      // Primeiro acesso — monta do zero com dados das colunas do DB
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
        }
      };
    }

    setNpcData(mergedData);
    setLoading(false);
  }

  const handleSave = async () => {
    if (!npcData) return;
    setSaving(true);

    try {
      // ✅ Mapeia ficha → colunas diretas do DB (schema public.npcs)
      const updatePayload = {
        // Colunas diretas
        nome:       npcData.info?.name          ?? '',
        img:        npcData.info?.img           ?? null,
        rank:       npcData.info?.shinobiLevel  ?? null,
        aldeia:     npcData.info?.activeVillage ?? null,
        nivel:      npcData.info?.campaignLevel ?? 1,
        hp:         npcData.combatStats?.vitCurrent ?? 100,
        max_hp:     npcData.combatStats?.vitTotal   ?? 100,
        cp:         npcData.combatStats?.chaCurrent ?? 100,
        max_cp:     npcData.combatStats?.chaTotal   ?? 100,
        atk:        npcData.bases?.cc?.total    ?? 10,
        def:        npcData.defenses?.dureza    ?? 10,
        esq:        npcData.bases?.esquiva?.total ?? 10,
        cd:         npcData.bases?.cd?.total    ?? 10,
        initiative: npcData.combatStats?.iniciativa ?? 0,
        // Ficha completa no jsonb
        habilidades: npcData,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('npcs')
        .update(updatePayload)
        .eq('id', npcId);

      if (error) throw error;

      alert('✅ Ficha do NPC salva com sucesso!');
    } catch (err: any) {
      console.error('Erro ao salvar NPC:', err);
      alert('❌ Erro ao salvar: ' + (err?.message ?? 'Erro desconhecido'));
    } finally {
      setSaving(false);
    }
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
      <nav className={styles.topNav}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href={`/admin-campanha/${campanhaId}/npcs`} className={styles.backLink}>
            <ArrowLeft size={18} /> Voltar para Bingo Book
          </Link>
          <span className={styles.modeLabel}>MODO MESTRE — NPC</span>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            background: '#ff6600', color: '#fff', border: 'none',
            padding: '0.6rem 1.2rem', borderRadius: '6px', fontWeight: 'bold',
            display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
            opacity: saving ? 0.7 : 1
          }}
        >
          {saving
            ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
            : <Save size={18} />
          }
          {saving ? 'Salvando...' : 'Salvar Ficha'}
        </button>
      </nav>

      <SheetHeader data={npcData} />

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
        {page === 1 && <PageOne   data={npcData} setData={setNpcData} />}
        {page === 2 && <PageTwo   data={npcData} setData={setNpcData} />}
        {page === 3 && <PageThree data={npcData} setData={setNpcData} />}
      </div>
    </main>
  );
}