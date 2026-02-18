import React from 'react';
import styles from './styles.module.css';
import JutsuCard from './parts/JutsuCard';

const MOCK_JUTSUS = [
  {
    nome: 'RASENGAN',
    acao: 'PADRÃO',
    nivel: 'A',
    alvo: '1 INIMIGO',
    dano: '10D10',
    alcance: 'TOQUE',
    duracao: 'INSTANTÂNEA',
    efeitos: 'EMPURRÃO E DANO CRÍTICO',
    custo: '20 CP',
    descricao: 'Uma esfera de chakra rotativa pura que explode ao contato, causando grande impacto.'
  },
  {
    nome: 'BOLA DE FOGO',
    acao: 'PADRÃO',
    nivel: 'C',
    alvo: 'ÁREA (CONE 6M)',
    dano: '6D6',
    alcance: '6 METROS',
    duracao: 'INSTANTÂNEA',
    efeitos: 'QUEIMADURA POR 2 TURNOS',
    custo: '10 CP',
    descricao: 'O usuário expele uma grande bola de fogo da boca após concentrar chakra no peito.'
  },
  {
    nome: 'CLONE DAS SOMBRAS',
    acao: 'MOVIMENTO',
    nivel: 'B',
    alvo: 'PRÓPRIO',
    dano: '-',
    alcance: 'PESSOAL',
    duracao: 'DETERMINADA',
    efeitos: 'CRIA CÓPIAS REAIS',
    custo: '5 CP POR CLONE',
    descricao: 'Cria cópias físicas que podem atacar. O chakra é dividido igualmente entre os clones.'
  },
  {
    nome: 'CHIDORI',
    acao: 'PADRÃO',
    nivel: 'A',
    alvo: '1 INIMIGO',
    dano: '12D8',
    alcance: 'MOV. + TOQUE',
    duracao: 'INSTANTÂNEA',
    efeitos: 'PERFURAÇÃO E PARALISIA',
    custo: '25 CP',
    descricao: 'Concentra uma imensa quantidade de chakra relâmpago na mão, emitindo som de pássaros.'
  }
];

// Adicionada a prop { data } para aceitar os dados da ficha
export default function PageThree({ data }: { data: any }) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span>GRIMÓRIO DE JUTSUS</span>
      </div>

      <div className={styles.jutsuGrid}>
        {MOCK_JUTSUS.map((jutsu, index) => (
          <JutsuCard key={index} data={jutsu} />
        ))}
      </div>
    </div>
  );
}