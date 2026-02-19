'use client';

import React, { useState, useEffect } from 'react';
import { X, Loader2, User, Backpack, Scroll } from 'lucide-react';
import { supabase } from '@/lib/supabase';

import SheetHeader from '../../../players/[id]/components/SheetHeader';
import PageOne from '../../../players/[id]/components/PageOne';
import PageTwo from '../../../players/[id]/components/PageTwo';
import PageThree from '../../../players/[id]/components/PageThree';

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

export default function QuickSheetModal({ campanhaId, isOpen, onClose, token }: any) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  // 1. SINCRONIZAÇÃO EM TEMPO REAL (Dano/Cura do Mestre)
  useEffect(() => {
    if (data && token && isOpen) {
      setData((prev: any) => ({
        ...prev,
        combatStats: {
          ...prev.combatStats,
          vitCurrent: token.hp ?? prev.combatStats.vitCurrent,
          vitTotal: token.maxHp ?? prev.combatStats.vitTotal,
          chaCurrent: token.cp ?? prev.combatStats.chaCurrent,
          chaTotal: token.maxCp ?? prev.combatStats.chaTotal
        }
      }));
    }
  }, [token?.hp, token?.cp, token?.maxHp, token?.maxCp, isOpen]);

  // 2. CARREGAMENTO DO BANCO DE DADOS
  useEffect(() => {
    if (isOpen && token?.originalId) {
      fetchFullSheet();
    }
  }, [isOpen, token?.originalId]);

  async function fetchFullSheet() {
    setLoading(true);
    try {
      const table = token.originalTable === 'players' ? 'personagens' : token.originalTable;
      const { data: dbData } = await supabase.from(table).select('*').eq('id', token.originalId).single();
      
      if (dbData) {
        // Pega a ficha JSON (ficha_data para players, habilidades para NPCs/Mobs)
        const hab = dbData.ficha_data || dbData.habilidades || {};
        
        // CORREÇÃO: Mapeamento de ALIASES para não "comer" perícias ou social
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
            // Prioriza o valor da coluna individual (que é o que o mapa mostra)
            vitCurrent: dbData.hp ?? hab.combatStats?.vitCurrent,
            vitTotal: dbData.max_hp ?? hab.combatStats?.vitTotal,
            chaCurrent: dbData.cp ?? hab.combatStats?.chaCurrent,
            chaTotal: dbData.max_cp ?? hab.combatStats?.chaTotal,
          }
        };
        setData(merged);
      }
    } catch (err) {
      console.error("Erro fatal ao carregar ficha:", err);
    } finally {
      setLoading(false);
    }
  }

  // 3. SALVAMENTO AUTOMÁTICO NO DB
  const handleDataChange = async (newData: any) => {
    setData(newData);
    
    const table = token.originalTable === 'players' ? 'personagens' : token.originalTable;
    const isPlayer = token.originalTable === 'players';

    // Extrai os valores calculados para atualizar as colunas individuais (sincroniza com mapa)
    const atk = newData.bases?.cc?.total || 0;
    const def = newData.defenses?.absorcao || newData.bases?.defesa?.total || 0;
    const esq = newData.bases?.esquiva?.total || newData.combatStats?.esquiva || 0;
    const cd = newData.bases?.cd?.total || 0;

    const updatePayload: any = {
      [isPlayer ? 'ficha_data' : 'habilidades']: newData,
      hp: newData.combatStats.vitCurrent,
      max_hp: newData.combatStats.vitTotal,
      cp: newData.combatStats.chaCurrent,
      max_cp: newData.combatStats.chaTotal,
      atk: atk,
      def: def,
      esq: esq,
      cd: cd,
      updated_at: new Date()
    };

    // Salva na tabela base do personagem
    await supabase.from(table).update(updatePayload).eq('id', token.originalId);

    // Salva no Token da Sessão (Realtime para o mestre e outros players)
    await supabase.from('sessao_tokens').update({
      hp: updatePayload.hp,
      max_hp: updatePayload.max_hp,
      cp: updatePayload.cp,
      max_cp: updatePayload.max_cp,
      atk: atk,
      def: def,
      esq: esq,
      cd: cd
    }).eq('id', token.id);
  };

  if (!isOpen || !token) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)' }}>
      <div style={{ background: '#0a0a0a', width: '98vw', height: '98vh', borderRadius: '8px', overflow: 'hidden', display: 'flex', flexDirection: 'column', border: '1px solid #333' }}>
        
        <div style={{ padding: '10px 25px', background: '#111', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #222' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <img src={token.img} alt="" style={{ width: 35, height: 35, borderRadius: '50%', objectFit: 'cover', border: '2px solid #ff6600' }} />
            <h3 style={{ margin: 0, color: '#ff6600', fontWeight: 900, fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '2px' }}>
              FICHA COMPLETA: {token.name}
            </h3>
          </div>
          <button onClick={onClose} style={{ background: '#ff4444', border: 'none', color: '#fff', cursor: 'pointer', padding: '6px 20px', borderRadius: '4px', fontWeight: 'bold' }}>FECHAR</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
           {loading ? (
              <div style={{ display: 'flex', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                 <Loader2 size={50} className="animate-spin" color="#ff6600" />
              </div>
           ) : data ? (
             <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <SheetHeader data={data} onChange={handleDataChange} />
                
                <div style={{ display: 'flex', gap: '5px', margin: '20px 0', background: '#111', padding: '5px', borderRadius: '8px', border: '1px solid #222' }}>
                  <button onClick={() => setPage(1)} style={{ flex: 1, background: page === 1 ? '#ff6600' : 'transparent', color: '#fff', border: 'none', padding: '12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>ATRIBUTOS & PERÍCIAS</button>
                  <button onClick={() => setPage(2)} style={{ flex: 1, background: page === 2 ? '#ff6600' : 'transparent', color: '#fff', border: 'none', padding: '12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>INVENTÁRIO</button>
                  <button onClick={() => setPage(3)} style={{ flex: 1, background: page === 3 ? '#ff6600' : 'transparent', color: '#fff', border: 'none', padding: '12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>JUTSUS</button>
                </div>

                <div style={{ paddingBottom: '40px' }}>
                  {page === 1 && <PageOne data={data} setData={handleDataChange} />}
                  {page === 2 && <PageTwo data={data} setData={handleDataChange} />}
                  {page === 3 && <PageThree data={data} setData={handleDataChange} />}
                </div>
             </div>
           ) : null}
        </div>
      </div>
    </div>
  );
}