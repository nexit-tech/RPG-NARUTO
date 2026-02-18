'use client';

import React, { useState } from 'react';
import { Scroll, Plus, Trash2, Check, X, ChevronDown, ChevronUp } from 'lucide-react';
import styles from './styles.module.css';

interface RoteiroPasso {
  id: number;
  titulo: string;
  descricao: string;
  concluido: boolean;
}

interface Roteiro {
  id: number;
  titulo: string;
  descricao: string;
  passos: RoteiroPasso[];
  expandido: boolean;
}

const INITIAL_ROTEIROS: Roteiro[] = [
  {
    id: 1,
    titulo: 'Arco: Exame Chūnin',
    descricao: 'Os jogadores participam do exame e precisam superar as 3 fases.',
    expandido: true,
    passos: [
      { id: 1, titulo: 'Fase 1 — Prova Escrita',    descricao: 'Teste de inteligência e coleta de informações. Dica: encorajar espionagem.', concluido: true },
      { id: 2, titulo: 'Fase 2 — Floresta da Morte', descricao: 'Sobreviver por 5 dias e coletar os pergaminhos Terra e Céu.', concluido: true },
      { id: 3, titulo: 'Fase 3 — Batalhas',           descricao: 'Confrontos individuais. Revelar que Orochimaru infiltrou agentes.', concluido: false },
      { id: 4, titulo: 'Twist — Invasão de Konoha',   descricao: 'Durante as finais, Orochimaru e Suna atacam. Combate em massa.', concluido: false },
    ],
  },
];

export default function RoteirosSection() {
  const [roteiros, setRoteiros] = useState<Roteiro[]>(INITIAL_ROTEIROS);
  const [showNewRoteiro, setShowNewRoteiro] = useState(false);
  const [novoRoteiro, setNovoRoteiro] = useState({ titulo: '', descricao: '' });

  // ── ROTEIRO ACTIONS ─────────────────────────────
  const addRoteiro = () => {
    if (!novoRoteiro.titulo.trim()) return;
    setRoteiros(prev => [...prev, { id: Date.now(), ...novoRoteiro, expandido: true, passos: [] }]);
    setNovoRoteiro({ titulo: '', descricao: '' });
    setShowNewRoteiro(false);
  };

  const deleteRoteiro = (id: number) => setRoteiros(prev => prev.filter(r => r.id !== id));

  const toggleExpand = (id: number) =>
    setRoteiros(prev => prev.map(r => r.id === id ? { ...r, expandido: !r.expandido } : r));

  // ── PASSO ACTIONS ────────────────────────────────
  const addPasso = (roteiroId: number) =>
    setRoteiros(prev => prev.map(r =>
      r.id !== roteiroId ? r : {
        ...r,
        passos: [...r.passos, { id: Date.now(), titulo: 'Novo Passo', descricao: '', concluido: false }]
      }
    ));

  const updatePasso = (roteiroId: number, passoId: number, field: string, val: any) =>
    setRoteiros(prev => prev.map(r =>
      r.id !== roteiroId ? r : {
        ...r,
        passos: r.passos.map(p => p.id === passoId ? { ...p, [field]: val } : p)
      }
    ));

  const deletePasso = (roteiroId: number, passoId: number) =>
    setRoteiros(prev => prev.map(r =>
      r.id !== roteiroId ? r : { ...r, passos: r.passos.filter(p => p.id !== passoId) }
    ));

  return (
    <div className={styles.section}>
      {/* HEADER */}
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}><Scroll size={20} /> Roteiros</h2>
        <button className={styles.addBtn} onClick={() => setShowNewRoteiro(!showNewRoteiro)}>
          <Plus size={16} /> Novo Roteiro
        </button>
      </div>

      {/* FORM NOVO ROTEIRO */}
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

      {/* LISTA DE ROTEIROS */}
      <div className={styles.roteirosList}>
        {roteiros.map(roteiro => {
          const concluidos = roteiro.passos.filter(p => p.concluido).length;
          const total      = roteiro.passos.length;
          const progresso  = total > 0 ? (concluidos / total) * 100 : 0;

          return (
            <div key={roteiro.id} className={styles.roteiroCard}>
              {/* HEADER DO ROTEIRO */}
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

              {/* BARRA DE PROGRESSO */}
              {total > 0 && (
                <div className={styles.progressTrack}>
                  <div className={styles.progressFill} style={{ width: `${progresso}%` }} />
                </div>
              )}

              {/* PASSOS */}
              {roteiro.expandido && (
                <div className={styles.passosList}>
                  {roteiro.passos.map((passo, idx) => (
                    <div key={passo.id} className={`${styles.passoItem} ${passo.concluido ? styles.passoConcluido : ''}`}>
                      <div className={styles.passoLeft}>
                        <button
                          className={`${styles.passoCheck} ${passo.concluido ? styles.passoCheckDone : ''}`}
                          onClick={() => updatePasso(roteiro.id, passo.id, 'concluido', !passo.concluido)}
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
                          placeholder="Título do passo..."
                        />
                        <textarea
                          className={styles.passoDesc}
                          value={passo.descricao}
                          onChange={e => updatePasso(roteiro.id, passo.id, 'descricao', e.target.value)}
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