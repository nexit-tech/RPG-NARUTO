import React from 'react';
import styles from './styles.module.css';

export default function SheetHeader({ data }: { data: any }) {
  const i = data.info;
  return (
    <div className={styles.header}>
      <div className={styles.mainInfo}>
        <div className={styles.avatarContainer}>
          <img src={i.img} className={styles.avatar} alt="Avatar" />
          <span className={styles.clan}>{i.clan}</span>
        </div>
        <h1 className={styles.name}>{i.name}</h1>
      </div>

      <div className={styles.tagsGrid}>
        {/* LINHA 1 (4 ITENS) */}
        <Tag label="Nível Shinobi" value={i.shinobiLevel} />
        <Tag label="Nível Campanha" value={i.campaignLevel} />
        <Tag label="Idade" value={i.age} />
        <Tag label="Gênero" value={i.gender} />
        
        {/* LINHA 2 (4 ITENS) */}
        <Tag label="Vila Origem" value={i.originVillage} />
        <Tag label="Vila Atuante" value={i.activeVillage} />
        <Tag label="Tendência" value={i.alignment} />
        <Tag label="Alt / Peso" value={i.heightWeight} />
      </div>
    </div>
  );
}

function Tag({ label, value }: { label: string, value: string | number }) {
  return (
    <div className={styles.tag}>
      <label>{label}</label>
      <span>{value}</span>
    </div>
  );
}