/* ============================================================
   MAFURAFU CRAFTS & HUB — app.js
   Arquitectura modular: cada módulo es un bloque independiente.
   Para agregar funcionalidad nueva, añade un bloque al final
   siguiendo el patrón: /* ═══ MÓDULO: NombreNuevo ═══ */
/* ============================================================ */
'use strict';

/* ═══════════════════════════════════════════════════════════
   CONSTANTES GLOBALES
═══════════════════════════════════════════════════════════ */

const YARN_COLORS_DEFAULT = [
  { name:'Amarillo',hex:'#f9d423' }, { name:'Rosa',    hex:'#ff8fab' },
  { name:'Verde',   hex:'#6bcb77' }, { name:'Azul',    hex:'#4d9de0' },
  { name:'Morado',  hex:'#9b6dff' }, { name:'Blanco',  hex:'#e8e8e8' },
  { name:'Naranja', hex:'#ff9a3c' }, { name:'Rojo',    hex:'#e05c6e' },
  { name:'Negro',   hex:'#3d3d3d' }, { name:'Café',    hex:'#a0522d' },
];

const DISPLAY_FONTS = [
  { name:'Nunito',   family:"'Nunito', sans-serif",    sample:'Abc' },
  { name:'Pacifico', family:"'Pacifico', cursive",      sample:'Abc' },
  { name:'Playfair', family:"'Playfair Display', serif", sample:'Abc' },
  { name:'Quicksand',family:"'Quicksand', sans-serif",  sample:'Abc' },
];
const BODY_FONTS = [
  { name:'Inter',    family:"'Inter', sans-serif" },
  { name:'Nunito',   family:"'Nunito', sans-serif" },
  { name:'Quicksand',family:"'Quicksand', sans-serif" },
];

const COLOR_THEMES = [
  { name:'Lavanda',  bg:'#f5f0fb', accent:'#9b6dff' },
  { name:'Rosa',     bg:'#fdf0f5', accent:'#e91e8c' },
  { name:'Menta',    bg:'#f0faf4', accent:'#27ae60' },
  { name:'Cielo',    bg:'#f0f7ff', accent:'#2196f3' },
  { name:'Durazno',  bg:'#fff6f0', accent:'#ff7043' },
  { name:'Gris',     bg:'#f5f5f5', accent:'#607d8b' },
];

const PLATFORM_ICONS = {
  youtube:'▶️', tiktok:'🎵', instagram:'📸', pdf:'📄', otro:'🔗'
};

const TAG_CLASSES = {
  pedido:'tag-pedido', regalo:'tag-regalo', bolsa:'tag-bolsa', urgente:'tag-urgente'
};

// EDITAR AQUÍ: URL base del servidor descargador Python
const DOWNLOADER_URL = 'http://localhost:5050';

// Claves de localStorage
const SK = {
  patterns:  'mafurafu_patterns',
  projects:  'mafurafu_projects',
  quotes:    'mafurafu_quotes',
  yarns:     'mafurafu_yarns',
  materials: 'mafurafu_materials',
  uploads:   'mafurafu_uploads',
  clients:   'mafurafu_clients',
  colors:    'mafurafu_customColors',
  settings:  'mafurafu_settings',
  visited:   'mafurafu_visited',
};

/* ═══════════════════════════════════════════════════════════
   ESTADO GLOBAL
═══════════════════════════════════════════════════════════ */
let state = {
  patterns:     [],  // tutoriales
  projects:     [],
  quotes:       [],
  yarns:        [],
  materials:    [],  // otros insumos: ojitos, relleno, telas, etc.
  uploadedPatterns: [], // archivos de patrones subidos (cualquier formato)
  clients:      [],
  customColors: [],
  settings: {
    hourRate:     200,
    darkMode:     false,
    fontDisplay:  "'Nunito', sans-serif",
    fontBody:     "'Inter', sans-serif",
    colorBg:      '#f5f0fb',
    colorAccent:  '#9b6dff',
  },
  ui: {
    currentPage:    'tutoriales',
    filterColor:    'Todos',
    filterTagTut:   '',
    filterTagProj:  '',
    filterStatus:   '',
    searchQuery:    '',
    selectedColorTut: null,
    selectedColorYarn:null,
    yarnLevel:      100,
    detailPct:      30,
  },
  downloaderOnline: false,
};

/* ═══════════════════════════════════════════════════════════
   MOCK DATA (solo primera visita)
═══════════════════════════════════════════════════════════ */
const MOCK_PATTERNS = [
  { id:'m1', titulo:'Amigurumi Pikachu bebé',       personaje:'Pikachu',   saga:'Pokémon',       color:'Amarillo', colorHex:'#f9d423', linkType:'youtube', url:'https://www.youtube.com/watch?v=ayQEc48QGuw', fecha:Date.now()-864e5*5, vistas:12, tags:['pedido'] },
  { id:'m2', titulo:'Stitch a crochet paso a paso', personaje:'Stitch',    saga:'Lilo & Stitch', color:'Azul',     colorHex:'#4d9de0', linkType:'youtube', url:'https://www.youtube.com/watch?v=DDzRMern12c', fecha:Date.now()-864e5*3, vistas:8,  tags:[] },
  { id:'m3', titulo:'Totoro grande para principiantes',personaje:'Totoro', saga:'Studio Ghibli', color:'Verde',    colorHex:'#6bcb77', linkType:'youtube', url:'https://www.youtube.com/watch?v=W8NQnxoJ2CI', fecha:Date.now()-864e5*2, vistas:5,  tags:['regalo'] },
  { id:'m4', titulo:'Hello Kitty amigurumi pequeño',personaje:'Hello Kitty',saga:'Sanrio',       color:'Rosa',     colorHex:'#ff8fab', linkType:'otro',    url:'',                                            fecha:Date.now()-864e5*1, vistas:3,  tags:[] },
  { id:'m5', titulo:'Kirby redondito paso a paso',  personaje:'Kirby',     saga:'Nintendo',      color:'Rosa',     colorHex:'#ff8fab', linkType:'youtube', url:'https://www.youtube.com/watch?v=ABYAiNrxH7U', fecha:Date.now()-864e5*.5,vistas:2,  tags:['urgente'] },
  { id:'m6', titulo:'Dragon Ball Z — Shenlong',     personaje:'Shenlong',  saga:'Dragon Ball Z', color:'Verde',    colorHex:'#6bcb77', linkType:'youtube', url:'https://www.youtube.com/watch?v=eTghv0gMRX8', fecha:Date.now()-864e5*.2,vistas:1,  tags:[] },
];
const MOCK_YARNS = [
  { id:'y1', nombre:'Amigurumi suave', color:'Rosa',     colorHex:'#ff8fab', gramaje:100, cantidad:3, level:75 },
  { id:'y2', nombre:'Catania',         color:'Azul',     colorHex:'#4d9de0', gramaje:50,  cantidad:5, level:100},
  { id:'y3', nombre:'Drops Design',    color:'Verde',    colorHex:'#6bcb77', gramaje:100, cantidad:1, level:25 },
];
const MOCK_CLIENTS = [
  { id:'c1', nombre:'Laura Gómez',    tel:'+52 555 1234', notas:'Le gusta el estilo kawaii. Suele pedir con anticipación.', proyectos:[], saldo:0 },
  { id:'c2', nombre:'Fernanda López', tel:'+52 555 5678', notas:'Pedidos urgentes frecuentes.', proyectos:[], saldo:150 },
];

/* ═══════════════════════════════════════════════════════════
   UTILIDADES
═══════════════════════════════════════════════════════════ */
function uid(prefix='id') { return prefix+'-'+Date.now().toString(36)+Math.random().toString(36).slice(2,7); }

function escHtml(s) {
  return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

function isLight(hex='#fff') {
  const c=(hex||'#fff').replace('#','');
  if(c.length<6)return true;
  const [r,g,b]=[0,2,4].map(i=>parseInt(c.slice(i,i+2),16));
  return (r*299+g*587+b*114)/1000>155;
}

function normHex(v) {
  v=(v||'').trim().replace(/^#+/,'');
  if(/^[0-9a-fA-F]{6}$/.test(v)) return '#'+v.toLowerCase();
  if(/^[0-9a-fA-F]{3}$/.test(v)) { const [r,g,b]=v.split(''); return '#'+r+r+g+g+b+b; }
  return null;
}

function formatMXN(n) { return '$'+Number(n||0).toLocaleString('es-MX',{minimumFractionDigits:2,maximumFractionDigits:2}); }

function showToast(msg, type='default') {
  const c=document.getElementById('toast-container');
  const t=document.createElement('div');
  t.className=`toast ${type}`;
  t.textContent=msg;
  c.appendChild(t);
  requestAnimationFrame(()=>requestAnimationFrame(()=>t.classList.add('show')));
  setTimeout(()=>{ t.classList.remove('show'); setTimeout(()=>t.remove(),350); }, 3200);
}

// Tiempo relativo desde una fecha
function timeAgo(ts) {
  const diff=Date.now()-ts;
  const days=Math.floor(diff/864e5);
  if(days<1)  return 'hoy';
  if(days<30) return `${days} día${days>1?'s':''}`;
  const months=Math.floor(days/30);
  if(months<12) return `${months} mes${months>1?'es':''}`;
  const years=Math.floor(months/12);
  return `${years} año${years>1?'s':''}`;
}

function daysSince(ts) {
  const days=Math.floor((Date.now()-ts)/864e5);
  if(days<30) return `${days} día${days!==1?'s':''}`;
  const m=Math.floor(days/30);
  if(m<12) return `${m} mes${m!==1?'es':''}`;
  const y=Math.floor(m/12);
  return `${y} año${y!==1?'s':''}`;
}

/* ═══════════════════════════════════════════════════════════
   ALMACENAMIENTO
═══════════════════════════════════════════════════════════ */
function save(key, data) {
  try { localStorage.setItem(key, JSON.stringify(data)); }
  catch { showToast('⚠️ Error al guardar (localStorage lleno)','error'); }
}
function load(key, fallback=[]) {
  try { const r=localStorage.getItem(key); return r?JSON.parse(r):fallback; }
  catch { return fallback; }
}

function loadAll() {
  state.customColors = load(SK.colors,   []);
  state.patterns     = load(SK.patterns, MOCK_PATTERNS);
  // Migración: asegurar que cada tutorial tenga un arreglo `colors`
  // (colores primarios/secundarios). Los tutoriales antiguos solo
  // tenían un color único en `color`/`colorHex`.
  state.patterns.forEach(p=>{
    if(!Array.isArray(p.colors)||!p.colors.length) {
      p.colors = p.color ? [{ name:p.color, hex:p.colorHex||getHex(p.color), type:'primario' }] : [];
    }
  });
  state.projects     = load(SK.projects, []);
  // Migración: asegurar que los colores de proyecto tengan `type`
  state.projects.forEach(pr=>{
    (pr.colors||[]).forEach(c=>{ if(!c.type) c.type='primario'; });
  });
  state.quotes       = load(SK.quotes,   []);
  state.yarns        = load(SK.yarns,    MOCK_YARNS);
  state.materials    = load(SK.materials, []);
  state.uploadedPatterns = load(SK.uploads, []);
  state.clients      = load(SK.clients,  MOCK_CLIENTS);
  const s            = load(SK.settings, {});
  state.settings     = { ...state.settings, ...s };

  // Primera visita: guardar mock data
  if(!localStorage.getItem(SK.visited)) {
    localStorage.setItem(SK.visited,'1');
    save(SK.patterns, state.patterns);
    save(SK.yarns,    state.yarns);
    save(SK.clients,  state.clients);
    setTimeout(()=>showToast('¡Bienvenida a MAFURAFU CRAFTS & HUB! 🧶✨','success'),600);
  }
}

function savePatterns()  { save(SK.patterns, state.patterns); }
function saveProjects()  { save(SK.projects, state.projects); }
function saveQuotes()    { save(SK.quotes,   state.quotes); }
function saveYarns()     { save(SK.yarns,    state.yarns); }
function saveMaterials() { save(SK.materials, state.materials); }
function saveUploads()   { save(SK.uploads,   state.uploadedPatterns); }
function saveClients()   { save(SK.clients,  state.clients); }
function saveColors()    { save(SK.colors,   state.customColors); }
function saveSettings()  { save(SK.settings, state.settings); }

/* ═══════════════════════════════════════════════════════════
   COLORES
═══════════════════════════════════════════════════════════ */
function allColors() { return [...YARN_COLORS_DEFAULT, ...state.customColors]; }

function getHex(name) {
  const c=allColors().find(x=>x.name===name);
  return c?c.hex:'#9b6dff';
}

// Devuelve el hex "representativo" de un tutorial/proyecto con
// varios colores: prioriza el primer color primario, si no hay,
// usa el primero disponible.
function mainColorHex(colorsArr, fallbackName, fallbackHex) {
  if(Array.isArray(colorsArr)&&colorsArr.length) {
    const primary=colorsArr.find(c=>c.type==='primario')||colorsArr[0];
    return primary.hex||getHex(primary.name);
  }
  return fallbackHex||getHex(fallbackName);
}

// Genera los puntitos de color (con distinción primario/secundario)
// usados en tarjetas de tutoriales y proyectos.
function colorsDotsHtml(colorsArr) {
  return (colorsArr||[]).map(c=>{
    const hex=c.hex||getHex(c.name);
    return `<span class="card-color-dot${c.type==='secundario'?' is-secundario':''}" style="background:${hex}" title="${escHtml(c.name)} (${c.type==='secundario'?'secundario':'primario'})"></span>`;
  }).join('');
}

function toEmbedUrl(url) {
  if(!url||!url.trim())return'';
  const m=url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  return m?`https://www.youtube.com/embed/${m[1]}?rel=0`:'';
}

/* ═══════════════════════════════════════════════════════════
   MÓDULO: MODO OSCURO
═══════════════════════════════════════════════════════════ */
function applyDarkMode() {
  document.body.classList.toggle('dark', state.settings.darkMode);
  const btn=document.getElementById('dark-mode-btn');
  if(btn)btn.textContent=state.settings.darkMode?'☀️ Modo claro':'🌙 Modo oscuro';
}
function toggleDarkMode() {
  state.settings.darkMode=!state.settings.darkMode;
  applyDarkMode();
  saveSettings();
}

/* ═══════════════════════════════════════════════════════════
   MÓDULO: PERSONALIZACIÓN (fuentes, colores, temas)
═══════════════════════════════════════════════════════════ */
function applySettings() {
  const s=state.settings;
  document.documentElement.style.setProperty('--font-display', s.fontDisplay);
  document.documentElement.style.setProperty('--font-body', s.fontBody);
  document.documentElement.style.setProperty('--color-bg', s.colorBg);
  document.documentElement.style.setProperty('--color-accent', s.colorAccent);
  // Calcular accent-dark (10% más oscuro)
  document.documentElement.style.setProperty('--color-accent-soft', hexToSoft(s.colorAccent));
}

function hexToSoft(hex) {
  // genera versión muy clara del acento (mezcla con blanco)
  const c=(hex||'#9b6dff').replace('#','');
  if(c.length!==6)return'#e9dfff';
  const [r,g,b]=[0,2,4].map(i=>parseInt(c.slice(i,i+2),16));
  const mix=(v)=>Math.round(v+(255-v)*0.7).toString(16).padStart(2,'0');
  return '#'+mix(r)+mix(g)+mix(b);
}

function renderCustomizePanel() {
  renderColorManager();
  // Temas de color
  const tr=document.getElementById('color-themes-row');
  if(tr) {
    tr.innerHTML=COLOR_THEMES.map(t=>
      `<button type="button" class="color-theme-btn" style="background:${t.accent}" title="${t.name}" data-bg="${t.bg}" data-accent="${t.accent}"></button>`
    ).join('');
    tr.querySelectorAll('.color-theme-btn').forEach(b=>{
      b.addEventListener('click',()=>{
        state.settings.colorBg=b.dataset.bg;
        state.settings.colorAccent=b.dataset.accent;
        applySettings(); saveSettings();
        document.getElementById('bg-color-picker').value=b.dataset.bg;
        document.getElementById('accent-color-picker').value=b.dataset.accent;
        showToast('🎨 Tema aplicado','success');
      });
    });
  }

  // Pickers individuales
  const bgP=document.getElementById('bg-color-picker');
  const acP=document.getElementById('accent-color-picker');
  if(bgP) { bgP.value=state.settings.colorBg; bgP.addEventListener('input',()=>{ state.settings.colorBg=bgP.value; applySettings(); saveSettings(); }); }
  if(acP) { acP.value=state.settings.colorAccent; acP.addEventListener('input',()=>{ state.settings.colorAccent=acP.value; applySettings(); saveSettings(); }); }

  // Fuentes display
  const fd=document.getElementById('font-display-options');
  if(fd) {
    fd.innerHTML=DISPLAY_FONTS.map(f=>
      `<button type="button" class="font-option${state.settings.fontDisplay===f.family?' selected':''}" data-family="${f.family}" data-name="${f.name}">
        <div class="font-sample" style="font-family:${f.family}">${f.sample}</div>
        <div class="font-name">${f.name}</div>
      </button>`
    ).join('');
    fd.querySelectorAll('.font-option').forEach(b=>{
      b.addEventListener('click',()=>{
        state.settings.fontDisplay=b.dataset.family;
        applySettings(); saveSettings();
        fd.querySelectorAll('.font-option').forEach(x=>x.classList.remove('selected'));
        b.classList.add('selected');
      });
    });
  }

  // Fuentes body
  const fb=document.getElementById('font-body-options');
  if(fb) {
    fb.innerHTML=BODY_FONTS.map(f=>
      `<button type="button" class="font-option${state.settings.fontBody===f.family?' selected':''}" data-family="${f.family}">
        <div class="font-sample" style="font-family:${f.family};font-size:1rem">${f.name}</div>
      </button>`
    ).join('');
    fb.querySelectorAll('.font-option').forEach(b=>{
      b.addEventListener('click',()=>{
        state.settings.fontBody=b.dataset.family;
        applySettings(); saveSettings();
        fb.querySelectorAll('.font-option').forEach(x=>x.classList.remove('selected'));
        b.classList.add('selected');
      });
    });
  }

  // Tarifa por hora
  const hr=document.getElementById('global-hour-rate');
  if(hr) hr.value=state.settings.hourRate;

  // Cargar fuente personalizada
  const loadBtn=document.getElementById('load-custom-font-btn');
  if(loadBtn) {
    loadBtn.addEventListener('click',()=>{
      const fontName=document.getElementById('custom-font-input').value.trim();
      const target=document.getElementById('custom-font-target').value;
      if(!fontName){showToast('Escribe el nombre de la fuente','error');return;}
      const link=document.createElement('link');
      const encoded=encodeURIComponent(fontName);
      link.href=`https://fonts.googleapis.com/css2?family=${encoded}:wght@400;700&display=swap`;
      link.rel='stylesheet';
      document.head.appendChild(link);
      const family=`'${fontName}', sans-serif`;
      if(target==='display') { state.settings.fontDisplay=family; }
      else { state.settings.fontBody=family; }
      applySettings(); saveSettings();
      showToast(`✅ Fuente "${fontName}" cargada`,'success');
    });
  }

  // Guardar tarifa
  const saveHR=document.getElementById('save-hour-rate-btn');
  if(saveHR) {
    saveHR.addEventListener('click',()=>{
      state.settings.hourRate=Number(hr?.value||200);
      saveSettings();
      // Sincronizar con cotizador
      const qhr=document.getElementById('q-hour-rate');
      if(qhr) qhr.value=state.settings.hourRate;
      showToast('⏱️ Tarifa guardada','success');
    });
  }
}

/* ═══════════════════════════════════════════════════════════
   MÓDULO: GESTIÓN GLOBAL DE COLORES (página Personalizar)
   Sección independiente para agregar/eliminar colores de
   estambre disponibles en toda la app (tutoriales, proyectos,
   estambres).
═══════════════════════════════════════════════════════════ */
function renderColorManager() {
  const grid=document.getElementById('color-manage-grid');
  if(!grid)return;
  grid.innerHTML=allColors().map((c,i)=>{
    const isDefault=i<YARN_COLORS_DEFAULT.length;
    return `<div class="color-manage-item${isDefault?' is-default':''}">
      <span class="cm-dot" style="background:${c.hex}"></span>
      <span class="cm-name">${escHtml(c.name)}</span>
      ${!isDefault?`<button type="button" class="cm-remove" data-r="${escHtml(c.name)}" title="Eliminar color">×</button>`:''}
    </div>`;
  }).join('');
  grid.querySelectorAll('.cm-remove').forEach(b=>{
    b.addEventListener('click',()=>{
      if(!confirm(`¿Eliminar color "${b.dataset.r}"?`))return;
      state.customColors=state.customColors.filter(c=>c.name!==b.dataset.r);
      saveColors(); renderColorPalette(); renderColorManager();
      showToast('🗑 Color eliminado');
    });
  });

  // Botón "+ Agregar color" — se conecta una sola vez (evita duplicados
  // porque este panel se vuelve a renderizar cada vez que se navega
  // a la página Personalizar)
  const addBtn=document.getElementById('cm-add-btn');
  if(addBtn && !addBtn.dataset.bound) {
    addBtn.dataset.bound='1';
    addBtn.addEventListener('click',()=>{
      const nameInput=document.getElementById('cm-new-name');
      const hexInput=document.getElementById('cm-new-hex');
      const nm=(nameInput?.value||'').trim();
      const hx=hexInput?.value||'#9b6dff';
      if(!nm){showToast('⚠️ Escribe un nombre para el color','error');return;}
      if(allColors().find(c=>c.name.toLowerCase()===nm.toLowerCase())){showToast(`"${nm}" ya existe`,'error');return;}
      state.customColors.push({name:nm,hex:hx,custom:true});
      saveColors(); renderColorPalette(); renderColorManager();
      if(nameInput) nameInput.value='';
      showToast(`✅ Color "${nm}" agregado`,'success');
    });
  }
}

/* ═══════════════════════════════════════════════════════════
   MÓDULO: NAVEGACIÓN
═══════════════════════════════════════════════════════════ */
function navigateTo(page) {
  state.ui.currentPage=page;
  document.querySelectorAll('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.page===page));
  document.querySelectorAll('.page-section').forEach(s=>s.classList.toggle('active',s.id===`page-${page}`));

  const titles={tutoriales:'Tutoriales',proyectos:'Proyectos',cotizaciones:'Cotizaciones',estambres:'Estambres',materiales:'Materiales','patrones-subidos':'Patrones subidos','crear-patrones':'Crear patrones',clientes:'Clientes',personalizar:'Personalizar'};
  const el=document.getElementById('header-page-title');
  if(el) el.textContent=titles[page]||page;

  const palette=document.getElementById('color-palette');
  if(palette) palette.style.display=(page==='tutoriales'||page==='proyectos')?'flex':'none';

  // Actualizar búsqueda placeholder
  const si=document.getElementById('search-input');
  if(si) si.placeholder={tutoriales:'Buscar tutoriales…',proyectos:'Buscar proyectos…',cotizaciones:'Buscar cotizaciones…',estambres:'Buscar estambres…',materiales:'Buscar materiales…','patrones-subidos':'Buscar archivos…',clientes:'Buscar clientes…',personalizar:''}[page]||'Buscar…';

  renderCurrentPage();
}

function renderCurrentPage() {
  const p=state.ui.currentPage;
  if(p==='tutoriales')  { renderColorPalette(); renderCarousel(); renderCatalog(); }
  if(p==='proyectos')   { renderColorPalette(); renderProjects(); }
  if(p==='cotizaciones'){ renderQuotes(); }
  if(p==='estambres')   { renderYarns(); }
  if(p==='materiales')  { renderMaterials(); }
  if(p==='patrones-subidos'){ renderUploadedFiles(); }
  if(p==='crear-patrones'){ renderPatternColorSwatches('cp-colors','cp-editor'); }
  if(p==='clientes')    { renderClients(); }
  if(p==='personalizar'){ renderCustomizePanel(); }
}

/* ═══════════════════════════════════════════════════════════
   MÓDULO: PALETA DE COLORES (HEADER)
═══════════════════════════════════════════════════════════ */
function renderColorPalette() {
  const pal=document.getElementById('color-palette');
  if(!pal)return;
  pal.innerHTML='<span class="palette-label">🎨 Estambre:</span>';

  const mkBtn=(color,style)=>{
    const b=document.createElement('button');
    b.className='color-btn'+(state.ui.filterColor===color?' active':'');
    b.dataset.color=color; b.title=color;
    if(style) b.style.cssText=style;
    b.addEventListener('click',()=>{ state.ui.filterColor=color; renderColorPalette(); renderCurrentPage(); });
    pal.appendChild(b);
  };
  mkBtn('Todos','background:conic-gradient(#f9d423,#ff8fab,#6bcb77,#4d9de0,#9b6dff,#f9d423)');
  allColors().forEach(({name,hex})=>mkBtn(name,`background:${hex}`));
}

/* ═══════════════════════════════════════════════════════════
   MÓDULO: SELECTOR DE COLOR (CHIPS + RUEDA)
   colorWidgetSetup(config):
   { pickerId, hexId, previewId, nameId, chipGridId, addBtnId, panelId, saveId, swatchId, labelId,
     onSelect: fn(name,hex) }
═══════════════════════════════════════════════════════════ */
function colorWidgetSetup(cfg) {
  const { pickerId, hexId, previewId, nameId, chipGridId, addBtnId, panelId, saveId, swatchId, labelId, onSelect } = cfg;

  function syncCCP(hex) {
    const pk=document.getElementById(pickerId);
    const hx=document.getElementById(hexId);
    const pv=document.getElementById(previewId);
    if(pk) pk.value=hex;
    if(hx) hx.value=hex;
    if(pv) pv.style.backgroundColor=hex;
  }

  function renderChips(selected=null) {
    const grid=document.getElementById(chipGridId);
    if(!grid)return;
    grid.innerHTML=allColors().map(({name,hex},i)=>{
      const isSel=selected&&selected.name===name;
      const isCustom=i>=YARN_COLORS_DEFAULT.length;
      const tc=isLight(hex)?'#2d2040':'#ffffff';
      return `<button type="button" class="color-chip${isSel?' selected':''}"
        data-cn="${escHtml(name)}" data-ch="${escHtml(hex)}"
        style="color:${tc};background:${hex};border-color:${isSel?'#2d2040':'transparent'}">
        <span class="chip-dot" style="background:${hex}"></span>${escHtml(name)}
        ${isCustom?`<button type="button" class="chip-remove" data-r="${escHtml(name)}">×</button>`:''}
      </button>`;
    }).join('');

    grid.querySelectorAll('.color-chip').forEach(ch=>{
      ch.addEventListener('click',e=>{
        if(e.target.closest('.chip-remove'))return;
        selectColor(ch.dataset.cn, ch.dataset.ch);
      });
    });
    grid.querySelectorAll('.chip-remove').forEach(b=>{
      b.addEventListener('click',e=>{
        e.stopPropagation();
        if(!confirm(`¿Eliminar color "${b.dataset.r}"?`))return;
        state.customColors=state.customColors.filter(c=>c.name!==b.dataset.r);
        saveColors(); renderColorPalette();
        renderChips(cfg.currentSelected);
        showToast('🗑 Color eliminado');
      });
    });
  }

  function selectColor(name,hex) {
    cfg.currentSelected={name,hex};
    if(onSelect)onSelect(name,hex);
    const sw=document.getElementById(swatchId);
    const lb=document.getElementById(labelId);
    if(sw)sw.style.backgroundColor=hex;
    if(lb)lb.textContent=name;
    renderChips({name,hex});
  }

  // Inicializar picker
  const pk=document.getElementById(pickerId);
  const hx=document.getElementById(hexId);
  const pv=document.getElementById(previewId);
  if(pk) {
    syncCCP(pk.value);
    pk.addEventListener('input',()=>syncCCP(pk.value));
  }
  if(hx) {
    hx.addEventListener('input',()=>{ const n=normHex(hx.value); if(n){syncCCP(n);} });
  }

  // Botón "Agregar color"
  const addBtn=document.getElementById(addBtnId);
  const panel=document.getElementById(panelId);
  if(addBtn&&panel) {
    addBtn.addEventListener('click',()=>panel.classList.toggle('open'));
  }

  // Guardar color personalizado
  const saveBtn=document.getElementById(saveId);
  if(saveBtn) {
    saveBtn.addEventListener('click',()=>{
      const hxv=normHex(document.getElementById(hexId)?.value)||document.getElementById(pickerId)?.value;
      const nm=(document.getElementById(nameId)?.value||'').trim();
      if(!nm){showToast('⚠️ Escribe un nombre','error');return;}
      if(allColors().find(c=>c.name.toLowerCase()===nm.toLowerCase())){showToast(`"${nm}" ya existe`,'error');return;}
      state.customColors.push({name:nm,hex:hxv,custom:true});
      saveColors(); renderColorPalette();
      selectColor(nm,hxv);
      renderChips({name:nm,hex:hxv});
      if(panel)panel.classList.remove('open');
      if(document.getElementById(nameId)) document.getElementById(nameId).value='';
      showToast(`✅ Color "${nm}" guardado`,'success');
    });
  }

  cfg.renderChips=renderChips;
  cfg.selectColor=selectColor;
  renderChips();
  return cfg;
}

/* ═══════════════════════════════════════════════════════════
   MÓDULO: SELECTOR MÚLTIPLE DE COLORES (PRIMARIOS/SECUNDARIOS)
   Permite elegir varios colores a la vez, divididos en dos
   grupos: primarios y secundarios. Se usa en tutoriales.
   multiColorWidgetSetup(cfg):
   { tabsId, chipGridId, addBtnId, panelId, pickerId, hexId,
     previewId, nameId, saveId, summaryId,
     countPrimarioId, countSecundarioId, initial:[{name,hex,type}] }
═══════════════════════════════════════════════════════════ */
function multiColorWidgetSetup(cfg) {
  const { tabsId, chipGridId, addBtnId, panelId, pickerId, hexId, previewId, nameId, saveId, summaryId, countPrimarioId, countSecundarioId } = cfg;
  cfg.selected = Array.isArray(cfg.initial) ? cfg.initial.map(c=>({...c})) : [];
  cfg.activeType = 'primario';

  function isSelected(name) { return cfg.selected.find(c=>c.name===name); }

  function toggleColor(name,hex) {
    const existing=isSelected(name);
    if(existing && existing.type===cfg.activeType) {
      // ya estaba en el grupo activo → lo quitamos
      cfg.selected=cfg.selected.filter(c=>c.name!==name);
    } else if(existing) {
      // estaba en el otro grupo → lo movemos al grupo activo
      existing.type=cfg.activeType;
    } else {
      cfg.selected.push({name,hex,type:cfg.activeType});
    }
    renderAll();
  }

  function removeColor(name) {
    cfg.selected=cfg.selected.filter(c=>c.name!==name);
    renderAll();
  }

  function renderTabs() {
    const tabs=document.getElementById(tabsId);
    if(!tabs)return;
    tabs.querySelectorAll('.color-type-tab').forEach(t=>{
      t.classList.toggle('active', t.dataset.type===cfg.activeType);
    });
    const cp=document.getElementById(countPrimarioId);
    const cs=document.getElementById(countSecundarioId);
    if(cp) cp.textContent=cfg.selected.filter(c=>c.type==='primario').length;
    if(cs) cs.textContent=cfg.selected.filter(c=>c.type==='secundario').length;
  }

  function renderChips() {
    const grid=document.getElementById(chipGridId);
    if(!grid)return;
    grid.innerHTML=allColors().map(({name,hex},i)=>{
      const sel=isSelected(name);
      const isCustom=i>=YARN_COLORS_DEFAULT.length;
      const tc=isLight(hex)?'#2d2040':'#ffffff';
      const markedClass=sel?` type-marked-${sel.type}`:'';
      const badge=sel?`<span class="chip-type-badge ${sel.type==='primario'?'p':'s'}">${sel.type==='primario'?'P':'S'}</span>`:'';
      return `<button type="button" class="color-chip${sel?' selected':''}${markedClass}"
        data-cn="${escHtml(name)}" data-ch="${escHtml(hex)}"
        style="color:${tc};background:${hex};border-color:${sel?'#2d2040':'transparent'}">
        <span class="chip-dot" style="background:${hex}"></span>${escHtml(name)}${badge}
        ${isCustom?`<button type="button" class="chip-remove" data-r="${escHtml(name)}">×</button>`:''}
      </button>`;
    }).join('');

    grid.querySelectorAll('.color-chip').forEach(ch=>{
      ch.addEventListener('click',e=>{
        if(e.target.closest('.chip-remove'))return;
        toggleColor(ch.dataset.cn, ch.dataset.ch);
      });
    });
    grid.querySelectorAll('.chip-remove').forEach(b=>{
      b.addEventListener('click',e=>{
        e.stopPropagation();
        if(!confirm(`¿Eliminar color "${b.dataset.r}"?`))return;
        state.customColors=state.customColors.filter(c=>c.name!==b.dataset.r);
        saveColors(); renderColorPalette(); renderColorManager();
        removeColor(b.dataset.r);
        showToast('🗑 Color eliminado');
      });
    });
  }

  function renderSummary() {
    const box=document.getElementById(summaryId);
    if(!box)return;
    const primarios=cfg.selected.filter(c=>c.type==='primario');
    const secundarios=cfg.selected.filter(c=>c.type==='secundario');
    if(!cfg.selected.length) {
      box.innerHTML='<span class="color-empty-hint">Aún no has elegido ningún color.</span>';
      return;
    }
    const grp=(label,list)=>{
      if(!list.length)return'';
      const tags=list.map(c=>`<span class="selected-color-tag is-${c.type}">
        <span class="chip-dot" style="background:${c.hex}"></span>${escHtml(c.name)}
        <button type="button" class="stag-remove" data-r="${escHtml(c.name)}">×</button>
      </span>`).join('');
      return `<div class="selected-colors-group"><span class="selected-colors-group-label">${label}</span>${tags}</div>`;
    };
    box.innerHTML=grp('🎯 Primarios',primarios)+grp('🌈 Secundarios',secundarios);
    box.querySelectorAll('.stag-remove').forEach(b=>{
      b.addEventListener('click',()=>removeColor(b.dataset.r));
    });
  }

  function renderAll() { renderTabs(); renderChips(); renderSummary(); }

  // Pestañas Primario/Secundario
  const tabs=document.getElementById(tabsId);
  if(tabs) {
    tabs.querySelectorAll('.color-type-tab').forEach(t=>{
      t.addEventListener('click',()=>{ cfg.activeType=t.dataset.type; renderAll(); });
    });
  }

  // Rueda de color / hex (para el panel "agregar color personalizado")
  function syncCCP(hex) {
    const pk=document.getElementById(pickerId);
    const hx=document.getElementById(hexId);
    const pv=document.getElementById(previewId);
    if(pk) pk.value=hex;
    if(hx) hx.value=hex;
    if(pv) pv.style.backgroundColor=hex;
  }
  const pk=document.getElementById(pickerId);
  const hx=document.getElementById(hexId);
  if(pk) { syncCCP(pk.value); pk.addEventListener('input',()=>syncCCP(pk.value)); }
  if(hx) { hx.addEventListener('input',()=>{ const n=normHex(hx.value); if(n){syncCCP(n);} }); }

  const addBtn=document.getElementById(addBtnId);
  const panel=document.getElementById(panelId);
  if(addBtn&&panel) addBtn.addEventListener('click',()=>panel.classList.toggle('open'));

  const saveBtn=document.getElementById(saveId);
  if(saveBtn) {
    saveBtn.addEventListener('click',()=>{
      const hxv=normHex(document.getElementById(hexId)?.value)||document.getElementById(pickerId)?.value;
      const nm=(document.getElementById(nameId)?.value||'').trim();
      if(!nm){showToast('⚠️ Escribe un nombre','error');return;}
      if(allColors().find(c=>c.name.toLowerCase()===nm.toLowerCase())){showToast(`"${nm}" ya existe`,'error');return;}
      state.customColors.push({name:nm,hex:hxv,custom:true});
      saveColors(); renderColorPalette(); renderColorManager();
      toggleColor(nm,hxv);
      if(panel)panel.classList.remove('open');
      if(document.getElementById(nameId)) document.getElementById(nameId).value='';
      showToast(`✅ Color "${nm}" guardado`,'success');
    });
  }

  cfg.renderAll=renderAll;
  renderAll();
  return cfg;
}

/* ═══════════════════════════════════════════════════════════
   MÓDULO: TUTORIALES (CARRUSEL + CATÁLOGO)
═══════════════════════════════════════════════════════════ */
let tutColorWidget=null;

function getFilteredTuts() {
  const q=state.ui.searchQuery.toLowerCase().trim();
  return state.patterns.filter(p=>{
    const colorNames=(p.colors&&p.colors.length)?p.colors.map(c=>c.name):[p.color].filter(Boolean);
    if(state.ui.filterColor!=='Todos'&&!colorNames.includes(state.ui.filterColor))return false;
    if(state.ui.filterTagTut&&!(p.tags||[]).includes(state.ui.filterTagTut))return false;
    if(q&&!`${p.titulo} ${p.personaje} ${p.saga} ${colorNames.join(' ')}`.toLowerCase().includes(q))return false;
    return true;
  });
}

function renderCarousel() {
  const track=document.getElementById('carousel-track');
  if(!track)return;
  const recent=[...state.patterns].sort((a,b)=>b.fecha-a.fecha).slice(0,6);
  if(!recent.length){track.innerHTML='<p class="carousel-empty">Aún no hay tutoriales guardados.</p>';return;}
  track.innerHTML=recent.map(p=>{
    const hex=mainColorHex(p.colors,p.color,p.colorHex);
    const embed=toEmbedUrl(p.url);
    return `<div class="carousel-card" style="--yarn-color:${hex}" data-id="${p.id}" role="button" tabindex="0" title="${escHtml(p.titulo)}">
      <div class="carousel-card-thumb">${embed?'▶️':'🧶'}</div>
      <div class="carousel-card-body">
        <div class="carousel-card-title">${escHtml(p.titulo)}</div>
        <div class="carousel-card-sub">${escHtml(p.personaje)}${p.saga?' · '+escHtml(p.saga):''}</div>
      </div>
    </div>`;
  }).join('');
  track.querySelectorAll('.carousel-card').forEach(c=>{
    const go=()=>{
      const t=document.querySelector(`.pattern-card[data-id="${c.dataset.id}"]`);
      if(t){t.scrollIntoView({behavior:'smooth',block:'center'});t.style.outline='3px solid var(--color-accent)';setTimeout(()=>t.style.outline='',1500);}
    };
    c.addEventListener('click',go);
    c.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' ')go();});
  });
}

function renderCatalog() {
  const grid=document.getElementById('catalog-grid');
  const countEl=document.getElementById('catalog-count');
  if(!grid)return;
  const filtered=getFilteredTuts().sort((a,b)=>b.fecha-a.fecha);
  if(countEl)countEl.textContent=`${filtered.length} tutorial${filtered.length!==1?'es':''}`;
  if(!filtered.length){
    grid.innerHTML=`<div class="catalog-empty"><span class="catalog-empty-icon">🔍</span><h3>Sin resultados</h3><p>Cambia los filtros o agrega un tutorial nuevo.</p></div>`;
    return;
  }
  grid.innerHTML=filtered.map(p=>renderTutCard(p)).join('');
  grid.querySelectorAll('.btn-delete').forEach(b=>b.addEventListener('click',()=>deleteTutorial(b.dataset.id)));
  grid.querySelectorAll('.card-link-edit').forEach(b=>b.addEventListener('click',()=>openEditLink(b.dataset.id)));
  grid.querySelectorAll('.view-pattern-btn').forEach(b=>b.addEventListener('click',()=>openViewPattern(b.dataset.id)));
  grid.querySelectorAll('.btn-play').forEach(b=>b.addEventListener('click',()=>{
    const p=state.patterns.find(x=>x.id===b.dataset.id);
    if(p){p.vistas=(p.vistas||0)+1;savePatterns();}
    openFloatPlayer(b.dataset.url, b.dataset.title);
  }));
}

function renderTutCard(p) {
  const hex=mainColorHex(p.colors,p.color,p.colorHex);
  const embed=toEmbedUrl(p.url);
  const tc=isLight(hex)?'#2d2040':'#ffffff';
  const platformIcon=PLATFORM_ICONS[p.linkType||'outro']||'🔗';
  const tagHtml=(p.tags||[]).map(t=>`<span class="tag ${TAG_CLASSES[t]||'tag-custom'}">${t}</span>`).join('');
  const colorsArr=(p.colors&&p.colors.length)?p.colors:(p.color?[{name:p.color,hex:p.colorHex||getHex(p.color),type:'primario'}]:[]);
  const colorNames=colorsArr.map(c=>c.name).join(', ')||'—';

  let videoSection='';
  if(embed) {
    videoSection=`<div class="card-video"><iframe src="${embed}" title="${escHtml(p.titulo)}" allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture" allowfullscreen loading="lazy"></iframe></div>`;
  } else if(p.url) {
    videoSection=`<div class="card-no-video"><div class="card-no-video-inner">${platformIcon}<span><a href="${escHtml(p.url)}" target="_blank" style="color:var(--color-accent)">Ver en ${p.linkType||'web'} ↗</a></span></div></div>`;
  } else {
    videoSection=`<div class="card-no-video"><div class="card-no-video-inner">🧶<span>Sin enlace</span></div></div>`;
  }

  return `<article class="pattern-card" data-id="${p.id}" style="--yarn-color:${hex}">
    ${videoSection}
    <div class="card-body">
      <h3 class="card-title">${escHtml(p.titulo)}</h3>
      <div class="card-meta">
        <span class="tag tag-persona">🎭 ${escHtml(p.personaje)}</span>
        ${p.saga?`<span class="tag tag-saga">📺 ${escHtml(p.saga)}</span>`:''}
        <span class="tag tag-color" style="background:${hex};color:${tc}">🧶 ${escHtml(colorNames)}</span>
      </div>
      <div class="card-colors-row">${colorsDotsHtml(colorsArr)}</div>
      ${tagHtml?`<div class="card-tags">${tagHtml}</div>`:''}
      <div class="card-link-row">
        <span>${platformIcon} ${p.linkType||'sin enlace'}</span>
        <button class="card-link-edit" data-id="${p.id}">✏️ Editar enlace</button>
      </div>
      <div class="card-footer-row">
        <span class="card-views">👁 ${p.vistas||0} · ${timeAgo(p.fecha)}</span>
        ${p.patronEscrito?`<button class="card-pattern-btn view-pattern-btn" data-id="${p.id}">📝 Patrón</button>`:''}
        ${embed?`<button class="btn-success btn-play" data-id="${p.id}" data-url="${escHtml(embed)}" data-title="${escHtml(p.titulo)}" style="font-size:var(--fs-xs)">▶️ Ver</button>`:''}
        <button class="btn-danger btn-delete" data-id="${p.id}" style="font-size:var(--fs-xs)">🗑</button>
      </div>
    </div>
  </article>`;
}

function deleteTutorial(id) {
  const p=state.patterns.find(x=>x.id===id);
  if(!p||!confirm(`¿Eliminar "${p.titulo}"?`))return;
  state.patterns=state.patterns.filter(x=>x.id!==id);
  savePatterns(); renderCarousel(); renderCatalog();
  showToast('🗑 Tutorial eliminado');
}

/* ═══════════════════════════════════════════════════════════
   MÓDULO: PROYECTOS
═══════════════════════════════════════════════════════════ */
function calcProjectPrice(material, hours, hourRate, pct) {
  const labor=hours*hourRate;
  const base=Number(material)+labor;
  return base+(base*pct/100);
}

function renderProjects() {
  const grid=document.getElementById('projects-grid');
  const countEl=document.getElementById('projects-count');
  if(!grid)return;
  const q=state.ui.searchQuery.toLowerCase().trim();
  const st=state.ui.filterStatus;
  const tg=state.ui.filterTagProj;
  const list=state.projects.filter(p=>{
    if(st&&p.estado!==st)return false;
    if(tg&&!(p.tags||[]).includes(tg))return false;
    if(q&&!`${p.nombre} ${p.cliente||''} ${p.notas||''}`.toLowerCase().includes(q))return false;
    return true;
  }).sort((a,b)=>b.fecha-a.fecha);

  if(countEl)countEl.textContent=`${list.length} proyecto${list.length!==1?'s':''}`;
  if(!list.length){
    grid.innerHTML=`<div class="catalog-empty"><span class="catalog-empty-icon">📋</span><h3>Sin proyectos</h3><p>Agrega tu primer proyecto con el botón +</p></div>`;
    return;
  }
  grid.innerHTML=list.map(p=>renderProjectCard(p)).join('');
  grid.querySelectorAll('.btn-finish').forEach(b=>b.addEventListener('click',()=>openFinishModal(b.dataset.id)));
  grid.querySelectorAll('.btn-delete-proj').forEach(b=>b.addEventListener('click',()=>{
    const pr=state.projects.find(x=>x.id===b.dataset.id);
    if(!pr||!confirm(`¿Eliminar proyecto "${pr.nombre}"?`))return;
    state.projects=state.projects.filter(x=>x.id!==b.dataset.id);
    saveProjects(); renderProjects(); showToast('🗑 Proyecto eliminado');
  }));
  grid.querySelectorAll('.project-photo-add').forEach(b=>b.addEventListener('click',()=>{
    const input=document.getElementById('project-photo-input');
    input.dataset.projId=b.dataset.projId;
    input.click();
  }));
  grid.querySelectorAll('.project-photo').forEach(img=>img.addEventListener('click',()=>openLightbox(img.src)));
}

function renderProjectCard(p) {
  const statusBadge=`<span class="badge badge-${p.estado||'pendiente'}">${{pendiente:'⏳ Pendiente',progreso:'🔧 En progreso',terminado:'✅ Terminado',entregado:'📦 Entregado'}[p.estado]||p.estado}</span>`;
  const tagHtml=(p.tags||[]).map(t=>`<span class="tag ${TAG_CLASSES[t]||'tag-custom'}">${t}</span>`).join('');
  const photosHtml=(p.photos||[]).map(src=>`<img class="project-photo" src="${src}" alt="foto"/>`).join('');

  let priceHtml='';
  if(p.estado==='terminado'||p.estado==='entregado'){
    const suggested=p.suggestedPrice||0;
    const sold=p.soldPrice||0;
    const gain=sold?sold-p.totalCost:suggested-p.totalCost;
    priceHtml=`<div class="price-row">
      <span class="price-main">${formatMXN(p.estado==='entregado'&&sold?sold:suggested)}</span>
      <span class="price-sub">${p.estado==='entregado'&&sold?'vendido':'sugerido'}</span>
      ${gain?`<span class="price-gain ${gain<0?'negative':''}">${gain>=0?'▲ ganancia: ':'▼ pérdida: '}${formatMXN(Math.abs(gain))}</span>`:''}
    </div>`;
  }

  const extras=(p.extras||[]).map(e=>`<span class="tag tag-custom">${e}</span>`).join('');
  const colors=colorsDotsHtml(p.colors);

  return `<div class="project-card">
    <div class="project-card-header">
      <div style="flex:1">
        <div style="display:flex;align-items:center;gap:var(--space-2);margin-bottom:var(--space-2)">
          <span class="project-title">${escHtml(p.nombre)}</span>
          ${statusBadge}
        </div>
        <div style="font-size:var(--fs-xs);color:var(--color-text-muted)">${p.cliente?'👤 '+escHtml(p.cliente):''}</div>
      </div>
      <span class="project-days" title="Antigüedad">📅 ${daysSince(p.fecha)}</span>
    </div>
    <div class="project-card-body">
      ${p.notas?`<div style="font-size:var(--fs-xs);color:var(--color-text-muted)">${escHtml(p.notas)}</div>`:''}
      <div style="display:flex;flex-wrap:wrap;gap:var(--space-2);align-items:center">
        ${colors}${extras}${tagHtml}
      </div>
      <div style="font-size:var(--fs-xs);color:var(--color-text-muted)">
        ${p.metros?`📏 ${p.metros} m · `:''}${p.costoMaterial?`💰 Material: ${formatMXN(p.costoMaterial)} · `:''}${p.horas?`⏱ ${p.horas} h`:''}
      </div>
      ${priceHtml}
      <div class="project-photos">${photosHtml}
        <button class="project-photo-add" data-proj-id="${p.id}" title="Agregar foto">📷</button>
      </div>
    </div>
    <div class="project-card-footer">
      ${(p.estado!=='terminado'&&p.estado!=='entregado')?`<button class="btn-success btn-finish" data-id="${p.id}" style="font-size:var(--fs-xs)">✅ Marcar terminado</button>`:''}
      ${p.estado==='terminado'?`<button class="btn-secondary btn-finish" data-id="${p.id}" style="font-size:var(--fs-xs)">📦 Marcar entregado</button>`:''}
      <button class="btn-danger btn-delete-proj" data-id="${p.id}" style="font-size:var(--fs-xs);margin-left:auto">🗑 Eliminar</button>
    </div>
  </div>`;
}

function openFinishModal(id) {
  const p=state.projects.find(x=>x.id===id);
  if(!p)return;
  document.getElementById('finish-project-id').value=id;
  document.getElementById('fin-horas').value=p.horas||'';
  document.getElementById('fin-material').value=p.costoMaterial||'';
  document.getElementById('fin-venta').value='';
  updateFinishResult();
  openModal('modal-finish');
}

function updateFinishResult() {
  const horas=Number(document.getElementById('fin-horas')?.value||0);
  const mat=Number(document.getElementById('fin-material')?.value||0);
  const venta=Number(document.getElementById('fin-venta')?.value||0);
  const hr=state.settings.hourRate;
  const pct=30;
  const labor=horas*hr;
  const base=mat+labor;
  const sugerido=base+(base*pct/100);
  const gain=venta?venta-base:sugerido-base;
  const box=document.getElementById('fin-breakdown');
  if(box) box.innerHTML=`
    <div class="quote-breakdown">
      <div class="quote-line"><span>Material real</span><span>${formatMXN(mat)}</span></div>
      <div class="quote-line"><span>Mano de obra (${horas}h × $${hr})</span><span>${formatMXN(labor)}</span></div>
      <div class="quote-line"><span>Costo total</span><span>${formatMXN(base)}</span></div>
      <div class="quote-line total"><span>Precio sugerido (+30%)</span><span>${formatMXN(sugerido)}</span></div>
      ${venta?`<div class="quote-line"><span>Ganancia real</span><span class="price-gain ${gain<0?'negative':''}">${formatMXN(gain)}</span></div>`:''}
    </div>`;
}
/* ═══════════════════════════════════════════════════════════
   MÓDULO: COTIZACIONES
═══════════════════════════════════════════════════════════ */
let currentDetailPct=30;

function calcQuote() {
  const mat=Number(document.getElementById('q-material')?.value||0);
  const hrs=Number(document.getElementById('q-hours')?.value||0);
  const hr=Number(document.getElementById('q-hour-rate')?.value||state.settings.hourRate);
  const pct=currentDetailPct;
  const realPrice=Number(document.getElementById('q-real-price')?.value||0);

  const labor=hrs*hr;
  const base=mat+labor;
  const sugerido=base+(base*pct/100);
  const gain=realPrice?realPrice-base:0;

  document.getElementById('quote-price').textContent=formatMXN(sugerido);
  document.getElementById('ql-material').textContent=formatMXN(mat);
  document.getElementById('ql-labor').textContent=formatMXN(labor);
  document.getElementById('ql-pct').textContent=pct+'%';
  document.getElementById('ql-total').textContent=formatMXN(sugerido);

  const gainRow=document.getElementById('ql-gain-row');
  if(gainRow){
    gainRow.style.display=realPrice?'flex':'none';
    const gainEl=document.getElementById('ql-gain');
    if(gainEl){gainEl.textContent=formatMXN(gain);gainEl.className='price-gain'+(gain<0?' negative':'');}
  }
  return {mat,labor,base,sugerido,gain,pct,hrs,hr,realPrice};
}

function renderQuotes() {
  const hr=document.getElementById('q-hour-rate');
  if(hr&&!hr.value)hr.value=state.settings.hourRate;

  const grid=document.getElementById('quotes-grid');
  if(!grid)return;
  const q=state.ui.searchQuery.toLowerCase();
  const list=state.quotes.filter(x=>!q||x.titulo?.toLowerCase().includes(q)).sort((a,b)=>b.fecha-a.fecha);
  if(!list.length){grid.innerHTML=`<div class="catalog-empty"><span class="catalog-empty-icon">💲</span><h3>Sin cotizaciones guardadas</h3><p>Calcula y guarda una cotización arriba.</p></div>`;return;}
  grid.innerHTML=list.map(q=>`
    <div class="quote-card">
      <div style="display:flex;align-items:center;justify-content:space-between">
        <strong style="font-family:var(--font-display)">${escHtml(q.titulo||'Cotización sin nombre')}</strong>
        <span style="font-size:var(--fs-xs);color:var(--color-text-muted)">${timeAgo(q.fecha)}</span>
      </div>
      <div class="quote-breakdown">
        <div class="quote-line"><span>Material</span><span>${formatMXN(q.mat)}</span></div>
        <div class="quote-line"><span>Mano de obra</span><span>${formatMXN(q.labor)}</span></div>
        <div class="quote-line total"><span>Precio sugerido</span><span>${formatMXN(q.sugerido)}</span></div>
      </div>
      <button class="btn-danger" data-qid="${q.id}" style="font-size:var(--fs-xs);align-self:flex-end">🗑 Eliminar</button>
    </div>`).join('');
  grid.querySelectorAll('[data-qid]').forEach(b=>b.addEventListener('click',()=>{
    state.quotes=state.quotes.filter(x=>x.id!==b.dataset.qid);
    saveQuotes(); renderQuotes(); showToast('🗑 Cotización eliminada');
  }));
}

/* ═══════════════════════════════════════════════════════════
   MÓDULO: ESTAMBRES
═══════════════════════════════════════════════════════════ */
function renderYarns() {
  const grid=document.getElementById('yarn-inventory-grid');
  const countEl=document.getElementById('yarn-count');
  if(!grid)return;
  const q=state.ui.searchQuery.toLowerCase();
  const list=state.yarns.filter(y=>!q||`${y.nombre} ${y.color}`.toLowerCase().includes(q));
  if(countEl)countEl.textContent=`${list.length} tipo${list.length!==1?'s':''}`;
  if(!list.length){grid.innerHTML=`<div class="catalog-empty"><span class="catalog-empty-icon">🧶</span><h3>Sin estambres</h3><p>Agrega tu inventario con el botón +</p></div>`;return;}

  const levelLabel={100:'🟢 Completo',75:'🟡 Sobra mucho',50:'🟠 Sobra poco',25:'🔴 Casi sin estambre',0:'⚫ Agotado'};
  const levelColor={100:'#6bcb77',75:'#f9d423',50:'#ff9a3c',25:'#e05c6e',0:'#3d3d3d'};

  grid.innerHTML=list.map(y=>{
    const hex=y.colorHex||getHex(y.color);
    const closestLevel=[100,75,50,25,0].reduce((prev,curr)=>Math.abs(curr-y.level)<Math.abs(prev-y.level)?curr:prev);
    return `<div class="yarn-ball-card">
      <div class="yarn-ball-top">
        <div class="yarn-ball-icon" style="background:${hex}25;border-color:${hex}40">
          <span style="filter:drop-shadow(0 1px 2px rgba(0,0,0,.2))">🧶</span>
        </div>
        <div>
          <div class="yarn-ball-name">${escHtml(y.nombre)}</div>
          <div class="yarn-ball-meta">
            <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${hex};margin-right:4px;vertical-align:middle"></span>
            ${escHtml(y.color)} · ${y.gramaje||'?'}g · ${y.cantidad||1} bola${y.cantidad!==1?'s':''}
          </div>
        </div>
      </div>
      <div class="yarn-level-bar">
        <div class="yarn-level-fill" style="width:${y.level||0}%;background:${levelColor[closestLevel]||'#6bcb77'}"></div>
      </div>
      <div style="display:flex;align-items:center;justify-content:space-between">
        <span class="yarn-level-label">${levelLabel[closestLevel]||'Nivel desconocido'}</span>
        <div style="display:flex;gap:4px">
          <button class="btn-icon" data-yid="${y.id}" data-action="up" title="Subir nivel" style="width:28px;height:28px;font-size:.8rem">+</button>
          <button class="btn-icon" data-yid="${y.id}" data-action="down" title="Bajar nivel" style="width:28px;height:28px;font-size:.8rem">−</button>
          <button class="btn-danger" data-yid="${y.id}" data-action="del" style="font-size:var(--fs-xs);padding:2px 8px">🗑</button>
        </div>
      </div>
    </div>`;
  }).join('');

  grid.querySelectorAll('[data-action]').forEach(b=>{
    b.addEventListener('click',()=>{
      const yarn=state.yarns.find(x=>x.id===b.dataset.yid);
      if(!yarn)return;
      if(b.dataset.action==='up') yarn.level=Math.min(100,yarn.level+25);
      if(b.dataset.action==='down') yarn.level=Math.max(0,yarn.level-25);
      if(b.dataset.action==='del'){
        if(!confirm(`¿Eliminar "${yarn.nombre}"?`))return;
        state.yarns=state.yarns.filter(x=>x.id!==b.dataset.yid);
      }
      saveYarns(); renderYarns();
    });
  });
}

/* ═══════════════════════════════════════════════════════════
   MÓDULO: MATERIALES (insumos genéricos: ojitos, relleno, telas…)
   No están atados a un color de estambre, así que se guardan
   con su propia categoría, cantidad y notas.
═══════════════════════════════════════════════════════════ */
const MATERIAL_ICONS = {
  'Ojitos':'👀','Relleno':'☁️','Tela':'🧵','Agujas/ganchos':'🪡',
  'Broches/accesorios':'🔘','Otro':'📦',
};

function renderMaterials() {
  const grid=document.getElementById('material-inventory-grid');
  const countEl=document.getElementById('material-count');
  if(!grid)return;
  const q=state.ui.searchQuery.toLowerCase();
  const list=state.materials.filter(m=>!q||`${m.nombre} ${m.categoria} ${m.notas||''}`.toLowerCase().includes(q));
  if(countEl)countEl.textContent=`${list.length} artículo${list.length!==1?'s':''}`;
  if(!list.length){grid.innerHTML=`<div class="catalog-empty"><span class="catalog-empty-icon">📦</span><h3>Sin materiales</h3><p>Agrega ojitos, relleno, telas y más con el botón +</p></div>`;return;}

  grid.innerHTML=list.map(m=>`<div class="yarn-ball-card">
      <div class="yarn-ball-top">
        <div class="yarn-ball-icon material-card-icon" style="background:var(--color-accent-soft);border-color:var(--color-border)">
          <span>${MATERIAL_ICONS[m.categoria]||'📦'}</span>
        </div>
        <div>
          <div class="yarn-ball-name">${escHtml(m.nombre)}</div>
          <div class="yarn-ball-meta">${escHtml(m.categoria)} · ${m.cantidad||0} unid.</div>
        </div>
      </div>
      ${m.notas?`<p class="form-hint" style="margin:0">${escHtml(m.notas)}</p>`:''}
      <div style="display:flex;align-items:center;justify-content:space-between">
        <span></span>
        <div style="display:flex;gap:4px">
          <button class="btn-icon" data-mid="${m.id}" data-action="up" title="Sumar 1" style="width:28px;height:28px;font-size:.8rem">+</button>
          <button class="btn-icon" data-mid="${m.id}" data-action="down" title="Restar 1" style="width:28px;height:28px;font-size:.8rem">−</button>
          <button class="btn-danger" data-mid="${m.id}" data-action="del" style="font-size:var(--fs-xs);padding:2px 8px">🗑</button>
        </div>
      </div>
    </div>`).join('');

  grid.querySelectorAll('[data-action]').forEach(b=>{
    b.addEventListener('click',()=>{
      const mat=state.materials.find(x=>x.id===b.dataset.mid);
      if(!mat)return;
      if(b.dataset.action==='up') mat.cantidad=(mat.cantidad||0)+1;
      if(b.dataset.action==='down') mat.cantidad=Math.max(0,(mat.cantidad||0)-1);
      if(b.dataset.action==='del'){
        if(!confirm(`¿Eliminar "${mat.nombre}"?`))return;
        state.materials=state.materials.filter(x=>x.id!==b.dataset.mid);
      }
      saveMaterials(); renderMaterials();
    });
  });
}

/* ═══════════════════════════════════════════════════════════
   MÓDULO: PATRONES SUBIDOS (archivos en cualquier formato)
   Los archivos se guardan como Data URL en localStorage, así
   que conviene subir archivos ligeros (unos pocos MB).
═══════════════════════════════════════════════════════════ */
function fileKindIcon(type,name) {
  const ext=(name.split('.').pop()||'').toLowerCase();
  if(type.includes('pdf')||ext==='pdf') return '📕';
  if(type.includes('word')||['doc','docx'].includes(ext)) return '📘';
  if(type.startsWith('image/')) return '🖼️';
  if(type.includes('text')||ext==='txt') return '📄';
  return '📎';
}

function renderUploadedFiles() {
  const grid=document.getElementById('uploaded-files-grid');
  const countEl=document.getElementById('upload-count');
  if(!grid)return;
  const q=state.ui.searchQuery.toLowerCase();
  const list=state.uploadedPatterns.filter(f=>!q||f.name.toLowerCase().includes(q));
  if(countEl)countEl.textContent=`${list.length} archivo${list.length!==1?'s':''}`;
  if(!list.length){grid.innerHTML=`<div class="catalog-empty"><span class="catalog-empty-icon">📤</span><h3>Sin archivos</h3><p>Sube patrones en PDF, Word, TXT o imagen con el botón de arriba</p></div>`;return;}

  grid.innerHTML=list.map(f=>`<div class="uploaded-file-card">
      <span class="uf-icon">${fileKindIcon(f.type||'',f.name)}</span>
      <span class="uf-name" title="${escHtml(f.name)}">${escHtml(f.name)}</span>
      <span class="uf-meta">${(f.size/1024).toFixed(0)} KB · ${timeAgo(f.fecha)}</span>
      <div class="uf-actions">
        <a class="uf-view" href="${f.dataUrl}" download="${escHtml(f.name)}">⬇️ Descargar</a>
        <button type="button" class="uf-del" data-fid="${f.id}">🗑 Eliminar</button>
      </div>
    </div>`).join('');

  grid.querySelectorAll('.uf-del').forEach(b=>{
    b.addEventListener('click',()=>{
      const f=state.uploadedPatterns.find(x=>x.id===b.dataset.fid);
      if(!f)return;
      if(!confirm(`¿Eliminar "${f.name}"?`))return;
      state.uploadedPatterns=state.uploadedPatterns.filter(x=>x.id!==b.dataset.fid);
      saveUploads(); renderUploadedFiles();
    });
  });
}

function handlePatternFileUpload(fileList) {
  const files=[...fileList];
  if(!files.length)return;
  let pending=files.length;
  files.forEach(file=>{
    const reader=new FileReader();
    reader.onload=()=>{
      state.uploadedPatterns.unshift({
        id:uid('f'),name:file.name,type:file.type||'',size:file.size,
        dataUrl:reader.result,fecha:Date.now(),
      });
      pending--;
      if(pending===0) { saveUploads(); renderUploadedFiles(); showToast(`✅ ${files.length} archivo${files.length!==1?'s':''} subido${files.length!==1?'s':''}`,'success'); }
    };
    reader.onerror=()=>{
      pending--;
      showToast(`❌ No se pudo leer "${file.name}"`,'error');
      if(pending===0) { saveUploads(); renderUploadedFiles(); }
    };
    reader.readAsDataURL(file);
  });
}

/* ═══════════════════════════════════════════════════════════
   MÓDULO: CLIENTES
═══════════════════════════════════════════════════════════ */
function renderClients() {
  const grid=document.getElementById('clients-grid');
  const countEl=document.getElementById('clients-count');
  if(!grid)return;
  const q=state.ui.searchQuery.toLowerCase();
  const list=state.clients.filter(c=>!q||`${c.nombre} ${c.tel||''} ${c.notas||''}`.toLowerCase().includes(q));
  if(countEl)countEl.textContent=`${list.length} cliente${list.length!==1?'s':''}`;
  if(!list.length){grid.innerHTML=`<div class="catalog-empty"><span class="catalog-empty-icon">👥</span><h3>Sin clientes</h3><p>Agrega tu primer cliente con el botón +</p></div>`;return;}

  grid.innerHTML=list.map(c=>{
    const initials=c.nombre.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
    const projs=state.projects.filter(p=>p.cliente===c.nombre);
    const pending=projs.filter(p=>p.estado==='pendiente'||p.estado==='progreso').length;
    const done=projs.filter(p=>p.estado==='terminado'||p.estado==='entregado').length;
    return `<div class="client-card">
      <div class="client-avatar">${initials}</div>
      <div class="client-info">
        <div class="client-name">${escHtml(c.nombre)}</div>
        <div class="client-contact">${c.tel?'📱 '+escHtml(c.tel):''}</div>
        ${c.notas?`<div style="font-size:var(--fs-xs);color:var(--color-text-muted);margin-top:var(--space-1)">${escHtml(c.notas)}</div>`:''}
        <div class="client-stats">
          <div class="client-stat"><span class="client-stat-label">Proyectos activos: </span><span class="client-stat-value">${pending}</span></div>
          <div class="client-stat"><span class="client-stat-label">Terminados: </span><span class="client-stat-value">${done}</span></div>
          ${c.saldo?`<div class="client-stat"><span class="client-stat-label">Saldo: </span><span class="client-stat-value" style="color:${c.saldo>0?'var(--color-success)':'var(--color-danger)'}">${formatMXN(c.saldo)}</span></div>`:''}
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:var(--space-2)">
        <button class="btn-danger btn-del-client" data-id="${c.id}" style="font-size:var(--fs-xs)">🗑</button>
      </div>
    </div>`;
  }).join('');

  grid.querySelectorAll('.btn-del-client').forEach(b=>b.addEventListener('click',()=>{
    const cl=state.clients.find(x=>x.id===b.dataset.id);
    if(!cl||!confirm(`¿Eliminar cliente "${cl.nombre}"?`))return;
    state.clients=state.clients.filter(x=>x.id!==b.dataset.id);
    saveClients(); renderClients(); showToast('🗑 Cliente eliminado');
  }));
}

/* ═══════════════════════════════════════════════════════════
   MÓDULO: REPRODUCTOR FLOTANTE ARRASTRABLE
═══════════════════════════════════════════════════════════ */
function initFloatPlayer() {
  const player=document.getElementById('float-player');
  const handle=document.getElementById('float-player-handle');
  const closeBtn=document.getElementById('float-player-close');
  const iframe=document.getElementById('float-player-iframe');
  const placeholder=document.getElementById('player-placeholder');
  const openBtn=document.getElementById('open-player-btn');

  if(openBtn) openBtn.addEventListener('click',()=>{
    player.classList.toggle('open');
  });
  if(closeBtn) closeBtn.addEventListener('click',()=>{
    player.classList.remove('open');
    if(iframe){iframe.src='';iframe.style.display='none';}
    if(placeholder) placeholder.style.display='flex';
  });

  // Arrastrar
  if(handle&&player) {
    let dragging=false, ox=0, oy=0, px=0, py=0;
    handle.addEventListener('mousedown',e=>{
      dragging=true;
      const rect=player.getBoundingClientRect();
      ox=e.clientX-rect.left; oy=e.clientY-rect.top;
      player.style.right='auto'; player.style.bottom='auto';
      document.body.style.userSelect='none';
    });
    document.addEventListener('mousemove',e=>{
      if(!dragging)return;
      px=e.clientX-ox; py=e.clientY-oy;
      player.style.left=px+'px'; player.style.top=py+'px';
    });
    document.addEventListener('mouseup',()=>{ dragging=false; document.body.style.userSelect=''; });
  }
}

function openFloatPlayer(url, title='Video') {
  const player=document.getElementById('float-player');
  const iframe=document.getElementById('float-player-iframe');
  const placeholder=document.getElementById('player-placeholder');
  const titleEl=document.getElementById('float-player-title');
  if(!player||!iframe)return;
  if(titleEl) titleEl.textContent=title;
  if(placeholder) placeholder.style.display='none';
  iframe.style.display='block';
  iframe.src=url;
  player.classList.add('open');
}

/* ═══════════════════════════════════════════════════════════
   MÓDULO: LIGHTBOX
═══════════════════════════════════════════════════════════ */
function openLightbox(src) {
  const lb=document.getElementById('lightbox');
  const img=document.getElementById('lightbox-img');
  if(lb&&img){img.src=src;lb.classList.add('open');}
}
function closeLightbox() {
  const lb=document.getElementById('lightbox');
  if(lb)lb.classList.remove('open');
}

/* ═══════════════════════════════════════════════════════════
   MÓDULO: DESCARGADOR PYTHON
═══════════════════════════════════════════════════════════ */
async function checkDownloader() {
  const btn=document.getElementById('downloader-status-btn');
  try {
    const r=await fetch(`${DOWNLOADER_URL}/ping`,{signal:AbortSignal.timeout(2000)});
    const d=await r.json();
    state.downloaderOnline=d.ok;
  } catch {
    state.downloaderOnline=false;
  }
  if(btn){
    btn.textContent=state.downloaderOnline?'🟢 Descargador':'🔴 Descargador';
    btn.title=state.downloaderOnline?'Descargador activo: haz clic para ver info':'Descargador inactivo. Ejecuta downloader.py';
  }
}

async function downloaderGetInfo(url) {
  const r=await fetch(`${DOWNLOADER_URL}/info?url=${encodeURIComponent(url)}`);
  return r.json();
}
async function downloaderDownload(url) {
  const r=await fetch(`${DOWNLOADER_URL}/download?url=${encodeURIComponent(url)}`);
  return r.json();
}
async function downloaderTranscript(url) {
  const r=await fetch(`${DOWNLOADER_URL}/transcript?url=${encodeURIComponent(url)}`);
  return r.json();
}

/* ═══════════════════════════════════════════════════════════
   MÓDULO: MODALES
═══════════════════════════════════════════════════════════ */
function openModal(id) {
  const m=document.getElementById(id);
  if(m){m.classList.add('open');document.body.style.overflow='hidden';}
}
function closeModal(id) {
  const m=document.getElementById(id);
  if(m){m.classList.remove('open');document.body.style.overflow='';}
}
function closeAllModals() {
  document.querySelectorAll('.modal-overlay.open').forEach(m=>{m.classList.remove('open');});
  document.body.style.overflow='';
}

/* ═══════════════════════════════════════════════════════════
   MÓDULO: EDITAR ENLACE
═══════════════════════════════════════════════════════════ */
function openEditLink(id) {
  const p=state.patterns.find(x=>x.id===id);
  if(!p)return;
  document.getElementById('edit-link-id').value=id;
  document.getElementById('el-type').value=p.linkType||'youtube';
  document.getElementById('el-url').value=p.url||'';
  openModal('modal-edit-link');
}

/* ═══════════════════════════════════════════════════════════
   MÓDULO: EXPORTAR / IMPORTAR
═══════════════════════════════════════════════════════════ */
function exportAll() {
  const data={patterns:state.patterns,projects:state.projects,quotes:state.quotes,yarns:state.yarns,clients:state.clients,customColors:state.customColors,settings:state.settings};
  const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url; a.download=`MAFURAFU-backup-${new Date().toISOString().slice(0,10)}.json`;
  a.click(); URL.revokeObjectURL(url);
  closeBackupMenu(); showToast('📦 Backup exportado','success');
}

function importFile(file) {
  const reader=new FileReader();
  reader.onload=ev=>{
    try {
      const d=JSON.parse(ev.target.result);
      const merge=confirm('¿Fusionar con los datos actuales?\n• Aceptar = fusionar\n• Cancelar = reemplazar todo');
      if(merge) {
        const addNew=(arr,existing)=>{
          const ids=new Set(existing.map(x=>x.id));
          return [...existing,...arr.filter(x=>!ids.has(x.id))];
        };
        if(d.patterns) state.patterns=addNew(d.patterns,state.patterns);
        if(d.projects) state.projects=addNew(d.projects,state.projects);
        if(d.quotes)   state.quotes=addNew(d.quotes,state.quotes);
        if(d.yarns)    state.yarns=addNew(d.yarns,state.yarns);
        if(d.clients)  state.clients=addNew(d.clients,state.clients);
        if(d.customColors) state.customColors=addNew(d.customColors,state.customColors);
      } else {
        if(d.patterns) state.patterns=d.patterns;
        if(d.projects) state.projects=d.projects;
        if(d.quotes)   state.quotes=d.quotes;
        if(d.yarns)    state.yarns=d.yarns;
        if(d.clients)  state.clients=d.clients;
        if(d.customColors) state.customColors=d.customColors;
        if(d.settings) state.settings={...state.settings,...d.settings};
      }
      savePatterns();saveProjects();saveQuotes();saveYarns();saveMaterials();saveUploads();saveClients();saveColors();saveSettings();
      renderCurrentPage(); showToast('✅ Datos importados','success');
    } catch(e){showToast('❌ Error al importar: '+e.message,'error');}
  };
  reader.readAsText(file);
}

function closeBackupMenu(){document.getElementById('backup-menu')?.classList.remove('open');}
function toggleBackupMenu(){document.getElementById('backup-menu')?.classList.toggle('open');}

/* ═══════════════════════════════════════════════════════════
   MÓDULO: SIDEBAR (MÓVIL)
═══════════════════════════════════════════════════════════ */
function initSidebarMobile() {
  const toggle=document.getElementById('sidebar-toggle');
  const sidebar=document.getElementById('sidebar');
  const overlay=document.getElementById('sidebar-overlay');
  if(!toggle)return;
  toggle.style.display='';
  toggle.addEventListener('click',()=>{
    sidebar.classList.toggle('open');
    overlay.classList.toggle('open');
  });
  overlay?.addEventListener('click',()=>{
    sidebar.classList.remove('open');
    overlay.classList.remove('open');
  });
}

/* ═══════════════════════════════════════════════════════════
   INICIALIZACIÓN DE TODOS LOS EVENTOS
═══════════════════════════════════════════════════════════ */
function initEvents() {

  setupPatternToolbars();

  // Navegación sidebar
  document.querySelectorAll('.nav-item[data-page]').forEach(b=>{
    b.addEventListener('click',()=>{
      navigateTo(b.dataset.page);
      // Cerrar sidebar en móvil
      document.getElementById('sidebar')?.classList.remove('open');
      document.getElementById('sidebar-overlay')?.classList.remove('open');
    });
  });

  // Búsqueda global
  document.getElementById('search-input')?.addEventListener('input',e=>{
    state.ui.searchQuery=e.target.value;
    renderCurrentPage();
  });

  // Filtros
  document.getElementById('filter-tags-tut')?.addEventListener('change',e=>{state.ui.filterTagTut=e.target.value;renderCatalog();});
  document.getElementById('filter-status-proj')?.addEventListener('change',e=>{state.ui.filterStatus=e.target.value;renderProjects();});
  document.getElementById('filter-tags-proj')?.addEventListener('change',e=>{state.ui.filterTagProj=e.target.value;renderProjects();});

  // FAB contextual
  document.getElementById('fab-btn')?.addEventListener('click',()=>{
    if(state.ui.currentPage==='patrones-subidos') {
      document.getElementById('pattern-file-input')?.click();
      return;
    }
    const map={tutoriales:'modal-tutorial',proyectos:'modal-proyecto',estambres:'modal-estambre',materiales:'modal-material',clientes:'modal-cliente',cotizaciones:null};
    const m=map[state.ui.currentPage];
    if(m){
      initModalContext(m);
      openModal(m);
    }
  });

  // Subida de archivos de patrones (cualquier formato)
  document.getElementById('pattern-file-input')?.addEventListener('change',e=>{
    handlePatternFileUpload(e.target.files);
    e.target.value='';
  });
  document.getElementById('upload-dropzone')?.addEventListener('dragover',e=>e.preventDefault());
  document.getElementById('upload-dropzone')?.addEventListener('drop',e=>{
    e.preventDefault();
    if(e.dataTransfer?.files?.length) handlePatternFileUpload(e.dataTransfer.files);
  });

  // Cerrar modales (botones X y fondo)
  document.querySelectorAll('.modal-close,[data-modal]').forEach(b=>{
    b.addEventListener('click',()=>closeModal(b.dataset.modal||b.closest('.modal-overlay')?.id));
  });
  document.querySelectorAll('.modal-overlay').forEach(m=>{
    m.addEventListener('click',e=>{if(e.target===m)closeModal(m.id);});
  });
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAllModals();});

  // GUARDAR TUTORIAL
  document.getElementById('save-tutorial-btn')?.addEventListener('click',()=>{
    const titulo=document.getElementById('t-titulo').value.trim();
    const personaje=document.getElementById('t-personaje').value.trim();
    const saga=document.getElementById('t-saga').value.trim();
    const url=document.getElementById('t-url').value.trim();
    const linkType=document.getElementById('t-link-type').value;
    const patronEscrito=document.getElementById('t-patron-editor')?.innerHTML.trim()||'';
    if(!titulo||!personaje){showToast('⚠️ Título y personaje son obligatorios','error');return;}
    const colorsSel=tutColorWidget?.selected||[];
    if(!colorsSel.length){showToast('⚠️ Elige al menos un color de estambre','error');return;}
    const primary=colorsSel.find(c=>c.type==='primario')||colorsSel[0];
    const tags=[...document.querySelectorAll('#tut-tag-selector input:checked')].map(x=>x.value);
    state.patterns.unshift({
      id:uid('t'),titulo,personaje,saga,
      colors:colorsSel.map(c=>({...c})),
      color:primary.name, colorHex:primary.hex,
      patronEscrito,
      linkType,url,fecha:Date.now(),vistas:0,tags
    });
    savePatterns();renderCarousel();renderCatalog();closeModal('modal-tutorial');
    showToast('✅ Tutorial guardado','success');
  });

  // EXPORTAR PATRÓN ESCRITO (desde el formulario de nuevo tutorial)
  document.getElementById('tut-export-txt-btn')?.addEventListener('click',()=>{
    const titulo=document.getElementById('t-titulo')?.value.trim()||'patron';
    const editor=document.getElementById('t-patron-editor');
    const texto=editor?.innerText.trim()||'';
    if(!texto){showToast('⚠️ Escribe el patrón primero','error');return;}
    exportPatternAsTXT(titulo,texto);
  });
  document.getElementById('tut-export-pdf-btn')?.addEventListener('click',()=>{
    const titulo=document.getElementById('t-titulo')?.value.trim()||'patron';
    const editor=document.getElementById('t-patron-editor');
    if(!editor?.innerText.trim()){showToast('⚠️ Escribe el patrón primero','error');return;}
    exportPatternAsPDF(titulo,editor.innerHTML);
  });

  // GUARDAR PROYECTO
  document.getElementById('save-proyecto-btn')?.addEventListener('click',()=>{
    const nombre=document.getElementById('p-nombre').value.trim();
    if(!nombre){showToast('⚠️ El nombre es obligatorio','error');return;}
    const extras=[...document.querySelectorAll('.extra-input')].map(i=>i.value.trim()).filter(Boolean);
    const pColors=[...document.querySelectorAll('.project-color-slot')].map(el=>{
      const name=el.querySelector('.slot-color-name')?.textContent||'';
      const hex=el.querySelector('.slot-color-dot')?.style.background||getHex(name);
      const type=el.querySelector('.slot-type-btn.active')?.dataset.type||'primario';
      return{name,hex,type};
    }).filter(c=>c.name&&c.name!=='Ninguno');
    const tags=[...document.querySelectorAll('#proj-tag-selector input:checked')].map(x=>x.value);
    state.projects.unshift({
      id:uid('p'),
      nombre,
      cliente:document.getElementById('p-cliente').value.trim(),
      estado:document.getElementById('p-estado').value,
      metros:Number(document.getElementById('p-metros').value||0),
      costoMaterial:Number(document.getElementById('p-costo-material').value||0),
      horas:Number(document.getElementById('p-horas').value||0),
      detalle:Number(document.getElementById('p-detalle').value||30),
      notas:document.getElementById('p-notas').value.trim(),
      colors:pColors,extras,tags,photos:[],fecha:Date.now()
    });
    saveProjects();renderProjects();closeModal('modal-proyecto');
    showToast('✅ Proyecto guardado','success');
  });

  // GUARDAR MATERIAL
  document.getElementById('save-material-btn')?.addEventListener('click',()=>{
    const nombre=document.getElementById('m-nombre').value.trim();
    if(!nombre){showToast('⚠️ El nombre es obligatorio','error');return;}
    state.materials.unshift({
      id:uid('mat'),
      nombre,
      categoria:document.getElementById('m-categoria').value,
      cantidad:Number(document.getElementById('m-cantidad').value||0),
      notas:document.getElementById('m-notas').value.trim(),
      fecha:Date.now(),
    });
    saveMaterials(); renderMaterials(); closeModal('modal-material');
    showToast('✅ Material guardado','success');
  });

  // GUARDAR ESTAMBRE
  document.getElementById('save-estambre-btn')?.addEventListener('click',()=>{
    const nombre=document.getElementById('y-nombre').value.trim();
    if(!nombre){showToast('⚠️ El nombre es obligatorio','error');return;}
    const yarnWidget=window._yarnColorWidget;
    if(!yarnWidget?.currentSelected){showToast('⚠️ Elige un color','error');return;}
    state.yarns.unshift({
      id:uid('y'),nombre,
      color:yarnWidget.currentSelected.name,
      colorHex:yarnWidget.currentSelected.hex,
      gramaje:Number(document.getElementById('y-gramaje').value||100),
      cantidad:Number(document.getElementById('y-cantidad').value||1),
      level:state.ui.yarnLevel
    });
    saveYarns();renderYarns();closeModal('modal-estambre');
    showToast('✅ Estambre guardado','success');
  });

  // GUARDAR CLIENTE
  document.getElementById('save-cliente-btn')?.addEventListener('click',()=>{
    const nombre=document.getElementById('c-nombre').value.trim();
    if(!nombre){showToast('⚠️ El nombre es obligatorio','error');return;}
    state.clients.unshift({id:uid('c'),nombre,tel:document.getElementById('c-tel').value.trim(),notas:document.getElementById('c-notas').value.trim(),saldo:0});
    saveClients();renderClients();closeModal('modal-cliente');
    showToast('✅ Cliente guardado','success');
    updateClientsDatalist();
  });

  // GUARDAR EDICIÓN DE ENLACE
  document.getElementById('save-edit-link-btn')?.addEventListener('click',()=>{
    const id=document.getElementById('edit-link-id').value;
    const p=state.patterns.find(x=>x.id===id);
    if(!p)return;
    p.linkType=document.getElementById('el-type').value;
    p.url=document.getElementById('el-url').value.trim();
    savePatterns();renderCatalog();closeModal('modal-edit-link');
    showToast('✅ Enlace actualizado','success');
  });

  // CONFIRMAR TERMINADO
  document.getElementById('confirm-finish-btn')?.addEventListener('click',()=>{
    const id=document.getElementById('finish-project-id').value;
    const p=state.projects.find(x=>x.id===id);
    if(!p)return;
    const horas=Number(document.getElementById('fin-horas').value||0);
    const mat=Number(document.getElementById('fin-material').value||0);
    const venta=Number(document.getElementById('fin-venta').value||0);
    const hr=state.settings.hourRate;
    const base=mat+horas*hr;
    const sugerido=base+(base*0.3);
    p.horas=horas;p.costoMaterial=mat;p.totalCost=base;
    p.suggestedPrice=sugerido;
    if(venta){p.soldPrice=venta;}
    p.estado=p.estado==='terminado'?'entregado':'terminado';
    p.fechaFin=Date.now();
    saveProjects();renderProjects();closeModal('modal-finish');
    showToast(`✅ Proyecto marcado como ${p.estado}`,'success');
  });
  document.getElementById('fin-horas')?.addEventListener('input',updateFinishResult);
  document.getElementById('fin-material')?.addEventListener('input',updateFinishResult);
  document.getElementById('fin-venta')?.addEventListener('input',updateFinishResult);

  // COTIZADOR
  document.getElementById('calc-quote-btn')?.addEventListener('click',calcQuote);
  document.getElementById('detail-selector')?.querySelectorAll('.detail-btn').forEach(b=>{
    b.addEventListener('click',()=>{
      document.querySelectorAll('#detail-selector .detail-btn').forEach(x=>x.classList.remove('selected'));
      b.classList.add('selected');
      currentDetailPct=Number(b.dataset.pct);
      calcQuote();
    });
  });
  document.getElementById('save-quote-btn')?.addEventListener('click',()=>{
    const res=calcQuote();
    const titulo=prompt('Nombre para esta cotización (opcional):','')||'Cotización';
    state.quotes.unshift({id:uid('q'),titulo,...res,fecha:Date.now()});
    saveQuotes();renderQuotes();showToast('✅ Cotización guardada','success');
  });

  // MODO OSCURO
  document.getElementById('dark-mode-btn')?.addEventListener('click',toggleDarkMode);

  // RESPALDO
  document.getElementById('backup-btn')?.addEventListener('click',e=>{e.stopPropagation();toggleBackupMenu();});
  document.getElementById('export-btn')?.addEventListener('click',exportAll);
  document.getElementById('import-btn')?.addEventListener('click',()=>{document.getElementById('import-file-input')?.click();closeBackupMenu();});
  document.getElementById('import-file-input')?.addEventListener('change',e=>{if(e.target.files[0])importFile(e.target.files[0]);e.target.value='';});
  document.addEventListener('click',e=>{
    if(!e.target.closest('#backup-btn')&&!e.target.closest('#backup-menu'))closeBackupMenu();
  });

  // FOTOS DE PROYECTO
  document.getElementById('project-photo-input')?.addEventListener('change',e=>{
    const id=e.target.dataset.projId;
    const p=state.projects.find(x=>x.id===id);
    if(!p)return;
    [...e.target.files].forEach(file=>{
      const reader=new FileReader();
      reader.onload=ev=>{ p.photos=p.photos||[]; p.photos.push(ev.target.result); saveProjects(); renderProjects(); };
      reader.readAsDataURL(file);
    });
    e.target.value='';
  });

  // LIGHTBOX
  document.getElementById('lightbox-close')?.addEventListener('click',closeLightbox);
  document.getElementById('lightbox')?.addEventListener('click',e=>{if(e.target===e.currentTarget)closeLightbox();});

  // DOWNLOADER STATUS
  document.getElementById('downloader-status-btn')?.addEventListener('click',()=>{
    if(!state.downloaderOnline) showToast('Ejecuta: python downloader.py','warning');
    else showToast('🟢 Descargador activo','success');
  });

  // Etiquetas tag selector (tutoriales y proyectos)
  document.querySelectorAll('#tut-tag-selector label, #proj-tag-selector label').forEach(lbl=>{
    const cb=lbl.querySelector('input[type="checkbox"]');
    lbl.addEventListener('click',()=>{
      setTimeout(()=>lbl.classList.toggle('selected',cb?.checked),0);
    });
  });

  // Nivel de estambre en modal
  document.querySelectorAll('[data-level]').forEach(b=>{
    b.addEventListener('click',()=>{
      document.querySelectorAll('[data-level]').forEach(x=>x.classList.remove('selected'));
      b.classList.add('selected');
      state.ui.yarnLevel=Number(b.dataset.level);
    });
  });

  // Colores del proyecto (slots dinámicos)
  document.getElementById('p-num-colors')?.addEventListener('input',e=>renderColorSlots(Number(e.target.value)||1));

  // Extras del proyecto
  document.getElementById('p-add-extra-btn')?.addEventListener('click',()=>{
    const list=document.getElementById('p-extras-list');
    if(!list)return;
    const row=document.createElement('div');
    row.style.cssText='display:flex;gap:8px;margin-bottom:8px;align-items:center';
    row.innerHTML=`<input class="form-input extra-input" type="text" placeholder="🪡 material o 👀 ojitos…" style="flex:1"/>
    <button type="button" class="btn-danger" style="font-size:.7rem;padding:4px 8px">×</button>`;
    row.querySelector('.btn-danger').addEventListener('click',()=>row.remove());
    list.appendChild(row);
  });

  // MODAL: VER / EXPORTAR PATRÓN ESCRITO
  document.getElementById('vp-export-txt-btn')?.addEventListener('click',()=>{
    const titulo=document.getElementById('vp-title')?.textContent.replace(/^📝\s*/,'')||'patron';
    const editor=document.getElementById('vp-text-editor');
    const texto=editor?.innerText.trim()||'';
    if(!texto){showToast('⚠️ Este tutorial no tiene patrón escrito','error');return;}
    exportPatternAsTXT(titulo,texto);
  });
  document.getElementById('vp-export-pdf-btn')?.addEventListener('click',()=>{
    const titulo=document.getElementById('vp-title')?.textContent.replace(/^📝\s*/,'')||'patron';
    const editor=document.getElementById('vp-text-editor');
    if(!editor?.innerText.trim()){showToast('⚠️ Este tutorial no tiene patrón escrito','error');return;}
    exportPatternAsPDF(titulo,editor.innerHTML);
  });
  document.getElementById('vp-save-btn')?.addEventListener('click',()=>{
    const id=document.getElementById('vp-pattern-id')?.value;
    const p=state.patterns.find(x=>x.id===id);
    if(!p)return;
    p.patronEscrito=document.getElementById('vp-text-editor')?.innerHTML.trim()||'';
    savePatterns(); renderCatalog();
    closeModal('modal-view-pattern');
    showToast('✅ Patrón actualizado','success');
  });

  // CREAR PATRÓN ESCRITO
  document.getElementById('cp-save-btn')?.addEventListener('click',()=>{
    const titulo=document.getElementById('cp-title')?.value.trim()||'Patrón sin nombre';
    const editor=document.getElementById('cp-editor');
    if(!editor?.innerText.trim()){showToast('⚠️ Escribe el patrón primero','error');return;}
    const saved=load('mafurafu_created_patterns',[]);
    saved.unshift({id:uid('cp'),titulo,html:editor.innerHTML,fecha:Date.now()});
    save('mafurafu_created_patterns',saved);
    showToast('✅ Patrón guardado en tu navegador','success');
  });
  document.getElementById('cp-export-txt-btn')?.addEventListener('click',()=>{
    const titulo=document.getElementById('cp-title')?.value.trim()||'patron';
    const texto=document.getElementById('cp-editor')?.innerText.trim()||'';
    if(!texto){showToast('⚠️ Escribe el patrón primero','error');return;}
    exportPatternAsTXT(titulo,texto);
  });
  document.getElementById('cp-export-pdf-btn')?.addEventListener('click',()=>{
    const titulo=document.getElementById('cp-title')?.value.trim()||'patron';
    const editor=document.getElementById('cp-editor');
    if(!editor?.innerText.trim()){showToast('⚠️ Escribe el patrón primero','error');return;}
    exportPatternAsPDF(titulo,editor.innerHTML);
  });
  document.getElementById('cp-file-input')?.addEventListener('change',e=>{
    const file=e.target.files?.[0];
    if(file) openPatternFile(file);
    e.target.value='';
  });
}

function openPatternFile(file) {
  const extension=file.name.split('.').pop()?.toLowerCase();
  if(!['txt','md','html','htm'].includes(extension)) {
    showToast('⚠️ Solo puedes editar archivos TXT, Markdown o HTML','error');
    return;
  }
  const reader=new FileReader();
  reader.onload=()=>{
    const editor=document.getElementById('cp-editor');
    if(!editor)return;
    if(extension==='html'||extension==='htm') {
      const doc=new DOMParser().parseFromString(String(reader.result||''),'text/html');
      doc.querySelectorAll('script,style,iframe,object,embed').forEach(el=>el.remove());
      doc.querySelectorAll('*').forEach(el=>[...el.attributes].forEach(attr=>{
        if(attr.name.toLowerCase().startsWith('on'))el.removeAttribute(attr.name);
      }));
      editor.innerHTML=doc.body?.innerHTML||'';
    } else {
      editor.textContent=String(reader.result||'');
    }
    const title=document.getElementById('cp-title');
    if(title&&!title.value.trim()) title.value=file.name.replace(/\.[^.]+$/,'');
    showToast(`✅ Archivo "${file.name}" abierto`,'success');
  };
  reader.onerror=()=>showToast('❌ No se pudo abrir el archivo','error');
  reader.readAsText(file);
}

/* ═══════════════════════════════════════════════════════════
   HELPERS DE MODALES
═══════════════════════════════════════════════════════════ */
function initModalContext(modalId) {
  if(modalId==='modal-tutorial') {
    // Limpiar form
    ['t-titulo','t-personaje','t-saga','t-url'].forEach(id=>{ const el=document.getElementById(id);if(el)el.value=''; });
    const patronEditor=document.getElementById('t-patron-editor');
    if(patronEditor) patronEditor.innerHTML='';
    renderPatternColorSwatches('t-patron-colors','t-patron-editor');
    document.querySelectorAll('#tut-tag-selector input').forEach(cb=>{cb.checked=false;});
    document.querySelectorAll('#tut-tag-selector label').forEach(l=>l.classList.remove('selected'));
    document.getElementById('tut-color-panel')?.classList.remove('open');

    // Inicializar widget de colores múltiples (primarios/secundarios)
    tutColorWidget=multiColorWidgetSetup({
      tabsId:'tut-color-tabs',chipGridId:'tut-color-chips',addBtnId:'tut-btn-add-color',
      panelId:'tut-color-panel',pickerId:'tut-cpicker',hexId:'tut-chex',previewId:'tut-cpreview',
      nameId:'tut-cname',saveId:'tut-csave',summaryId:'tut-selected-summary',
      countPrimarioId:'tut-count-primario',countSecundarioId:'tut-count-secundario',
      initial:[],
    });

    // Descargador
    document.getElementById('t-link-type')?.addEventListener('change',e=>{
      const row=document.getElementById('tut-download-row');
      if(row)row.style.display=(e.target.value==='youtube'&&state.downloaderOnline)?'block':'none';
    });
    document.getElementById('tut-get-info-btn')?.addEventListener('click',async()=>{
      const url=document.getElementById('t-url').value.trim();
      if(!url)return;
      const res=document.getElementById('tut-download-result');
      if(res)res.textContent='Cargando info…';
      const info=await downloaderGetInfo(url);
      if(res)res.textContent=info.ok?`📹 ${info.title} · ${info.platform} · ${Math.round(info.duration/60)} min`:`❌ ${info.error}`;
    });
    document.getElementById('tut-transcript-btn')?.addEventListener('click',async()=>{
      const url=document.getElementById('t-url').value.trim();
      if(!url)return;
      const res=document.getElementById('tut-download-result');
      if(res)res.textContent='Obteniendo transcripción…';
      const t=await downloaderTranscript(url);
      if(res)res.textContent=t.ok?`📝 ${t.transcript.slice(0,300)}…`:`❌ ${t.error}`;
    });
    document.getElementById('tut-download-btn')?.addEventListener('click',async()=>{
      const url=document.getElementById('t-url').value.trim();
      if(!url)return;
      const res=document.getElementById('tut-download-result');
      if(res)res.textContent='⬇️ Descargando… (puede tomar un momento)';
      const d=await downloaderDownload(url);
      if(res)res.textContent=d.ok?`✅ Guardado: ${d.filename} (${d.size_mb} MB)`:`❌ ${d.error}`;
    });
  }

  if(modalId==='modal-estambre') {
    ['y-nombre','y-gramaje','y-cantidad'].forEach(id=>{ const el=document.getElementById(id);if(el)el.value=''; });
    window._yarnColorWidget=colorWidgetSetup({
      pickerId:null,hexId:null,previewId:null,nameId:null,
      chipGridId:'yarn-color-chips',addBtnId:null,panelId:null,saveId:null,
      swatchId:'yarn-swatch',labelId:'yarn-color-name',currentSelected:null,
    });
  }

  if(modalId==='modal-material') {
    ['m-nombre','m-cantidad','m-notas'].forEach(id=>{ const el=document.getElementById(id);if(el)el.value=''; });
    const cat=document.getElementById('m-categoria'); if(cat) cat.selectedIndex=0;
  }

  if(modalId==='modal-proyecto') {
    ['p-nombre','p-cliente','p-metros','p-costo-material','p-horas','p-notas'].forEach(id=>{ const el=document.getElementById(id);if(el)el.value=''; });
    document.querySelectorAll('#proj-tag-selector input').forEach(cb=>{cb.checked=false;});
    document.querySelectorAll('#proj-tag-selector label').forEach(l=>l.classList.remove('selected'));
    document.getElementById('p-extras-list').innerHTML='';
    renderColorSlots(1);
    updateClientsDatalist();
  }

  if(modalId==='modal-cliente') {
    ['c-nombre','c-tel','c-notas'].forEach(id=>{ const el=document.getElementById(id);if(el)el.value=''; });
  }
}

function renderColorSlots(n) {
  const container=document.getElementById('p-colors-slots');
  if(!container)return;
  container.innerHTML='';
  for(let i=0;i<n;i++){
    const div=document.createElement('div');
    div.className='project-color-slot';
    div.style.cssText='display:flex;align-items:center;gap:8px;margin-bottom:8px;flex-wrap:wrap';
    const dot=document.createElement('span');
    dot.className='slot-color-dot';
    dot.style.cssText='width:18px;height:18px;border-radius:50%;background:#ddd;border:1.5px solid rgba(0,0,0,.1);flex-shrink:0';
    const lbl=document.createElement('span');
    lbl.className='slot-color-name';
    lbl.style.cssText='font-size:var(--fs-xs);font-weight:700;min-width:60px';
    lbl.textContent='Ninguno';
    const sel=document.createElement('select');
    sel.className='form-select';
    sel.style.cssText='flex:1;min-width:120px';
    sel.innerHTML=`<option value="">— elige color ${i+1} —</option>`+allColors().map(c=>`<option value="${c.name}" data-hex="${c.hex}">${c.name}</option>`).join('');
    sel.addEventListener('change',()=>{
      const opt=sel.selectedOptions[0];
      const hex=opt?.dataset.hex||getHex(opt?.value);
      dot.style.background=hex;
      lbl.textContent=opt?.value||'Ninguno';
    });
    // Toggle Primario / Secundario
    const typeToggle=document.createElement('div');
    typeToggle.className='slot-type-toggle';
    const btnP=document.createElement('button');
    btnP.type='button'; btnP.className='slot-type-btn active'; btnP.dataset.type='primario'; btnP.textContent='Primario';
    const btnS=document.createElement('button');
    btnS.type='button'; btnS.className='slot-type-btn'; btnS.dataset.type='secundario'; btnS.textContent='Secundario';
    const selectType=(btn)=>{
      typeToggle.querySelectorAll('.slot-type-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
    };
    btnP.addEventListener('click',()=>selectType(btnP));
    btnS.addEventListener('click',()=>selectType(btnS));
    typeToggle.appendChild(btnP); typeToggle.appendChild(btnS);

    div.appendChild(dot);div.appendChild(lbl);div.appendChild(sel);div.appendChild(typeToggle);
    container.appendChild(div);
  }
}

function updateClientsDatalist() {
  const dl=document.getElementById('clients-datalist');
  if(dl) dl.innerHTML=state.clients.map(c=>`<option value="${escHtml(c.nombre)}">`).join('');
}

/* ═══════════════════════════════════════════════════════════
   MÓDULO: PATRONES ESCRITOS (guardar como TXT / PDF)
═══════════════════════════════════════════════════════════ */
function safeFileName(name) {
  return (name||'patron').trim().replace(/[\\/:*?"<>|]+/g,'-').slice(0,60)||'patron';
}

function exportPatternAsTXT(titulo,texto) {
  const blob=new Blob([`${titulo}\n${'='.repeat(titulo.length)}\n\n${texto}`],{type:'text/plain;charset=utf-8'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url; a.download=`${safeFileName(titulo)}.txt`;
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
  showToast('📝 Patrón guardado como TXT','success');
}

// Convierte un color CSS ("#rrggbb" o "rgb(r,g,b)") en [r,g,b]
function parseCssColor(str) {
  if(!str) return [30,20,50];
  str=String(str).trim();
  if(str.startsWith('#')) {
    let h=str.slice(1);
    if(h.length===3) h=h.split('').map(c=>c+c).join('');
    const num=parseInt(h,16);
    return [(num>>16)&255,(num>>8)&255,num&255];
  }
  const m=str.match(/rgba?\(([^)]+)\)/);
  if(m) {
    const parts=m[1].split(',').map(s=>parseFloat(s.trim()));
    return [parts[0]||0,parts[1]||0,parts[2]||0];
  }
  return [30,20,50];
}

// Recorre el HTML del editor y lo convierte en líneas de
// "runs" (fragmentos de texto con su color/negrita/subrayado),
// para poder dibujarlas con colores en el PDF.
function extractRichRuns(html) {
  const tmp=document.createElement('div');
  tmp.innerHTML=html||'';
  const lines=[[]];
  function pushLine(){ lines.push([]); }
  function walk(node,color,bold,underline){
    node.childNodes.forEach(child=>{
      if(child.nodeType===3) {
        if(child.textContent) lines[lines.length-1].push({text:child.textContent,color,bold,underline});
      } else if(child.nodeType===1) {
        const tag=child.tagName;
        if(tag==='BR'){ pushLine(); return; }
        let c2=color, b2=bold, u2=underline;
        if(child.style&&child.style.color) c2=child.style.color;
        if(tag==='B'||tag==='STRONG'||(child.style&&child.style.fontWeight==='bold')) b2=true;
        if(tag==='U'||(child.style&&/underline/.test(child.style.textDecoration||''))) u2=true;
        const isBlock=(tag==='DIV'||tag==='P');
        if(isBlock&&lines[lines.length-1].length) pushLine();
        walk(child,c2,b2,u2);
        if(isBlock) pushLine();
      }
    });
  }
  walk(tmp,null,false,false);
  while(lines.length>1&&!lines[lines.length-1].length) lines.pop();
  return lines;
}

function exportPatternAsPDF(titulo,html) {
  const JsPDFCtor=window.jspdf&&window.jspdf.jsPDF;
  if(!JsPDFCtor) { showToast('⚠️ No se pudo cargar el generador de PDF','error'); return; }
  const doc=new JsPDFCtor({ unit:'pt', format:'a4' });
  const marginX=48, marginY=56, maxWidth=500;
  doc.setFont('helvetica','bold'); doc.setFontSize(16); doc.setTextColor(30,20,50);
  const titleLines=doc.splitTextToSize(titulo,maxWidth);
  doc.text(titleLines,marginX,marginY);
  let y=marginY+titleLines.length*20+14, x=marginX;
  const lineHeight=15, pageHeight=doc.internal.pageSize.getHeight();
  doc.setFontSize(11);
  extractRichRuns(html).forEach(runs=>{
    if(!runs.length){ y+=lineHeight; return; }
    if(y>pageHeight-marginY){ doc.addPage(); y=marginY; }
    x=marginX;
    runs.forEach(run=>{
      run.text.split(/(\s+)/).forEach(word=>{
        if(!word)return;
        doc.setFont('helvetica',run.bold?'bold':'normal');
        const w=doc.getTextWidth(word);
        if(x+w>marginX+maxWidth&&word.trim()){ y+=lineHeight; x=marginX; if(y>pageHeight-marginY){doc.addPage();y=marginY;} }
        const [r,g,b]=parseCssColor(run.color);
        doc.setTextColor(r,g,b);
        doc.text(word,x,y);
        if(run.underline) doc.line(x,y+2,x+w,y+2);
        x+=w;
      });
    });
    y+=lineHeight;
  });
  doc.save(`${safeFileName(titulo)}.pdf`);
  showToast('📄 Patrón guardado como PDF (con colores)','success');
}

// Barra de herramientas del editor de patrón escrito: negrita,
// subrayado y colores de texto (para marcar cambios de estambre)
function setupPatternToolbars() {
  document.querySelectorAll('.pattern-toolbar').forEach(tb=>{
    if(tb.dataset.bound)return;
    tb.dataset.bound='1';
    const targetId=tb.dataset.target;
    // Evita que el editor pierda la selección de texto al hacer clic
    // en un botón de la barra
    tb.addEventListener('mousedown',e=>{
      if(e.target.closest('.pt-btn,.pt-color,.pt-color-dyn,.pt-color-custom')) e.preventDefault();
    });
    tb.querySelectorAll('.pt-btn').forEach(b=>{
      b.addEventListener('click',()=>{
        const editor=document.getElementById(targetId);
        if(!editor)return;
        editor.focus();
        document.execCommand(b.dataset.cmd,false,null);
      });
    });
    tb.addEventListener('click',e=>{
      const b=e.target.closest('.pt-color');
      if(!b)return;
        const editor=document.getElementById(targetId);
        if(!editor)return;
        editor.focus();
        document.execCommand('styleWithCSS',true,null);
        document.execCommand('foreColor',false,b.dataset.color);
    });
    const custom=tb.querySelector('.pt-color-custom');
    if(custom) {
      custom.addEventListener('input',()=>{
        const editor=document.getElementById(targetId);
        if(!editor)return;
        editor.focus();
        document.execCommand('styleWithCSS',true,null);
        document.execCommand('foreColor',false,custom.value);
      });
    }
  });
}

// Rellena la barra de patrón con los colores YA REGISTRADOS en la
// app (los predefinidos + los que agregaste en "Gestión de colores"),
// para marcar el cambio de estambre con el color real que usas.
function renderPatternColorSwatches(containerId,targetId) {
  const box=document.getElementById(containerId);
  if(!box)return;
  box.innerHTML=allColors().map(c=>
    `<button type="button" class="pt-color-dyn" data-color="${c.hex}" title="${escHtml(c.name)}" style="background:${c.hex}"></button>`
  ).join('');
  box.querySelectorAll('.pt-color-dyn').forEach(b=>{
    b.addEventListener('click',()=>{
      const editor=document.getElementById(targetId);
      if(!editor)return;
      editor.focus();
      document.execCommand('styleWithCSS',true,null);
      document.execCommand('foreColor',false,b.dataset.color);
    });
  });
}

// Modal para ver/editar/exportar el patrón escrito guardado en un tutorial
function openViewPattern(id) {
  const p=state.patterns.find(x=>x.id===id);
  if(!p)return;
  document.getElementById('vp-pattern-id').value=id;
  document.getElementById('vp-title').textContent=`📝 ${p.titulo}`;
  document.getElementById('vp-text-editor').innerHTML=p.patronEscrito||'';
  renderPatternColorSwatches('vp-text-colors','vp-text-editor');
  openModal('modal-view-pattern');
}

/* ═══════════════════════════════════════════════════════════
   ARRANQUE
═══════════════════════════════════════════════════════════ */
function init() {
  loadAll();
  applySettings();
  applyDarkMode();
  initEvents();
  initFloatPlayer();
  initSidebarMobile();
  navigateTo('tutoriales');
  
  // Verificar descargador al iniciar y cada 10s
  updateDownloaderStatus();
  setInterval(updateDownloaderStatus, 10000);

  // Botón hamburguesa visible en móvil
  if(window.innerWidth <= 768) {
    const t = document.getElementById('sidebar-toggle');
    if(t) t.style.display = 'flex';
  }
}

document.addEventListener('DOMContentLoaded', init);

// Variable global del estado de conexión
let isDownloaderOnline = false;

// Verificación del servidor local (http://localhost:5050)
async function updateDownloaderStatus() {
  const btn = document.getElementById('downloader-status-btn');
  if (!btn) return;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const res = await fetch('http://localhost:5050/ping', { signal: controller.signal });
    clearTimeout(timeoutId);
    
    const data = await res.json();

    if (data.ok) {
      isDownloaderOnline = true;
      btn.innerHTML = '🟢 Descargador';
      btn.style.color = 'var(--color-success, #4CAF50)';
      btn.title = 'Servidor activo (http://localhost:5050)';
    } else {
      throw new Error();
    }
  } catch (err) {
    isDownloaderOnline = false;
    btn.innerHTML = '🔴 Descargador';
    btn.style.color = 'var(--color-danger, #FF5252)';
    btn.title = 'Servidor desconectado. Ejecuta: python downloader.py';
  }
}

// Evento al hacer clic en el botón del header
document.getElementById('downloader-status-btn')?.addEventListener('click', async () => {
  if (!isDownloaderOnline) {
    alert('⚠️ El servidor de descargas no está activo.\n\nAbre tu terminal en la carpeta del proyecto y ejecuta:\npython downloader.py');
    return;
  }

  try {
    const res = await fetch('http://localhost:5050/downloads');
    const data = await res.json();

    if (data.ok && data.files.length > 0) {
      const lista = data.files.slice(0, 10).map(f => `• ${f.name} (${f.size_mb} MB)`).join('\n');
      alert(`📁 Últimos videos descargados en MAFURAFU_Videos:\n\n${lista}`);
    } else {
      alert('🟢 Servidor activo.\nLa carpeta MAFURAFU_Videos aún no tiene descargas.');
    }
  } catch (err) {
    alert('Error al consultar los archivos del servidor local.');
  }
});

/* ═══ MÓDULO: YouTube Downloader ═══ */
document.addEventListener('DOMContentLoaded', () => {
  const ytBtn = document.getElementById('yt-toggle-btn');
  const ytModal = document.getElementById('yt-modal');
  const ytCloseBtn = document.getElementById('yt-close-btn');
  const ytDownloadBtn = document.getElementById('yt-download-btn');
  const ytUrlInput = document.getElementById('yt-url-input');

  if (ytBtn && ytModal) {
    ytBtn.addEventListener('click', () => ytModal.classList.remove('hidden'));
  }

  if (ytCloseBtn && ytModal) {
    ytCloseBtn.addEventListener('click', () => ytModal.classList.add('hidden'));
  }

  if (ytDownloadBtn) {
    ytDownloadBtn.addEventListener('click', async () => {
      const url = ytUrlInput ? ytUrlInput.value.trim() : '';
      if (!url) return alert('Ingresa un enlace de video válido.');

      try {
        ytDownloadBtn.disabled = true;
        ytDownloadBtn.textContent = 'Descargando...';

        const targetUrl = `http://localhost:5050/download?url=${encodeURIComponent(url)}`;
        const response = await fetch(targetUrl);
        const data = await response.json();

        if (data.ok) {
          alert(`¡Descarga completada! 🧶\n\nArchivo: ${data.filename}\nTamaño: ${data.size_mb} MB`);
          if (ytModal) ytModal.classList.add('hidden');
          if (ytUrlInput) ytUrlInput.value = '';
        } else {
          alert(`Error al descargar: ${data.error}`);
        }
      } catch (error) {
        alert('No se pudo conectar con el servidor Python.\nAsegúrate de ejecutar "python downloader.py" en la terminal.');
      } finally {
        ytDownloadBtn.disabled = false;
        ytDownloadBtn.textContent = 'Descargar';
      }
    });
  }
});
// Array que recupera las etiquetas personalizadas guardadas o crea uno vacío
let customTags = JSON.parse(localStorage.getItem('mafurafu_custom_tags')) || [];

// Renderiza una etiqueta en la interfaz y en el filtro
function renderTagElement(tagObj) {
  const tagSelector = document.getElementById('tut-tag-selector');
  const filterSelect = document.getElementById('filter-tags-tut');
  if (!tagSelector) return;

  // Evita duplicar si ya existe en la vista
  if (tagSelector.querySelector(`input[value="${tagObj.id}"]`)) return;

  const label = document.createElement('label');
  label.className = 'color-chip';
  label.style.cursor = 'pointer';
  label.innerHTML = `<input type="checkbox" value="${tagObj.id}" style="display:none"> ${tagObj.emoji} ${tagObj.name}`;

  label.addEventListener('click', () => {
    const chk = label.querySelector('input');
    chk.checked = !chk.checked;
    label.classList.toggle('active', chk.checked);
  });

  tagSelector.appendChild(label);

  // Añade la opción al menú de filtro principal
  if (filterSelect && !filterSelect.querySelector(`option[value="${tagObj.id}"]`)) {
    const opt = document.createElement('option');
    opt.value = tagObj.id;
    opt.textContent = `${tagObj.emoji} ${tagObj.name}`;
    filterSelect.appendChild(opt);
  }
}

// Carga las etiquetas almacenadas al abrir la app
function loadStoredCustomTags() {
  customTags.forEach(tag => renderTagElement(tag));
}

// Evento para agregar y persistir una nueva etiqueta
document.getElementById('add-tag-btn')?.addEventListener('click', () => {
  const tagInput = document.getElementById('add-tag-input');
  const emojiSelect = document.getElementById('tag-emoji-select');
  
  const name = tagInput.value.trim();
  const emoji = emojiSelect.value;

  if (!name) return;

  const tagId = name.toLowerCase().replace(/\s+/g, '_');
  const newTag = { id: tagId, name: name, emoji: emoji };

  // Guarda en localStorage si no está repetida
  if (!customTags.some(t => t.id === tagId)) {
    customTags.push(newTag);
    localStorage.setItem('mafurafu_custom_tags', JSON.stringify(customTags));
  }

  renderTagElement(newTag);

  // Selecciona automáticamente la etiqueta recién creada
  const tagSelector = document.getElementById('tut-tag-selector');
  const createdLabel = tagSelector.querySelector(`input[value="${tagId}"]`)?.parentElement;
  if (createdLabel) {
    const chk = createdLabel.querySelector('input');
    chk.checked = true;
    createdLabel.classList.add('active');
  }

  tagInput.value = '';
});

// Inicializar la carga al renderizar el documento
document.addEventListener('DOMContentLoaded', loadStoredCustomTags);

/* ═══════════════════════════════════════════════════════════
   *** AGREGA AQUÍ NUEVOS MÓDULOS ***
   Copia este bloque:
   /* ═══ MÓDULO: NombreNuevo ═══ */
   // Tu código aquí