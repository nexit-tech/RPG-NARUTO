'use client';

import React, { useState, useEffect, use, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import styles from './styles.module.css';

// Components
import InitiativeTracker from './components/InitiativeTracker';
import BattleMap, { Token } from './components/BattleMap';
import CombatLog from './components/CombatLog';
import DmControls from './components/DmControls';
import CurrentTurnPanel from './components/CurrentTurnPanel';
import ActionModal from './components/ActionModal';
import MobSelectorModal from './components/MobSelectorModal';
import AoEActionModal from './components/AoEActionModal';
import QuickSheetModal from './components/QuickSheetModal';
import InitiativeModal from './components/InitiativeModal';

export default function ActiveSessionPage({ params }: { params: Promise<{ campanhaId: string }> }) {
  // Desempacotamento seguro dos params (Exigência do Next 15)
  const resolvedParams = use(params);
  const campanhaId = resolvedParams?.campanhaId;

  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);

  // Estados principais da mesa
  const [tokens, setTokens] = useState<Token[]>([]);
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  const [mapUrl, setMapUrl] = useState('https://i.pinimg.com/originals/99/3a/05/993a059c03db26993952dc67b931920d.jpg');
  const [showGrid, setShowGrid] = useState(true);
  const [logs, setLogs] = useState<string[]>(["Sessão iniciada e conectada ao servidor."]);
  
  // Modos e Configurações
  const [interactionMode, setInteractionMode] = useState<'move' | 'attack' | 'heal' | 'down' | 'aoe_cone' | 'aoe_circle' | 'aoe_line' | 'spawn'>('move');
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [gridScale, setGridScale] = useState(1.0); 
  const [combatActive, setCombatActive] = useState(false);

  // Estado para posicionar Mob/NPC no mapa
  const [pendingSpawn, setPendingSpawn] = useState<{ dbTemplate: any, type: 'mob' | 'npc' } | null>(null);

  // Modais
  const [actionModal, setActionModal] = useState<any>({ isOpen: false, type: null, targetId: null });
  const [aoeModal, setAoeModal] = useState<any>({ isOpen: false, targets: [], shape: '' });
  const [mobModalOpen, setMobModalOpen] = useState(false);
  const [sheetModalOpen, setSheetModalOpen] = useState(false);
  const [initModalOpen, setInitModalOpen] = useState(false);

  // Canal de Realtime
  const channelRef = useRef<any>(null);

  // --- BUSCA INICIAL DE DADOS E REALTIME ---
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
              level: t.level, class: t.class, stats: { atk: t.atk, def: t.def, esq: t.esq, cd: t.cd },
              initiative: t.initiative || 0, inCombat: t.in_combat, isDown: t.is_down
            };
            return [...prev, newToken].sort((a, b) => (b.initiative || 0) - (a.initiative || 0));
          });
        } 
        else if (payload.eventType === 'UPDATE') {
          const t = payload.new;
          setTokens(prev => {
              const updated = prev.map(existing => existing.id === t.id ? {
                  ...existing, x: t.map_x, y: t.map_y, hp: t.hp, cp: t.cp,
                  inCombat: t.in_combat, isDown: t.is_down, initiative: t.initiative
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
        setMapUrl(s.map_url);
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

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId]);

  async function fetchSessionData() {
    setLoading(true);
    
    const { data: sessao, error } = await supabase.from('sessoes').select('*').eq('campanha_id', campanhaId).single();

    if (sessao && !error) {
      setSessionId(sessao.id);
      setMapUrl(sessao.map_url || 'https://i.pinimg.com/originals/99/3a/05/993a059c03db26993952dc67b931920d.jpg');
      setShowGrid(sessao.show_grid);
      setGridScale(sessao.grid_scale || 1.0);
      setSnapToGrid(sessao.snap_to_grid);
      setCombatActive(sessao.combat_active);
      setCurrentTurnIndex(sessao.current_turn_index || 0);

      const { data: tokensDb } = await supabase.from('sessao_tokens').select('*').eq('sessao_id', sessao.id);

      if (tokensDb) {
        const mappedTokens: Token[] = tokensDb.map(t => {
          let origId = t.personagem_id || t.npc_id || t.mob_id || null;
          let origTable = t.personagem_id ? 'players' : (t.npc_id ? 'npcs' : 'mobs');

          return {
            id: t.id,
            originalId: origId,
            originalTable: origTable as any,
            name: t.nome || 'Desconhecido',
            type: t.token_type === 'enemy' || t.token_type === 'mob' ? 'enemy' : 'player',
            img: t.img || 'https://via.placeholder.com/150',
            x: t.map_x || 0,
            y: t.map_y || 0,
            hp: t.hp || 0, maxHp: t.max_hp || 1, cp: t.cp || 0, maxCp: t.max_cp || 1,
            level: t.level || 1, class: t.class || 'N/A', 
            stats: { atk: t.atk || 0, def: t.def || 0, esq: t.esq || 0, cd: t.cd || 0 },
            initiative: t.initiative || 0, inCombat: !!t.in_combat, isDown: !!t.is_down
          };
        });

        mappedTokens.sort((a, b) => (b.initiative || 0) - (a.initiative || 0));
        setTokens(mappedTokens);
      }
    }
    setLoading(false);
  }

  const addLog = (msg: string) => setLogs(prev => [...prev, msg]);

  // Segurança extra: Garante que os arrays não fiquem undefined
  const safeTokens = tokens || [];
  const displayedTokens = combatActive 
    ? safeTokens.filter(t => t.inCombat !== false) 
    : safeTokens;

  // Previne leitura de index vazio se a lista de tokens estiver vazia
  const safeTurnIndex = (displayedTokens.length > 0 && currentTurnIndex < displayedTokens.length) 
    ? currentTurnIndex 
    : 0;
  
  const currentCharacter = displayedTokens.length > 0 ? displayedTokens[safeTurnIndex] : null;

  // --- AÇÕES DO TURNO ---
  const syncTurnIndex = async (newIndex: number) => {
    setCurrentTurnIndex(newIndex);
    if (sessionId) await supabase.from('sessoes').update({ current_turn_index: newIndex }).eq('id', sessionId);
  };

  const nextTurn = () => {
    if (displayedTokens.length === 0) return;
    let nextIndex = (safeTurnIndex + 1) % displayedTokens.length;
    if (combatActive) {
      let loopCount = 0;
      while (displayedTokens[nextIndex]?.isDown && loopCount < displayedTokens.length) {
        addLog(`⏩ ${displayedTokens[nextIndex].name} pulou o turno (derrubado).`);
        nextIndex = (nextIndex + 1) % displayedTokens.length;
        loopCount++;
      }
    }
    syncTurnIndex(nextIndex);
  };

  const prevTurn = () => {
    if (displayedTokens.length === 0) return;
    let prevIndex = (safeTurnIndex - 1 + displayedTokens.length) % displayedTokens.length;
    syncTurnIndex(prevIndex);
  };

  const toggleCombatMode = async () => {
    const newState = !combatActive;
    setCombatActive(newState);
    setCurrentTurnIndex(0);
    if (sessionId) await supabase.from('sessoes').update({ combat_active: newState, current_turn_index: 0 }).eq('id', sessionId);
    if (newState) addLog("⚔️ Mestre iniciou o Combate!");
    else addLog("🕊️ Combate finalizado. Modo Exploração.");
  };

  // --- AÇÕES DO MAPA ---
  const handleTokenDrag = (id: string, x: number, y: number) => {
    setTokens(prev => prev.map(t => t.id === id ? { ...t, x, y } : t));
    if (channelRef.current) {
      channelRef.current.send({ type: 'broadcast', event: 'token_drag', payload: { id, x, y } });
    }
  };

  const handleMoveToken = async (id: string, x: number, y: number) => {
    setTokens(prev => prev.map(t => t.id === id ? { ...t, x, y } : t));
    await supabase.from('sessao_tokens').update({ map_x: x, map_y: y }).eq('id', id);
  };

  const handleTokenAction = async (action: 'attack' | 'heal' | 'down', targetId: string) => {
    const target = safeTokens.find(t => t.id === targetId);
    if (!target) return;

    if (action === 'down') {
      const newStatus = !target.isDown;
      setTokens(prev => prev.map(t => t.id === targetId ? { ...t, isDown: newStatus } : t));
      await supabase.from('sessao_tokens').update({ is_down: newStatus }).eq('id', targetId);
      addLog(newStatus ? `💀 ${target.name} foi DERRUBADO!` : `♻️ ${target.name} levantou-se.`);
      setInteractionMode('move');
    } else {
      setActionModal({ isOpen: true, type: action, targetId });
    }
  };

  const handleModalConfirm = async (value: number, isHit: boolean) => {
    const { type, targetId } = actionModal;
    const target = safeTokens.find(t => t.id === targetId);
    
    if (target && type) {
      let newHp = target.hp;
      if (type === 'attack') {
        if (isHit) {
          newHp = Math.max(0, target.hp - value);
          addLog(`⚔️ Acerto em ${target.name} (-${value} PV)!`);
        } else addLog(`🛡️ Ataque falhou em ${target.name}.`);
      } else if (type === 'heal') {
        newHp = Math.min(target.maxHp, target.hp + value);
        addLog(`💚 ${target.name} recuperou ${value} PV.`);
      }

      setTokens(prev => prev.map(t => t.id === targetId ? { ...t, hp: newHp } : t));
      await supabase.from('sessao_tokens').update({ hp: newHp }).eq('id', targetId);
    }
    
    setActionModal({ ...actionModal, isOpen: false });
    setInteractionMode('move');
  };

  // --- SPAWN (INVOCAÇÃO) COM CLIQUE ---
  const handleSelectEntityToSpawn = (dbTemplate: any, type: 'mob' | 'npc') => {
    setPendingSpawn({ dbTemplate, type });
    setInteractionMode('spawn');
    setMobModalOpen(false);
    addLog(`📍 Clique no mapa para invocar: ${dbTemplate.nome}`);
  };

  const executeSpawn = async (x: number, y: number) => {
    if (!sessionId || !pendingSpawn) return;
    const { dbTemplate, type } = pendingSpawn;
    
    const hpMax = dbTemplate.max_hp || dbTemplate.hp_base || 100;
    const cpMax = dbTemplate.max_cp || dbTemplate.cp_base || 100;

    const dbToken = {
      sessao_id: sessionId,
      token_type: type,
      npc_id: type === 'npc' ? dbTemplate.id : null,
      mob_id: type === 'mob' ? dbTemplate.id : null,
      nome: dbTemplate.nome || 'Desconhecido',
      img: dbTemplate.img || 'https://via.placeholder.com/150',
      hp: hpMax, max_hp: hpMax,
      cp: cpMax, max_cp: cpMax,
      atk: dbTemplate.atk || 10, def: dbTemplate.def || 10,
      esq: dbTemplate.esq || 10, cd: dbTemplate.cd || 10,
      level: dbTemplate.nivel || 1,
      class: type === 'mob' ? (dbTemplate.tipo || 'Monstro') : 'Ninja',
      map_x: x, map_y: y, 
      in_combat: true, is_down: false, initiative: 0
    };

    const { data, error } = await supabase.from('sessao_tokens').insert(dbToken).select().single();
    if (!error && data) {
      addLog(`⚠️ ${data.nome} invocado no mapa!`);
    }
    
    setInteractionMode('move');
    setPendingSpawn(null);
  };

  if (loading) {
    return (
      <main className={styles.layout} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ textAlign: 'center', color: '#ff6600' }}>
          <Loader2 size={60} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
          <h2 style={{ marginTop: '1rem', color: 'white' }}>Iniciando o Servidor do Mapa...</h2>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.layout}>
      <header className={styles.topBar}>
        <Link href={`/admin-campanha/${campanhaId}`} className={styles.backLink}>
          <ArrowLeft size={18} /> SAIR
        </Link>
        <h1 className={styles.title}>MESA VIRTUAL - SESSÃO ATIVA</h1>
        <div style={{width: 100}}></div>
      </header>

      <section className={styles.areaInitiative}>
        <InitiativeTracker 
          order={displayedTokens} 
          currentIndex={safeTurnIndex} 
          onNext={nextTurn} 
          onPrev={prevTurn} 
          onOpenSheet={() => setSheetModalOpen(true)}
        />
      </section>

      <div className={styles.mainGrid}>
        <aside className={styles.areaControls}>
          <DmControls 
            interactionMode={interactionMode} setInteractionMode={setInteractionMode}
            snapToGrid={snapToGrid} setSnapToGrid={setSnapToGrid}
            gridScale={gridScale} setGridScale={setGridScale}
            onToggleGrid={() => setShowGrid(!showGrid)} gridEnabled={showGrid}
            onChangeMap={() => {
              const url = window.prompt("Insira a URL da imagem do novo cenário:");
              if (url && sessionId) {
                setMapUrl(url);
                supabase.from('sessoes').update({ map_url: url }).eq('id', sessionId);
                addLog("🗺️ O Mestre alterou o cenário.");
              }
            }} 
            onAddLog={addLog}
            onOpenMobModal={() => setMobModalOpen(true)}
            combatActive={combatActive} 
            onToggleCombat={toggleCombatMode} 
            onOpenInitiative={() => setInitModalOpen(true)}
          />
        </aside>

        <div className={styles.centerCol}>
          <section className={`${styles.areaMap} ${styles[interactionMode] || ''}`}>
            <BattleMap 
              imageUrl={mapUrl} showGrid={showGrid} 
              gridScale={gridScale} snapToGrid={snapToGrid}
              interactionMode={interactionMode as any}
              tokens={displayedTokens} 
              onMoveToken={handleMoveToken}
              onTokenDrag={handleTokenDrag} 
              onTokenAction={handleTokenAction}
              onAoEComplete={(targets, shape) => {
                if (targets.length === 0) return addLog(`💨 AoE falhou (0 alvos).`);
                setAoeModal({ isOpen: true, targets, shape });
                setInteractionMode('move');
              }}
              onDeleteToken={async (id) => {
                const target = safeTokens.find(t => t.id === id);
                if (window.confirm(`Remover ${target?.name || 'token'} permanentemente da mesa?`)) {
                  setTokens(prev => prev.filter(t => t.id !== id));
                  await supabase.from('sessao_tokens').delete().eq('id', id);
                  addLog(`❌ ${target?.name || 'Token'} removido do mapa.`);
                }
              }}
              onMapClick={executeSpawn}
            />
            
            <ActionModal 
              isOpen={actionModal.isOpen} type={actionModal.type}
              attackerName={currentCharacter?.name || 'Desconhecido'}
              targetName={safeTokens.find(t => t.id === actionModal.targetId)?.name || 'Alvo'}
              onClose={() => setActionModal({...actionModal, isOpen: false})}
              onConfirm={handleModalConfirm}
            />
            <AoEActionModal 
              isOpen={aoeModal.isOpen} targets={aoeModal.targets} shape={aoeModal.shape}
              onClose={() => setAoeModal({...aoeModal, isOpen: false})}
              onConfirm={handleAoEConfirm}
            />
            
            <MobSelectorModal 
              campanhaId={campanhaId}
              isOpen={mobModalOpen} 
              onClose={() => setMobModalOpen(false)} 
              onSelect={handleSelectEntityToSpawn} 
            />
          </section>
          
          {currentCharacter && <CurrentTurnPanel character={currentCharacter as Token} />}
        </div>

        <aside className={styles.areaLog}>
          <CombatLog logs={logs} />
        </aside>
      </div>
      
      <QuickSheetModal 
        campanhaId={campanhaId}
        isOpen={sheetModalOpen} 
        onClose={() => setSheetModalOpen(false)} 
        token={currentCharacter}
      />
    </main>
  );
}