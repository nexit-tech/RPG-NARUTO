import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import styles from './styles.module.css';

export default function MobSelectorModal({ campanhaId, isOpen, onClose, onSelect }: any) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'mob' | 'npc'>('mob');

  useEffect(() => {
    if (isOpen && campanhaId) fetchRegistros();
  }, [isOpen, campanhaId, tab]);

  async function fetchRegistros() {
    setLoading(true);
    const tableName = tab === 'mob' ? 'mobs' : 'npcs';
    
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .eq('campanha_id', campanhaId)
      .order('nome', { ascending: true });

    if (!error && data) {
      setItems(data);
    }
    setLoading(false);
  }

  if (!isOpen) return null;

  return (
    <div style={{position:'absolute', inset:0, background:'rgba(0,0,0,0.8)', zIndex:3000, display:'flex', alignItems:'center', justifyContent:'center'}}>
      <div style={{background:'#111', border:'1px solid #333', width:400, borderRadius:8, overflow:'hidden'}}>
        
        <div style={{padding:10, background:'#1a1a1a', display:'flex', justifyContent:'space-between', alignItems: 'center'}}>
          <h3 style={{color:'#fff', fontFamily:'NinjaNaruto', margin:0}}>INVOCAR ENTIDADE</h3>
          <button onClick={onClose} style={{background:'transparent', border:'none', color:'#fff', cursor:'pointer'}}><X size={18}/></button>
        </div>

        <div style={{display:'flex', background:'#222'}}>
          <button 
            onClick={() => setTab('mob')} 
            style={{flex: 1, padding: '10px', background: tab === 'mob' ? '#ff6600' : 'transparent', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold'}}
          >MOBS</button>
          <button 
            onClick={() => setTab('npc')} 
            style={{flex: 1, padding: '10px', background: tab === 'npc' ? '#ff6600' : 'transparent', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold'}}
          >NPCs</button>
        </div>

        <div style={{padding:10, minHeight:200, maxHeight:300, overflowY:'auto', display:'flex', flexDirection:'column', gap:10}}>
          {loading ? (
            <div style={{display:'flex', justifyContent:'center', padding: '2rem'}}>
              <Loader2 className="animate-spin" color="#ff6600" />
            </div>
          ) : items.length === 0 ? (
            <p style={{textAlign: 'center', color: '#666', fontSize: '0.9rem', marginTop: '2rem'}}>
              Nenhum registro encontrado.
            </p>
          ) : (
            items.map((item) => (
              <div 
                key={item.id} 
                onClick={() => onSelect(item, tab)} 
                style={{display:'flex', alignItems:'center', gap:10, padding:10, background:'#222', borderRadius:4, cursor:'pointer', border:'1px solid transparent'}}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#ff6600'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}
              >
                <img src={item.img || 'https://via.placeholder.com/150'} style={{width:40, height:40, borderRadius:'50%', objectFit:'cover'}} />
                <div>
                  <strong style={{display:'block', color:'#eee'}}>{item.nome}</strong>
                  <span style={{fontSize:12, color:'#888'}}>
                    HP: {tab === 'mob' ? item.hp_base : item.hp} | Lvl {item.nivel}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}