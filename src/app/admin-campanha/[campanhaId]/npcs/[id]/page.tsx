'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, Backpack, Scroll, Loader2, Save } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import styles from './styles.module.css';

// Importamos os componentes visuais das abas (sem o mock de dados antigo)
import SheetHeader from '../../players/[id]/components/SheetHeader';
import PageOne from '../../players/[id]/components/PageOne';
import PageTwo from '../../players/[id]/components/PageTwo';
import PageThree from '../../players/[id]/components/PageThree';

// 🌟 A FICHA TOTALMENTE ZERADA
const BLANK_NPC_DATA = {
  basic: {
    name: '', player: 'Mestre', class: '', level: 1, concept: '',
    clan: '', rank: '', village: '', age: 0, gender: '', nindo: '',
    img: 'https://via.placeholder.com/150?text=Sem+Foto'
  },
  vitals: {
    hp: { current: 100, max: 100 },
    cp: { current: 100, max: 100 }
  },
  combatStats: { atk: 0, def: 0, esq: 0, cd: 0, initiative: 0, movement: 0 },
  attributes: {
    ninjutsu: 0, taijutsu: 0, genjutsu: 0,
    forca: 0, agilidade: 0, vitalidade: 0,
    inteligencia: 0, destreza: 0, carisma: 0
  },
  skills: [], weapons: [], inventory: [], jutsus: [], aptitudes: [],
  combatBases: [], combatAbilities: [], social: [], armors: []
};

export default function NpcSheetPage({ params }: { params: Promise<{ campanhaId: string, id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  
  const campanhaId = resolvedParams.campanhaId;
  const npcId = resolvedParams.id;

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // O estado vivo que a tela vai ler e você vai poder alterar
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

    let mergedData;

    // Se a coluna JSONB "habilidades" já for um objeto com os dados da ficha, carregamos ela!
    if (data.habilidades && typeof data.habilidades === 'object' && !Array.isArray(data.habilidades) && data.habilidades.basic) {
      mergedData = data.habilidades;
      // Garante que a foto e nome principais sempre sobreponham
      mergedData.basic.name = data.nome;
      mergedData.basic.img = data.img;
    } else {
      // É O PRIMEIRO ACESSO! Monta a ficha Zerada usando o que acabamos de puxar do banco
      mergedData = {
        ...BLANK_NPC_DATA,
        basic: {
          ...BLANK_NPC_DATA.basic,
          name: data.nome,
          img: data.img,
          rank: data.rank || '',
          village: data.aldeia || '',
          level: data.nivel || 1,
        },
        vitals: {
          hp: { current: data.hp || 100, max: data.max_hp || 100 },
          cp: { current: data.cp || 100, max: data.max_cp || 100 },
        },
        combatStats: {
          ...BLANK_NPC_DATA.combatStats,
          atk: data.atk || 10,
          def: data.def || 10,
          esq: data.esq || 10,
          cd: data.cd || 10,
        }
      };
    }

    setNpcData(mergedData);
    setLoading(false);
  }

  // 💾 A LÓGICA DE SALVAMENTO NO SUPABASE
  const handleSave = async () => {
    setSaving(true);
    
    // Pegamos os valores que estão sendo visualizados e preparamos pro banco
    const updatePayload = {
      nome: npcData.basic.name,
      img: npcData.basic.img,
      rank: npcData.basic.rank,
      aldeia: npcData.basic.village,
      nivel: npcData.basic.level,
      hp: npcData.vitals.hp.current,
      max_hp: npcData.vitals.hp.max,
      cp: npcData.vitals.cp.current,
      max_cp: npcData.vitals.cp.max,
      atk: npcData.combatStats.atk,
      def: npcData.combatStats.def,
      esq: npcData.combatStats.esq,
      cd: npcData.combatStats.cd,
      // A MÁGICA: Empacota inventário, habilidades e tudo mais na coluna JSONB!
      habilidades: npcData 
    };

    const { error } = await supabase.from('npcs').update(updatePayload).eq('id', npcId);
    
    setSaving(false);
    if (error) {
      alert('Erro ao salvar ficha: ' + error.message);
    } else {
      alert('Ficha do NPC atualizada com sucesso!');
    }
  };

  if (loading || !npcData) {
    return (
      <div className={styles.container} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#ff6600' }}>
        <Loader2 size={50} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  return (
    <main className={styles.container}>
      {/* Barra Superior */}
      <nav className={styles.topNav} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href={`/admin-campanha/${campanhaId}/npcs`} className={styles.backLink}>
            <ArrowLeft size={18} /> Voltar para Bingo Book
          </Link>
          <span className={styles.modeLabel}>MODO MESTRE — NPC</span>
        </div>

        {/* Botão de Salvar Alterações Conectado ao Supabase! */}
        <button 
          onClick={handleSave} 
          disabled={saving}
          style={{ background: '#ff6600', color: '#fff', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '6px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
        >
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
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
        {/* Passamos o setData para o componente poder alterar o estado global quando você digitar! */}
        {/* @ts-ignore - Evita erros caso o componente ainda não tenha essa tipagem */}
        {page === 1 && <PageOne data={npcData} setData={setNpcData} />}
        {/* @ts-ignore */}
        {page === 2 && <PageTwo data={npcData} setData={setNpcData} />}
        {/* @ts-ignore */}
        {page === 3 && <PageThree data={npcData} setData={setNpcData} />}
      </div>
    </main>
  );
}