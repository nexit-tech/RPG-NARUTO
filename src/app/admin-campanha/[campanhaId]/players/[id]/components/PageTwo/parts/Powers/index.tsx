import React from 'react';
import { Zap, Plus, Trash2 } from 'lucide-react';
import styles from './styles.module.css';

export default function Powers({ data, isEditing, onChange }: any) {
  
  // Garante que é um array
  const powersData = Array.isArray(data) ? data : [];

  const handleFieldChange = (index: number, field: string, val: string) => {
    const newData = [...powersData];
    newData[index] = { ...newData[index], [field]: val };
    onChange(newData);
  };

  const addItem = () => {
    onChange([...powersData, { poder: '', nivel: 1, efeitos: '' }]);
  };

  const removeItem = (index: number) => {
    const newData = powersData.filter((_, i) => i !== index);
    onChange(newData);
  };

  const inputStyle = {
    background: 'rgba(0,0,0,0.5)', border: '1px solid #444', color: '#fff', 
    width: '100%', padding: '4px', borderRadius: '4px', outline: 'none'
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <Zap size={20} color="#fff" /> <span>PODERES</span>
      </div>
      <div className={styles.tableWrapper || ''}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th align="left">PODER</th>
              <th align="center" style={{ width: '80px' }}>NÍVEL</th>
              <th align="left">EFEITOS</th>
              {isEditing && <th style={{ width: '40px' }}></th>}
            </tr>
          </thead>
          <tbody>
            {powersData.map((p: any, i: number) => (
              <tr key={i}>
                <td className={styles.name}>
                  {isEditing ? <input style={inputStyle} value={p.poder} onChange={e => handleFieldChange(i, 'poder', e.target.value)} /> : p.poder}
                </td>
                <td align="center" className={styles.level}>
                  {isEditing ? <input type="number" style={{...inputStyle, textAlign: 'center'}} value={p.nivel} onChange={e => handleFieldChange(i, 'nivel', e.target.value)} /> : p.nivel}
                </td>
                <td className={styles.effect}>
                  {isEditing ? <input style={inputStyle} value={p.efeitos} onChange={e => handleFieldChange(i, 'efeitos', e.target.value)} /> : p.efeitos}
                </td>
                
                {/* Botão de Remover Linha */}
                {isEditing && (
                  <td align="center">
                    <button onClick={() => removeItem(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ff4444' }}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                )}
              </tr>
            ))}
            
            {/* Linhas Vazias de preenchimento (só aparecem se não estiver editando) */}
            {!isEditing && powersData.length < 4 && [...Array(4 - powersData.length)].map((_, i) => (
              <tr key={`empty-${i}`}><td colSpan={3}>&nbsp;</td></tr>
            ))}
          </tbody>
        </table>

        {/* Botão de Adicionar (só aparece editando) */}
        {isEditing && (
          <div style={{ padding: '8px', display: 'flex', justifyContent: 'center' }}>
            <button 
              onClick={addItem}
              style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#333', color: '#fff', border: '1px solid #555', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}
            >
              <Plus size={16} /> ADICIONAR PODER
            </button>
          </div>
        )}
      </div>
    </div>
  );
}