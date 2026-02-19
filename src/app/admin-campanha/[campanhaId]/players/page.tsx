import React from 'react';
import Link from 'next/link';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { ArrowLeft, Users, Shield, Zap } from 'lucide-react';
import styles from './styles.module.css';

export default async function PlayersListPage({ params }: { params: Promise<{ campanhaId: string }> }) {
  const resolvedParams = await params;
  const campanhaId = resolvedParams.campanhaId;

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
      },
    }
  );

  const { data: campanha } = await supabase
    .from('campanhas')
    .select('nome')
    .eq('id', campanhaId)
    .single();

  const { data: jogadores, error } = await supabase
    .from('personagens')
    .select('*')
    .eq('campanha_id', campanhaId)
    .order('nome', { ascending: true });

  const safeJogadores = jogadores || [];

  return (
    <main className={styles.container}>
      
      {/* HEADER CORRIGIDO COM AS CLASSES DO SEU CSS */}
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <Link href={`/admin-campanha/${campanhaId}`} className={styles.backLink}>
            <ArrowLeft size={18} /> Voltar para o Painel
          </Link>
        </div>
        <div className={styles.titleArea}>
          <h1 className={styles.pageTitle}>
            Equipe Shinobi
          </h1>
          <p className={styles.subTitle}>
            {campanha ? `Mesa: ${campanha.nome}` : ''}
          </p>
        </div>
      </header>

      {/* ÁREA DE LISTAGEM COM A GRID CERTA */}
      <section>
        {error && (
          <div style={{ textAlign: 'center', color: '#ff6600', padding: '2rem' }}>
            <span>Erro ao carregar jogadores: {error.message}</span>
          </div>
        )}

        {safeJogadores.length === 0 && !error ? (
          <div style={{ textAlign: 'center', color: '#888', padding: '4rem', background: '#0f0f0f', borderRadius: '8px', border: '1px solid #222' }}>
            <Users size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <h3 style={{ color: '#fff', marginBottom: '0.5rem' }}>Nenhum shinobi recrutado nesta campanha ainda.</h3>
            <p style={{ fontSize: '0.9rem' }}>Os jogadores precisam acessar o link da mesa e criar suas fichas.</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {safeJogadores.map((player) => (
              <Link 
                href={`/admin-campanha/${campanhaId}/players/${player.id}`} 
                key={player.id} 
                className={styles.card}
              >
                <div className={styles.imageContainer}>
                  <img 
                    src={player.img || 'https://via.placeholder.com/400x300?text=Sem+Foto'} 
                    alt={player.nome} 
                    className={styles.image} 
                  />
                  <div className={styles.levelBadge}>Nvl {player.level || 1}</div>
                </div>
                
                <div className={styles.cardContent}>
                  <h3 className={styles.name}>{player.nome}</h3>
                  <div className={styles.clan}>{player.class || 'Ninja em Treinamento'}</div>
                  
                  <div className={styles.metaInfo}>
                    <div className={styles.infoTag} style={{ color: '#22c55e', border: '1px solid #1a3320' }}>
                      <Shield size={14} /> {player.hp || 0}/{player.max_hp || 0}
                    </div>
                    <div className={styles.infoTag} style={{ color: '#3b82f6', border: '1px solid #1a2033' }}>
                      <Zap size={14} /> {player.cp || 0}/{player.max_cp || 0}
                    </div>
                  </div>
                </div>

                {/* BOTÃO HOVER ANIMADO DO SEU CSS */}
                <div className={styles.cardFooter}>
                  Ver Ficha Completa
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

    </main>
  );
}