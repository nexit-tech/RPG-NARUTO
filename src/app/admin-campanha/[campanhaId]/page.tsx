'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Loader2, Swords, Users, Edit, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import styles from './styles.module.css';

interface Campanha {
  id: string;
  nome: string;
  descricao: string;
  mestre: string;
  rank: string;
  nivel: number;
  status: string;
  banner_url: string;
}

interface Personagem {
  id: string;
  nome: string;
  class: string;
  level: number;
  img: string;
  hp: number;
  max_hp: number;
  cp: number;
  max_cp: number;
  user_id?: string;
}

export default function PlayerLobbyPage({ params }: { params: Promise<{ campanhaId: string }> }) {
  const router = useRouter();
  
  const resolvedParams = use(params);
  const campanhaId = resolvedParams.campanhaId;

  const [currentUser, setCurrentUser] = useState<any>(null); // Guardar o usuário logado
  const [campanha, setCampanha] = useState<Campanha | null>(null);
  const [personagens, setPersonagens] = useState<Personagem[]>([]);
  const [loading, setLoading] = useState(true);

  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [enteringId, setEnteringId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ nome: '', class: '', img: '' });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [charToDelete, setCharToDelete] = useState<Personagem | null>(null);

  useEffect(() => {
    if (campanhaId) {
      fetchData();
    }
  }, [campanhaId]);

  async function fetchData() {
    setLoading(true);

    // 1. Pegar o usuário logado atualmente
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      router.push('/login'); // Se não tiver logado, manda pro login
      return;
    }
    
    setCurrentUser(user);

    // 2. Buscar a campanha e APENAS os personagens deste usuário
    const [campReq, charsReq] = await Promise.all([
      supabase.from('campanhas').select('*').eq('id', campanhaId).limit(1).single(),
      supabase.from('personagens')
        .select('id, nome, class, level, img, hp, max_hp, cp, max_cp, user_id')
        .eq('campanha_id', campanhaId)
        .eq('user_id', user.id) // <--- O SEGREDO ESTÁ AQUI: Filtra pelo dono!
    ]);

    if (campReq.error || !campReq.data) {
      console.error('Campanha não encontrada', campReq.error);
      router.push('/player');
      return;
    }

    setCampanha(campReq.data);
    setPersonagens(charsReq.data || []);
    setLoading(false);
  }

  function openEditModal(char: Personagem) {
    setFormData({ nome: char.nome, class: char.class, img: char.img });
    setEditingId(char.id);
    setIsCreating(true);
  }

  function closeFormModal() {
    setIsCreating(false);
    setEditingId(null);
    setFormData({ nome: '', class: '', img: '' });
  }

  async function handleSaveCharacter() {
    if (!formData.nome.trim() || !currentUser) return;
    setSaving(true);

    const finalImg = formData.img || 'https://via.placeholder.com/150?text=Sem+Foto';

    if (editingId) {
      const { data, error } = await supabase
        .from('personagens')
        .update({
          nome: formData.nome,
          class: formData.class || 'Ninja em Treinamento',
          img: finalImg,
        })
        .eq('id', editingId)
        .eq('user_id', currentUser.id) // Segurança extra: só edita se for dele
        .select('id, nome, class, level, img, hp, max_hp, cp, max_cp, user_id')
        .single();

      if (error) {
        console.error('Erro ao atualizar personagem:', error);
      } else if (data) {
        setPersonagens(personagens.map(p => p.id === editingId ? data : p));
        closeFormModal();
      }
    } else {
      const novoPersonagem = {
        campanha_id: campanhaId,
        user_id: currentUser.id, // <--- ATRIBUI A FICHA AO USUÁRIO
        nome: formData.nome,
        class: formData.class || 'Ninja em Treinamento',
        img: finalImg,
        level: 1,
        hp: 100,
        max_hp: 100,
        cp: 100,
        max_cp: 100,
        atk: 10,
        def: 10,
        esq: 10,
        cd: 10,
        in_combat: false,
        is_down: false,
      };

      const { data, error } = await supabase
        .from('personagens')
        .insert([novoPersonagem])
        .select('id, nome, class, level, img, hp, max_hp, cp, max_cp, user_id')
        .single();

      if (error) {
        console.error('Erro ao criar personagem:', error);
      } else if (data) {
        setPersonagens([...personagens, data]);
        closeFormModal();
        
        const { error: rpcError } = await supabase.rpc('increment_jogadores', { camp_id: campanhaId });
        if (rpcError) {
          await supabase.from('campanhas').update({ jogadores: personagens.length + 1 }).eq('id', campanhaId);
        }
      }
    }

    setSaving(false);
  }

  async function confirmDelete() {
    if (!charToDelete || !currentUser) return;
    setSaving(true);

    const { error } = await supabase
      .from('personagens')
      .delete()
      .eq('id', charToDelete.id)
      .eq('user_id', currentUser.id); // Segurança extra: só exclui se for dele

    if (error) {
      console.error('Erro ao excluir personagem:', error);
    } else {
      setPersonagens(personagens.filter(p => p.id !== charToDelete.id));
      setCharToDelete(null);

      const { error: rpcError } = await supabase.rpc('decrement_jogadores', { camp_id: campanhaId });
      if (rpcError) {
         await supabase.from('campanhas').update({ jogadores: Math.max(0, personagens.length - 1) }).eq('id', campanhaId);
      }
    }

    setSaving(false);
  }

  async function enterSession(personagemId: string) {
    setEnteringId(personagemId);

    try {
      const { data: sessao } = await supabase
        .from('sessoes')
        .select('id')
        .eq('campanha_id', campanhaId)
        .limit(1)
        .maybeSingle();

      if (sessao) {
        const { data: tokenExistente } = await supabase
          .from('sessao_tokens')
          .select('id')
          .eq('sessao_id', sessao.id)
          .eq('personagem_id', personagemId)
          .limit(1)
          .maybeSingle();

        if (!tokenExistente) {
          const char = personagens.find(p => p.id === personagemId);
          if (char) {
            const finalImg = char.img.startsWith('blob:') 
              ? 'https://via.placeholder.com/150?text=Sem+Foto' 
              : char.img;

            await supabase.from('sessao_tokens').insert({
              sessao_id: sessao.id,
              personagem_id: char.id,
              token_type: 'player',
              nome: char.nome,
              img: finalImg,
              hp: char.hp,
              max_hp: char.max_hp,
              cp: char.cp,
              max_cp: char.max_cp,
              level: char.level,
              class: char.class,
              map_x: 0, 
              map_y: 0,
              in_combat: false
            });
          }
        }
      }
    } catch (err) {
      console.error("☠️ Erro inesperado:", err);
    } finally {
      router.push(`/player/${campanhaId}/${personagemId}`);
    }
  }

  if (loading) {
    return (
      <div className={styles.loadingScreen}>
        <Loader2 size={40} className={styles.spinner} />
        <span>Sincronizando chakra...</span>
      </div>
    );
  }

  if (!campanha) return null;

  return (
    <main className={styles.container}>
      <div className={styles.hero}>
        {campanha.banner_url && (
          <img src={campanha.banner_url} alt={campanha.nome} className={styles.heroBg} />
        )}
        <div className={styles.heroOverlay} />
        
        <div className={styles.heroContent}>
          <Link href="/player" className={styles.backLink}>
            <ArrowLeft size={18} /> Voltar para Campanhas
          </Link>
          <h1 className={styles.heroTitle}>{campanha.nome}</h1>
          
          <div className={styles.heroMeta} style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', marginTop: '1rem' }}>
            <span>Mestre: <strong style={{color: '#fff'}}>{campanha.mestre || 'Desconhecido'}</strong></span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ff6600', fontWeight: 'bold' }}>
              <Users size={18} /> Sua Equipe
            </span>
          </div>
        </div>
      </div>

      <section className={styles.lobbySection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Escolha seu Shinobi</h2>
          <button onClick={() => { setIsCreating(true); setEditingId(null); setFormData({nome:'', class:'', img:''}) }} className={styles.createBtn}>
            <Plus size={18} /> Criar Personagem
          </button>
        </div>

        <div className={styles.grid}>
          {personagens.length === 0 ? (
            <div className={styles.emptyState}>
              Você não tem nenhum personagem alistado nesta campanha. Crie um agora!
            </div>
          ) : (
            personagens.map((char) => (
              <div key={char.id} className={styles.charCard}>
                <div className={styles.charInfo}>
                  <img 
                    src={char.img} 
                    alt={char.nome} 
                    className={styles.charAvatar} 
                    onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/150?text=Sem+Foto' }} 
                  />
                  <div style={{ flex: 1 }}>
                    <h3 className={styles.charName}>{char.nome}</h3>
                    <span className={styles.charMeta}>Nvl {char.level} • {char.class}</span>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '8px', alignSelf: 'flex-start' }}>
                    <button 
                      onClick={(e) => { e.stopPropagation(); openEditModal(char); }} 
                      style={{ background: '#1a1a1a', border: '1px solid #333', color: '#ccc', borderRadius: '6px', padding: '8px', cursor: 'pointer', display: 'flex' }}
                      title="Editar Shinobi"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setCharToDelete(char); }} 
                      style={{ background: '#1a1a1a', border: '1px solid #333', color: '#ff4444', borderRadius: '6px', padding: '8px', cursor: 'pointer', display: 'flex' }}
                      title="Excluir Shinobi"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <button 
                  onClick={() => enterSession(char.id)} 
                  disabled={enteringId === char.id}
                  className={styles.enterBtn}
                >
                  {enteringId === char.id ? (
                    <Loader2 size={18} className={styles.spinner} style={{ margin: 0, color: '#fff' }} />
                  ) : (
                    <><Swords size={18} /> Entrar na Sessão</>
                  )}
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      {/* MODALS FICAM IGUAIS */}
      {isCreating && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2 className={styles.modalTitle}>{editingId ? 'Editar Shinobi' : 'Novo Shinobi'}</h2>
            
            <div className={styles.formGroup}>
              <label>Nome do Personagem</label>
              <input 
                type="text" 
                className={styles.input}
                value={formData.nome}
                onChange={(e) => setFormData({...formData, nome: e.target.value})}
                placeholder="Ex: Boruto Uzumaki"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Classe ou Clã</label>
              <input 
                type="text" 
                className={styles.input}
                value={formData.class}
                onChange={(e) => setFormData({...formData, class: e.target.value})}
                placeholder="Ex: Uchiha, Médico..."
              />
            </div>

            <div className={styles.formGroup}>
              <label>URL do Avatar (Opcional)</label>
              <input 
                type="text" 
                className={styles.input}
                value={formData.img}
                onChange={(e) => setFormData({...formData, img: e.target.value})}
                placeholder="https://..."
              />
            </div>

            <div className={styles.modalActions}>
              <button onClick={closeFormModal} className={styles.cancelBtn} disabled={saving}>
                Cancelar
              </button>
              <button 
                onClick={handleSaveCharacter}
                disabled={saving || !formData.nome}
                className={styles.submitBtn}
              >
                {saving ? <Loader2 size={18} className={styles.spinner} style={{ margin: 0, color: '#fff' }} /> : 'Salvar Ficha'}
              </button>
            </div>
          </div>
        </div>
      )}

      {charToDelete && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2 className={styles.modalTitle} style={{ color: '#ff4444' }}>Excluir Shinobi?</h2>
            
            <p style={{ color: '#ccc', textAlign: 'center', marginBottom: '2rem', lineHeight: '1.5' }}>
              Tem certeza que deseja apagar a ficha de <strong>{charToDelete.nome}</strong>?<br/> 
              Essa ação não pode ser desfeita.
            </p>

            <div className={styles.modalActions}>
              <button onClick={() => setCharToDelete(null)} className={styles.cancelBtn} disabled={saving}>
                Cancelar
              </button>
              <button 
                onClick={confirmDelete}
                disabled={saving}
                className={styles.submitBtn}
                style={{ background: '#ff4444' }}
              >
                {saving ? <Loader2 size={18} className={styles.spinner} style={{ margin: 0, color: '#fff' }} /> : 'Sim, Excluir'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}