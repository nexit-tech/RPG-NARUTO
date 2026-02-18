import React from 'react';
import { Backpack } from 'lucide-react';
import styles from './styles.module.css';

const DATA = [
  { nome: 'Kunai', qtd: 10, comp: 'Bolsa de Armas', notas: 'Aço Comum' },
  { nome: 'Bomba de Fumaça', qtd: 5, comp: 'Bolso Colete', notas: 'Roxa' },
  { nome: 'Pergaminho', qtd: 2, comp: 'Mochila', notas: 'Selamento nv.1' },
  { nome: 'Ração Militar', qtd: 3, comp: 'Bolsa', notas: 'Recupera CP' },
  { nome: 'Corda Ninja', qtd: 1, comp: 'Mochila', notas: '15 metros' },
];

export default function Inventory() {
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
            </tr>
          </thead>
          <tbody>
            {DATA.map((item, i) => (
              <tr key={i}>
                <td className={styles.name}>{item.nome}</td>
                <td align="center" className={styles.qty}>{item.qtd}</td>
                <td>{item.comp}</td>
                <td className={styles.notes}>{item.notas}</td>
              </tr>
            ))}
            {/* Linhas Vazias para preencher visualmente */}
            {[...Array(3)].map((_, i) => (
              <tr key={`empty-${i}`}><td colSpan={4}>&nbsp;</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}