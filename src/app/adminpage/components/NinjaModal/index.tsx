import React from 'react';
import { X } from 'lucide-react';
import styles from './styles.module.css';

interface NinjaModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function NinjaModal({ isOpen, onClose, title, children }: NinjaModalProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modalContainer}>
        <header className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <button onClick={onClose} className={styles.closeBtn}>
            <X size={24} />
          </button>
        </header>
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
}