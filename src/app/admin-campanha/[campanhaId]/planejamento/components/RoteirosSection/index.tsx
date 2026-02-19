'use client';

import React, { useState, useEffect } from 'react';
import { Scroll, Plus, Trash2, Check, X, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import styles from './styles.module.css';

interface RoteiroPasso {
  id: number;
  titulo: string;
  descricao: string;
  concluido: boolean;
}

interface Roteiro {
  id: string; // Virou string
  titulo: string;
  descricao: string;
  passos: RoteiroPasso[];
  expandido: boolean;
}

export default function RoteirosSection({ campanhaId }: { campanhaId: string }) {
  const [roteiros, setRoteiros] = useState<Roteiro[]>([]);
  const [showNewRoteiro, setShowNewRoteiro] = useState(false);
  const [novoRoteiro, setNovoRoteiro] = useState({ titulo: '', descricao: '' });

  useEffect(() => {
    fetchRoteiros();
  }, [campanhaId]);

  const fetchRoteiros = async () => {
    const { data, error } = await supabase
      .from('roteiros')
      .select('*')
      .eq('campanha_id', campanhaId)
      .order('ordem', { ascending: true });

    if (data && !error) {
      setRoteiros(data.map(d => {
        // Como 'passos' não é uma coluna nativa, salvamos como JSON dentro do 'conteudo'
        const parsed = JSON.parse(d.conteudo || '{"descricao": "", "passos": []}');
        return {
          id: d.id,
          titulo: d.titulo,
          descricao: parsed.descricao || '',
          passos: parsed.passos || [],
          expandido: false
        };
      }));
    }
  };

  const syncDb = async (roteiroData: Roteiro) => {
    await supabase.from('roteiros').update({
      conteudo: JSON.stringify({ descricao: roteiroData.descricao, passos: roteiroData.passos })
    }).eq('id', roteiroData.id);
  };

  const addRoteiro = async () => {
    if (!novoRoteiro.titulo.trim()) return;

    const newRoteiroData = { descricao: novoRoteiro.descricao, passos: [] };
    const { data, error } = await supabase.from('roteiros').insert([{
      campanha_id: campanhaId,
      titulo: novoRoteiro.titulo,
      conteudo: JSON.stringify(newRoteiroData),
      ordem: roteiros.length
    }]).select().single();

    if (data && !error) {
      setRoteiros(prev => [...prev, {
        id: data.id,
        titulo: data.titulo,
        descricao: novoRoteiro.descricao,
        passos: [],
        expandido: true
      }]);
      setNovoRoteiro({ titulo: '', descricao: '' });
      setShowNewRoteiro(false);
    }
  };

  const deleteRoteiro = async (id: string) => {
    await supabase.from('roteiros').delete().eq('id', id);
    setRoteiros(prev => prev.filter(r => r.id !== id));
  };

  const toggleExpand = (id: string) =>
    setRoteiros(prev => prev.map(r => r.id === id ? { ...r, expandido: !r.expandido } : r));

  const addPasso = (roteiroId: string) => {
    setRoteiros(prev => {
      const updated = prev.map(r => {
        if (r.id !== roteiroId) return r;
        const newState = { ...r, passos: [...r.passos, { id: Date.now(), titulo: 'Novo Passo', descricao: '', concluido: false }] };
        syncDb(newState); // Sincroniza logo após criar
        return newState;
      });
      return updated;
    });
  };

  const updatePasso = (roteiroId: string, passoId: number, field: string, val: any) => {
    setRoteiros(prev => prev.map(r =>
      r.id !== roteiroId ? r : {
        ...r,
        passos: r.passos.map(p => p.id === passoId ? { ...p, [field]: val } : p)
      }
    ));
  };

  const triggerDbSave = (roteiroId: string) => {
    const roteiroToSave = roteiros.find(r => r.id === roteiroId);
    if (roteiroToSave) syncDb(roteiroToSave);
  };

  const deletePasso = (roteiroId: string, passoId: number) => {
    setRoteiros(prev => {
      const updated = prev.map(r => {
        if (r.id !== roteiroId) return r;
        const newState = { ...r, passos: r.passos.filter(p => p.id !== passoId) };
        syncDb(newState); // Sincroniza logo após apagar
        return newState;
      });
      return updated;
    });
  };

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}><Scroll size={20} /> Roteiros</h2>
        <button className={styles.addBtn} onClick={() => setShowNewRoteiro(!showNewRoteiro)}>
          <Plus size={16} /> Novo Roteiro
        </button>
      </div>

      {showNewRoteiro && (
        <div className={styles.formCard}>
          <div className={styles.formGroup}>
            <label>Título do Roteiro</label>
            <input
              className={styles.input}
              placeholder="Ex: Arco da Akatsuki..."
              value={novoRoteiro.titulo}
              onChange={e => setNovoRoteiro({ ...novoRoteiro, titulo: e.target.value })}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Descrição Geral</label>
            <textarea
              className={styles.textarea}
              placeholder="Resumo do arco ou evento..."
              value={novoRoteiro.descricao}
              onChange={e => setNovoRoteiro({ ...novoRoteiro, descricao: e.target.value })}
              rows={3}
            />
          </div>
          <div className={styles.formActions}>
            <button className={styles.cancelBtn} onClick={() => setShowNewRoteiro(false)}>Cancelar</button>
            <button className={styles.confirmBtn} onClick={addRoteiro}>Criar Roteiro</button>
          </div>
        </div>
      )}

      <div className={styles.roteirosList}>
        {roteiros.map(roteiro => {
          const concluidos = roteiro.passos.filter(p => p.concluido).length;
          const total      = roteiro.passos.length;
          const progresso  = total > 0 ? (concluidos / total) * 100 : 0;

          return (
            <div key={roteiro.id} className={styles.roteiroCard}>
              <div className={styles.roteiroHeader}>
                <div className={styles.roteiroTitleRow}>
                  <button className={styles.expandBtn} onClick={() => toggleExpand(roteiro.id)}>
                    {roteiro.expandido ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                  <div>
                    <h3 className={styles.roteiroTitulo}>{roteiro.titulo}</h3>
                    {roteiro.descricao && <p className={styles.roteiroDesc}>{roteiro.descricao}</p>}
                  </div>
                </div>
                <div className={styles.roteiroMeta}>
                  <span className={styles.roteiroProgress}>{concluidos}/{total} passos</span>
                  <button onClick={() => deleteRoteiro(roteiro.id)} className={styles.actionBtn} style={{ color: '#ff4444' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {total > 0 && (
                <div className={styles.progressTrack}>
                  <div className={styles.progressFill} style={{ width: `${progresso}%` }} />
                </div>
              )}

              {roteiro.expandido && (
                <div className={styles.passosList}>
                  {roteiro.passos.map((passo, idx) => (
                    <div key={passo.id} className={`${styles.passoItem} ${passo.concluido ? styles.passoConcluido : ''}`}>
                      <div className={styles.passoLeft}>
                        <button
                          className={`${styles.passoCheck} ${passo.concluido ? styles.passoCheckDone : ''}`}
                          onClick={() => {
                            updatePasso(roteiro.id, passo.id, 'concluido', !passo.concluido);
                            // Sincroniza com db no timeout rapido para garantir que o state rodou
                            setTimeout(() => triggerDbSave(roteiro.id), 100);
                          }}
                        >
                          {passo.concluido ? <Check size={12} /> : <span>{idx + 1}</span>}
                        </button>
                        <div className={styles.passoConnector} />
                      </div>

                      <div className={styles.passoContent}>
                        <input
                          className={styles.passoTitulo}
                          value={passo.titulo}
                          onChange={e => updatePasso(roteiro.id, passo.id, 'titulo', e.target.value)}
                          onBlur={() => triggerDbSave(roteiro.id)} // Salva no banco ao sair do input
                          placeholder="Título do passo..."
                        />
                        <textarea
                          className={styles.passoDesc}
                          value={passo.descricao}
                          onChange={e => updatePasso(roteiro.id, passo.id, 'descricao', e.target.value)}
                          onBlur={() => triggerDbSave(roteiro.id)} // Salva no banco ao sair do textarea
                          placeholder="Descrição, dicas para o mestre, eventos secretos..."
                          rows={2}
                        />
                      </div>

                      <button
                        className={styles.actionBtn}
                        style={{ color: '#333', alignSelf: 'flex-start', marginTop: '8px' }}
                        onClick={() => deletePasso(roteiro.id, passo.id)}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}

                  <button className={styles.addPassoBtn} onClick={() => addPasso(roteiro.id)}>
                    <Plus size={14} /> Adicionar Passo
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {roteiros.length === 0 && (
          <div className={styles.emptyState}>
            <Scroll size={40} />
            <p>Nenhum roteiro criado ainda</p>
          </div>
        )}
      </div>
    </div>
  );
}