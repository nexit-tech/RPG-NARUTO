import React from 'react';
import Link from 'next/link';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { ArrowLeft, Users, Skull, Map, Scroll, PlayCircle, Swords, Activity, UserMinus } from 'lucide-react';
import styles from './styles.module.css';

export default async function CampaignDashboard({ params }: { params: Promise<{ campanhaId: string }> }) {
  // 1. Desempacotando os parâmetros (Padrão Next.js 15)
  const resolvedParams = await params;
  const id = resolvedParams.campanhaId;
  const cookieStore = await cookies();

  // 2. Conectando ao Banco (Server-Side)
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

  // 3. Fazemos múltiplas buscas PARALELAS no banco para a página carregar num piscar de olhos!
  const [
    { data: campanha },
    { data: sessao },
    { data: mobsData },
    { data: personagensData },
    { data: npcsData }
  ] = await Promise.all([
    supabase.from('campanhas').select('*').eq('id', id).single(),
    supabase.from('sessoes').select('id').eq('campanha_id', id).maybeSingle(),
    supabase.from('mobs').select('id, nome, img, nivel').eq('campanha_id', id).order('created_at', { ascending: false }).limit(4),
    supabase.from('personagens').select('id, nome, img, class, level').eq('campanha_id', id).order('created_at', { ascending: false }).limit(4),
    supabase.from('npcs').select('id, nome, img, rank, tipo').eq('campanha_id', id).order('created_at', { ascending: false }).limit(4)
  ]);

  // Se a URL estiver errada, 404 nele!
  if (!campanha) {
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

  // 4. Busca os jogadores que estão com o Token na Mesa (Sessão Ativa)
  let activeTokens: any[] = [];
  if (sessao) {
    const { data: tokens } = await supabase
      .from('sessao_tokens')
      .select('id, nome, img, class, in_combat')
      .eq('sessao_id', sessao.id)
      .eq('token_type', 'player');
    
    if (tokens) activeTokens = tokens;
  }

  // Garantindo que arrays não quebrem a tela se vierem vazios
  const mobs = mobsData || [];
  const personagens = personagensData || [];
  const npcs = npcsData || [];

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <Link href="/adminpage" className={styles.backLink}>
          <ArrowLeft size={20} /> Voltar para Missões
        </Link>
        <h1 className={styles.pageTitle}>Painel: {campanha.nome}</h1>
      </header>

      <div className={styles.dashboardGrid}>
        
        {/* === COLUNA ESQUERDA === */}
        <div className={styles.leftColumn}>
          
          <section className={styles.activeSessionBlock}>
            <div className={styles.cardHeader}>
              <PlayCircle className={styles.icon} />
              <h2>Sessão Ativa</h2>
              <div className={styles.statusOnline}>{activeTokens.length > 0 ? 'LIVE' : 'AGUARDANDO'}</div>
            </div>
            
            <div className={styles.sessionContent}>
              <div className={styles.playerList}>
                {activeTokens.length === 0 ? (
                  <div style={{ padding: '2rem', textAlign: 'center', color: '#666', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                    <UserMinus size={32} />
                    <span>Nenhum jogador entrou no mapa ainda.</span>
                  </div>
                ) : (
                  activeTokens.map(player => (
                    <div key={player.id} className={styles.sessionPlayerRow}>
                      <div className={styles.playerMainInfo}>
                        <img 
                          src={player.img?.startsWith('blob:') ? 'https://via.placeholder.com/150' : (player.img || 'https://via.placeholder.com/150')} 
                          alt={player.nome} 
                          className={styles.avatar} 
                        />
                        <div className={styles.itemInfo}>
                          <strong className={styles.itemName}>{player.nome}</strong>
                          <span className={styles.itemMeta}>{player.class}</span>
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

            <Link href={`/admin-campanha/${id}/sessao-ativa`} className={styles.mainActionBtn}>
              ABRIR PAINEL DE COMBATE
            </Link>
          </section>

          <Link href={`/admin-campanha/${id}/planejamento`} className={styles.strategyBlock}>
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

        {/* === COLUNA DIREITA === */}
        <div className={styles.rightColumn}>
          
          {/* BESTIÁRIO (MOBS) */}
          <Link href={`/admin-campanha/${id}/mobs`} className={styles.sideCard}>
            <div className={styles.cardHeader}>
              <Skull className={styles.icon} />
              <h2>Bestiário (Mobs)</h2>
            </div>
            <div className={styles.miniList}>
              {mobs.length === 0 ? (
                <p style={{ color: '#666', fontSize: '0.8rem', textAlign: 'center', padding: '1rem 0' }}>Nenhum mob criado.</p>
              ) : (
                mobs.map(mob => (
                  <div key={mob.id} className={styles.miniItem}>
                    <img src={mob.img || 'https://via.placeholder.com/150'} className={styles.miniAvatar} alt={mob.nome} />
                    <div className={styles.miniInfo}>
                      <div className={styles.miniName}>{mob.nome}</div>
                      <div className={styles.miniMeta}>Nvl {mob.nivel}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Link>

          {/* EQUIPE SHINOBI (PLAYERS) */}
          <Link href={`/admin-campanha/${id}/players`} className={styles.sideCard}>
            <div className={styles.cardHeader}>
              <Users className={styles.icon} />
              <h2>Equipe Shinobi</h2>
            </div>
            <div className={styles.miniList}>
              {personagens.length === 0 ? (
                <p style={{ color: '#666', fontSize: '0.8rem', textAlign: 'center', padding: '1rem 0' }}>Nenhum shinobi na equipe.</p>
              ) : (
                <>
                  {personagens.map(p => (
                    <div key={p.id} className={styles.miniItem}>
                      <img src={p.img || 'https://via.placeholder.com/150'} className={styles.miniAvatar} alt={p.nome} />
                      <div className={styles.miniInfo}>
                        <div className={styles.miniName}>{p.nome}</div>
                        <div className={styles.miniMeta}>Nvl {p.level} • {p.class}</div>
                      </div>
                    </div>
                  ))}
                  <p className={styles.moreLabel}>Gerenciar Equipe</p>
                </>
              )}
            </div>
          </Link>

          {/* BINGO BOOK (NPCs) */}
          <Link href={`/admin-campanha/${id}/npcs`} className={styles.sideCard}>
            <div className={styles.cardHeader}>
              <Scroll className={styles.icon} />
              <h2>Bingo Book (NPCs)</h2>
            </div>
            <div className={styles.miniList}>
              {npcs.length === 0 ? (
                <p style={{ color: '#666', fontSize: '0.8rem', textAlign: 'center', padding: '1rem 0' }}>Nenhum NPC registrado.</p>
              ) : (
                npcs.map(npc => (
                  <div key={npc.id} className={styles.miniItem}>
                    <img src={npc.img || 'https://via.placeholder.com/150'} className={styles.miniAvatar} alt={npc.nome} />
                    <div className={styles.miniInfo}>
                      <div className={styles.miniName}>{npc.nome}</div>
                      <div className={styles.miniMeta}>{npc.rank || npc.tipo || 'Desconhecido'}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Link>

        </div>

      </div>
    </main>
  );
}