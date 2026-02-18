import React from 'react';
import { Scroll, Plus, Trash2 } from 'lucide-react';
import styles from './styles.module.css';

export default function CalcJutsus({ data, isEditing, onChange }: any) {
  
  const jutsusData = Array.isArray(data) ? data : [];

  const handleFieldChange = (index: number, field: string, val: string) => {
    const newData = [...jutsusData];
    newData[index] = { ...newData[index], [field]: val };
    onChange(newData);
  };

  const addItem = () => {
    onChange([...jutsusData, { jutsu: '', custo: 0, nv: 1, dur: '-', elem: '-', bonus: 0, base: '' }]);
  };

  const removeItem = (index: number) => {
    const newData = jutsusData.filter((_, i) => i !== index);
    onChange(newData);
  };

  const inputStyle = {
    background: 'rgba(0,0,0,0.5)', border: '1px solid #444', color: '#fff', 
    width: '100%', padding: '4px', borderRadius: '4px', outline: 'none', textAlign: 'center' as const
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <Scroll size={20} color="#fff" /> <span>CALCULADORA DE DANO - JUTSUS</span>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table className={styles.table}>
          <thead>
          <tr>
              <th align="left">JUTSU</th>
              <th style={{ width: '60px' }}>CUSTO</th>
              <th style={{ width: '60px' }}>NV. USADO</th>
              <th style={{ width: '60px' }}>DUREZA</th>
              <th style={{ width: '80px' }}>DANO ELEM.</th>
              <th style={{ width: '80px' }}>BÔNUS</th>
              <th style={{ width: '100px' }}>DANO BASE</th>
              {isEditing && <th style={{ width: '40px' }}></th>}
          </tr>
          </thead>
          <tbody>
            {jutsusData.map((j: any, i: number) => (
              <tr key={i}>
                <td className={styles.jutsuName}>
                  {isEditing ? <input style={{...inputStyle, textAlign: 'left'}} value={j.jutsu} onChange={e => handleFieldChange(i, 'jutsu', e.target.value)} /> : j.jutsu}
                </td>
                <td align="center">
                  {isEditing ? <input type="number" style={inputStyle} value={j.custo} onChange={e => handleFieldChange(i, 'custo', e.target.value)} /> : j.custo}
                </td>
                <td align="center">
                  {isEditing ? <input type="number" style={inputStyle} value={j.nv} onChange={e => handleFieldChange(i, 'nv', e.target.value)} /> : j.nv}
                </td>
                <td align="center">
                  {isEditing ? <input style={inputStyle} value={j.dur} onChange={e => handleFieldChange(i, 'dur', e.target.value)} /> : j.dur}
                </td>
                <td align="center">
                  {isEditing ? <input style={inputStyle} value={j.elem} onChange={e => handleFieldChange(i, 'elem', e.target.value)} /> : j.elem}
                </td>
                <td align="center">
                  {isEditing ? <input type="number" style={inputStyle} value={j.bonus} onChange={e => handleFieldChange(i, 'bonus', e.target.value)} /> : `+${j.bonus}`}
                </td>
                <td align="center" className={styles.base}>
                  {isEditing ? <input style={inputStyle} value={j.base} onChange={e => handleFieldChange(i, 'base', e.target.value)} /> : j.base}
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
            {!isEditing && jutsusData.length < 2 && [...Array(2 - jutsusData.length)].map((_, i) => (
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
              <Plus size={16} /> ADICIONAR JUTSU
            </button>
          </div>
        )}
      </div>
    </div>
  );
}