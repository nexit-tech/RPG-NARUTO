import React, { useState, useEffect } from 'react';
import { Edit, Save } from 'lucide-react';
import styles from './styles.module.css';

export default function SheetHeader({ data, onChange }: { data: any, onChange?: any }) {
  // Puxa o "info" do data ou cria um objeto vazio
  const [localInfo, setLocalInfo] = useState(data?.info || {});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (data?.info) {
      setLocalInfo(data.info);
    }
  }, [data]);

  const handleChange = (field: string, val: string) => {
    const updatedInfo = { ...localInfo, [field]: val };
    setLocalInfo(updatedInfo);
    
    // Se o componente pai tiver um onChange, avisa ele também
    if (onChange) {
      onChange({ ...data, info: updatedInfo });
    }
  };

  return (
    <div className={styles.header} style={{ position: 'relative' }}>
      
      {/* BOTÃO DE EDITAR */}
      <div style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 10 }}>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: isEditing ? '#22c55e' : '#333',
            color: '#fff', border: 'none', padding: '6px 12px',
            borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem'
          }}
        >
          {isEditing ? <><Save size={16} /> SALVAR CABEÇALHO</> : <><Edit size={16} /> EDITAR CABEÇALHO</>}
        </button>
      </div>

      <div className={styles.mainInfo}>
        <div className={styles.avatarContainer}>
          <img src={localInfo.img || 'https://via.placeholder.com/140'} className={styles.avatar} alt="Avatar" />
          
          {/* Input para trocar a foto */}
          {isEditing && (
            <input 
              className={styles.urlInput} 
              style={{ padding: '2px 4px', textAlign: 'center', borderRadius: '4px' }}
              placeholder="URL da Imagem"
              value={localInfo.img || ''}
              onChange={e => handleChange('img', e.target.value)}
            />
          )}

          {/* CLÃ */}
          {isEditing ? (
            <input 
              className={styles.editInput}
              style={{ 
                position: 'absolute', bottom: '-10px', left: '50%', transform: 'translateX(-50%)', 
                width: '100px', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase',
                background: '#ff6600', color: '#000', borderRadius: '12px', padding: '2px 8px'
              }}
              value={localInfo.clan || ''}
              onChange={e => handleChange('clan', e.target.value)}
              placeholder="Clã"
            />
          ) : (
            <span className={styles.clan}>{localInfo.clan}</span>
          )}
        </div>

        {/* NOME DO PERSONAGEM */}
        {isEditing ? (
          <input 
            className={styles.editInput}
            style={{ 
              fontFamily: 'NinjaNaruto, sans-serif', fontSize: '2.5rem', marginTop: '1rem',
              textAlign: 'center', color: '#fff', width: '350px', letterSpacing: '1px'
            }}
            value={localInfo.name || ''}
            onChange={e => handleChange('name', e.target.value)}
            placeholder="Nome do Ninja"
          />
        ) : (
          <h1 className={styles.name}>{localInfo.name}</h1>
        )}
      </div>

      <div className={styles.tagsGrid}>
        {/* LINHA 1 (4 ITENS) */}
        <Tag label="Nível Shinobi" field="shinobiLevel" value={localInfo.shinobiLevel} isEditing={isEditing} onChange={handleChange} />
        <Tag label="Nível Campanha" field="campaignLevel" value={localInfo.campaignLevel} isEditing={isEditing} onChange={handleChange} />
        <Tag label="Idade" field="age" value={localInfo.age} isEditing={isEditing} onChange={handleChange} />
        <Tag label="Gênero" field="gender" value={localInfo.gender} isEditing={isEditing} onChange={handleChange} />
        
        {/* LINHA 2 (4 ITENS) */}
        <Tag label="Vila Origem" field="originVillage" value={localInfo.originVillage} isEditing={isEditing} onChange={handleChange} />
        <Tag label="Vila Atuante" field="activeVillage" value={localInfo.activeVillage} isEditing={isEditing} onChange={handleChange} />
        <Tag label="Tendência" field="alignment" value={localInfo.alignment} isEditing={isEditing} onChange={handleChange} />
        <Tag label="Alt / Peso" field="heightWeight" value={localInfo.heightWeight} isEditing={isEditing} onChange={handleChange} />
      </div>
    </div>
  );
}

// Subcomponente Tag ajustado para receber o modo edição
function Tag({ label, field, value, isEditing, onChange }: any) {
  return (
    <div className={styles.tag}>
      <label>{label}</label>
      {isEditing ? (
        <input 
          className={styles.editInput} 
          value={value || ''} 
          onChange={e => onChange(field, e.target.value)} 
          style={{ marginTop: '2px' }}
        />
      ) : (
        <span>{value}</span>
      )}
    </div>
  );
}