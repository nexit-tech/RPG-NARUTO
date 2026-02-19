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
  const [campaignToDelete, setCampaignToDelete] = useState<Campaign | null>(null);

  const [formData, setFormData] = useState({
    nome: '',
    rank: 'Rank D',
    nivel: '1',
    banner_url: ''
  });

  useEffect(() => {
    fetchCampaigns();
  }, []);

  // 1. Busca as Campanhas no Supabase
  const fetchCampaigns = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('campanhas')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar campanhas:', error);
    } else if (data) {
      setCampaigns(data.map(dbToCampaign));
    }
    setLoading(false);
  };

  const handleOpenCreate = () => {
    setEditingCampaign(null);
    setFormData({ nome: '', rank: 'Rank D', nivel: '1', banner_url: '' });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (e: React.MouseEvent, camp: Campaign) => {
    e.stopPropagation(); // Evita que o clique do card seja acionado junto com o do botão
    setEditingCampaign(camp);
    
    // Extrai o rank e o nível da string gerada pelo dbToCampaign
    const rankMatch = camp.level.split(' (')[0];
    const nivelMatch = camp.level.match(/\d+/);

    setFormData({
      nome: camp.name,
      rank: rankMatch || 'Rank D',
      nivel: nivelMatch ? nivelMatch[0] : '1',
      banner_url: camp.imageUrl || ''
    });
    setIsFormOpen(true);
  };

  const handleOpenDelete = (e: React.MouseEvent, camp: Campaign) => {
    e.stopPropagation(); // Evita que o clique do card seja acionado
    setCampaignToDelete(camp);
    setIsDeleteOpen(true);
  };

  // 2. Salva (Cria ou Edita)
  const handleSave = async () => {
    if (!formData.nome) return;
    setSaving(true);

    const payload = {
      nome: formData.nome,
      rank: formData.rank,
      nivel: parseInt(formData.nivel) || 1,
      banner_url: formData.banner_url
    };

    if (editingCampaign) {
      // Atualizar
      const { error } = await supabase
        .from('campanhas')
        .update(payload)
        .eq('id', editingCampaign.id);

      if (!error) {
        setIsFormOpen(false);
        fetchCampaigns();
      }
    } else {
      // Criar
      const { error } = await supabase
        .from('campanhas')
        .insert([payload]);

      if (!error) {
        setIsFormOpen(false);
        fetchCampaigns();
      }
    }
    setSaving(false);
  };

  // 3. Exclui Campanha
  const confirmDelete = async () => {
    if (!campaignToDelete) return;
    setSaving(true);

    const { error } = await supabase
      .from('campanhas')
      .delete()
      .eq('id', campaignToDelete.id);

    if (!error) {
      setIsDeleteOpen(false);
      setCampaignToDelete(null);
      fetchCampaigns();
    } else {
      console.error("Erro ao deletar:", error);
    }
    setSaving(false);
  };

  // === 4. AQUI ESTÁ A MÁGICA DO REDIRECIONAMENTO ===
  const handleCardClick = (id: string) => {
    // Redireciona enviando o UUID da campanha como parâmetro na URL
    router.push(`/admin-campanha?id=${id}`);
  };

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Missões e Campanhas</h1>
        <button className={styles.createBtn} onClick={handleOpenCreate}>
          <Plus size={20} /> Nova Campanha
        </button>
      </header>

      {loading ? (
        <div className={styles.loadingArea}>
          <Loader2 size={40} className={styles.spinner} />
          <p>Carregando pergaminhos...</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {campaigns.length === 0 ? (
            <p className={styles.emptyMsg}>Nenhuma campanha encontrada. Crie sua primeira missão!</p>
          ) : (
            campaigns.map((camp) => (
              <CampaignCard
                key={camp.id}
                data={camp}
                onClick={() => handleCardClick(camp.id)}
                onEdit={handleOpenEdit}
                onDelete={handleOpenDelete}
              />
            ))
          )}
        </div>
      )}

      {/* MODAL DE CRIAÇÃO / EDIÇÃO */}
      <NinjaModal
        isOpen={isFormOpen}
        onClose={() => !saving && setIsFormOpen(false)}
        title={editingCampaign ? 'Editar Campanha' : 'Nova Campanha'}
      >
        <div className={styles.formGroup}>
          <label>Nome da Campanha</label>
          <input
            className={styles.input}
            type="text"
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            placeholder="Ex: Resgate do Kazekage"
          />
        </div>

        <div className={styles.formGroup}>
          <label>URL do Banner (Opcional)</label>
          <input
            className={styles.input}
            type="text"
            value={formData.banner_url}
            onChange={(e) => setFormData({ ...formData, banner_url: e.target.value })}
            placeholder="https://..."
          />
        </div>

        <div className={styles.row}>
          <div className={styles.formGroup}>
            <label>Rank</label>
            <select
              className={styles.select}
              value={formData.rank}
              onChange={(e) => setFormData({ ...formData, rank: e.target.value })}
            >
              <option value="Rank D">Rank D</option>
              <option value="Rank C">Rank C</option>
              <option value="Rank B">Rank B</option>
              <option value="Rank A">Rank A</option>
              <option value="Rank S">Rank S</option>
            </select>
          </div>

          <div className={styles.formGroup}>
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

      {/* MODAL DE EXCLUSÃO */}
      <NinjaModal
        isOpen={isDeleteOpen}
        onClose={() => !saving && setIsDeleteOpen(false)}
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
            {saving ? <Loader2 size={16} className={styles.spinner} /> : 'Excluir'}
          </button>
        </div>
      </NinjaModal>
    </main>
  );
}