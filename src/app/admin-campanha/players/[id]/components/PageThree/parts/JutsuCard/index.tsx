import React from 'react';
import styles from './styles.module.css';

export default function JutsuCard({ data }: { data: any }) {
  return (
    <div className={styles.jutsuCard}>
      {/* Cabeçalho do Card com Recortes */}
      <div className={styles.cardFields}>
        <Field label="NOME" value={data.nome} isTitle />
        <div className={styles.row}>
          <Field label="AÇÃO" value={data.acao} />
          <Field label="NÍVEL" value={data.nivel} />
        </div>
        <div className={styles.row}>
          <Field label="ALVO" value={data.alvo} />
          <Field label="DANO" value={data.dano} />
        </div>
        <div className={styles.row}>
          <Field label="ALCANCE" value={data.alcance} />
          <Field label="DURAÇÃO" value={data.duracao} />
        </div>
        <Field label="EFEITOS" value={data.efeitos} />
        <Field label="CUSTO DE CHAKRA" value={data.custo} highlight />
      </div>

      {/* Seção de Descrição Pautada */}
      <div className={styles.descriptionSection}>
        <div className={styles.descHeader}>DESCRIÇÃO</div>
        <div className={styles.descBody}>
          <p>{data.descricao}</p>
          <div className={styles.lines}></div>
        </div>
      </div>
    </div>
  );
}

const Field = ({ label, value, isTitle, highlight }: any) => (
  <div className={`${styles.field} ${highlight ? styles.highlight : ''}`}>
    <label>{label}:</label>
    <span className={isTitle ? styles.fontNinja : ''}>{value}</span>
  </div>
);