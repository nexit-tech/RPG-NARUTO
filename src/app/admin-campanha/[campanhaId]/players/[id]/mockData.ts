export const FULL_PLAYER_DATA = {
  // --- CABEÇALHO ---
  info: {
    name: 'Naruto Uzumaki',
    clan: 'Uzumaki',
    shinobiLevel: 'Jounin',
    campaignLevel: 20,
    age: 32,
    gender: 'Masculino',
    originVillage: 'Konoha',
    activeVillage: 'Konoha',
    alignment: 'Leal e Bom',
    heightWeight: '1.80m / 80kg',
    img: 'https://imgs.search.brave.com/oeorTa8qLitRgjIz4ApXVeErnXx7JXBTS-Zow0OLM-4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzL2IwLzdl/LzNmL2IwN2UzZmYy/MTYzZDg0MGFlMTll/MmU2YWQ3OTYwMWY1/LmpwZw'
  },

  // --- ATRIBUTOS ---
  attributes: {
    for: 18, des: 16, agi: 18, per: 14, int: 12, vig: 20, esp: 20
  },
  
  // --- COMBATE ---
  combatStats: {
    vitTotal: 200, vitCurrent: 180,
    chaTotal: 500, chaCurrent: 450,
    iniciativa: 14,
    prontidao: 14,
    esquiva: 25,
    deslocamento: 18
  },

  // --- DEFESAS ---
  defenses: {
    armadura: 5,
    dureza: 10,
    absorcao: 20
  },

  // --- SOCIAL ---
  social: {
    carisma: 18, manipulacao: 10, atuacao: 5, intimidar: 15,
    barganhar: 8, blefar: 5, obterInfo: 12, mudarAtitude: 14
  },

  // --- PERÍCIAS GERAIS (LISTA COMPLETA) ---
  skills: [
    { name: 'Acrobacia', attr: 'AGI', total: 15 },
    { name: 'Arte', attr: 'INT', total: 5 },
    { name: 'Atletismo', attr: 'FOR', total: 18 },
    { name: 'Ciências Naturais', attr: 'INT', total: 8 },
    { name: 'Concentração', attr: 'INT', total: 20 },
    { name: 'Cultura', attr: 'INT', total: 10 },
    { name: 'Disfarce', attr: 'PER', total: 12 },
    { name: 'Escapar', attr: 'DES', total: 14 },
    { name: 'Furtividade', attr: 'AGI', total: 10 },
    { name: 'Lidar com Animais', attr: 'PER', total: 15 },
    { name: 'Mecanismo', attr: 'INT', total: 6 },
    { name: 'Medicina', attr: 'INT', total: 5 },
    { name: 'Ocultismo', attr: 'INT', total: 8 },
    { name: 'Prestidigitação', attr: 'DES', total: 12 },
    { name: 'Procurar', attr: 'PER', total: 14 },
    { name: 'Prontidão', attr: 'PER', total: 14 },
    { name: 'Rastrear', attr: 'PER', total: 12 },
    { name: 'Venefício', attr: 'INT', total: 4 },
  ],

  // --- BASES DE COMBATE ---
  bases: {
    cc: { base: 10, attr: 8, other: 4, total: 22 },
    cd: { base: 8, attr: 6, other: 4, total: 18 },
    esquiva: { base: 10, attr: 9, other: 6, total: 25 },
    lim: { base: 2, attr: 4, other: 4, total: 10 }
  },

  combatAbilities: [
    { name: 'Combate Desarmado', nivel: 5 },
    { name: 'Mestre em Taijutsu', nivel: 3 },
    { name: 'Especialista em Clones', nivel: 4 },
    { name: 'Senjutsu', nivel: 2 },
  ],

  // --- PÁGINA 2 ---
  inventory: [
    { name: 'Kunai', qtd: 10, slot: 'Bolsa', notes: 'Aço comum' },
    { name: 'Bomba de Fumaça', qtd: 5, slot: 'Bolso', notes: 'Roxa' },
    { name: 'Lámen', qtd: 2, slot: 'Mochila', notes: 'Emergência' },
  ],
  powers: [
    { name: 'Manto da Kurama', level: 5, effects: '+50 Chakra, +10 Força' },
    { name: 'Modo Sábio', level: 3, effects: 'Senjutsu ativado' },
  ],
  economy: { kg: 'Fuuinjutsu', ryos: 150000, compUsados: 12 },
  aptitudes: [
    { name: 'Ninja Briguento', cost: 2 },
    { name: 'Vontade do Fogo', cost: 5 },
  ],
  powerPoints: { total: 50, spent: 45 },
  
  attacks: [
    { name: 'Soco Inglês', dano: '1d6', bonus: '+10', alcance: 'Toque', crit: '20/x2', dureza: '5', base: '10' },
    { name: 'Kunai', dano: '1d4', bonus: '+8', alcance: '9m', crit: '19/x2', dureza: '2', base: '8' }
  ],

  // --- PÁGINA 3 (JUTSUS) ---
  jutsus: [
    { 
      name: 'Rasengan', action: 'Padrão', level: 'A', target: '1 Inimigo', 
      damage: '10d10', range: 'Toque', duration: 'Inst.', cost: 20, 
      effects: 'Empurrão 3m', desc: 'Esfera espiral de chakra puro.' 
    },
    { 
      name: 'Rasenshuriken', action: 'Completa', level: 'S', target: 'Área 10m', 
      damage: '50d10', range: '20m', duration: 'Inst.', cost: 100, 
      effects: 'Dano Celular', desc: 'Vento cortante em nível celular.' 
    }
  ]
};