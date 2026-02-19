import React, { useState, useRef } from 'react';
import { Sword, Heart, Skull, Trash2 } from 'lucide-react';
import styles from './styles.module.css';

export interface Token {
  id: string;
  name: string;
  type: string;
  img: string;
  x: number; y: number;
  hp: number; maxHp: number;
  cp: number; maxCp: number;
  level: number; class: string;
  stats: { atk: number, def: number, esq: number, cd: number };
  initiative?: number;
  inCombat?: boolean;
  isDown?: boolean; 
}

export interface BattleMapProps {
  imageUrl: string;
  showGrid: boolean;
  gridScale: number;
  snapToGrid: boolean;
  interactionMode: 'move' | 'attack' | 'heal' | 'down' | 'aoe_cone' | 'aoe_circle' | 'aoe_line';
  tokens: Token[];
  onMoveToken: (id: string, x: number, y: number) => void;
  onTokenAction: (action: 'attack' | 'heal' | 'down', targetId: string) => void;
  onAoEComplete: (targets: Token[], shape: string) => void;
  onDeleteToken: (id: string) => void; 
}

const GRID_PX = 60;
const METERS_PER_CELL = 1.5;

export default function BattleMap({ 
  imageUrl, showGrid, gridScale, snapToGrid, interactionMode, 
  tokens, onMoveToken, onTokenAction, onAoEComplete, onDeleteToken 
}: BattleMapProps) {
  
  const mapRef = useRef<HTMLDivElement>(null);
  
  const [dragState, setDragState] = useState<{id: string | null, x: number, y: number}>({ id: null, x: 0, y: 0 });
  const [startGrid, setStartGrid] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isDrawingAoE, setIsDrawingAoE] = useState(false);
  const [aoeStart, setAoeStart] = useState({ x: 0, y: 0 });
  const [contextMenu, setContextMenu] = useState<{ visible: boolean, x: number, y: number, targetId: string | null }>({
    visible: false, x: 0, y: 0, targetId: null
  });

  // --- HANDLERS MOUSE ---
  const handleMouseDown = (e: React.MouseEvent, token?: Token) => {
    if (e.button !== 0) return;
    e.preventDefault(); e.stopPropagation();
    
    // Fecha menu se clicar fora (no mapa)
    setContextMenu({ ...contextMenu, visible: false });

    if (!mapRef.current) return;
    const rect = mapRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    if (interactionMode.startsWith('aoe')) {
      setIsDrawingAoE(true);
      setAoeStart({ x: clickX, y: clickY });
      setMousePos({ x: clickX, y: clickY });
      return;
    }

    if (token) {
      if (['attack', 'heal', 'down'].includes(interactionMode)) {
        onTokenAction(interactionMode as any, token.id);
        return;
      }
      setDragState({ id: token.id, x: clickX, y: clickY });
      setStartGrid({ x: token.x, y: token.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!mapRef.current) return;
    const rect = mapRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });
    if (dragState.id) setDragState(prev => ({ ...prev, x, y }));
  };

  const handleMouseUp = () => {
    if (dragState.id) {
      if (snapToGrid) {
        const gridX = Math.floor(dragState.x / GRID_PX);
        const gridY = Math.floor(dragState.y / GRID_PX);
        if (gridX >= 0 && gridY >= 0) onMoveToken(dragState.id, gridX, gridY);
      } else {
        const floatX = dragState.x / GRID_PX;
        const floatY = dragState.y / GRID_PX;
        onMoveToken(dragState.id, floatX, floatY);
      }
      setDragState({ id: null, x: 0, y: 0 });
    }
    if (isDrawingAoE) {
      setIsDrawingAoE(false);
      calculateAoECollision();
    }
  };

  // --- MENU DE CONTEXTO ---
  const handleContextMenu = (e: React.MouseEvent, token?: Token) => {
    e.preventDefault(); e.stopPropagation();
    if (isDrawingAoE) {
      setIsDrawingAoE(false);
      setAoeStart({ x: 0, y: 0 });
      return;
    }
    if (mapRef.current && token) {
      const rect = mapRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      // Posicionamento inteligente
      const menuW = 160; const menuH = 170;
      const finalX = (clickX + menuW > rect.width) ? clickX - menuW : clickX;
      const finalY = (clickY + menuH > rect.height) ? clickY - menuH : clickY;
      setContextMenu({ visible: true, x: finalX, y: finalY, targetId: token.id });
    }
  };

  const handleActionClick = (action: 'attack' | 'heal' | 'down' | 'delete') => {
    if (contextMenu.targetId) {
      if (action === 'delete') onDeleteToken(contextMenu.targetId);
      else onTokenAction(action, contextMenu.targetId);
      
      setContextMenu({ ...contextMenu, visible: false });
    }
  };

  // --- CÁLCULO AOE & RENDER ---
  const calculateAoECollision = () => {
    const targets: Token[] = [];
    const dx = mousePos.x - aoeStart.x;
    const dy = mousePos.y - aoeStart.y;
    const distance = Math.sqrt(dx*dx + dy*dy);
    const angle = Math.atan2(dy, dx); 

    tokens.forEach(t => {
      const tX = t.x * GRID_PX + GRID_PX/2;
      const tY = t.y * GRID_PX + GRID_PX/2;
      let hit = false;
      if (interactionMode === 'aoe_circle') {
        if (Math.sqrt((tX - aoeStart.x)**2 + (tY - aoeStart.y)**2) <= distance) hit = true;
      } else if (interactionMode === 'aoe_line') {
        const lineLenSq = dx*dx + dy*dy;
        if (lineLenSq > 0) {
          const tVal = Math.max(0, Math.min(1, ((tX - aoeStart.x)*dx + (tY - aoeStart.y)*dy) / lineLenSq));
          const nX = aoeStart.x + tVal * dx;
          const nY = aoeStart.y + tVal * dy;
          if (Math.sqrt((tX - nX)**2 + (tY - nY)**2) <= 30) hit = true;
        }
      } else if (interactionMode === 'aoe_cone') {
        const distToOrigin = Math.sqrt((tX - aoeStart.x)**2 + (tY - aoeStart.y)**2);
        if (distToOrigin <= distance) {
          let angleDiff = Math.atan2(tY - aoeStart.y, tX - aoeStart.x) - angle;
          while (angleDiff <= -Math.PI) angleDiff += Math.PI*2;
          while (angleDiff > Math.PI) angleDiff -= Math.PI*2;
          if (Math.abs(angleDiff) <= 0.52) hit = true;
        }
      }
      if (hit) targets.push(t);
    });
    onAoEComplete(targets, interactionMode);
  };

  const renderDynamicAoE = () => {
    if (!isDrawingAoE) return null;
    const dx = mousePos.x - aoeStart.x;
    const dy = mousePos.y - aoeStart.y;
    const dist = Math.sqrt(dx*dx + dy*dy);
    const rotationDeg = (Math.atan2(dy, dx) * 180) / Math.PI;
    const meters = ((dist / GRID_PX) * gridScale).toFixed(1);

    return (
      <div className={styles.aoeContainer}>
        <svg className={styles.svgOverlay}>
          {interactionMode === 'aoe_circle' && (
            <>
              <circle cx={aoeStart.x} cy={aoeStart.y} r={dist} fill="rgba(255, 0, 0, 0.2)" stroke="#ff0000" strokeWidth="2" />
              <line x1={aoeStart.x} y1={aoeStart.y} x2={mousePos.x} y2={mousePos.y} stroke="#fff" strokeDasharray="5,5" />
            </>
          )}
          {interactionMode === 'aoe_line' && (
            <line x1={aoeStart.x} y1={aoeStart.y} x2={mousePos.x} y2={mousePos.y} stroke="rgba(255, 0, 0, 0.5)" strokeWidth="60" />
          )}
          {interactionMode === 'aoe_cone' && (
            <path d={describeCone(aoeStart.x, aoeStart.y, dist, rotationDeg - 30, rotationDeg + 30)} fill="rgba(255, 0, 0, 0.3)" stroke="#ff0000" strokeWidth="2" />
          )}
        </svg>
        <div className={styles.distanceBadge} style={{ left: mousePos.x + 20, top: mousePos.y }}>{meters}m</div>
      </div>
    );
  };

  function describeCone(x: number, y: number, radius: number, startAngle: number, endAngle: number) {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return ["M", x, y, "L", start.x, start.y, "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y, "L", x, y].join(" ");
  }

  function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
    const angleInRadians = (angleInDegrees) * Math.PI / 180.0;
    return { x: centerX + (radius * Math.cos(angleInRadians)), y: centerY + (radius * Math.sin(angleInRadians)) };
  }

  const getDistance = () => {
    if (!dragState.id) return 0;
    const dx = Math.abs(dragState.x - (startGrid.x * GRID_PX + GRID_PX/2));
    const dy = Math.abs(dragState.y - (startGrid.y * GRID_PX + GRID_PX/2));
    return (Math.sqrt(dx*dx + dy*dy) / GRID_PX * gridScale).toFixed(1);
  };

  return (
    <div className={`${styles.viewport} ${styles[interactionMode]}`} 
      ref={mapRef} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} 
      onMouseLeave={() => { if(dragState.id) handleMouseUp(); if(isDrawingAoE) setIsDrawingAoE(false); }}
      onMouseDown={(e) => handleMouseDown(e)} 
      onContextMenu={(e) => handleContextMenu(e)} 
    >
      <img src={imageUrl} alt="Mapa" className={styles.mapImage} draggable={false} />
      {showGrid && <div className={styles.gridOverlay} style={{backgroundSize: `${GRID_PX}px ${GRID_PX}px`}}></div>}
      
      {renderDynamicAoE()}

      {dragState.id && (
        <div className={styles.measurementLayer}>
          <svg className={styles.svgOverlay}>
            <line x1={startGrid.x * GRID_PX + GRID_PX/2} y1={startGrid.y * GRID_PX + GRID_PX/2} x2={dragState.x} y2={dragState.y} stroke="#ff6600" strokeWidth="2" strokeDasharray="5,5" />
          </svg>
          <div className={styles.distanceBadge} style={{ left: dragState.x + 20, top: dragState.y - 40 }}>{getDistance()}m</div>
        </div>
      )}

      {tokens.map(token => {
        const isDragging = token.id === dragState.id;
        const left = isDragging ? dragState.x - GRID_PX/2 : token.x * GRID_PX;
        const top = isDragging ? dragState.y - GRID_PX/2 : token.y * GRID_PX;
        
        // Estilo Derrubado (Cinza e Transparente)
        const tokenStyle = token.isDown ? { filter: 'grayscale(100%)', opacity: 0.6 } : {};

        return (
          <div
            key={token.id}
            className={`${styles.token} ${isDragging ? styles.dragging : ''}`}
            style={{ width: GRID_PX, height: GRID_PX, left, top, ...tokenStyle }}
            onMouseDown={(e) => handleMouseDown(e, token)}
            onContextMenu={(e) => handleContextMenu(e, token)}
          >
            <img src={token.img} alt={token.name} className={styles.tokenImg} style={{ borderColor: token.type === 'enemy' ? '#ff4444' : '#44ff88' }} />
            {token.isDown && <div style={{position:'absolute', fontSize:24, zIndex:101, textShadow: '0 0 5px black'}}>💀</div>}
            <div className={styles.miniHp}><div className={styles.miniHpFill} style={{width: `${Math.max(0, (token.hp/token.maxHp)*100)}%`, background: token.type === 'enemy' ? '#ff4444' : '#44ff88'}}/></div>
          </div>
        );
      })}

      {contextMenu.visible && (
        <>
          <div className={styles.menuBackdrop} onClick={() => setContextMenu({...contextMenu, visible: false})} />
          {/* CRUCIAL: onMouseDown stopPropagation impede que o clique no menu passe para o mapa e feche o menu */}
          <div 
            className={styles.contextMenu} 
            style={{ top: contextMenu.y, left: contextMenu.x }}
            onMouseDown={(e) => e.stopPropagation()} 
          >
            <div className={styles.menuHeader}>AÇÕES</div>
            <button className={styles.menuBtn} onClick={() => handleActionClick('attack')}><Sword size={16}/> Atacar</button>
            <button className={styles.menuBtn} onClick={() => handleActionClick('heal')}><Heart size={16}/> Curar</button>
            <button className={styles.menuBtn} onClick={() => handleActionClick('down')}><Skull size={16}/> Derrubar</button>
            <button className={`${styles.menuBtn} ${styles.delBtn}`} onClick={() => handleActionClick('delete')}><Trash2 size={16}/> Remover</button>
          </div>
        </>
      )}
    </div>
  );
}