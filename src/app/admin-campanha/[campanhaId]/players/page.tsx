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
      
      {/* HEADER LIMPO USANDO SUAS CLASSES */}
      <header className={styles.topBar}>
        <div>
          <Link href={`/admin-campanha/${campanhaId}`} className={styles.backLink}>
            <ArrowLeft size={18} /> Voltar para o Painel
          </Link>
          <h1 className={styles.pageTitle}>
            <Users size={28} style={{ marginRight: '10px', color: '#ff6600' }} />
            Equipe Shinobi {campanha ? `- ${campanha.nome}` : ''}
          </h1>
        </div>
      </header>

      {/* ÁREA DE LISTAGEM */}
      <section className={styles.listContainer}>
        {error && (
          <div className={styles.emptyState}>
            <span>Erro ao carregar jogadores: {error.message}</span>
          </div>
        )}

        {safeJogadores.length === 0 && !error ? (
          <div className={styles.emptyState}>
            <span>Nenhum shinobi recrutado nesta campanha ainda.</span>
            <small>Os jogadores precisam acessar o link da mesa e criar suas fichas.</small>
          </div>
        ) : (
          <div className={styles.grid}>
            {safeJogadores.map((player) => (
              <Link 
                href={`/admin-campanha/${campanhaId}/players/${player.id}`} 
                key={player.id} 
                className={styles.card}
              >
                {/* ESTRUTURA IGUAL A DOS MOBS/NPCS PRA PUXAR SEU CSS */}
                <div className={styles.imageWrapper}>
                  <img 
                    src={player.img || 'https://via.placeholder.com/150?text=Sem+Foto'} 
                    alt={player.nome} 
                    className={styles.image} 
                  />
                </div>
                
                <div className={styles.content}>
                  <h3 className={styles.title}>{player.nome}</h3>
                  
                  <div className={styles.metaData}>
                    <div className={styles.tag}>
                      <span>Nvl {player.level || 1} • {player.class || 'Ninja em Treinamento'}</span>
                    </div>
                  </div>
                  
                  <div className={styles.actions} style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <div className={styles.tag} style={{ color: '#22c55e', border: '1px solid #1a3320' }}>
                      <Shield size={14} /> {player.hp || 0}/{player.max_hp || 0}
                    </div>
                    <div className={styles.tag} style={{ color: '#3b82f6', border: '1px solid #1a2033' }}>
                      <Zap size={14} /> {player.cp || 0}/{player.max_cp || 0}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

    </main>
  );
}