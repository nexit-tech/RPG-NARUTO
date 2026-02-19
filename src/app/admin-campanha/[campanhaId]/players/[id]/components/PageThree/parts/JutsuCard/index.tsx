import React from 'react';
import { Trash2 } from 'lucide-react';
import styles from './styles.module.css';

export default function JutsuCard({ data, isEditing, onChange, onRemove }: any) {
  
  const handleChange = (field: string, val: string) => {
    onChange({ ...data, [field]: val });
  };

  const inputStyle = {
    background: 'rgba(0,0,0,0.6)', border: '1px solid #444', color: '#fff',
    width: '100%', padding: '2px 4px', borderRadius: '4px', outline: 'none',
    fontSize: 'inherit', fontFamily: 'inherit'
  };

  // O componente Field agora injeta o input perfeitamente no seu CSS original
  const Field = ({ label, fieldKey, isTitle, highlight }: any) => (
    <div className={`${styles.field} ${highlight ? styles.highlight : ''}`}>
      <label>{label}:</label>
      {isEditing ? (
        <input 
          style={{
            ...inputStyle,
            maxWidth: isTitle ? '75%' : '55%',
            textAlign: isTitle ? 'left' as const : 'right' as const,
            fontFamily: isTitle ? 'NinjaNaruto, sans-serif' : 'inherit',
            color: isTitle ? '#ff6600' : (highlight ? '#ffcc00' : '#eee'),
            fontSize: isTitle ? '1.1rem' : '0.8rem'
          }}
          value={data[fieldKey] || ''}
          onChange={e => handleChange(fieldKey, e.target.value)}
        />
      ) : (
        <span className={isTitle ? styles.fontNinja : ''}>{data[fieldKey]}</span>
      )}
    </div>
  );

  return (
    <div className={styles.jutsuCard}>
      
      {/* Faixa de exclusão no topo (Só aparece quando editando) */}
      {isEditing && (
        <div style={{ background: 'rgba(255, 0, 0, 0.1)', padding: '6px', display: 'flex', justifyContent: 'flex-end', borderBottom: '1px solid #444' }}>
          <button 
            onClick={onRemove} 
            style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', cursor: 'pointer', color: '#ff4444', fontSize: '0.75rem', fontWeight: 'bold' }}
            title="Excluir Jutsu"
          >
            <Trash2 size={14} /> EXCLUIR JUTSU
          </button>
        </div>
      )}

      {/* Cabeçalho do Card com Recortes */}
      <div className={styles.cardFields}>
        <Field label="NOME" fieldKey="nome" isTitle />
        <div className={styles.row}>
          <Field label="AÇÃO" fieldKey="acao" />
          <Field label="NÍVEL" fieldKey="nivel" />
        </div>
        <div className={styles.row}>
          <Field label="ALVO" fieldKey="alvo" />
          <Field label="DANO" fieldKey="dano" />
        </div>
        <div className={styles.row}>
          <Field label="ALCANCE" fieldKey="alcance" />
          <Field label="DURAÇÃO" fieldKey="duracao" />
        </div>
        <Field label="EFEITOS" fieldKey="efeitos" />
        <Field label="CUSTO DE CHAKRA" fieldKey="custo" highlight />
      </div>

      {/* Seção de Descrição Pautada */}
      <div className={styles.descriptionSection}>
        <div className={styles.descHeader}>DESCRIÇÃO</div>
        <div className={styles.descBody}>
          {isEditing ? (
            <textarea 
              style={{ ...inputStyle, minHeight: '80px', resize: 'vertical', color: '#aaa', textAlign: 'left', fontSize: '0.75rem', lineHeight: '1.4' }}
              value={data.descricao || ''}
              onChange={e => handleChange('descricao', e.target.value)}
            />
          ) : (
            <p>{data.descricao}</p>
          )}
          <div className={styles.lines}></div>
        </div>
      </div>
    </div>
  );
}