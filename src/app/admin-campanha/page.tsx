import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { ArrowLeft, Users, Skull, Map, Scroll, PlayCircle, Swords, Activity } from 'lucide-react';
import styles from './styles.module.css';

// Lemos o parâmetro ?id= da URL usando "searchParams"
export default async function CampaignDashboard({ searchParams }: { searchParams: { id?: string } }) {
  const id = searchParams.id;

  // Se o mestre tentar entrar direto em /admin-campanha sem clicar numa campanha, mandamos ele de volta!
  if (!id) {
    redirect('/adminpage');
  }

  const cookieStore = await cookies();
  
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

  // 1. Puxamos a campanha ESPECÍFICA baseada no ID da URL
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

  // 2. Puxamos TODOS os Jogadores, Mobs e NPCs REAIS dessa campanha!
  const [
    { data: jogadoresDb },
    { data: mobsDb },
    { data: npcsDb }
  ] = await Promise.all([
    supabase.from('personagens').select('id, nome, class, level, img, in_combat').eq('campanha_id', id),
    supabase.from('mobs').select('id, nome, nivel, img').eq('campanha_id', id),
    supabase.from('npcs').select('id, nome, img').eq('campanha_id', id)
  ]);

  const jogadores = jogadoresDb || [];
  const mobs = mobsDb || [];
  const npcs = npcsDb || [];

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <Link href="/adminpage" className={styles.backLink}>
          <ArrowLeft size={20} /> Voltar para Missões
        </Link>
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
                {jogadores.length === 0 ? (
                  <p style={{ color: '#666', fontSize: '0.85rem', padding: '1rem' }}>Nenhum shinobi recrutado ainda.</p>
                ) : (
                  jogadores.map(player => (
                    <div key={player.id} className={styles.sessionPlayerRow}>
                      <div className={styles.playerMainInfo}>
                        <img 
                          src={player.img || 'https://via.placeholder.com/150?text=Sem+Foto'} 
                          alt={player.nome} 
                          className={styles.avatar} 
                        />
                        <div className={styles.itemInfo}>
                          <strong className={styles.itemName}>{player.nome}</strong>
                          <span className={styles.itemMeta}>{player.class || 'Ninja'} • Nvl {player.level || 1}</span>
                        </div>
                      </div>

                      <div className={`${styles.combatBadge} ${player.in_combat ? styles.inCombat : styles.exploring}`}>
                        {player.in_combat ? (
                          <><Swords size={14} /> EM COMBATE</>
                        ) : (
                          <><Activity size={14} /> EXPLORANDO</>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

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
              {mobs.length === 0 && <p style={{ color: '#666', fontSize: '0.75rem' }}>Nenhum mob cadastrado.</p>}
              {mobs.slice(0, 3).map(mob => (
                <div key={mob.id} className={styles.miniItem}>
                  <img src={mob.img || 'https://via.placeholder.com/150'} className={styles.miniAvatar} alt={mob.nome} />
                  <div className={styles.miniInfo}>
                    <div className={styles.miniName}>{mob.nome}</div>
                    <div className={styles.miniMeta}>Nível {mob.nivel || 1}</div>
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
              {jogadores.length === 0 && <p style={{ color: '#666', fontSize: '0.75rem' }}>Equipe vazia.</p>}
              {jogadores.slice(0, 3).map(p => (
                <div key={p.id} className={styles.miniItem}>
                  <img src={p.img || 'https://via.placeholder.com/150'} className={styles.miniAvatar} alt={p.nome} />
                  <span className={styles.miniName}>{p.nome}</span>
                </div>
              ))}
              {jogadores.length > 3 && <p className={styles.moreLabel}>Ver todos os {jogadores.length} shinobis</p>}
            </div>
          </Link>

          <Link href={`/admin-campanha/npcs?id=${id}`} className={styles.sideCard}>
            <div className={styles.cardHeader}>
              <Scroll className={styles.icon} />
              <h2>Bingo Book (NPCs)</h2>
            </div>
            <div className={styles.miniList}>
              {npcs.length === 0 && <p style={{ color: '#666', fontSize: '0.75rem' }}>Nenhum NPC cadastrado.</p>}
              {npcs.slice(0, 3).map(npc => (
                <div key={npc.id} className={styles.miniItem}>
                  <img src={npc.img || 'https://via.placeholder.com/150'} className={styles.miniAvatar} alt={npc.nome} />
                  <div className={styles.miniInfo}>
                    <div className={styles.miniName}>{npc.nome}</div>
                    <div className={styles.miniMeta}>NPC</div>
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