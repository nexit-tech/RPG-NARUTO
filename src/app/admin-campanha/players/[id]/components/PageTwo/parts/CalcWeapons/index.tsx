import React from 'react';
import { Sword, Plus, Trash2 } from 'lucide-react';
import styles from './styles.module.css';

export default function CalcWeapons({ data, isEditing, onChange }: any) {
  
  const weaponsData = Array.isArray(data) ? data : [];

  const handleFieldChange = (index: number, field: string, val: string) => {
    const newData = [...weaponsData];
    newData[index] = { ...newData[index], [field]: val };
    onChange(newData);
  };

  const addItem = () => {
    onChange([...weaponsData, { nome: '', dano: '', bonus: 0, alcance: '', crit: '', dureza: 0, base: '' }]);
  };

  const removeItem = (index: number) => {
    const newData = weaponsData.filter((_, i) => i !== index);
    onChange(newData);
  };

  const inputStyle = {
    background: 'rgba(0,0,0,0.5)', border: '1px solid #444', color: '#fff', 
    width: '100%', padding: '4px', borderRadius: '4px', outline: 'none', textAlign: 'center' as const
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <Sword size={20} color="#fff" /> <span>CALCULADORA DE DANO - ATAQUES</span>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th align="left">NOME</th>
              <th>DANO</th>
              <th>BÔNUS</th>
              <th>ALCANCE</th>
              <th>CRÍTICO</th>
              <th>DUREZA</th>
              <th>DANO BASE</th>
              {isEditing && <th style={{ width: '40px' }}></th>}
            </tr>
          </thead>
          <tbody>
            {weaponsData.map((w: any, i: number) => (
              <tr key={i}>
                <td className={styles.wName}>
                  {isEditing ? <input style={{...inputStyle, textAlign: 'left'}} value={w.nome} onChange={e => handleFieldChange(i, 'nome', e.target.value)} /> : w.nome}
                </td>
                <td align="center">
                  {isEditing ? <input style={inputStyle} value={w.dano} onChange={e => handleFieldChange(i, 'dano', e.target.value)} /> : w.dano}
                </td>
                <td align="center">
                  {isEditing ? <input type="number" style={inputStyle} value={w.bonus} onChange={e => handleFieldChange(i, 'bonus', e.target.value)} /> : `+${w.bonus}`}
                </td>
                <td align="center">
                  {isEditing ? <input style={inputStyle} value={w.alcance} onChange={e => handleFieldChange(i, 'alcance', e.target.value)} /> : w.alcance}
                </td>
                <td align="center">
                  {isEditing ? <input style={inputStyle} value={w.crit} onChange={e => handleFieldChange(i, 'crit', e.target.value)} /> : w.crit}
                </td>
                <td align="center">
                  {isEditing ? <input type="number" style={inputStyle} value={w.dureza} onChange={e => handleFieldChange(i, 'dureza', e.target.value)} /> : w.dureza}
                </td>
                <td align="center" className={styles.base}>
                  {isEditing ? <input style={inputStyle} value={w.base} onChange={e => handleFieldChange(i, 'base', e.target.value)} /> : w.base}
                </td>
                {isEditing && (
                  <td align="center">
                    <button onClick={() => removeItem(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ff4444' }}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                )}
              </tr>
            ))}
            {!isEditing && weaponsData.length < 2 && [...Array(2 - weaponsData.length)].map((_, i) => (
              <tr key={`e-${i}`}><td colSpan={7}>&nbsp;</td></tr>
            ))}
          </tbody>
        </table>
        
        {isEditing && (
          <div style={{ padding: '8px', display: 'flex', justifyContent: 'center' }}>
            <button 
              onClick={addItem}
              style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#333', color: '#fff', border: '1px solid #555', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}
            >
              <Plus size={16} /> ADICIONAR ATAQUE
            </button>
          </div>
        )}
      </div>
    </div>
  );
}