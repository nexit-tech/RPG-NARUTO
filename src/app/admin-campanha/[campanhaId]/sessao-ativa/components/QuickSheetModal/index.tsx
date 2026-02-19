import React, { useState, useEffect } from 'react';
import { X, Loader2, User, Backpack, Scroll } from 'lucide-react';
import { supabase } from '@/lib/supabase';

import SheetHeader from '../../../players/[id]/components/SheetHeader';
import PageOne from '../../../players/[id]/components/PageOne';
import PageTwo from '../../../players/[id]/components/PageTwo';
import PageThree from '../../../players/[id]/components/PageThree';

// Estrutura em branco para garantir que a ficha não quebre caso falte algum dado
const BLANK_DATA = {
  info: { name: '', img: '' },
  attributes: { for: 0, des: 0, agi: 0, per: 0, int: 0, vig: 0, esp: 0 },
  combatStats: { vitTotal: 100, vitCurrent: 100, chaTotal: 100, chaCurrent: 100, iniciativa: 0, esquiva: 0, deslocamento: 0 },
  defenses: { dureza: 0, absorcao: 0 },
  social: { carisma: 0, manipulacao: 0, atuacao: 0, intimidar: 0, barganhar: 0, blefar: 0, obterInfo: 0, mudarAtitude: 0 },
  skills: [], bases: { cc: { total: 0 }, cd: { total: 0 }, esquiva: { total: 0 }, lim: { total: 0 } },
  inventory: [], powers: [], economy: { comp: '0/0', ryos: 0, ppTotal: 0, ppGastos: 0 }, aptitudes: [], attacks: [], jutsus: []
};

export default function QuickSheetModal({ campanhaId, isOpen, onClose, token }: any) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (isOpen && token?.originalId) {
      fetchFullSheet();
    }
  }, [isOpen, token]);

  async function fetchFullSheet() {
    setLoading(true);
    // Identifica se é player, npc ou mob para buscar na tabela certa
    const table = token.originalTable === 'players' ? 'personagens' : token.originalTable;
    
    const { data: dbData } = await supabase.from(table).select('*').eq('id', token.originalId).single();
    
    if (dbData) {
      const hab = dbData.habilidades || dbData.ficha_data || {};
      
      // Mescla o template com os dados salvos para garantir consistência
      const merged = { 
        ...BLANK_DATA, 
        ...hab, 
        info: { ...BLANK_DATA.info, ...hab.info, name: dbData.nome, img: dbData.img },
        combatStats: {
          ...BLANK_DATA.combatStats,
          ...hab.combatStats,
          // Garante que o HP/CP do db atualize a tela
          vitCurrent: dbData.hp ?? hab.combatStats?.vitCurrent,
          vitTotal: dbData.max_hp ?? hab.combatStats?.vitTotal,
          chaCurrent: dbData.cp ?? hab.combatStats?.chaCurrent,
          chaTotal: dbData.max_cp ?? hab.combatStats?.chaTotal,
        }
      };
      
      setData(merged);
    }
    setLoading(false);
  }

  if (!isOpen || !token) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#111', width: '95vw', maxWidth: '1200px', height: '90vh', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        
        {/* Cabeçalho do Modal */}
        <div style={{ padding: '15px 20px', background: '#1a1a1a', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #333' }}>
          <h3 style={{ margin: 0, fontFamily: 'NinjaNaruto', color: '#ff6600', letterSpacing: '1px' }}>
            FICHA DE {token.name.toUpperCase()}
          </h3>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', padding: '5px' }}>
            <X size={24} />
          </button>
        </div>

        {/* Área da Ficha Completa */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', position: 'relative' }}>
           {loading ? (
              <div style={{ display: 'flex', height: '100%', justifyContent: 'center', alignItems: 'center', color: '#ff6600' }}>
                 <Loader2 size={50} style={{ animation: 'spin 1s linear infinite' }} />
              </div>
           ) : data ? (
             <>
                <SheetHeader data={data} onChange={setData} />
                
                <div style={{ display: 'flex', gap: '10px', margin: '20px 0', borderBottom: '2px solid #333', paddingBottom: '10px' }}>
                  <button onClick={() => setPage(1)} style={{ background: page === 1 ? '#ff6600' : '#222', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', display: 'flex', gap: '8px', fontWeight: 'bold' }}>
                    <User size={18}/> DADOS
                  </button>
                  <button onClick={() => setPage(2)} style={{ background: page === 2 ? '#ff6600' : '#222', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', display: 'flex', gap: '8px', fontWeight: 'bold' }}>
                    <Backpack size={18}/> EQUIPAMENTO
                  </button>
                  <button onClick={() => setPage(3)} style={{ background: page === 3 ? '#ff6600' : '#222', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', display: 'flex', gap: '8px', fontWeight: 'bold' }}>
                    <Scroll size={18}/> JUTSUS
                  </button>
                </div>

                <div style={{ paddingBottom: '50px' }}>
                  {page === 1 && <PageOne data={data} setData={setData} />}
                  {page === 2 && <PageTwo data={data} setData={setData} />}
                  {page === 3 && <PageThree data={data} setData={setData} />}
                </div>
             </>
           ) : (
             <div style={{ textAlign: 'center', color: '#888', marginTop: '3rem' }}>
               <h3 style={{ color: '#ff4444' }}>Ficha Não Encontrada</h3>
               <p>Este token pode ter sido criado avulso ou removido do banco.</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}