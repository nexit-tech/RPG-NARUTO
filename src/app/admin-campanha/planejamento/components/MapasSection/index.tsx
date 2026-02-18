'use client';

import React, { useState } from 'react';
import { Map, Plus, Eye, X, Trash2 } from 'lucide-react';
import styles from './styles.module.css';

interface MapItem {
  id: number;
  name: string;
  imageUrl: string;
  description: string;
}

const INITIAL_MAPS: MapItem[] = [
  { id: 1, name: 'Floresta de Konoha', imageUrl: 'https://i.pinimg.com/originals/99/3a/05/993a059c03db26993952dc67b931920d.jpg', description: 'Área de treinamento e patrulha' },
  { id: 2, name: 'Vale do Fim', imageUrl: 'https://images7.alphacoders.com/611/611138.png', description: 'Local do confronto final' },
];

export default function MapasSection() {
  const [mapas, setMapas] = useState<MapItem[]>(INITIAL_MAPS);
  const [showForm, setShowForm] = useState(false);
  const [viewMap, setViewMap] = useState<MapItem | null>(null);
  const [form, setForm] = useState({ name: '', imageUrl: '', description: '' });

  const handleAdd = () => {
    if (!form.name.trim() || !form.imageUrl.trim()) return;
    setMapas(prev => [...prev, { id: Date.now(), ...form }]);
    setForm({ name: '', imageUrl: '', description: '' });
    setShowForm(false);
  };

  const handleDelete = (id: number) => setMapas(prev => prev.filter(m => m.id !== id));

  return (
    <div className={styles.section}>
      {/* HEADER */}
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}><Map size={20} /> Mapas</h2>
        <button className={styles.addBtn} onClick={() => setShowForm(!showForm)}>
          <Plus size={16} /> Adicionar Mapa
        </button>
      </div>

      {/* FORM */}
      {showForm && (
        <div className={styles.formCard}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Nome do Mapa</label>
              <input
                className={styles.input}
                placeholder="Ex: Aldeia da Chuva"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className={styles.formGroup}>
              <label>URL da Imagem</label>
              <input
                className={styles.input}
                placeholder="https://..."
                value={form.imageUrl}
                onChange={e => setForm({ ...form, imageUrl: e.target.value })}
              />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label>Descrição (opcional)</label>
            <input
              className={styles.input}
              placeholder="Contexto ou notas sobre este mapa..."
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div className={styles.formActions}>
            <button className={styles.cancelBtn} onClick={() => setShowForm(false)}>Cancelar</button>
            <button className={styles.confirmBtn} onClick={handleAdd}>Salvar Mapa</button>
          </div>
        </div>
      )}

      {/* GRID */}
      <div className={styles.mapGrid}>
        {mapas.map(map => (
          <div key={map.id} className={styles.mapCard}>
            <div className={styles.mapThumb}>
              <img src={map.imageUrl} alt={map.name} />
              <div className={styles.mapOverlay}>
                <button className={styles.viewBtn} onClick={() => setViewMap(map)}>
                  <Eye size={18} /> Ver Mapa
                </button>
              </div>
            </div>
            <div className={styles.mapInfo}>
              <h3 className={styles.mapName}>{map.name}</h3>
              {map.description && <p className={styles.mapDesc}>{map.description}</p>}
            </div>
            <button className={styles.deleteIconBtn} onClick={() => handleDelete(map.id)}>
              <Trash2 size={14} />
            </button>
          </div>
        ))}

        {mapas.length === 0 && (
          <div className={styles.emptyState}>
            <Map size={40} />
            <p>Nenhum mapa adicionado ainda</p>
          </div>
        )}
      </div>

      {/* LIGHTBOX */}
      {viewMap && (
        <div className={styles.lightbox} onClick={() => setViewMap(null)}>
          <div className={styles.lightboxContent} onClick={e => e.stopPropagation()}>
            <div className={styles.lightboxHeader}>
              <h3>{viewMap.name}</h3>
              <button onClick={() => setViewMap(null)} className={styles.lightboxClose}><X size={20} /></button>
            </div>
            <img src={viewMap.imageUrl} alt={viewMap.name} className={styles.lightboxImg} />
            {viewMap.description && <p className={styles.lightboxDesc}>{viewMap.description}</p>}
          </div>
        </div>
      )}
    </div>
  );
}