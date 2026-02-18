'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
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

const INITIAL_CHARACTERS: Token[] = [
  { id: 'p1', name: 'Sasuke', type: 'player', img: 'https://imgs.search.brave.com/HIiVnoJFxGOfdSvGo_TvR6H0ETyr8ajAclCUTASKdp0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS50ZW5vci5jb20v/ZXlKak5EMUN6U2tB/QUFBTS9zYXN1a2Ut/dWNoaWhhLmdpZg.gif', hp: 80, maxHp: 100, cp: 150, maxCp: 180, x: 4, y: 6, level: 20, class: 'Vingador', stats: { atk: 22, def: 18, esq: 25, cd: 16 }, initiative: 0, inCombat: true, isDown: false },
  { id: 'p2', name: 'Naruto', type: 'player', img: 'https://imgs.search.brave.com/oeorTa8qLitRgjIz4ApXVeErnXx7JXBTS-Zow0OLM-4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzL2IwLzdl/LzNmL2IwN2UzZmYy/MTYzZDg0MGFlMTll/MmU2YWQ3OTYwMWY1/LmpwZw', hp: 180, maxHp: 200, cp: 450, maxCp: 500, x: 5, y: 7, level: 20, class: 'Hokage', stats: { atk: 20, def: 20, esq: 18, cd: 14 }, initiative: 0, inCombat: true, isDown: false },
];

export default function ActiveSessionPage() {
  const [tokens, setTokens] = useState<Token[]>(INITIAL_CHARACTERS);
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  const [mapUrl, setMapUrl] = useState('https://i.pinimg.com/originals/99/3a/05/993a059c03db26993952dc67b931920d.jpg');
  const [showGrid, setShowGrid] = useState(true);
  const [logs, setLogs] = useState<string[]>(["Sessão iniciada."]);
  
  // Modes & Settings
  const [interactionMode, setInteractionMode] = useState<'move' | 'attack' | 'heal' | 'down' | 'aoe_cone' | 'aoe_circle' | 'aoe_line'>('move');
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [gridScale, setGridScale] = useState(1.5); 
  const [combatActive, setCombatActive] = useState(false); // ESTADO PRINCIPAL DO COMBATE

  // Modais
  const [actionModal, setActionModal] = useState<any>({ isOpen: false, type: null, targetId: null });
  const [aoeModal, setAoeModal] = useState<any>({ isOpen: false, targets: [], shape: '' });
  const [mobModalOpen, setMobModalOpen] = useState(false);
  const [sheetModalOpen, setSheetModalOpen] = useState(false);
  const [initModalOpen, setInitModalOpen] = useState(false);

  const addLog = (msg: string) => setLogs(prev => [...prev, msg]);

  // --- LÓGICA DE EXIBIÇÃO ---
  // Se combate estiver ativo, filtra. Se não, mostra todo mundo.
  const displayedTokens = combatActive 
    ? tokens.filter(t => t.inCombat !== false) 
    : tokens;

  // Garante que o índice não estoure ao trocar de listas
  const safeTurnIndex = currentTurnIndex >= displayedTokens.length ? 0 : currentTurnIndex;
  const currentCharacter = displayedTokens[safeTurnIndex];

  // --- CONTROLE DE TURNO ---
  const nextTurn = () => {
    if (displayedTokens.length === 0) return;
    
    let nextIndex = (safeTurnIndex + 1) % displayedTokens.length;
    
    // Só pula turnos se estiver em combate real
    if (combatActive) {
      let loopCount = 0;
      while (displayedTokens[nextIndex].isDown && loopCount < displayedTokens.length) {
        addLog(`⏩ ${displayedTokens[nextIndex].name} pulou o turno (derrubado).`);
        nextIndex = (nextIndex + 1) % displayedTokens.length;
        loopCount++;
      }
    }
    
    setCurrentTurnIndex(nextIndex);
  };

  const prevTurn = () => {
    let prevIndex = (safeTurnIndex - 1 + displayedTokens.length) % displayedTokens.length;
    setCurrentTurnIndex(prevIndex);
  };

  // --- HANDLERS ---

  const toggleCombatMode = () => {
    const newState = !combatActive;
    setCombatActive(newState);
    setCurrentTurnIndex(0); // Reseta para o primeiro da lista nova
    
    if (newState) addLog("⚔️ Mestre iniciou o Combate!");
    else addLog("🕊️ Combate finalizado. Modo Exploração.");
  };

  const handleTokenAction = (action: 'attack' | 'heal' | 'down', targetId: string) => {
    const target = tokens.find(t => t.id === targetId);
    if (!target) return;

    if (action === 'down') {
      setTokens(prev => prev.map(t => t.id === targetId ? { ...t, isDown: !t.isDown } : t));
      addLog(target.isDown ? `♻️ ${target.name} levantou-se.` : `💀 ${target.name} foi DERRUBADO!`);
      setInteractionMode('move');
    } else {
      setActionModal({ isOpen: true, type: action, targetId });
    }
  };

  const handleAoEComplete = (targets: Token[], shape: string) => {
    if (targets.length === 0) {
      addLog(`💨 AoE falhou (0 alvos).`);
      return;
    }
    setAoeModal({ isOpen: true, targets, shape });
    setInteractionMode('move');
  };

  const handleAoEConfirm = (damages: Record<string, number>) => {
    const hitNames: string[] = [];
    setTokens(prev => prev.map(t => {
      const dmg = damages[t.id];
      if (dmg !== undefined && dmg > 0) {
        hitNames.push(`${t.name} (-${dmg})`);
        return { ...t, hp: Math.max(0, t.hp - dmg) };
      }
      return t;
    }));
    if (hitNames.length > 0) addLog(`💥 AoE finalizado: ${hitNames.join(', ')}.`);
    setAoeModal({ ...aoeModal, isOpen: false });
  };

  const handleModalConfirm = (value: number, isHit: boolean) => {
    const { type, targetId } = actionModal;
    const target = tokens.find(t => t.id === targetId);
    if (target && type) {
      if (type === 'attack') {
        if (isHit) {
          setTokens(prev => prev.map(t => t.id === targetId ? { ...t, hp: Math.max(0, t.hp - value) } : t));
          addLog(`⚔️ Acerto em ${target.name} (-${value} PV)!`);
        } else addLog(`🛡️ Ataque falhou em ${target.name}.`);
      } else if (type === 'heal') {
        setTokens(prev => prev.map(t => t.id === targetId ? { ...t, hp: Math.min(t.maxHp, t.hp + value) } : t));
        addLog(`💚 ${target.name} recuperou ${value} PV.`);
      }
    }
    setActionModal({ ...actionModal, isOpen: false });
    setInteractionMode('move');
  };

  const handleDeleteToken = (id: string) => {
    const target = tokens.find(t => t.id === id);
    if (window.confirm(`Remover ${target?.name} permanentemente?`)) {
      setTokens(prev => prev.filter(t => t.id !== id));
      addLog(`❌ ${target?.name} removido do mapa.`);
    }
  };

  const handleInitiativeConfirm = (updates: { id: string, initiative: number, inCombat: boolean }[]) => {
    setTokens(prev => {
      const newTokens = [...prev];
      updates.forEach(u => {
        const idx = newTokens.findIndex(t => t.id === u.id);
        if (idx !== -1) {
          newTokens[idx] = { ...newTokens[idx], initiative: u.initiative, inCombat: u.inCombat };
        }
      });
      newTokens.sort((a, b) => (b.initiative || 0) - (a.initiative || 0));
      return newTokens;
    });
    setInitModalOpen(false);
    setCombatActive(true); // Auto-inicia ao definir ordem
    setCurrentTurnIndex(0);
    addLog("⚔️ Iniciativa definida! Combate iniciado.");
  };

  const handleAddMob = (mobTemplate: any) => {
    const newId = `m_${Date.now()}`;
    const newToken: Token = {
      id: newId, name: mobTemplate.name, type: 'enemy', img: mobTemplate.img,
      hp: mobTemplate.hp, maxHp: mobTemplate.hp, cp: 0, maxCp: 0, level: 1, class: 'Mob',
      x: 5, y: 5, stats: { atk: 0, def: 0, esq: 0, cd: 0 },
      inCombat: true, isDown: false, initiative: 0
    };
    setTokens(prev => [...prev, newToken]);
    addLog(`⚠️ ${mobTemplate.name} invocado!`);
    setMobModalOpen(false);
  };

  const handleUrlChange = () => {
    const url = window.prompt("Insira a URL da imagem do novo mapa:");
    if (url) {
      setMapUrl(url);
      addLog("🗺️ O Mestre alterou o cenário.");
    }
  };

  return (
    <main className={styles.layout}>
      <header className={styles.topBar}>
        <Link href="/admin-campanha" className={styles.backLink}><ArrowLeft size={18} /> SAIR</Link>
        <h1 className={styles.title}>COMBATE ATIVO</h1>
        <div style={{width: 100}}></div>
      </header>

      <section className={styles.areaInitiative}>
        <InitiativeTracker 
          order={displayedTokens} // LISTA DINÂMICA (Combate ou Todos)
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
            onToggleCombat={toggleCombatMode} // Função de toggle corrigida
            onOpenInitiative={() => setInitModalOpen(true)}
          />
        </aside>

        <div className={styles.centerCol}>
          <section className={`${styles.areaMap} ${styles[interactionMode]}`}>
            <BattleMap 
              imageUrl={mapUrl} showGrid={showGrid} 
              gridScale={gridScale} snapToGrid={snapToGrid}
              interactionMode={interactionMode as any}
              tokens={displayedTokens} // LISTA DINÂMICA NO MAPA
              onMoveToken={(id, x, y) => setTokens(prev => prev.map(t => t.id === id ? { ...t, x, y } : t))}
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