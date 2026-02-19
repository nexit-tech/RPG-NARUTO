import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { ArrowLeft, Users, Skull, Map, Scroll, PlayCircle, Swords, Activity } from 'lucide-react';
import styles from './styles.module.css';

// --- MOCK DATA ---
const MOCK_PLAYERS = [
  { id: 1, name: 'Naruto Uzumaki', level: 'Nvl 20', class: 'Nanadaime', inCombat: true, img: 'https://imgs.search.brave.com/oeorTa8qLitRgjIz4ApXVeErnXx7JXBTS-Zow0OLM-4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzL2IwLzdl/LzNmL2IwN2UzZmYy/MTYzZDg0MGFlMTll/MmU2YWQ3OTYwMWY1/LmpwZw' },
  { id: 2, name: 'Sasuke Uchiha', level: 'Nvl 20', class: 'Shadow Hokage', inCombat: true, img: 'https://imgs.search.brave.com/HIiVnoJFxGOfdSvGo_TvR6H0ETyr8ajAclCUTASKdp0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS50ZW5vci5jb20v/ZXlKak5EMUN6U2tB/QUFBTS9zYXN1a2Ut/dWNoaWhhLmdpZg.gif' },
  { id: 3, name: 'Sakura Haruno', level: 'Nvl 19', class: 'Médica Ninja', inCombat: false, img: 'https://imgs.search.brave.com/D2pDWEF3zHIQdnLSA29Oy8q17IPCSy3rvC4pQB5NRKk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMud2lraWEubm9j/b29raWUubmV0L25h/cnV0by9pbWFnZXMv/Ni82NC9TYWt1cmFf/UGFydF8xLnBuZy9y/ZXZpc2lvbi9sYXRl/c3Qvc2NhbGUtdG8t/d2lkdGgtZG93bi8z/MDA_Y2I9MjAxNzA3/MjYxMDE0NDQ' },
];

const MOCK_NPCS = [
  { id: 1, name: 'Kakashi Hatake', role: 'Conselheiro', img: 'https://imgs.search.brave.com/EGIZ5oD2mBtZXBrZ10deMReBz4i7m7d4UFKtcrv98Oo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMud2lraWEubm9j/b29raWUubmV0L3Bf/Xy9pbWFnZXMvNi82/ZS9LYWthc2hpX2lu/Zm9ib3hfaW1hZ2Uu/cG5nL3JldmlzaW9u/L2xhdGVzdC9zY2Fs/ZS10by13aWR0aC1k/b3duLzI2OD9jYj0y/MDE4MDQxNzIzNTEz/NCZwYXRoLXByZWZp/eD1wcm90YWdvbmlz/dA' },
];

const MOCK_MOBS = [
  { id: 1, name: 'Zetsu Branco', level: 'Nvl 5', type: 'Minion', img: 'https://imgs.search.brave.com/hAIyZtVgluqvO_176cybig8JoSIDDzB1ZBt-gyR6spQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jcml0/aWNhbGhpdHMuY29t/LmJyL3dwLWNvbnRl/bnQvdXBsb2Fkcy8y/MDIwLzEyL1NoaXJv/X1pldHN1LTkxMHg1/MTguanBn' },
];

// Lemos o parâmetro ?id= da URL usando "searchParams"
export default async function CampaignDashboard({ searchParams }: { searchParams: { id?: string } }) {
  const id = searchParams.id;

  // Se o mestre tentar entrar direto em /admin-campanha sem clicar numa campanha, mandamos ele de volta!
  if (!id) {
    redirect('/adminpage');
  }

  // Conectamos ao banco
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
      },
    }
  );

  // Puxamos a campanha ESPECÍFICA baseada no ID da URL
  const { data: campanha, error } = await supabase
    .from('campanhas')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !campanha) {
    return (
      <main className={styles.container}>
        <div style={{ textAlign: 'center', marginTop: '5rem', color: 'white' }}>
          <h2>Erro 404 - Pergaminho não encontrado!</h2>
          <p>Esta campanha não existe ou foi apagada.</p>
          <Link href="/adminpage" style={{ color: '#ff6600', textDecoration: 'underline' }}>
            Voltar para as Missões
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <Link href="/adminpage" className={styles.backLink}>
          <ArrowLeft size={20} /> Voltar para Missões
        </Link>
        {/* NOME VINDO DO BANCO DE DADOS! */}
        <h1 className={styles.pageTitle}>Painel: {campanha.nome}</h1>
      </header>

      <div className={styles.dashboardGrid}>
        
        <div className={styles.leftColumn}>
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

            {/* ATENÇÃO: Repassamos o ID para a próxima página saber qual campanha estamos! */}
            <Link href={`/admin-campanha/sessao-ativa?id=${id}`} className={styles.mainActionBtn}>
              ABRIR PAINEL DE COMBATE
            </Link>
          </section>

          <Link href={`/admin-campanha/planejamento?id=${id}`} className={styles.strategyBlock}>
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

        <div className={styles.rightColumn}>
          
          <Link href={`/admin-campanha/mobs?id=${id}`} className={styles.sideCard}>
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

          <Link href={`/admin-campanha/players?id=${id}`} className={styles.sideCard}>
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

          <Link href={`/admin-campanha/npcs?id=${id}`} className={styles.sideCard}>
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