import React from 'react';
import { X, Skull } from 'lucide-react';
import styles from './styles.module.css'; // Crie um css basico modal padrao

// Mock de Mobs disponíveis (pode vir de props ou banco)
const AVAILABLE_MOBS = [
  { name: 'Zetsu Branco', img: 'https://imgs.search.brave.com/hAIyZtVgluqvO_176cybig8JoSIDDzB1ZBt-gyR6spQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jcml0/aWNhbGhpdHMuY29t/LmJyL3dwLWNvbnRl/bnQvdXBsb2Fkcy8y/MDIwLzEyL1NoaXJv/X1pldHN1LTkxMHg1/MTguanBn', hp: 40 },
  { name: 'Ninja Renegado', img: 'https://cdn-icons-png.flaticon.com/512/1353/1353866.png', hp: 60 },
  { name: 'Kurama (Boss)', img: 'https://i.pinimg.com/736x/f3/d3/f0/f3d3f0a3225227702526155695029320.jpg', hp: 5000 },
];

export default function MobSelectorModal({ isOpen, onClose, onSelect }: any) {
  if (!isOpen) return null;

  return (
    <div style={{position:'absolute', inset:0, background:'rgba(0,0,0,0.8)', zIndex:3000, display:'flex', alignItems:'center', justifyContent:'center'}}>
      <div style={{background:'#111', border:'1px solid #333', width:400, borderRadius:8, overflow:'hidden'}}>
        <div style={{padding:10, background:'#1a1a1a', display:'flex', justifyContent:'space-between'}}>
          <h3 style={{color:'#fff', fontFamily:'NinjaNaruto'}}>INVOCAR MOB</h3>
          <button onClick={onClose} style={{background:'transparent', border:'none', color:'#fff', cursor:'pointer'}}><X size={18}/></button>
        </div>
        <div style={{padding:10, maxHeight:300, overflowY:'auto', display:'flex', flexDirection:'column', gap:10}}>
          {AVAILABLE_MOBS.map((mob, i) => (
            <div key={i} onClick={() => onSelect(mob)} style={{display:'flex', alignItems:'center', gap:10, padding:10, background:'#222', borderRadius:4, cursor:'pointer', border:'1px solid transparent'}}>
              <img src={mob.img} style={{width:40, height:40, borderRadius:'50%', objectFit:'cover'}} />
              <div>
                <strong style={{display:'block', color:'#eee'}}>{mob.name}</strong>
                <span style={{fontSize:12, color:'#888'}}>HP Base: {mob.hp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}