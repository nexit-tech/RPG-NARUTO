'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, Edit, Save, Plus, User, Backpack, Scroll } from 'lucide-react';

// === ESTILOS ===
import styles from './styles.module.css';
import headerStyles from '@/app/admin-campanha/[campanhaId]/players/[id]/components/SheetHeader/styles.module.css';
import pageOneStyles from '@/app/admin-campanha/[campanhaId]/players/[id]/components/PageOne/styles.module.css';
import pageTwoStyles from '@/app/admin-campanha/[campanhaId]/players/[id]/components/PageTwo/styles.module.css';
import pageThreeStyles from '@/app/admin-campanha/[campanhaId]/players/[id]/components/PageThree/styles.module.css';

// === IMPORTAÇÕES DAS "PARTS" ORIGINAIS DO ADMIN ===
import Attributes from '@/app/admin-campanha/[campanhaId]/players/[id]/components/PageOne/parts/Attributes';
import Vitals from '@/app/admin-campanha/[campanhaId]/players/[id]/components/PageOne/parts/Vitals';
import Armors from '@/app/admin-campanha/[campanhaId]/players/[id]/components/PageOne/parts/Armors';
import CombatStats from '@/app/admin-campanha/[campanhaId]/players/[id]/components/PageOne/parts/CombatStats';
import CombatBases from '@/app/admin-campanha/[campanhaId]/players/[id]/components/PageOne/parts/CombatBases';
import Social from '@/app/admin-campanha/[campanhaId]/players/[id]/components/PageOne/parts/Social';
import Skills from '@/app/admin-campanha/[campanhaId]/players/[id]/components/PageOne/parts/Skills';
import Inventory from '@/app/admin-campanha/[campanhaId]/players/[id]/components/PageTwo/parts/Inventory';
import Powers from '@/app/admin-campanha/[campanhaId]/players/[id]/components/PageTwo/parts/Powers';
import Resources from '@/app/admin-campanha/[campanhaId]/players/[id]/components/PageTwo/parts/Resources';
import Aptitudes from '@/app/admin-campanha/[campanhaId]/players/[id]/components/PageTwo/parts/Aptitudes';
import CalcJutsus from '@/app/admin-campanha/[campanhaId]/players/[id]/components/PageTwo/parts/CalcJutsus';
import CalcWeapons from '@/app/admin-campanha/[campanhaId]/players/[id]/components/PageTwo/parts/CalcWeapons';
import JutsuCard from '@/app/admin-campanha/[campanhaId]/players/[id]/components/PageThree/parts/JutsuCard';

interface FichaTabProps {
  campanhaId: string;
  personagemId: string;
}

const BLANK_DATA = {
  info: { name: '', img: '' },
  attributes: { for: 0, des: 0, agi: 0, per: 0, int: 0, vig: 0, esp: 0 },
  combatStats: { vitTotal: 100, vitCurrent: 100, chaTotal: 100, chaCurrent: 100, iniciativa: 0, esquiva: 0, deslocamento: 0 },
  defenses: { dureza: 0, absorcao: 0 },
  skills: [], 
  bases: { cc: { total: 0 }, cd: { total: 0 }, esquiva: { total: 0 }, lim: { total: 0 }, defesa: { total: 0 } },
  social: { carisma: 0, manipulacao: 0, atuacao: 0, intimidar: 0, barganhar: 0, blefar: 0, obterInfo: 0, mudarAtitude: 0 },
  inventory: [], powers: [], economy: { comp: '0/0', ryos: 0, ppTotal: 0, ppGastos: 0 }, aptitudes: [], attacks: [], jutsus: []
};

// ==========================================
// 1. COMPONENTE PRINCIPAL (FICHA TAB)
// ==========================================
export default function FichaTab({ campanhaId, personagemId }: FichaTabProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (personagemId) {
      fetchPlayerData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [personagemId]);

  async function fetchPlayerData() {
    setLoading(true);
    try {
      const { data: dbData } = await supabase
        .from('personagens')
        .select('*')
        .eq('id', personagemId)
        .single();

      if (dbData) {
        const hab = dbData.ficha_data || {};
        const skillsSource = hab.skills || hab.pericias || BLANK_DATA.skills;
        const socialSource = hab.social || hab.social_stats || hab.atributos_sociais || BLANK_DATA.social;

        const merged = {
          ...BLANK_DATA,
          ...hab,
          skills: skillsSource,
          social: socialSource,
          info: { ...BLANK_DATA.info, ...hab.info, name: dbData.nome, img: dbData.img },
          combatStats: {
            ...BLANK_DATA.combatStats,
            ...hab.combatStats,
            vitCurrent: dbData.hp ?? hab.combatStats?.vitCurrent,
            vitTotal: dbData.max_hp ?? hab.combatStats?.vitTotal,
            chaCurrent: dbData.cp ?? hab.combatStats?.chaCurrent,
            chaTotal: dbData.max_cp ?? hab.combatStats?.chaTotal,
          }
        };
        setData(merged);
      }
    } catch (err) {
      console.error("Erro ao buscar dados do personagem:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleDataChange = async (newData: any) => {
    setData(newData);

    const atk = newData.bases?.cc?.total || 0;
    const def = newData.defenses?.absorcao || newData.bases?.defesa?.total || 0;
    const esq = newData.bases?.esquiva?.total || 0;
    const cd = newData.bases?.cd?.total || 0;

    const updatePayload = {
      ficha_data: newData,
      hp: newData.combatStats.vitCurrent,
      max_hp: newData.combatStats.vitTotal,
      cp: newData.combatStats.chaCurrent,
      max_cp: newData.combatStats.chaTotal,
      atk, def, esq, cd,
      updated_at: new Date().toISOString()
    };

    await supabase.from('personagens').update(updatePayload).eq('id', personagemId);

    await supabase.from('sessao_tokens')
      .update({
        hp: updatePayload.hp,
        max_hp: updatePayload.max_hp,
        cp: updatePayload.cp,
        max_cp: updatePayload.max_cp,
        atk, def, esq, cd
      })
      .eq('personagem_id', personagemId);
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Loader2 size={50} className="animate-spin" color="#ff6600" />
        <p>Invocando sua ficha...</p>
      </div>
    );
  }

  return (
    <div className={styles.fichaContainer}>
      <SheetHeader data={data} onChange={handleDataChange} />

      {/* NAVEGAÇÃO IDÊNTICA AO DOS MOBS */}
      <div className={styles.tabsContainer}>
        <div className={styles.tabsWrapper}>
          <button onClick={() => setPage(1)} className={`${styles.tab} ${page === 1 ? styles.active : ''}`}>
            <User size={18} /> <span>DADOS GERAIS</span>
          </button>
          <button onClick={() => setPage(2)} className={`${styles.tab} ${page === 2 ? styles.active : ''}`}>
            <Backpack size={18} /> <span>EQUIP & PODERES</span>
          </button>
          <button onClick={() => setPage(3)} className={`${styles.tab} ${page === 3 ? styles.active : ''}`}>
            <Scroll size={18} /> <span>GRIMÓRIO (JUTSUS)</span>
          </button>
        </div>
      </div>

      <div className={styles.contentArea}>
        {page === 1 && <PageOne   data={data} setData={handleDataChange} />}
        {page === 2 && <PageTwo   data={data} setData={handleDataChange} />}
        {page === 3 && <PageThree data={data} setData={handleDataChange} />}
      </div>
    </div>
  );
}

// ==========================================
// 2. RÉPLICA: SHEET HEADER
// ==========================================
function SheetHeader({ data, onChange }: { data: any, onChange?: any }) {
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
  };

  const handleToggleEdit = () => {
    if (isEditing) {
      if (onChange) onChange({ ...data, info: localInfo });
    }
    setIsEditing(!isEditing);
  };

  return (
    <div className={headerStyles.header} style={{ position: 'relative' }}>
      <div style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 10 }}>
        <button 
          onClick={handleToggleEdit}
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

      <div className={headerStyles.mainInfo}>
        <div className={headerStyles.avatarContainer}>
          <img src={localInfo.img || 'https://via.placeholder.com/140'} className={headerStyles.avatar} alt="Avatar" />
          {isEditing && (
            <input 
              className={headerStyles.urlInput} 
              style={{ padding: '2px 4px', textAlign: 'center', borderRadius: '4px' }}
              placeholder="URL da Imagem" value={localInfo.img || ''} onChange={e => handleChange('img', e.target.value)}
            />
          )}
          {isEditing ? (
            <input 
              className={headerStyles.editInput}
              style={{ 
                position: 'absolute', bottom: '-10px', left: '50%', transform: 'translateX(-50%)', 
                width: '100px', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase',
                background: '#ff6600', color: '#000', borderRadius: '12px', padding: '2px 8px'
              }}
              value={localInfo.clan || ''} onChange={e => handleChange('clan', e.target.value)} placeholder="Clã"
            />
          ) : (
            <span className={headerStyles.clan}>{localInfo.clan}</span>
          )}
        </div>

        {isEditing ? (
          <input 
            className={headerStyles.editInput}
            style={{ 
              fontFamily: 'NinjaNaruto, sans-serif', fontSize: '2.5rem', marginTop: '1rem',
              textAlign: 'center', color: '#fff', width: '350px', letterSpacing: '1px'
            }}
            value={localInfo.name || ''} onChange={e => handleChange('name', e.target.value)} placeholder="Nome do Ninja"
          />
        ) : (
          <h1 className={headerStyles.name}>{localInfo.name}</h1>
        )}
      </div>

      <div className={headerStyles.tagsGrid}>
        <Tag label="Nível Shinobi" field="shinobiLevel" value={localInfo.shinobiLevel} isEditing={isEditing} onChange={handleChange} />
        <Tag label="Nível Campanha" field="campaignLevel" value={localInfo.campaignLevel} isEditing={isEditing} onChange={handleChange} />
        <Tag label="Idade" field="age" value={localInfo.age} isEditing={isEditing} onChange={handleChange} />
        <Tag label="Gênero" field="gender" value={localInfo.gender} isEditing={isEditing} onChange={handleChange} />
        <Tag label="Vila Origem" field="originVillage" value={localInfo.originVillage} isEditing={isEditing} onChange={handleChange} />
        <Tag label="Vila Atuante" field="activeVillage" value={localInfo.activeVillage} isEditing={isEditing} onChange={handleChange} />
        <Tag label="Tendência" field="alignment" value={localInfo.alignment} isEditing={isEditing} onChange={handleChange} />
        <Tag label="Alt / Peso" field="heightWeight" value={localInfo.heightWeight} isEditing={isEditing} onChange={handleChange} />
      </div>
    </div>
  );
}

function Tag({ label, field, value, isEditing, onChange }: any) {
  return (
    <div className={headerStyles.tag}>
      <label>{label}</label>
      {isEditing ? (
        <input 
          className={headerStyles.editInput} 
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

// ==========================================
// 3. RÉPLICA: PAGE ONE
// ==========================================
function PageOne({ data, setData }: { data: any, setData?: any }) {
  const [localData, setLocalData] = useState(data);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => { setLocalData(data); }, [data]);

  const updateSection = (sectionKey: string, newData: any) => {
    setLocalData((prev: any) => ({ ...prev, [sectionKey]: newData }));
  };

  const handleToggleEdit = () => {
    if (isEditing) { if (setData) setData(localData); }
    setIsEditing(!isEditing);
  };

  return (
    <div className={pageOneStyles.container}>
      <div className={pageOneStyles.editBar}>
        <button 
          className={`${pageOneStyles.editBtn} ${isEditing ? pageOneStyles.saveBtn : ''}`}
          onClick={handleToggleEdit}
        >
          {isEditing ? <><Save size={18} /> SALVAR FICHA</> : <><Edit size={18} /> EDITAR FICHA</>}
        </button>
      </div>

      <Attributes data={localData?.attributes || { for: 0, des: 0, agi: 0, per: 0, int: 0, vig: 0, esp: 0 }} isEditing={isEditing} onChange={(d: any) => updateSection('attributes', d)} />

      <div className={pageOneStyles.mainGrid}>
        <Vitals data={localData?.combatStats || {}} isEditing={isEditing} onChange={(d: any) => updateSection('combatStats', d)} />
        <Armors data={localData?.defenses || {}} isEditing={isEditing} onChange={(d: any) => updateSection('defenses', d)} />
        <CombatStats data={localData?.combatStats || {}} attributes={localData?.attributes || {}} skills={localData?.skills || []} bases={localData?.bases || {}} isEditing={isEditing} onChange={(d: any) => updateSection('combatStats', d)} />
        <CombatBases data={localData?.bases || {}} attributes={localData?.attributes || {}} isEditing={isEditing} onChange={(d: any) => updateSection('bases', d)} />

        <div className={pageOneStyles.span2}>
          <Social data={localData?.social || {}} isEditing={isEditing} onChange={(d: any) => updateSection('social', d)} />
        </div>
        
        <div className={pageOneStyles.span2}>
          <Skills data={localData?.skills || []} attributes={localData?.attributes || {}} isEditing={isEditing} onChange={(d: any) => updateSection('skills', d)} />
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 4. RÉPLICA: PAGE TWO
// ==========================================
function PageTwo({ data, setData }: { data: any, setData?: any }) {
  const [localData, setLocalData] = useState(data || {});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => { setLocalData(data || {}); }, [data]);

  const updateSection = (sectionKey: string, newData: any) => {
    setLocalData((prev: any) => ({ ...prev, [sectionKey]: newData }));
  };

  const handleToggleEdit = () => {
    if (isEditing) { if (setData) setData(localData); }
    setIsEditing(!isEditing);
  };

  return (
    <div className={pageTwoStyles.container}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
        <button 
          onClick={handleToggleEdit}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px', background: isEditing ? '#22c55e' : '#333',
            color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold'
          }}
        >
          {isEditing ? <><Save size={18} /> SALVAR FICHA</> : <><Edit size={18} /> EDITAR FICHA</>}
        </button>
      </div>

      <Inventory data={localData.inventory || []} isEditing={isEditing} onChange={(d: any) => updateSection('inventory', d)} />

      <div className={pageTwoStyles.middleSection}>
        <div className={pageTwoStyles.leftCol}>
          <Powers data={localData.powers || []} isEditing={isEditing} onChange={(d: any) => updateSection('powers', d)} />
        </div>
        <div className={pageTwoStyles.rightCol}>
          <Resources data={localData.economy || {}} isEditing={isEditing} onChange={(d: any) => updateSection('economy', d)} />
        </div>
      </div>

      <Aptitudes data={localData.aptitudes || []} isEditing={isEditing} onChange={(d: any) => updateSection('aptitudes', d)} />
      <CalcJutsus data={localData.jutsus || []} isEditing={isEditing} onChange={(d: any) => updateSection('jutsus', d)} />
      <CalcWeapons data={localData.attacks || []} isEditing={isEditing} onChange={(d: any) => updateSection('attacks', d)} />
    </div>
  );
}

// ==========================================
// 5. RÉPLICA: PAGE THREE
// ==========================================
const MOCK_JUTSUS = [
  { nome: 'RASENGAN', acao: 'PADRÃO', nivel: 'A', alvo: '1 INIMIGO', dano: '10D10', alcance: 'TOQUE', duracao: 'INSTANTÂNEA', efeitos: 'EMPURRÃO E DANO CRÍTICO', custo: '20 CP', descricao: 'Uma esfera de chakra rotativa...' }
];

function PageThree({ data, setData }: { data: any, setData?: any }) {
  const [localJutsus, setLocalJutsus] = useState<any[]>(data?.jutsus?.length > 0 ? data.jutsus : MOCK_JUTSUS);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => { if (data?.jutsus) { setLocalJutsus(data.jutsus); } }, [data]);

  const updateJutsu = (index: number, updatedJutsu: any) => {
    const newData = [...localJutsus];
    newData[index] = updatedJutsu;
    setLocalJutsus(newData);
  };

  const removeJutsu = (index: number) => { setLocalJutsus(localJutsus.filter((_, i) => i !== index)); };

  const addJutsu = () => {
    setLocalJutsus([...localJutsus, { nome: 'NOVO JUTSU', acao: '-', nivel: '-', alvo: '-', dano: '-', alcance: '-', duracao: '-', efeitos: '-', custo: '0 CP', descricao: '' }]);
  };

  const handleToggleEdit = () => {
    if (isEditing) { if (setData) setData({ ...data, jutsus: localJutsus }); }
    setIsEditing(!isEditing);
  };

  return (
    <div className={pageThreeStyles.container}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
        <button 
          onClick={handleToggleEdit}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px', background: isEditing ? '#22c55e' : '#333',
            color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold'
          }}
        >
          {isEditing ? <><Save size={18} /> SALVAR GRIMÓRIO</> : <><Edit size={18} /> EDITAR GRIMÓRIO</>}
        </button>
      </div>

      <div className={pageThreeStyles.header}>
        <span>GRIMÓRIO DE JUTSUS</span>
      </div>

      <div className={pageThreeStyles.jutsuGrid}>
        {localJutsus.map((jutsu, index) => (
          <JutsuCard key={index} data={jutsu} isEditing={isEditing} onChange={(val: any) => updateJutsu(index, val)} onRemove={() => removeJutsu(index)} />
        ))}
        {isEditing && (
          <div 
            onClick={addJutsu}
            style={{
              display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', 
              minHeight: '280px', border: '2px dashed #444', borderRadius: '8px', cursor: 'pointer', color: '#888', background: 'rgba(0,0,0,0.3)', gap: '10px', transition: 'all 0.2s'
            }}
          >
            <Plus size={40} />
            <span style={{ fontWeight: 'bold', letterSpacing: '1px' }}>ADICIONAR JUTSU</span>
          </div>
        )}
      </div>
    </div>
  );
}