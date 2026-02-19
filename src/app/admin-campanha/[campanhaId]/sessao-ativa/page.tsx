'use client';

import React, { useState, useEffect, use } from 'react';
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

// O Next.js 15 exige que desempacotemos os params com `use`
export default function ActiveSessionPage({ params }: { params: Promise<{ campanhaId: string }> }) {
  const { campanhaId } = use(params);

  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);

  // Estados principais da mesa
  const [tokens, setTokens] = useState<Token[]>([]);
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  const [mapUrl, setMapUrl] = useState('https://i.pinimg.com/originals/99/3a/05/993a059c03db26993952dc67b931920d.jpg');
  const [showGrid, setShowGrid] = useState(true);
  const [logs, setLogs] = useState<string[]>(["Sessão iniciada e conectada ao servidor."]);
  
  // Modos e Configurações
  const [interactionMode, setInteractionMode] = useState<'move' | 'attack' | 'heal' | 'down' | 'aoe_cone' | 'aoe_circle' | 'aoe_line'>('move');
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [gridScale, setGridScale] = useState(1.5); 
  const [combatActive, setCombatActive] = useState(false);

  // Modais
  const [actionModal, setActionModal] = useState<any>({ isOpen: false, type: null, targetId: null });
  const [aoeModal, setAoeModal] = useState<any>({ isOpen: false, targets: [], shape: '' });
  const [mobModalOpen, setMobModalOpen] = useState(false);
  const [sheetModalOpen, setSheetModalOpen] = useState(false);
  const [initModalOpen, setInitModalOpen] = useState(false);

  // --- BUSCA INICIAL DE DADOS (SUPABASE) ---
  useEffect(() => {
    if (campanhaId) fetchSessionData();
  }, [campanhaId]);

  async function fetchSessionData() {
    setLoading(true);
    
    // 1. Busca a Sessão da Campanha
    const { data: sessao } = await supabase
      .from('sessoes')
      .select('*')
      .eq('campanha_id', campanhaId)
      .single();

    if (sessao) {
      setSessionId(sessao.id);
      setMapUrl(sessao.map_url || 'https://i.pinimg.com/originals/99/3a/05/993a059c03db26993952dc67b931920d.jpg');
      setShowGrid(sessao.show_grid);
      setGridScale(sessao.grid_scale);
      setSnapToGrid(sessao.snap_to_grid);
      setCombatActive(sessao.combat_active);
      setCurrentTurnIndex(sessao.current_turn_index || 0);

      // 2. Busca todos os Tokens (Players, NPCs, Mobs) que estão na mesa!
      const { data: tokensDb } = await supabase
        .from('sessao_tokens')
        .select('*')
        .eq('sessao_id', sessao.id);

      if (tokensDb) {
        // Mapeia do banco para o formato visual que o React espera
        const mappedTokens: Token[] = tokensDb.map(t => ({
          id: t.id,
          name: t.nome,
          type: t.token_type === 'enemy' || t.token_type === 'mob' ? 'enemy' : 'player', // Mobs ficam vermelhos, Players/NPCs verdes
          img: t.img,
          x: t.map_x,
          y: t.map_y,
          hp: t.hp, maxHp: t.max_hp,
          cp: t.cp, maxCp: t.max_cp,
          level: t.level, class: t.class,
          stats: { atk: t.atk, def: t.def, esq: t.esq, cd: t.cd },
          initiative: t.initiative || 0,
          inCombat: t.in_combat,
          isDown: t.is_down
        }));

        // Ordena pela iniciativa
        mappedTokens.sort((a, b) => (b.initiative || 0) - (a.initiative || 0));
        setTokens(mappedTokens);
      }
    }
    setLoading(false);
  }

  const addLog = (msg: string) => setLogs(prev => [...prev, msg]);

  // --- LÓGICA DE EXIBIÇÃO ---
  const displayedTokens = combatActive 
    ? tokens.filter(t => t.inCombat !== false) 
    : tokens;

  const safeTurnIndex = currentTurnIndex >= displayedTokens.length ? 0 : currentTurnIndex;
  const currentCharacter = displayedTokens[safeTurnIndex];

  // --- CONTROLE DE TURNO E SALVAMENTO AUTOMÁTICO ---
  const syncTurnIndex = async (newIndex: number) => {
    setCurrentTurnIndex(newIndex);
    if (sessionId) {
      await supabase.from('sessoes').update({ current_turn_index: newIndex }).eq('id', sessionId);
    }
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
    let prevIndex = (safeTurnIndex - 1 + displayedTokens.length) % displayedTokens.length;
    syncTurnIndex(prevIndex);
  };

  const toggleCombatMode = async () => {
    const newState = !combatActive;
    setCombatActive(newState);
    setCurrentTurnIndex(0);
    
    if (sessionId) {
      await supabase.from('sessoes').update({ combat_active: newState, current_turn_index: 0 }).eq('id', sessionId);
    }
    
    if (newState) addLog("⚔️ Mestre iniciou o Combate!");
    else addLog("🕊️ Combate finalizado. Modo Exploração.");
  };

  // --- INTEGRAÇÃO COM O MAPA ---
  const handleMoveToken = async (id: string, x: number, y: number) => {
    // Atualiza na tela imediantamente (Otimista)
    setTokens(prev => prev.map(t => t.id === id ? { ...t, x, y } : t));
    // Salva no banco silenciosamente
    await supabase.from('sessao_tokens').update({ map_x: x, map_y: y }).eq('id', id);
  };

  const handleTokenAction = async (action: 'attack' | 'heal' | 'down', targetId: string) => {
    const target = tokens.find(t => t.id === targetId);
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
    const target = tokens.find(t => t.id === targetId);
    
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

  const handleAoEComplete = (targets: Token[], shape: string) => {
    if (targets.length === 0) {
      addLog(`💨 AoE falhou (0 alvos).`);
      return;
    }
    setAoeModal({ isOpen: true, targets, shape });
    setInteractionMode('move');
  };

  const handleAoEConfirm = async (damages: Record<string, number>) => {
    const hitNames: string[] = [];
    const newTokensState = [...tokens];

    for (const [id, dmg] of Object.entries(damages)) {
      if (dmg !== undefined && dmg > 0) {
        const idx = newTokensState.findIndex(t => t.id === id);
        if (idx !== -1) {
          hitNames.push(`${newTokensState[idx].name} (-${dmg})`);
          const newHp = Math.max(0, newTokensState[idx].hp - dmg);
          newTokensState[idx] = { ...newTokensState[idx], hp: newHp };
          // Atualiza o banco
          await supabase.from('sessao_tokens').update({ hp: newHp }).eq('id', id);
        }
      }
    }

    setTokens(newTokensState);
    if (hitNames.length > 0) addLog(`💥 AoE finalizado: ${hitNames.join(', ')}.`);
    setAoeModal({ ...aoeModal, isOpen: false });
  };

  const handleDeleteToken = async (id: string) => {
    const target = tokens.find(t => t.id === id);
    if (window.confirm(`Remover ${target?.name} permanentemente da mesa?`)) {
      setTokens(prev => prev.filter(t => t.id !== id));
      await supabase.from('sessao_tokens').delete().eq('id', id);
      addLog(`❌ ${target?.name} removido do mapa.`);
    }
  };

  const handleInitiativeConfirm = async (updates: { id: string, initiative: number, inCombat: boolean }[]) => {
    const newTokens = [...tokens];
    
    // Processamos os updates para a tela e disparamos para o banco
    for (const u of updates) {
      const idx = newTokens.findIndex(t => t.id === u.id);
      if (idx !== -1) {
        newTokens[idx] = { ...newTokens[idx], initiative: u.initiative, inCombat: u.inCombat };
        await supabase.from('sessao_tokens').update({ initiative: u.initiative, in_combat: u.inCombat }).eq('id', u.id);
      }
    }
    
    newTokens.sort((a, b) => (b.initiative || 0) - (a.initiative || 0));
    setTokens(newTokens);
    
    setInitModalOpen(false);
    setCombatActive(true); 
    syncTurnIndex(0);
    addLog("⚔️ Iniciativa definida! Combate iniciado.");
  };

  // INSERE O MOB DIRETAMENTE NO BANCO DE DADOS DA MESA!
  const handleAddMob = async (mobTemplate: any) => {
    if (!sessionId) return;

    const dbToken = {
      sessao_id: sessionId,
      token_type: 'mob',
      nome: mobTemplate.nome || mobTemplate.name,
      img: mobTemplate.img || 'https://via.placeholder.com/150',
      hp: mobTemplate.hp_base || mobTemplate.hp || 50,
      max_hp: mobTemplate.hp_base || mobTemplate.maxHp || 50,
      cp: mobTemplate.cp_base || 0,
      max_cp: mobTemplate.cp_base || 0,
      atk: mobTemplate.atk || 10,
      def: mobTemplate.def || 10,
      esq: mobTemplate.esq || 10,
      cd: mobTemplate.cd || 10,
      level: mobTemplate.nivel || 1,
      class: 'Monstro',
      map_x: 2, // Nasce pertinho do canto superior
      map_y: 2,
      in_combat: true,
      is_down: false,
      initiative: 0
    };

    const { data, error } = await supabase.from('sessao_tokens').insert(dbToken).select().single();
    
    if (!error && data) {
      const novoToken: Token = {
        id: data.id, name: data.nome, type: 'enemy', img: data.img,
        hp: data.hp, maxHp: data.max_hp, cp: data.cp, maxCp: data.max_cp,
        x: data.map_x, y: data.map_y, level: data.level, class: data.class,
        stats: { atk: data.atk, def: data.def, esq: data.esq, cd: data.cd },
        inCombat: data.in_combat, isDown: data.is_down, initiative: data.initiative
      };
      
      setTokens(prev => [...prev, novoToken]);
      addLog(`⚠️ ${data.nome} invocado no mapa!`);
    }
    setMobModalOpen(false);
  };

  const handleUrlChange = async () => {
    const url = window.prompt("Insira a URL da imagem do novo cenário:");
    if (url && sessionId) {
      setMapUrl(url);
      await supabase.from('sessoes').update({ map_url: url }).eq('id', sessionId);
      addLog("🗺️ O Mestre alterou o cenário.");
    }
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

      {/* TRACKER DE INICIATIVA NO TOPO LENDO A LISTA 'displayedTokens' */}
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
            onChangeMap={handleUrlChange} onAddLog={addLog}
            onOpenMobModal={() => setMobModalOpen(true)}
            combatActive={combatActive} 
            onToggleCombat={toggleCombatMode} 
            onOpenInitiative={() => setInitModalOpen(true)}
          />
        </aside>

        <div className={styles.centerCol}>
          <section className={`${styles.areaMap} ${styles[interactionMode]}`}>
            <BattleMap 
              imageUrl={mapUrl} showGrid={showGrid} 
              gridScale={gridScale} snapToGrid={snapToGrid}
              interactionMode={interactionMode as any}
              tokens={displayedTokens} 
              onMoveToken={handleMoveToken}
              onTokenAction={handleTokenAction}
              onAoEComplete={handleAoEComplete}
              onDeleteToken={handleDeleteToken}
            />
            
            {/* Modais */}
            <ActionModal 
              isOpen={actionModal.isOpen} type={actionModal.type}
              attackerName={currentCharacter?.name}
              targetName={tokens.find(t => t.id === actionModal.targetId)?.name || 'Alvo'}
              onClose={() => setActionModal({...actionModal, isOpen: false})}
              onConfirm={handleModalConfirm}
            />
            <AoEActionModal 
              isOpen={aoeModal.isOpen} targets={aoeModal.targets} shape={aoeModal.shape}
              onClose={() => setAoeModal({...aoeModal, isOpen: false})}
              onConfirm={handleAoEConfirm}
            />
            <MobSelectorModal 
              isOpen={mobModalOpen} onClose={() => setMobModalOpen(false)} onSelect={handleAddMob} 
            />
            <InitiativeModal 
              isOpen={initModalOpen} tokens={tokens} 
              onClose={() => setInitModalOpen(false)} onConfirm={handleInitiativeConfirm}
            />
          </section>
          
          {/* PAINEL INFERIOR DO TURNO */}
          <CurrentTurnPanel character={currentCharacter} />
        </div>

        <aside className={styles.areaLog}>
          <CombatLog logs={logs} />
        </aside>
      </div>
      
      <QuickSheetModal 
        isOpen={sheetModalOpen} onClose={() => setSheetModalOpen(false)} 
        characterName={currentCharacter?.name}
      />
    </main>
  );
}