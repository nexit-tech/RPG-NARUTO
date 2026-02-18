'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Users, Skull, Map, Scroll, Shield, PlayCircle, Swords, Activity } from 'lucide-react';
import styles from './styles.module.css';

// --- MOCK DATA ---
const MOCK_PLAYERS = [
  { id: 1, name: 'Naruto Uzumaki', level: 'Nvl 20', class: 'Nanadaime', inCombat: true, img: 'https://imgs.search.brave.com/oeorTa8qLitRgjIz4ApXVeErnXx7JXBTS-Zow0OLM-4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzL2IwLzdl/LzNmL2IwN2UzZmYy/MTYzZDg0MGFlMTll/MmU2YWQ3OTYwMWY1/LmpwZw' },
  { id: 2, name: 'Sasuke Uchiha', level: 'Nvl 20', class: 'Shadow Hokage', inCombat: true, img: 'https://imgs.search.brave.com/HIiVnoJFxGOfdSvGo_TvR6H0ETyr8ajAclCUTASKdp0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS50ZW5vci5jb20v/ZXlKak5EMUN6U2tB/QUFBTS9zYXN1a2Ut/dWNoaWhhLmdpZg.gif' },
  { id: 3, name: 'Sakura Haruno', level: 'Nvl 19', class: 'Médica Ninja', inCombat: false, img: 'https://imgs.search.brave.com/D2pDWEF3zHIQdnLSA29Oy8q17IPCSy3rvC4pQB5NRKk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMud2lraWEubm9j/b29raWUubmV0L25h/cnV0by9pbWFnZXMv/Ni82NC9TYWt1cmFf/UGFydF8xLnBuZy9y/ZXZpc2lvbi9sYXRl/c3Qvc2NhbGUtdG8t/d2lkdGgtZG93bi8z/MDA_Y2I9MjAxNzA3/MjYxMDE0NDQ' },
  { id: 4, name: 'Kawaki', level: 'Nvl 12', class: 'Karma Vessel', inCombat: false, img: 'https://imgs.search.brave.com/GR2Tp_bwQGCSwoHHnlCdHoPdOJmYMplC2LGzyHF1yYo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jcml0/aWNhbGhpdHMuY29t/LmJyL3dwLWNvbnRl/bnQvdXBsb2Fkcy8y/MDIxLzA0LzIwMjEw/MjI0LWJvcnV0by1r/YXdha2ktOTEweDUw/MS5qcGcud2VicA' },
];

const MOCK_NPCS = [
  { id: 1, name: 'Kakashi Hatake', role: 'Conselheiro', img: 'https://imgs.search.brave.com/EGIZ5oD2mBtZXBrZ10deMReBz4i7m7d4UFKtcrv98Oo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMud2lraWEubm9j/b29raWUubmV0L3Bf/Xy9pbWFnZXMvNi82/ZS9LYWthc2hpX2lu/Zm9ib3hfaW1hZ2Uu/cG5nL3JldmlzaW9u/L2xhdGVzdC9zY2Fs/ZS10by13aWR0aC1k/b3duLzI2OD9jYj0y/MDE4MDQxNzIzNTEz/NCZwYXRoLXByZWZp/eD1wcm90YWdvbmlz/dA' },
  { id: 2, name: 'Tsunade Senju', role: 'Lendária', img: 'https://imgs.search.brave.com/sa91CuLR-8_e4mum1jiMr95MlA6SwLjsn1q-KtHpOxQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMwLmNicmltYWdl/cy5jb20vd29yZHBy/ZXNzL3dwLWNvbnRl/bnQvdXBsb2Fkcy8y/MDIwLzEwL1RzdW5h/ZGUtTmFydXRvLTcu/anBnP3E9NTAmZml0/PWNyb3Amdz04MjUm/ZHByPTEuNQ' },
];

const MOCK_MOBS = [
  { id: 1, name: 'Zetsu Branco', level: 'Nvl 5', type: 'Minion', img: 'https://imgs.search.brave.com/hAIyZtVgluqvO_176cybig8JoSIDDzB1ZBt-gyR6spQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jcml0/aWNhbGhpdHMuY29t/LmJyL3dwLWNvbnRl/bnQvdXBsb2Fkcy8y/MDIwLzEyL1NoaXJv/X1pldHN1LTkxMHg1/MTguanBn' },
];

export default function CampaignDashboard() {
  const router = useRouter();

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <Link href="/adminpage" className={styles.backLink}>
          <ArrowLeft size={20} /> Voltar para Missões
        </Link>
        <h1 className={styles.pageTitle}>Painel de Controle</h1>
      </header>

      <div className={styles.dashboardGrid}>
        
        {/* === COLUNA ESQUERDA (Sessão + Estratégia) === */}
        <div className={styles.leftColumn}>
          {/* 1. SESSÃO ATIVA (Ocupa o resto do espaço) */}
          <section className={styles.activeSessionBlock}>
            <div className={styles.cardHeader}>
              <PlayCircle className={styles.icon} />
              <h2>Sessão Ativa</h2>
              <div className={styles.statusOnline}>LIVE</div>
            </div>
            
            <div className={styles.sessionContent}>
              <div className={styles.playerList}>
                {MOCK_PLAYERS.map(player => (
                  <div key={player.id} className={styles.sessionPlayerRow}>
                    <div className={styles.playerMainInfo}>
                      <img src={player.img} alt={player.name} className={styles.avatar} />
                      <div className={styles.itemInfo}>
                        <strong className={styles.itemName}>{player.name}</strong>
                        <span className={styles.itemMeta}>{player.class}</span>
                      </div>
                    </div>

                    <div className={`${styles.combatBadge} ${player.inCombat ? styles.inCombat : styles.exploring}`}>
                      {player.inCombat ? (
                        <><Swords size={14} /> EM COMBATE</>
                      ) : (
                        <><Activity size={14} /> EXPLORANDO</>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Link href="/admin-campanha/sessao-ativa" className={styles.mainActionBtn}>
              ABRIR PAINEL DE COMBATE
            </Link>
          </section>

          {/* 2. SALA DE ESTRATÉGIA (Barra Fixa na base) */}
          <Link href="/admin-campanha/planejamento" className={styles.strategyBlock}>
            <div className={styles.strategyContent}>
              <div className={styles.strategyHeader}>
                <Map className={styles.icon} />
                <h2>Sala de Estratégia</h2>
              </div>
              <p className={styles.cardDesc}>Acesse roteiros, mapas e segredos.</p>
            </div>
            <div className={styles.strategyArrow}>→</div>
          </Link>
        </div>

        {/* === COLUNA DIREITA (Mobs, Players, NPCs) === */}
        <div className={styles.rightColumn}>
          
          {/* 1. Bestiário */}
          <Link href="/admin-campanha/mobs" className={styles.sideCard}>
            <div className={styles.cardHeader}>
              <Skull className={styles.icon} />
              <h2>Bestiário (Mobs)</h2>
            </div>
            <div className={styles.miniList}>
              {MOCK_MOBS.map(mob => (
                <div key={mob.id} className={styles.miniItem}>
                  <img src={mob.img} className={styles.miniAvatar} alt={mob.name} />
                  <div className={styles.miniInfo}>
                    <div className={styles.miniName}>{mob.name}</div>
                    <div className={styles.miniMeta}>{mob.level}</div>
                  </div>
                </div>
              ))}
            </div>
          </Link>

          {/* 2. Equipe Shinobi */}
          <Link href="/admin-campanha/players" className={styles.sideCard}>
            <div className={styles.cardHeader}>
              <Users className={styles.icon} />
              <h2>Equipe Shinobi</h2>
            </div>
            <div className={styles.miniList}>
              {MOCK_PLAYERS.slice(0, 3).map(p => (
                <div key={p.id} className={styles.miniItem}>
                  <img src={p.img} className={styles.miniAvatar} alt={p.name} />
                  <span className={styles.miniName}>{p.name}</span>
                </div>
              ))}
              <p className={styles.moreLabel}>Ver todos os shinobis</p>
            </div>
          </Link>

          {/* 3. Bingo Book */}
          <Link href="/admin-campanha/npcs" className={styles.sideCard}>
            <div className={styles.cardHeader}>
              <Scroll className={styles.icon} />
              <h2>Bingo Book (NPCs)</h2>
            </div>
            <div className={styles.miniList}>
              {MOCK_NPCS.map(npc => (
                <div key={npc.id} className={styles.miniItem}>
                  <img src={npc.img} className={styles.miniAvatar} alt={npc.name} />
                  <div className={styles.miniInfo}>
                    <div className={styles.miniName}>{npc.name}</div>
                    <div className={styles.miniMeta}>{npc.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </Link>

        </div>

      </div>
    </main>
  );
}