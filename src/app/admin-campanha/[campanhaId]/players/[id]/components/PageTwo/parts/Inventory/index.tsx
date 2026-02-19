import React from 'react';
import { Backpack, Plus, Trash2 } from 'lucide-react';
import styles from './styles.module.css';

export default function Inventory({ data, isEditing, onChange }: any) {
  
  // Garante que é um array
  const inventoryData = Array.isArray(data) ? data : [];

  const handleFieldChange = (index: number, field: string, val: string) => {
    const newData = [...inventoryData];
    newData[index] = { ...newData[index], [field]: val };
    onChange(newData);
  };

  const addItem = () => {
    onChange([...inventoryData, { nome: '', qtd: 1, comp: '', notas: '' }]);
  };

  const removeItem = (index: number) => {
    const newData = inventoryData.filter((_, i) => i !== index);
    onChange(newData);
  };

  const inputStyle = {
    background: 'rgba(0,0,0,0.5)', border: '1px solid #444', color: '#fff', 
    width: '100%', padding: '4px', borderRadius: '4px', outline: 'none'
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <Backpack size={20} color="#000" /> <span>INVENTÁRIO</span>
      </div>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th align="left">NOME</th>
              <th align="center" style={{ width: '80px' }}>QUANTIDADE</th>
              <th align="left">COMPARTIMENTOS</th>
              <th align="left">ANOTAÇÕES</th>
              {isEditing && <th style={{ width: '40px' }}></th>}
            </tr>
          </thead>
          <tbody>
            {inventoryData.map((item: any, i: number) => (
              <tr key={i}>
                <td className={styles.name}>
                  {isEditing ? <input style={inputStyle} value={item.nome} onChange={e => handleFieldChange(i, 'nome', e.target.value)} /> : item.nome}
                </td>
                <td align="center" className={styles.qty}>
                  {isEditing ? <input type="number" style={{...inputStyle, textAlign: 'center'}} value={item.qtd} onChange={e => handleFieldChange(i, 'qtd', e.target.value)} /> : item.qtd}
                </td>
                <td>
                  {isEditing ? <input style={inputStyle} value={item.comp} onChange={e => handleFieldChange(i, 'comp', e.target.value)} /> : item.comp}
                </td>
                <td className={styles.notes}>
                  {isEditing ? <input style={inputStyle} value={item.notas} onChange={e => handleFieldChange(i, 'notas', e.target.value)} /> : item.notas}
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
            
            {/* Linhas Vazias de preenchimento (só aparecem se não estiver editando e se tiver poucos itens) */}
            {!isEditing && inventoryData.length < 5 && [...Array(5 - inventoryData.length)].map((_, i) => (
              <tr key={`empty-${i}`}><td colSpan={4}>&nbsp;</td></tr>
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
              <Plus size={16} /> ADICIONAR ITEM
            </button>
          </div>
        )}
      </div>
    </div>
  );
}