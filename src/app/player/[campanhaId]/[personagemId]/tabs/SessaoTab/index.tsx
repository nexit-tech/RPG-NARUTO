'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

// Reutiliza TODOS os componentes do admin
import InitiativeTracker from '@/app/admin-campanha/[campanhaId]/sessao-ativa/components/InitiativeTracker';
import BattleMap, { Token } from '@/app/admin-campanha/[campanhaId]/sessao-ativa/components/BattleMap';
import CombatLog from '@/app/admin-campanha/[campanhaId]/sessao-ativa/components/CombatLog';
import CurrentTurnPanel from '@/app/admin-campanha/[campanhaId]/sessao-ativa/components/CurrentTurnPanel';
import ActionModal from '@/app/admin-campanha/[campanhaId]/sessao-ativa/components/ActionModal';
import AoEActionModal from '@/app/admin-campanha/[campanhaId]/sessao-ativa/components/AoEActionModal';
import InitiativeModal from '@/app/admin-campanha/[campanhaId]/sessao-ativa/components/InitiativeModal';
import QuickSheetModal from '@/app/admin-campanha/[campanhaId]/sessao-ativa/components/QuickSheetModal';

// Painel de comandos exclusivo do player (sem Derrubar e sem Mapa & Grid)
import PlayerControls from './components/PlayerControls';

import styles from './styles.module.css';

// Mock idêntico ao admin — no futuro virá do banco em tempo real
const INITIAL_CHARACTERS: Token[] = [
  {
    id: 'p1', name: 'Sasuke', type: 'player',
    img: 'https://imgs.search.brave.com/HIiVnoJFxGOfdSvGo_TvR6H0ETyr8ajAclCUTASKdp0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS50ZW5vci5jb20v/ZXlKak5EMUN6U2tB/QUFBTS9zYXN1a2Ut/dWNoaWhhLmdpZg.gif',
    hp: 80, maxHp: 100, cp: 150, maxCp: 180,
    x: 4, y: 6, level: 20, class: 'Vingador',
    stats: { atk: 22, def: 18, esq: 25, cd: 16 },
    initiative: 0, inCombat: true, isDown: false,
  },
  {
    id: 'p2', name: 'Naruto', type: 'player',
    img: 'https://imgs.search.brave.com/oeorTa8qLitRgjIz4ApXVeErnXx7JXBTS-Zow0OLM-4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzL2IwLzdl/LzNmL2IwN2UzZmYy/MTYzZDg0MGFlMTll/MmU2YWQ3OTYwMWY1/LmpwZw',
    hp: 180, maxHp: 200, cp: 450, maxCp: 500,
    x: 5, y: 7, level: 20, class: 'Hokage',
    stats: { atk: 20, def: 20, esq: 18, cd: 14 },
    initiative: 0, inCombat: true, isDown: false,
  },
];

export default function SessaoTab() {
  const [tokens, setTokens] = useState<Token[]>(INITIAL_CHARACTERS);
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  const [mapUrl] = useState('https://i.pinimg.com/originals/99/3a/05/993a059c03db26993952dc67b931920d.jpg');
  const [showGrid] = useState(true);
  const [logs, setLogs] = useState<string[]>(['Sessão iniciada.']);
  const [combatActive] = useState(false); // Player não controla isso

  const [interactionMode, setInteractionMode] = useState<
    'move' | 'attack' | 'heal' | 'aoe_cone' | 'aoe_circle' | 'aoe_line'
  >('move');

  // Modais
  const [actionModal, setActionModal] = useState<any>({ isOpen: false, type: null, targetId: null });
  const [aoeModal, setAoeModal] = useState<any>({ isOpen: false, targets: [], shape: '' });
  const [initModalOpen, setInitModalOpen] = useState(false);
  const [sheetModalOpen, setSheetModalOpen] = useState(false);

  const addLog = (msg: string) => setLogs(prev => [...prev, msg]);

  const displayedTokens = tokens.filter(t => t.inCombat !== false);
  const safeTurnIndex = currentTurnIndex >= displayedTokens.length ? 0 : currentTurnIndex;
  const currentCharacter = displayedTokens[safeTurnIndex];

  const nextTurn = () => {
    if (displayedTokens.length === 0) return;
    setCurrentTurnIndex((safeTurnIndex + 1) % displayedTokens.length);
  };

  const prevTurn = () => {
    setCurrentTurnIndex((safeTurnIndex - 1 + displayedTokens.length) % displayedTokens.length);
  };

  const handleTokenAction = (action: 'attack' | 'heal' | 'down', targetId: string) => {
    // Player não pode derrubar — ignora silenciosamente
    if (action === 'down') return;
    setActionModal({ isOpen: true, type: action, targetId });
  };

  const handleAoEComplete = (targets: Token[], shape: string) => {
    if (targets.length === 0) { addLog('💨 AoE falhou (0 alvos).'); return; }
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
    if (hitNames.length > 0) addLog(`💥 AoE: ${hitNames.join(', ')}.`);
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
        } else {
          addLog(`🛡️ Ataque falhou em ${target.name}.`);
        }
      } else if (type === 'heal') {
        setTokens(prev => prev.map(t => t.id === targetId ? { ...t, hp: Math.min(t.maxHp, t.hp + value) } : t));
        addLog(`💚 ${target.name} recuperou ${value} PV.`);
      }
    }
    setActionModal({ ...actionModal, isOpen: false });
    setInteractionMode('move');
  };

  const handleInitiativeConfirm = (updates: { id: string; initiative: number; inCombat: boolean }[]) => {
    setTokens(prev => {
      const next = [...prev];
      updates.forEach(u => {
        const idx = next.findIndex(t => t.id === u.id);
        if (idx !== -1) next[idx] = { ...next[idx], initiative: u.initiative, inCombat: u.inCombat };
      });
      next.sort((a, b) => (b.initiative || 0) - (a.initiative || 0));
      return next;
    });
    setInitModalOpen(false);
    setCurrentTurnIndex(0);
    addLog('📋 Ordem de turno atualizada.');
  };

  return (
    <main className={styles.layout}>
      {/* TOPO DE INICIATIVA */}
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
        {/* PAINEL ESQUERDO — PlayerControls */}
        <aside className={styles.areaControls}>
          <PlayerControls
            interactionMode={interactionMode}
            setInteractionMode={setInteractionMode}
            combatActive={combatActive}
            onOpenInitiative={() => setInitModalOpen(true)}
          />
        </aside>

        {/* CENTRO — Mapa */}
        <div className={styles.centerCol}>
          <section className={styles.areaMap}>
            <BattleMap
              imageUrl={mapUrl}
              showGrid={showGrid}
              gridScale={1.5}
              snapToGrid={true}
              interactionMode={interactionMode as any}
              tokens={displayedTokens}
              onMoveToken={(id, x, y) =>
                setTokens(prev => prev.map(t => t.id === id ? { ...t, x, y } : t))
              }
              onTokenAction={handleTokenAction}
              onAoEComplete={handleAoEComplete}
              onDeleteToken={() => {}} // Player não deleta tokens
            />

            {/* Modais */}
            <ActionModal
              isOpen={actionModal.isOpen}
              type={actionModal.type}
              attackerName={currentCharacter?.name}
              targetName={tokens.find(t => t.id === actionModal.targetId)?.name || 'Alvo'}
              onClose={() => setActionModal({ ...actionModal, isOpen: false })}
              onConfirm={handleModalConfirm}
            />
            <AoEActionModal
              isOpen={aoeModal.isOpen}
              targets={aoeModal.targets}
              shape={aoeModal.shape}
              onClose={() => setAoeModal({ ...aoeModal, isOpen: false })}
              onConfirm={handleAoEConfirm}
            />
            <InitiativeModal
              isOpen={initModalOpen}
              tokens={tokens}
              onClose={() => setInitModalOpen(false)}
              onConfirm={handleInitiativeConfirm}
            />
          </section>

          <CurrentTurnPanel character={currentCharacter} />
        </div>

        {/* DIREITA — Log */}
        <aside className={styles.areaLog}>
          <CombatLog logs={logs} />
        </aside>
      </div>

      <QuickSheetModal
        isOpen={sheetModalOpen}
        onClose={() => setSheetModalOpen(false)}
        characterName={currentCharacter?.name}
      />
    </main>
  );
}