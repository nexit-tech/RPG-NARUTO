'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Search, Shield, Zap } from 'lucide-react';
import styles from './styles.module.css';

// MOCK DE PLAYERS (LISTA COMPLETA)
const ALL_PLAYERS = [
  { id: 1, name: 'Naruto Uzumaki', clan: 'Uzumaki', level: 'Nvl 20', class: 'Nanadaime', img: 'https://imgs.search.brave.com/oeorTa8qLitRgjIz4ApXVeErnXx7JXBTS-Zow0OLM-4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzL2IwLzdl/LzNmL2IwN2UzZmYy/MTYzZDg0MGFlMTll/MmU2YWQ3OTYwMWY1/LmpwZw' },
  { id: 2, name: 'Sasuke Uchiha', clan: 'Uchiha', level: 'Nvl 20', class: 'Shadow Hokage', img: 'https://imgs.search.brave.com/HIiVnoJFxGOfdSvGo_TvR6H0ETyr8ajAclCUTASKdp0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS50ZW5vci5jb20v/ZXlKak5EMUN6U2tB/QUFBTS9zYXN1a2Ut/dWNoaWhhLmdpZg.gif' },
  { id: 3, name: 'Sakura Haruno', clan: 'Haruno', level: 'Nvl 19', class: 'Médica Ninja', img: 'https://imgs.search.brave.com/D2pDWEF3zHIQdnLSA29Oy8q17IPCSy3rvC4pQB5NRKk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMud2lraWEubm9j/b29raWUubmV0L25h/cnV0by9pbWFnZXMv/Ni82NC9TYWt1cmFf/UGFydF8xLnBuZy9y/ZXZpc2lvbi9sYXRl/c3Qvc2NhbGUtdG8t/d2lkdGgtZG93bi8z/MDA_Y2I9MjAxNzA3/MjYxMDE0NDQ' },
  { id: 4, name: 'Kawaki', clan: 'Unknown', level: 'Nvl 12', class: 'Karma Vessel', img: 'https://imgs.search.brave.com/GR2Tp_bwQGCSwoHHnlCdHoPdOJmYMplC2LGzyHF1yYo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jcml0/aWNhbGhpdHMuY29t/LmJyL3dwLWNvbnRl/bnQvdXBsb2Fkcy8y/MDIxLzA0LzIwMjEw/MjI0LWJvcnV0by1r/YXdha2ktOTEweDUw/MS5qcGcud2VicA' },
  { id: 5, name: 'Boruto Uzumaki', clan: 'Uzumaki', level: 'Nvl 10', class: 'Karma User', img: 'https://imgs.search.brave.com/riKG-SqphF1GDH0ZoVcl97vrGsXEuEe41YG0BRl-78Y/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/ZHJpYmJibGUuY29t/L3VzZXJ1cGxvYWQv/MzI5MzUxMDkvZmls/ZS9vcmlnaW5hbC0y/MjVhMGU2N2JlY2I0/ZjNkMTJjN2UwYTky/NzhkMjBlMC5qcGc_/Zm9ybWF0PXdlYnAm/cmVzaXplPTQwMHgz/MDAmdmVydGljYWw9/Y2VudGVy' },
  { id: 6, name: 'Mitsuki', clan: 'Oto', level: 'Nvl 11', class: 'Sage Mode', img: 'https://imgs.search.brave.com/NmSswl_xc1ntrXPWCCXi1QWJAcqICtaBylP2uVQEhaE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzL2VhL2U5/LzU3L2VhZTk1NzU3/NTc3ZjJkNjkyMmYw/NDg1ZmI5MTU0YWE1/LmpwZw' },
];

export default function PlayersListPage() {
  return (
    <main className={styles.container}>
      {/* HEADER */}
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <Link href="/admin-campanha" className={styles.backLink}>
            <ArrowLeft size={20} /> Painel do Mestre
          </Link>
          <div className={styles.stats}>
            <span>Total: <strong>{ALL_PLAYERS.length}</strong> Shinobis</span>
          </div>
        </div>
        
        <div className={styles.titleArea}>
          <h1 className={styles.pageTitle}>Selecione o Shinobi</h1>
          <p className={styles.subTitle}>Gerenciamento de Fichas dos Jogadores</p>
        </div>

        {/* BARRA DE PESQUISA */}
        <div className={styles.searchBar}>
          <Search className={styles.searchIcon} />
          <input type="text" placeholder="Buscar por nome ou clã..." />
        </div>
      </header>

      {/* GRID DE PLAYERS */}
      <div className={styles.grid}>
        {ALL_PLAYERS.map((player) => (
          // Link que leva para a ficha individual (players/[id])
          <Link href={`/admin-campanha/players/${player.id}`} key={player.id} className={styles.card}>
            
            <div className={styles.imageContainer}>
              <img src={player.img} alt={player.name} className={styles.image} />
              <div className={styles.levelBadge}>{player.level}</div>
            </div>
            
            <div className={styles.cardContent}>
              <h3 className={styles.name}>{player.name}</h3>
              <div className={styles.clan}>{player.clan}</div>
              
              <div className={styles.metaInfo}>
                <div className={styles.infoTag}>
                  <Shield size={12} /> {player.class}
                </div>
              </div>
            </div>
            
            <div className={styles.cardFooter}>
               <Zap size={14} style={{ marginRight: 5 }} /> Acessar Ficha
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}