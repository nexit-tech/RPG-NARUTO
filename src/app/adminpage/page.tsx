'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import styles from './styles.module.css';
import NinjaModal from './components/NinjaModal';
import CampaignCard, { Campaign } from './components/CampaignCard';

// --- MOCK DATA (Imagens Reais de Naruto) ---
const INITIAL_CAMPAIGNS: Campaign[] = [
  { 
    id: 1, 
    name: 'A Sombra da Akatsuki', 
    level: 'Rank S (Nvl 12)', 
    players: 4, 
    // Imagem da Akatsuki (Nuvens)
    imageUrl: 'https://imgs.search.brave.com/13oZlmakm4WgGpOhIwyLFCKf18KOw9yOrE79bhJSqqE/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL00v/TVY1Qk1qVTBORGd6/WlRNdFpHTm1ZUzAw/WXpObUxUaGxNVGt0/WXpNM09HSmpPVGxr/TkRCbVhrRXlYa0Zx/Y0dkZVFYVnlOelUx/TnpFM05UZ0AuanBn' 
  },
  { 
    id: 2, 
    name: 'Exame Chunnin: Floresta da Morte', 
    level: 'Genin (Nvl 3)', 
    players: 6,
    // Imagem da Floresta / Portão
    imageUrl: 'https://imgs.search.brave.com/oeorTa8qLitRgjIz4ApXVeErnXx7JXBTS-Zow0OLM-4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzL2IwLzdl/LzNmL2IwN2UzZmYy/MTYzZDg0MGFlMTll/MmU2YWQ3OTYwMWY1/LmpwZw' 
  },
  { 
    id: 3, 
    name: 'O Vale do Fim', 
    level: 'Lenda (Nvl 20)', 
    players: 2,
    // Imagem das Estátuas Madara vs Hashirama
    imageUrl: 'https://images7.alphacoders.com/611/611138.png' 
  },
];

export default function AdminPage() {
  const router = useRouter();
  
  // Estado das Campanhas
  const [campaigns, setCampaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS);
  
  // Controle dos Modais
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  
  // Estados de Edição/Criação
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [formData, setFormData] = useState({ name: '', level: '', imageUrl: '' });
  
  // Estado de Exclusão
  const [campaignToDelete, setCampaignToDelete] = useState<Campaign | null>(null);

  // --- NAVEGAÇÃO ---
  const handleCardClick = () => {
    // Futuramente passaremos o ID: router.push(`/admin-campanha/${id}`);
    router.push('/admin-campanha');
  };

  // --- ABRIR MODAL (CRIAR ou EDITAR) ---
  const openFormModal = (e?: React.MouseEvent, campaign?: Campaign) => {
    if (e) e.stopPropagation(); // Impede o clique no card

    if (campaign) {
      // Modo EDIÇÃO
      setEditingCampaign(campaign);
      setFormData({ 
        name: campaign.name, 
        level: campaign.level, 
        imageUrl: campaign.imageUrl || '' 
      });
    } else {
      // Modo CRIAÇÃO
      setEditingCampaign(null);
      setFormData({ name: '', level: '', imageUrl: '' });
    }
    setIsFormOpen(true);
  };

  // --- SALVAR (LOGICA DE ADD/UPDATE) ---
  const handleSave = () => {
    if (editingCampaign) {
      // Atualizar Existente
      setCampaigns(prev => prev.map(c => 
        c.id === editingCampaign.id 
          ? { ...c, ...formData, players: c.players } 
          : c
      ));
    } else {
      // Criar Novo
      const newCamp: Campaign = { 
        id: Math.random(), // ID Provisório
        name: formData.name,
        level: formData.level,
        imageUrl: formData.imageUrl,
        players: 0 // Começa com 0
      };
      setCampaigns([...campaigns, newCamp]);
      
      // Opcional: Redirecionar logo após criar
      // router.push('/admin-campanha');
    }
    setIsFormOpen(false);
  };

  // --- DELETE ACTIONS ---
  const openDeleteModal = (e: React.MouseEvent, campaign: Campaign) => {
    e.stopPropagation();
    setCampaignToDelete(campaign);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    setCampaigns(prev => prev.filter(c => c.id !== campaignToDelete?.id));
    setIsDeleteOpen(false);
    setCampaignToDelete(null);
  };

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

      {/* LISTA DE CARDS (MODULAR) */}
      <section className={styles.listContainer}>
        {campaigns.map((camp) => (
          <CampaignCard 
            key={camp.id}
            data={camp}
            onEdit={openFormModal}
            onDelete={openDeleteModal}
            onClick={handleCardClick}
          />
        ))}
      </section>

      {/* --- MODAL UNIFICADO (CRIAR / EDITAR) --- */}
      <NinjaModal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        title={editingCampaign ? "Reescrever Pergaminho" : "Invocar Nova Missão"}
      >
        <div className={styles.formGroup}>
          <label>Nome da Campanha</label>
          <input 
            className={styles.input}
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="Ex: A Grande Guerra Ninja"
          />
        </div>
        
        <div className={styles.formGroup}>
          <label>URL da Imagem (Capa)</label>
          <input 
            className={styles.input}
            value={formData.imageUrl}
            onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
            placeholder="https://..."
          />
        </div>

        <div className={styles.formGroup}>
          <label>Nível / Rank Recomendado</label>
          <input 
            className={styles.input}
            value={formData.level}
            onChange={(e) => setFormData({...formData, level: e.target.value})}
            placeholder="Ex: Rank S (Jounin)"
          />
        </div>
        
        <button className={styles.submitBtn} onClick={handleSave}>
          {editingCampaign ? "Salvar Alterações" : "Criar Campanha"}
        </button>
      </NinjaModal>

      {/* --- MODAL DE CONFIRMAÇÃO (DELETE) --- */}
      <NinjaModal 
        isOpen={isDeleteOpen} 
        onClose={() => setIsDeleteOpen(false)} 
        title="Queimar Arquivo?"
      >
        <p style={{ color: '#ccc', marginBottom: '20px', lineHeight: '1.5' }}>
          Tem certeza que deseja excluir a campanha <strong>{campaignToDelete?.name}</strong>? 
          <br/>
          <small style={{ color: '#666' }}>Esta ação é irreversível.</small>
        </p>
        <div className={styles.modalActions}>
          <button className={styles.cancelBtn} onClick={() => setIsDeleteOpen(false)}>Cancelar</button>
          <button className={styles.confirmDeleteBtn} onClick={confirmDelete}>Excluir</button>
        </div>
      </NinjaModal>
    </main>
  );
}