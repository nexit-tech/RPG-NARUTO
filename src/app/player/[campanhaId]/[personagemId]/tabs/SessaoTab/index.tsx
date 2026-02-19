'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import styles from './styles.module.css';

import InitiativeTracker from '@/app/admin-campanha/[campanhaId]/sessao-ativa/components/InitiativeTracker';
import BattleMap, { Token } from '@/app/admin-campanha/[campanhaId]/sessao-ativa/components/BattleMap';
import CombatLog from '@/app/admin-campanha/[campanhaId]/sessao-ativa/components/CombatLog';
import CurrentTurnPanel from '@/app/admin-campanha/[campanhaId]/sessao-ativa/components/CurrentTurnPanel';
import QuickSheetModal from '@/app/admin-campanha/[campanhaId]/sessao-ativa/components/QuickSheetModal';

import PlayerControls from './components/PlayerControls';

interface SessaoTabProps {
  campanhaId: string;
  personagemId: string;
}

export default function SessaoTab({ campanhaId, personagemId }: SessaoTabProps) {
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const [interactionMode, setInteractionMode] = useState<'move' | 'attack' | 'heal' | 'aoe_cone' | 'aoe_circle' | 'aoe_line'>('move');

  const [tokens, setTokens] = useState<Token[]>([]);
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  const [mapUrl, setMapUrl] = useState('https://i.pinimg.com/originals/99/3a/05/993a059c03db26993952dc67b931920d.jpg');
  const [showGrid, setShowGrid] = useState(true);
  const [gridScale, setGridScale] = useState(1.0);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [combatActive, setCombatActive] = useState(false);
  
  const [logs, setLogs] = useState<string[]>(["Sessão conectada. Aguardando o Mestre..."]);
  const [sheetModalOpen, setSheetModalOpen] = useState(false);

  const channelRef = useRef<any>(null);

  useEffect(() => {
    if (campanhaId) fetchSessionData();
  }, [campanhaId]);

  useEffect(() => {
    if (!sessionId) return;

    const channel = supabase.channel(`mesa-${sessionId}`, {
      config: { broadcast: { self: false } }
    });

    channel
      .on('postgres_changes', { event: '*', schema: 'public', table: 'sessao_tokens', filter: `sessao_id=eq.${sessionId}` }, (payload) => {
        if (payload.eventType === 'INSERT') {
          const t = payload.new;
          setTokens(prev => {
            if (prev.some(existing => existing.id === t.id)) return prev;
            const newToken: Token = {
              id: t.id, originalId: t.personagem_id || t.npc_id || t.mob_id,
              originalTable: t.personagem_id ? 'players' : (t.npc_id ? 'npcs' : 'mobs'),
              name: t.nome, type: t.token_type === 'enemy' || t.token_type === 'mob' ? 'enemy' : 'player',
              img: t.img, x: t.map_x, y: t.map_y,
              hp: t.hp, maxHp: t.max_hp, cp: t.cp, maxCp: t.max_cp,
              level: t.level, class: t.class, 
              stats: { atk: t.atk, def: t.def, esq: t.esq, cd: t.cd },
              initiative: t.initiative || 0, inCombat: t.in_combat, isDown: t.is_down
            };
            return [...prev, newToken].sort((a, b) => (b.initiative || 0) - (a.initiative || 0));
          });
        } 
        else if (payload.eventType === 'UPDATE') {
          const t = payload.new;
          setTokens(prev => {
              const updated = prev.map(existing => existing.id === t.id ? {
                  ...existing, x: t.map_x, y: t.map_y, hp: t.hp, maxHp: t.max_hp, cp: t.cp, maxCp: t.max_cp,
                  inCombat: t.in_combat, isDown: t.is_down, initiative: t.initiative,
                  stats: { atk: t.atk, def: t.def, esq: t.esq, cd: t.cd }
              } : existing);
              return updated.sort((a, b) => (b.initiative || 0) - (a.initiative || 0));
          });
        } 
        else if (payload.eventType === 'DELETE') {
          setTokens(prev => prev.filter(existing => existing.id !== payload.old.id));
        }
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'sessoes', filter: `id=eq.${sessionId}` }, (payload) => {
        const s = payload.new;
        if (s.map_url) setMapUrl(s.map_url);
        setShowGrid(s.show_grid);
        setGridScale(s.grid_scale || 1.0);
        setSnapToGrid(s.snap_to_grid);
        setCombatActive(s.combat_active);
        setCurrentTurnIndex(s.current_turn_index || 0);
      })
      .on('broadcast', { event: 'token_drag' }, ({ payload }) => {
        setTokens(prev => prev.map(t => t.id === payload.id ? { ...t, x: payload.x, y: payload.y } : t));
      })
      .subscribe();

    channelRef.current = channel;

    return () => { supabase.removeChannel(channel); };
  }, [sessionId]);

  async function fetchSessionData() {
    try {
      setLoading(true);
      const { data: sessao } = await supabase.from('sessoes').select('*').eq('campanha_id', campanhaId).single();

      if (sessao) {
        setSessionId(sessao.id);
        if (sessao.map_url) setMapUrl(sessao.map_url);
        setShowGrid(sessao.show_grid);
        setGridScale(sessao.grid_scale || 1.0);
        setSnapToGrid(sessao.snap_to_grid);
        setCombatActive(sessao.combat_active);
        setCurrentTurnIndex(sessao.current_turn_index || 0);

        const { data: tokensDb } = await supabase.from('sessao_tokens').select('*').eq('sessao_id', sessao.id);

        if (tokensDb) {
          const mappedTokens: Token[] = tokensDb.map(t => ({
            id: t.id, originalId: t.personagem_id || t.npc_id || t.mob_id,
            originalTable: t.personagem_id ? 'players' : (t.npc_id ? 'npcs' : 'mobs'),
            name: t.nome || 'Desconhecido', type: t.token_type === 'enemy' || t.token_type === 'mob' ? 'enemy' : 'player',
            img: t.img || 'https://via.placeholder.com/150', x: t.map_x || 0, y: t.map_y || 0,
            hp: t.hp || 0, maxHp: t.max_hp || 1, cp: t.cp || 0, maxCp: t.max_cp || 1,
            level: t.level || 1, class: t.class || 'N/A', 
            stats: { atk: t.atk || 0, def: t.def || 0, esq: t.esq || 0, cd: t.cd || 0 },
            initiative: t.initiative || 0, inCombat: !!t.in_combat, isDown: !!t.is_down
          }));
          setTokens(mappedTokens.sort((a, b) => (b.initiative || 0) - (a.initiative || 0)));
        }
      }
    } catch (err) {
      console.error("Erro fatal:", err);
    } finally {
      setLoading(false);
    }
  }

  const safeTokens = tokens || [];
  const myToken = safeTokens.find(t => t.originalId === personagemId);
  
  // REGRA: Nathan nunca some do combate
  const displayedTokens = combatActive 
    ? safeTokens.filter(t => t.inCombat !== false || t.originalId === personagemId) 
    : safeTokens;

  const safeTurnIndex = (displayedTokens.length > 0 && currentTurnIndex < displayedTokens.length) ? currentTurnIndex : 0;

  // Lógica de Travamento de Turno
  const isMyTurn = displayedTokens[safeTurnIndex]?.originalId === personagemId;
  const canAct = !combatActive || isMyTurn;

  const handleTokenDrag = (id: string, x: number, y: number) => {
    if (!canAct) return;
    const tokenDragged = safeTokens.find(t => t.id === id);
    if (tokenDragged?.originalId !== personagemId) return;

    setTokens(prev => prev.map(t => t.id === id ? { ...t, x, y } : t));
    if (channelRef.current) {
      channelRef.current.send({ type: 'broadcast', event: 'token_drag', payload: { id, x, y } });
    }
  };

  const handleMoveToken = async (id: string, x: number, y: number) => {
    if (!canAct) return;
    const tokenMoved = safeTokens.find(t => t.id === id);
    if (tokenMoved?.originalId !== personagemId) return;

    setTokens(prev => prev.map(t => t.id === id ? { ...t, x, y } : t));
    await supabase.from('sessao_tokens').update({ map_x: x, map_y: y }).eq('id', id);
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Loader2 size={50} className="animate-spin" color="#ff6600" />
        <p>Conectando ao Campo de Batalha...</p>
      </div>
    );
  }

  return (
    <div className={styles.layout}>
      
      <section className={styles.areaInitiative}>
        <InitiativeTracker 
          order={displayedTokens} 
          currentIndex={safeTurnIndex} 
          onNext={() => {}} 
          onPrev={() => {}} 
          onOpenSheet={() => setSheetModalOpen(true)}
        />
      </section>

      <div className={styles.mainGrid}>
        
        <aside className={styles.areaControls}>
          <PlayerControls 
            interactionMode={interactionMode}
            setInteractionMode={setInteractionMode}
            combatActive={combatActive}
            isMyTurn={isMyTurn}
            onOpenSheet={() => setSheetModalOpen(true)} 
          />
        </aside>

        <div className={styles.centerCol}>
          <section className={`${styles.areaMap} move`}>
            <BattleMap 
              imageUrl={mapUrl} showGrid={showGrid} 
              gridScale={gridScale} snapToGrid={snapToGrid}
              interactionMode={interactionMode}
              tokens={displayedTokens} 
              onMoveToken={handleMoveToken}
              onTokenDrag={handleTokenDrag} 
              onTokenAction={() => {}} 
              onAoEComplete={() => {}} 
              onDeleteToken={async () => {}} 
              onMapClick={async () => {}} 
            />
          </section>
          
          {myToken && <CurrentTurnPanel character={myToken} />}
        </div>

        <aside className={styles.areaLog}>
          <CombatLog logs={logs} />
        </aside>

      </div>

      <QuickSheetModal 
        campanhaId={campanhaId}
        isOpen={sheetModalOpen} 
        onClose={() => setSheetModalOpen(false)} 
        token={myToken} 
      />
    </div>
  );
}