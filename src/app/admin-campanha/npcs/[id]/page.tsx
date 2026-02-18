"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import styles from './styles.module.css';

// Importando os componentes diretos da pasta de Players (O reaproveitamento genial!)
import SheetHeader from '../../players/[id]/components/SheetHeader';
import PageOne from '../../players/[id]/components/PageOne';
import PageTwo from '../../players/[id]/components/PageTwo';
import PageThree from '../../players/[id]/components/PageThree';

// MOLDE COMPLETO (Agora com as Perícias preenchidas para não ficar em branco!)
const BLANK_NPC_DATA = {
  info: { 
    name: "Novo NPC", clan: "Sem Clã", img: "https://via.placeholder.com/140",
    shinobiLevel: 1, campaignLevel: 1, age: 20, gender: "Indefinido",
    originVillage: "-", activeVillage: "-", alignment: "-", heightWeight: "-"
  },
  attributes: { for: 0, des: 0, con: 0, int: 0, per: 0, car: 0 },
  combatStats: {
    hp: { base: 10, other: 0 },
    cp: { base: 10, other: 0 },
    st: { base: 10, other: 0 }
  },
  defenses: {
    ca: { armor: 0, bonus: 0 },
    bloqueio: { base: 0, other: 0 }
  },
  bases: {
    cc: { base: 0, other: 0, attrKey: 'for' },
    cd: { base: 0, other: 0, attrKey: 'des' },
    esquiva: { base: 0, other: 0, attrKey: 'agi' },
    lim: { base: 0, other: 0, attrKey: 'per' }
  },
  social: [
    { name: 'Intimidação', pontos: 0, other: 0, attrKey: 'car' },
    { name: 'Persuasão', pontos: 0, other: 0, attrKey: 'car' }
  ],
  // Array de Perícias agora preenchido para aparecer na tela! (Pode ajustar os nomes se usar outros)
  skills: [
    { name: 'Acrobacia', pontos: 0, attr: 'DES', other: 0 },
    { name: 'Atletismo', pontos: 0, attr: 'FOR', other: 0 },
    { name: 'Conhecimento', pontos: 0, attr: 'INT', other: 0 },
    { name: 'Furtividade', pontos: 0, attr: 'DES', other: 0 },
    { name: 'Iniciativa', pontos: 0, attr: 'DES', other: 0 },
    { name: 'Intuição', pontos: 0, attr: 'PER', other: 0 },
    { name: 'Investigação', pontos: 0, attr: 'INT', other: 0 },
    { name: 'Medicina', pontos: 0, attr: 'INT', other: 0 },
    { name: 'Percepção', pontos: 0, attr: 'PER', other: 0 },
    { name: 'Sobrevivência', pontos: 0, attr: 'PER', other: 0 }
  ],
  inventory: [],
  powers: [],
  economy: { ryos: 0, ppTotal: 0, ppGastos: 0, comp: '0 / 0' },
  aptitudes: [],
  attacks: [],
  jutsus: []
};

export default function NpcSheetPage() {
  const router = useRouter();
  
  const [npcData, setNpcData] = useState<any>(BLANK_NPC_DATA);
  const [activeTab, setActiveTab] = useState(1);

  const handleDataChange = (newData: any) => {
    setNpcData(newData);
  };

  // Função auxiliar para deixar o menu de abas elegante
  const getTabStyle = (tabNumber: number) => ({
    flex: 1,
    padding: '12px 20px',
    background: activeTab === tabNumber ? '#ff6600' : '#111',
    color: activeTab === tabNumber ? '#000' : '#888',
    border: '1px solid #333',
    borderBottom: activeTab === tabNumber ? 'none' : '1px solid #333',
    borderRadius: '8px 8px 0 0',
    fontWeight: 900,
    fontSize: '0.9rem',
    cursor: 'pointer',
    letterSpacing: '1px',
    textTransform: 'uppercase' as const,
    transition: 'all 0.2s ease-in-out',
  });

  return (
    <div className={styles.container || ''} style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Botão de Voltar */}
      <button 
        onClick={() => router.push('/admin-campanha/npcs')}
        style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: '#ff6600', cursor: 'pointer', marginBottom: '1.5rem', fontWeight: 'bold' }}
      >
        <ArrowLeft size={20} /> VOLTAR PARA BINGO BOOK
      </button>

      {/* CABEÇALHO */}
      <SheetHeader data={npcData} onChange={handleDataChange} />

      {/* SELETOR DE ABAS (Estilo Ninja Naruto) */}
      <div style={{ display: 'flex', gap: '4px', marginTop: '2rem', borderBottom: '2px solid #ff6600' }}>
        <button style={getTabStyle(1)} onClick={() => setActiveTab(1)}>STATUS</button>
        <button style={getTabStyle(2)} onClick={() => setActiveTab(2)}>TÉCNICA</button>
        <button style={getTabStyle(3)} onClick={() => setActiveTab(3)}>GRIMÓRIO</button>
      </div>

      {/* ÁREA DA PÁGINA */}
      <div style={{ background: '#0a0a0a', padding: '2rem 1rem', border: '1px solid #333', borderTop: 'none', borderRadius: '0 0 8px 8px' }}>
        {activeTab === 1 && <PageOne data={npcData} onChange={handleDataChange} />}
        {activeTab === 2 && <PageTwo data={npcData} onChange={handleDataChange} />}
        {activeTab === 3 && <PageThree data={npcData} onChange={handleDataChange} />}
      </div>

    </div>
  );
}