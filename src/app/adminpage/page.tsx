'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Loader2 } from 'lucide-react';
import styles from './styles.module.css';
import NinjaModal from './components/NinjaModal';
import CampaignCard from './components/CampaignCard';
import { supabase } from '@/lib/supabase';

export interface Campaign {
  id: string;
  name: string;
  level: string;
  players: number;
  imageUrl?: string;
}

// Mapeamento entre o formato do componente e o banco
function dbToCampaign(row: any): Campaign {
  return {
    id: row.id,
    name: row.nome,
    level: `${row.rank} (Nvl ${row.nivel})`,
    players: row.jogadores ?? 0,
    imageUrl: row.banner_url ?? undefined,
  };
}

export default function AdminPage() {
  const router = useRouter();

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [formData, setFormData] = useState({ name: '', rank: '', nivel: '', imageUrl: '' });

  const [campaignToDelete, setCampaignToDelete] = useState<Campaign | null>(null);

  // ── CARREGAR CAMPANHAS ──────────────────────────────────────────────────────
  useEffect(() => {
    fetchCampaigns();
  }, []);

  async function fetchCampaigns() {
    setLoading(true);
    const { data, error } = await supabase
      .from('campanhas')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar campanhas:', error);
    } else {
      setCampaigns((data ?? []).map(dbToCampaign));
    }
    setLoading(false);
  }

  // ── NAVEGAÇÃO ───────────────────────────────────────────────────────────────
  const handleCardClick = (id: string) => {
    router.push(`/admin-campanha/${id}`);
  };

  // ── ABRIR MODAL ─────────────────────────────────────────────────────────────
  const openFormModal = (e?: React.MouseEvent, campaign?: Campaign) => {
    if (e) e.stopPropagation();

    if (campaign) {
      setEditingCampaign(campaign);
      const match = campaign.level.match(/^(.+?)\s*\(Nvl\s*(\d+)\)$/);
      setFormData({
        name: campaign.name,
        rank: match ? match[1].trim() : campaign.level,
        nivel: match ? match[2] : '',
        imageUrl: campaign.imageUrl ?? '',
      });
    } else {
      setEditingCampaign(null);
      setFormData({ name: '', rank: '', nivel: '', imageUrl: '' });
    }
    setIsFormOpen(true);
  };

  // ── SALVAR (CREATE / UPDATE) ─────────────────────────────────────────────────
  const handleSave = async () => {
    if (!formData.name.trim()) return;
    setSaving(true);

    const payload = {
      nome: formData.name,
      rank: formData.rank,
      nivel: parseInt(formData.nivel) || 1,
      banner_url: formData.imageUrl || null,
    };

    if (editingCampaign) {
      // APENAS ATUALIZA
      const { error } = await supabase
        .from('campanhas')
        .update(payload)
        .eq('id', editingCampaign.id);

      if (error) console.error('Erro ao atualizar:', error);
    } else {
      // 🌟 CRIAR NOVA CAMPANHA + SESSÃO AUTOMÁTICA
      const { data: novaCampanha, error } = await supabase
        .from('campanhas')
        .insert({ ...payload, status: 'ativa', jogadores: 0 })
        .select('id') // Pedimos pro Supabase devolver o ID gerado!
        .single();

      if (error) {
        console.error('Erro ao criar campanha:', error);
      } else if (novaCampanha) {
        // Agora que temos o ID da campanha, criamos a Sessão atrelada a ela
        const { error: sessaoError } = await supabase
          .from('sessoes')
          .insert({
            campanha_id: novaCampanha.id,
            combat_active: false,
            current_turn_index: 0,
            show_grid: true,
            grid_scale: 1.5,
            snap_to_grid: true
          });

        if (sessaoError) {
          console.error('Erro ao criar sessão base:', sessaoError);
        } else {
          console.log('✅ Campanha e Sessão criadas com sucesso!');
        }
      }
    }

    await fetchCampaigns();
    setSaving(false);
    setIsFormOpen(false);
  };

  // ── DELETE ───────────────────────────────────────────────────────────────────
  const openDeleteModal = (e: React.MouseEvent, campaign: Campaign) => {
    e.stopPropagation();
    setCampaignToDelete(campaign);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!campaignToDelete) return;
    setSaving(true);

    // Nota: Como a sessão tem uma foreign key (campanha_id), 
    // se o banco estiver configurado com CASCADE, deletar a campanha deleta a sessão.
    // Se não tiver CASCADE, idealmente apagaríamos a sessão primeiro. Mas vamos focar no insert por hora!
    const { error } = await supabase
      .from('campanhas')
      .delete()
      .eq('id', campaignToDelete.id);

    if (error) console.error('Erro ao deletar:', error);

    await fetchCampaigns();
    setSaving(false);
    setIsDeleteOpen(false);
    setCampaignToDelete(null);
  };

  // ── RENDERIZAÇÃO ──────────────────────────────
  return (
    <main className={styles.container}>
      {/* HEADER */}
      <header className={styles.topBar}>
        <div>
          <h1 className={styles.pageTitle}>Missões Ativas</h1>
          <p className={styles.subTitle}>Gerenciamento de Campanhas do Servidor</p>
        </div>
        <button className={styles.createBtn} onClick={(e) => openFormModal(e)}>
          <Plus size={20} />
          <span>Nova Missão</span>
        </button>
      </header>

      {/* LISTA */}
      <section className={styles.listContainer}>
        {loading ? (
          <div className={styles.loadingState}>
            <Loader2 size={32} className={styles.spinner} />
            <span>Carregando missões...</span>
          </div>
        ) : campaigns.length === 0 ? (
          <div className={styles.emptyState}>
            <span>Nenhuma campanha encontrada.</span>
            <small>Clique em "Nova Missão" para começar.</small>
          </div>
        ) : (
          campaigns.map((camp) => (
            <CampaignCard
              key={camp.id}
              data={camp}
              onEdit={openFormModal}
              onDelete={openDeleteModal}
              onClick={() => handleCardClick(camp.id)}
            />
          ))
        )}
      </section>

      {/* MODAL CRIAR / EDITAR */}
      <NinjaModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingCampaign ? 'Reescrever Pergaminho' : 'Invocar Nova Missão'}
      >
        <div className={styles.formGroup}>
          <label>Nome da Campanha</label>
          <input
            className={styles.input}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ex: A Grande Guerra Ninja"
          />
        </div>

        <div className={styles.formGroup}>
          <label>URL da Imagem (Capa)</label>
          <input
            className={styles.input}
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            placeholder="https://..."
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <div className={styles.formGroup} style={{ flex: 2 }}>
            <label>Rank</label>
            <input
              className={styles.input}
              value={formData.rank}
              onChange={(e) => setFormData({ ...formData, rank: e.target.value })}
              placeholder="Ex: Rank S, Genin, Kage..."
            />
          </div>
          <div className={styles.formGroup} style={{ flex: 1 }}>
            <label>Nível</label>
            <input
              className={styles.input}
              type="number"
              min={1}
              value={formData.nivel}
              onChange={(e) => setFormData({ ...formData, nivel: e.target.value })}
              placeholder="Ex: 12"
            />
          </div>
        </div>

        <button className={styles.submitBtn} onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 size={18} className={styles.spinner} /> : null}
          {editingCampaign ? 'Salvar Alterações' : 'Criar Campanha'}
        </button>
      </NinjaModal>

      {/* MODAL DELETE */}
      <NinjaModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Queimar Arquivo?"
      >
        <p style={{ color: '#ccc', marginBottom: '20px', lineHeight: '1.5' }}>
          Tem certeza que deseja excluir a campanha <strong>{campaignToDelete?.name}</strong>?
          <br />
          <small style={{ color: '#666' }}>Esta ação é irreversível.</small>
        </p>
        <div className={styles.modalActions}>
          <button className={styles.cancelBtn} onClick={() => setIsDeleteOpen(false)}>Cancelar</button>
          <button className={styles.confirmDeleteBtn} onClick={confirmDelete} disabled={saving}>
            {saving ? <Loader2 size={16} className={styles.spinner} /> : null}
            Excluir
          </button>
        </div>
      </NinjaModal>
    </main>
  );
}