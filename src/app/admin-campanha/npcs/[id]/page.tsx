'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Skull, Shield, Sword, Scroll, Target, AlertTriangle } from 'lucide-react';
import styles from './styles.module.css';

// Mock Data para o NPC (Simulando um fetch pelo ID)
const NPC_DATA = {
  id: 101,
  name: 'Kakashi Hatake',
  epithet: 'O Ninja Copiador',
  village: 'Konoha',
  rank: 'Hokage / Rank S',
  status: 'Aliado', // ou 'Inimigo' / 'Procurado'
  bounty: 0, // Se for inimigo, tem recompensa
  img: 'https://imgs.search.brave.com/EGIZ5oD2mBtZXBrZ10deMReBz4i7m7d4UFKtcrv98Oo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMud2lraWEubm9j/b29raWUubmV0L3Bf/Xy9pbWFnZXMvNi82/ZS9LYWthc2hpX2lu/Zm9ib3hfaW1hZ2Uu/cG5nL3JldmlzaW9u/L2xhdGVzdC9zY2Fs/ZS10by13aWR0aC1k/b3duLzI2OD9jYj0y/MDE4MDQxNzIzNTEz/NCZwYXRoLXByZWZp/eD1wcm90YWdvbmlz/dA',
  stats: { hp: 450, cp: 600, def: 22, esq: 30 },
  traits: [
    'Mestre do Sharingan (Copia Jutsus)',
    'Estrategista Nato (INT +5)',
    'Raiton Especialista'
  ],
  lore: 'Sexto Hokage de Konoha. Famoso por ter copiado mais de mil jutsus. Atualmente atua como conselheiro e líder estratégico.',
  jutsus: ['Raikiri', 'Kamui', 'Parede de Terra', 'Clone das Sombras']
};

export default function NpcProfilePage({ params }: { params: { id: string } }) {
  // Em produção: const npc = fetchNpc(params.id);
  const npc = NPC_DATA; 
  const isEnemy = npc.status === 'Inimigo' || npc.status === 'Procurado';

  return (
    <main className={styles.container}>
      <nav className={styles.topNav}>
        <Link href="/admin-campanha/npcs" className={styles.backLink}>
          <ArrowLeft size={18} /> Voltar para Bingo Book
        </Link>
        <span className={`${styles.statusBadge} ${isEnemy ? styles.enemy : styles.ally}`}>
          {npc.status.toUpperCase()}
        </span>
      </nav>

      <div className={styles.contentGrid}>
        {/* COLUNA ESQUERDA: FOTO E STATUS BÁSICO */}
        <aside className={styles.profileCard}>
          <div className={styles.imageWrapper}>
            <img src={npc.img} alt={npc.name} className={styles.avatar} />
            {isEnemy && <div className={styles.wantedStamp}>WANTED</div>}
          </div>
          
          <h1 className={styles.name}>{npc.name}</h1>
          <h2 className={styles.epithet}>"{npc.epithet}"</h2>
          
          <div className={styles.villageInfo}>
            <img src="/src/app/favicon.ico" alt="Vila" width={20} style={{opacity:0.5}}/> {/* Placeholder icone vila */}
            <span>{npc.village}</span>
          </div>

          <div className={styles.statsBlock}>
            <div className={styles.statRow}>
              <div className={styles.statLabel}><Target size={14}/> HP</div>
              <div className={styles.statValue} style={{color: '#ff4444'}}>{npc.stats.hp}</div>
            </div>
            <div className={styles.statRow}>
              <div className={styles.statLabel}><Scroll size={14}/> CP</div>
              <div className={styles.statValue} style={{color: '#00ccff'}}>{npc.stats.cp}</div>
            </div>
            <div className={styles.statRow}>
              <div className={styles.statLabel}><Shield size={14}/> DEF</div>
              <div className={styles.statValue}>{npc.stats.def}</div>
            </div>
          </div>

          {isEnemy && (
            <div className={styles.bountyBox}>
              <label>RECOMPENSA</label>
              <span>¥ {npc.bounty.toLocaleString()}</span>
            </div>
          )}
        </aside>

        {/* COLUNA DIREITA: DETALHES TÁTICOS */}
        <section className={styles.detailsArea}>
          
          {/* TRAÇOS E COMPORTAMENTO */}
          <div className={styles.panel}>
            <h3 className={styles.panelTitle}><AlertTriangle size={18}/> HABILIDADES & TRAÇOS</h3>
            <ul className={styles.traitList}>
              {npc.traits.map((trait, i) => (
                <li key={i}>{trait}</li>
              ))}
            </ul>
          </div>

          {/* JUTSUS CONHECIDOS */}
          <div className={styles.panel}>
            <h3 className={styles.panelTitle}><Sword size={18}/> ARSENAL DE JUTSUS</h3>
            <div className={styles.jutsuTags}>
              {npc.jutsus.map((jutsu, i) => (
                <span key={i} className={styles.jutsuTag}>{jutsu}</span>
              ))}
            </div>
          </div>

          {/* LORE / HISTÓRICO */}
          <div className={styles.panel}>
            <h3 className={styles.panelTitle}><Scroll size={18}/> ARQUIVO CONFIDENCIAL</h3>
            <p className={styles.loreText}>{npc.lore}</p>
          </div>

        </section>
      </div>
    </main>
  );
}