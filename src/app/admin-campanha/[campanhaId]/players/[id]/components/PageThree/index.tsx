import React, { useState, useEffect } from 'react';
import { Edit, Save, Plus } from 'lucide-react';
import styles from './styles.module.css';
import JutsuCard from './parts/JutsuCard';

const MOCK_JUTSUS = [
  {
    nome: 'RASENGAN', acao: 'PADRÃO', nivel: 'A', alvo: '1 INIMIGO', dano: '10D10', alcance: 'TOQUE', duracao: 'INSTANTÂNEA', efeitos: 'EMPURRÃO E DANO CRÍTICO', custo: '20 CP', descricao: 'Uma esfera de chakra rotativa pura que explode ao contato, causando grande impacto.'
  },
  {
    nome: 'BOLA DE FOGO', acao: 'PADRÃO', nivel: 'C', alvo: 'ÁREA (CONE 6M)', dano: '6D6', alcance: '6 METROS', duracao: 'INSTANTÂNEA', efeitos: 'QUEIMADURA POR 2 TURNOS', custo: '10 CP', descricao: 'O usuário expele uma grande bola de fogo da boca após concentrar chakra no peito.'
  },
  {
    nome: 'CLONE DAS SOMBRAS', acao: 'MOVIMENTO', nivel: 'B', alvo: 'PRÓPRIO', dano: '-', alcance: 'PESSOAL', duracao: 'DETERMINADA', efeitos: 'CRIA CÓPIAS REAIS', custo: '5 CP POR CLONE', descricao: 'Cria cópias físicas que podem atacar. O chakra é dividido igualmente entre os clones.'
  },
  {
    nome: 'CHIDORI', acao: 'PADRÃO', nivel: 'A', alvo: '1 INIMIGO', dano: '12D8', alcance: 'MOV. + TOQUE', duracao: 'INSTANTÂNEA', efeitos: 'PERFURAÇÃO E PARALISIA', custo: '25 CP', descricao: 'Concentra uma imensa quantidade de chakra relâmpago na mão, emitindo som de pássaros.'
  }
];

export default function PageThree({ data, setData }: { data: any, setData?: any }) {
  // Inicializa com os Jutsus da ficha, ou usa o MOCK como fallback visual
  const [localJutsus, setLocalJutsus] = useState<any[]>(data?.jutsus?.length > 0 ? data.jutsus : MOCK_JUTSUS);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (data?.jutsus) {
      setLocalJutsus(data.jutsus);
    }
  }, [data]);

  const updateJutsu = (index: number, updatedJutsu: any) => {
    const newData = [...localJutsus];
    newData[index] = updatedJutsu;
    setLocalJutsus(newData);
  };

  const removeJutsu = (index: number) => {
    const newData = localJutsus.filter((_, i) => i !== index);
    setLocalJutsus(newData);
  };

  const addJutsu = () => {
    setLocalJutsus([...localJutsus, {
      nome: 'NOVO JUTSU', acao: '-', nivel: '-', alvo: '-', dano: '-', alcance: '-', duracao: '-', efeitos: '-', custo: '0 CP', descricao: ''
    }]);
  };

  const handleToggleEdit = () => {
    if (isEditing) {
      if (setData) setData({ ...data, jutsus: localJutsus });
    }
    setIsEditing(!isEditing);
  };

  return (
    <div className={styles.container}>
      
      {/* BARRA DE CONTROLE DE EDIÇÃO */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
        <button 
          onClick={handleToggleEdit}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: isEditing ? '#22c55e' : '#333',
            color: '#fff', border: 'none', padding: '8px 16px',
            borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold'
          }}
        >
          {isEditing ? <><Save size={18} /> SALVAR GRIMÓRIO</> : <><Edit size={18} /> EDITAR GRIMÓRIO</>}
        </button>
      </div>

      <div className={styles.header}>
        <span>GRIMÓRIO DE JUTSUS</span>
      </div>

      <div className={styles.jutsuGrid}>
        {localJutsus.map((jutsu, index) => (
          <JutsuCard 
            key={index} 
            data={jutsu} 
            isEditing={isEditing}
            onChange={(val: any) => updateJutsu(index, val)}
            onRemove={() => removeJutsu(index)}
          />
        ))}

        {/* Card "Fantasma" para adicionar novos jutsus (Só aparece quando editando) */}
        {isEditing && (
          <div 
            onClick={addJutsu}
            style={{
              display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', 
              minHeight: '280px', border: '2px dashed #444', borderRadius: '8px', 
              cursor: 'pointer', color: '#888', background: 'rgba(0,0,0,0.3)', gap: '10px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,102,0,0.1)'; e.currentTarget.style.color = '#ff6600'; e.currentTarget.style.borderColor = '#ff6600'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.3)'; e.currentTarget.style.color = '#888'; e.currentTarget.style.borderColor = '#444'; }}
          >
            <Plus size={40} />
            <span style={{ fontWeight: 'bold', letterSpacing: '1px' }}>ADICIONAR JUTSU</span>
          </div>
        )}
      </div>
    </div>
  );
}