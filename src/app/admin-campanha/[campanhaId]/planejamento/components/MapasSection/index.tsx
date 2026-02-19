'use client';

import React, { useState, useEffect } from 'react';
import { Map, Plus, Eye, X, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import styles from './styles.module.css';

interface MapItem {
  id: string; // Virou string pro UUID
  name: string;
  imageUrl: string;
  description: string;
}

export default function MapasSection({ campanhaId }: { campanhaId: string }) {
  const [mapas, setMapas] = useState<MapItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [viewMap, setViewMap] = useState<MapItem | null>(null);
  const [form, setForm] = useState({ name: '', imageUrl: '', description: '' });

  useEffect(() => {
    fetchMapas();
  }, [campanhaId]);

  const fetchMapas = async () => {
    const { data, error } = await supabase
      .from('mapas')
      .select('*')
      .eq('campanha_id', campanhaId)
      .order('created_at', { ascending: false });

    if (data && !error) {
      setMapas(data.map(d => ({
        id: d.id,
        name: d.nome,
        imageUrl: d.url,
        description: d.descricao || ''
      })));
    }
  };

  const handleAdd = async () => {
    if (!form.name.trim() || !form.imageUrl.trim()) return;
    
    const { data, error } = await supabase.from('mapas').insert([{
      campanha_id: campanhaId,
      nome: form.name,
      url: form.imageUrl,
      descricao: form.description
    }]).select().single();

    if (data && !error) {
      setMapas(prev => [{
        id: data.id, 
        name: data.nome, 
        imageUrl: data.url, 
        description: data.descricao || '' 
      }, ...prev]);
      
      setForm({ name: '', imageUrl: '', description: '' });
      setShowForm(false);
    }
  };

  const handleDelete = async (id: string) => {
    await supabase.from('mapas').delete().eq('id', id);
    setMapas(prev => prev.filter(m => m.id !== id));
  };

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}><Map size={20} /> Mapas</h2>
        <button className={styles.addBtn} onClick={() => setShowForm(!showForm)}>
          <Plus size={16} /> Adicionar Mapa
        </button>
      </div>

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