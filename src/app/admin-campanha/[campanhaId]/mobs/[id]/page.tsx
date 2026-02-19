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

const BLANK_MOB_DATA = {
  info: {
    name: '', clan: '', shinobiLevel: '', campaignLevel: 1, age: 0, gender: '',
    originVillage: '', activeVillage: '', alignment: '', heightWeight: '',
    img: 'https://via.placeholder.com/150?text=Sem+Foto'
  },
  attributes: { for: 0, des: 0, agi: 0, per: 0, int: 0, vig: 0, esp: 0 },
  combatStats: {
    vitTotal: 50, vitCurrent: 50, chaTotal: 30, chaCurrent: 30,
    iniciativa: 0, esquiva: 0, deslocamento: 0
  },
  defenses: { dureza: 0, absorcao: 0 },
  social: {
    carisma: 0, manipulacao: 0, atuacao: 0, intimidar: 0,
    barganhar: 0, blefar: 0, obterInfo: 0, mudarAtitude: 0
  },
  skills: [
    { name: 'Acrobacia', attr: 'AGI', pontos: 0, other: 0, total: 0 },
    { name: 'Furtividade', attr: 'AGI', pontos: 0, other: 0, total: 0 },
    { name: 'Percepção', attr: 'PER', pontos: 0, other: 0, total: 0 },
  ],
  bases: {
    cc: { base: 0, attr: 0, other: 0, total: 0, attrKey: 'for' },
    cd: { base: 0, attr: 0, other: 0, total: 0, attrKey: 'des' },
    esquiva: { base: 0, attr: 0, other: 0, total: 0, attrKey: 'agi' },
    lim: { base: 0, attr: 0, other: 0, total: 0, attrKey: 'per' }
  },
  inventory: [],
  powers: [],
  economy: { comp: '0/0', ryos: 0, ppTotal: 0, ppGastos: 0 },
  aptitudes: [],
  attacks: [],
  jutsus: []
};

export default function MobSheetPage({ params }: { params: Promise<{ campanhaId: string, id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);

  const campanhaId = resolvedParams.campanhaId;
  const mobId = resolvedParams.id;

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mobData, setMobData] = useState<any>(null);

  useEffect(() => {
    if (mobId) fetchMobData();
  }, [mobId]);

  async function fetchMobData() {
    setLoading(true);

    const { data, error } = await supabase
      .from('mobs')
      .select('*')
      .eq('id', mobId)
      .single();

    if (error || !data) {
      console.error('Erro ao buscar Mob:', error);
      router.push(`/admin-campanha/${campanhaId}/mobs`);
      return;
    }

    let mergedData: any;
    const habilidades = data.habilidades;
    const fichaJaExiste = habilidades && typeof habilidades === 'object' && !Array.isArray(habilidades) && habilidades.info;

    if (fichaJaExiste) {
      mergedData = {
        ...BLANK_MOB_DATA,
        ...habilidades,
        info: {
          ...BLANK_MOB_DATA.info,
          ...habilidades.info,
          name: data.nome ?? habilidades.info?.name ?? '',
          img: data.img ?? habilidades.info?.img ?? BLANK_MOB_DATA.info.img,
          campaignLevel: data.nivel ?? habilidades.info?.campaignLevel ?? 1,
        },
        combatStats: {
          ...BLANK_MOB_DATA.combatStats,
          ...habilidades.combatStats,
          vitCurrent: habilidades.combatStats?.vitCurrent ?? data.hp_base ?? 50,
          vitTotal: data.hp_base ?? habilidades.combatStats?.vitTotal ?? 50,
          chaCurrent: habilidades.combatStats?.chaCurrent ?? data.cp_base ?? 30,
          chaTotal: data.cp_base ?? habilidades.combatStats?.chaTotal ?? 30,
        },
        defenses: habilidades.defenses || BLANK_MOB_DATA.defenses,
        bases: habilidades.bases || BLANK_MOB_DATA.bases,
        skills: habilidades.skills || BLANK_MOB_DATA.skills,
        social: habilidades.social || BLANK_MOB_DATA.social,
      };
    } else {
      mergedData = {
        ...BLANK_MOB_DATA,
        info: {
          ...BLANK_MOB_DATA.info,
          name: data.nome ?? '',
          img: data.img ?? BLANK_MOB_DATA.info.img,
          campaignLevel: data.nivel ?? 1,
        },
        combatStats: {
          ...BLANK_MOB_DATA.combatStats,
          vitCurrent: data.hp_base ?? 50,
          vitTotal: data.hp_base ?? 50,
          chaCurrent: data.cp_base ?? 30,
          chaTotal: data.cp_base ?? 30,
        }
      };
    }

    setMobData(mergedData);
    setLoading(false);
  }

  // 👇 NOVA FUNÇÃO: Atualiza o estado na tela e salva no DB automaticamente!
  const handleUpdateAndSave = async (updatedData: any) => {
    setMobData(updatedData); // Atualiza UI
    setSaving(true); // Mostra o "Salvando..." no topo

    try {
      const updatePayload = {
        nome: updatedData.info?.name ?? '',
        img: updatedData.info?.img ?? null,
        nivel: updatedData.info?.campaignLevel ?? 1,
        hp_base: updatedData.combatStats?.vitTotal ?? 50,
        cp_base: updatedData.combatStats?.chaTotal ?? 30,
        atk: updatedData.bases?.cc?.total ?? 8,
        def: updatedData.defenses?.dureza ?? 6,
        esq: updatedData.bases?.esquiva?.total ?? 8,
        cd: updatedData.bases?.cd?.total ?? 6,
        habilidades: updatedData,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('mobs')
        .update(updatePayload)
        .eq('id', mobId);

      if (error) throw error;
    } catch (err: any) {
      console.error('Erro ao salvar Mob:', err);
      alert('❌ Erro ao salvar DB: ' + (err?.message ?? 'Erro desconhecido'));
    } finally {
      // Dá um tempinho só pro usuário ver que salvou
      setTimeout(() => setSaving(false), 500); 
    }
  };

  if (loading || !mobData) {
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
          <Link href={`/admin-campanha/${campanhaId}/mobs`} className={styles.backLink}>
            <ArrowLeft size={18} /> Voltar para Bestiário
          </Link>
          <span className={styles.modeLabel}>MODO MESTRE — MOB</span>
        </div>

        {/* 👇 Feedback Visual de Salvamento Automático */}
        <div style={{ width: '120px', display: 'flex', justifyContent: 'flex-end' }}>
          {saving && (
            <span style={{ color: '#22c55e', fontSize: '0.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> SALVANDO...
            </span>
          )}
        </div>
      </nav>

      <SheetHeader data={mobData} onChange={handleUpdateAndSave} />

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
        <PageOne   data={mobData} setData={handleUpdateAndSave} />
        <PageTwo   data={mobData} setData={handleUpdateAndSave} />
        <PageThree data={mobData} setData={handleUpdateAndSave} />
      </div>
    </main>
  );
}