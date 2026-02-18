import React from 'react';
import { Star, Plus, Trash2 } from 'lucide-react';
import styles from './styles.module.css';

export default function Aptitudes({ data, isEditing, onChange }: any) {
  
  const aptData = Array.isArray(data) ? data : [];

  const handleFieldChange = (index: number, field: string, val: string) => {
    const newData = [...aptData];
    newData[index] = { ...newData[index], [field]: val };
    onChange(newData);
  };

  const addItem = () => {
    onChange([...aptData, { nome: '', nv: 'NV.1', custo: 0 }]);
  };

  const removeItem = (index: number) => {
    const newData = aptData.filter((_, i) => i !== index);
    onChange(newData);
  };

  const inputStyle = {
    background: 'rgba(0,0,0,0.5)', border: '1px solid #444', color: '#fff', 
    width: '100%', padding: '2px 4px', borderRadius: '4px', outline: 'none'
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <Star size={20} color="#000" /> <span>APTIDÕES</span>
      </div>
      
      <div className={styles.gridHeader}>
        <div className={styles.col}>NOME/NV.</div>
        <div className={styles.col}>PTS. GASTOS</div>
        <div className={styles.col}>NOME/NV.</div>
        <div className={styles.col}>PTS. GASTOS</div>
        <div className={styles.col}>NOME/NV.</div>
        <div className={styles.col}>PTS. GASTOS</div>
      </div>

      <div className={styles.gridBody}>
        {aptData.map((item: any, i: number) => (
          <React.Fragment key={i}>
            <div className={styles.cellName} style={isEditing ? { display: 'flex', gap: '4px', alignItems: 'center' } : {}}>
              {isEditing ? (
                <>
                  <input style={{...inputStyle, flex: 1}} placeholder="Nome" value={item.nome} onChange={e => handleFieldChange(i, 'nome', e.target.value)} />
                  <input style={{...inputStyle, width: '45px', textAlign: 'center'}} placeholder="NV." value={item.nv} onChange={e => handleFieldChange(i, 'nv', e.target.value)} />
                </>
              ) : (
                <>
                  <span className={styles.aptName}>{item.nome}</span>
                  <span className={styles.aptNv}>{item.nv}</span>
                </>
              )}
            </div>
            
            <div className={styles.cellCost} style={isEditing ? { display: 'flex', gap: '4px', alignItems: 'center', justifyContent: 'center' } : {}}>
              {isEditing ? (
                <>
                  <input type="number" style={{...inputStyle, width: '40px', textAlign: 'center'}} value={item.custo} onChange={e => handleFieldChange(i, 'custo', e.target.value)} />
                  <button onClick={() => removeItem(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ff4444', padding: 0 }}>
                    <Trash2 size={16} />
                  </button>
                </>
              ) : (
                item.custo
              )}
            </div>
          </React.Fragment>
        ))}

        {!isEditing && aptData.length < 6 && [...Array(6 - aptData.length)].map((_, i) => (
           <React.Fragment key={`e-${i}`}>
             <div className={styles.cellName}></div><div className={styles.cellCost}></div>
           </React.Fragment>
        ))}
      </div>

      {isEditing && (
        <div style={{ padding: '8px', display: 'flex', justifyContent: 'center', background: 'rgba(0,0,0,0.3)' }}>
          <button 
            onClick={addItem}
            style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#333', color: '#fff', border: '1px solid #555', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}
          >
            <Plus size={16} /> ADICIONAR APTIDÃO
          </button>
        </div>
      )}
    </div>
  );
}