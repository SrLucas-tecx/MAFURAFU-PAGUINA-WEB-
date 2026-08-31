'use strict';

    /* ============================================================
       CONFIGURACIÓN DE COLORES DE ESTAMBRE
       EDITAR AQUÍ: Agrega o quita colores. Deben coincidir con las
       variables CSS --yarn-NombreColor definidas en :root arriba.
       ============================================================ */
    const YARN_COLORS = [
      { name: 'Amarillo', emoji: '🌟' },
      { name: 'Rosa',     emoji: '🌸' },
      { name: 'Verde',    emoji: '🍀' },
      { name: 'Azul',     emoji: '💙' },
      { name: 'Morado',   emoji: '💜' },
      { name: 'Blanco',   emoji: '⬜' },
      { name: 'Naranja',  emoji: '🍊' },
      { name: 'Rojo',     emoji: '❤️' },
      { name: 'Negro',    emoji: '🖤' },
      { name: 'Café',     emoji: '🤎' },
    ];

    /* ============================================================
       DATOS DE PRUEBA (MOCK DATA)
       EDITAR AQUÍ: Puedes cambiar estos patrones de ejemplo o
       simplemente borrarlos — sólo se cargan si el localStorage está vacío.
       ============================================================ */
    const MOCK_DATA = [
      {
        id: 'mock-1',
        titulo: 'Amigurumi Pikachu bebé',
        personaje: 'Pikachu',
        saga: 'Pokémon',
        color: 'Amarillo',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        fecha: Date.now() - 86400000 * 5,
        vistas: 12,
      },
      {
        id: 'mock-2',
        titulo: 'Stitch a crochet paso a paso',
        personaje: 'Stitch',
        saga: 'Lilo & Stitch',
        color: 'Azul',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        fecha: Date.now() - 86400000 * 3,
        vistas: 8,
      },
      {
        id: 'mock-3',
        titulo: 'Totoro grande para principiantes',
        personaje: 'Totoro',
        saga: 'Studio Ghibli',
        color: 'Verde',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        fecha: Date.now() - 86400000 * 2,
        vistas: 5,
      },
      {
        id: 'mock-4',
        titulo: 'Hello Kitty amigurumi pequeño',
        personaje: 'Hello Kitty',
        saga: 'Sanrio',
        color: 'Rosa',
        url: '',
        fecha: Date.now() - 86400000 * 1,
        vistas: 3,
      },
      {
        id: 'mock-5',
        titulo: 'Kirby redondito paso a paso',
        personaje: 'Kirby',
        saga: 'Nintendo',
        color: 'Rosa',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        fecha: Date.now() - 86400000 * 0.5,
        vistas: 2,
      },
      {
        id: 'mock-6',
        titulo: 'Dragon bola Z — Shenlong',
        personaje: 'Shenlong',
        saga: 'Dragon Ball Z',
        color: 'Verde',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        fecha: Date.now() - 86400000 * 0.2,
        vistas: 1,
      },
    ];

    /* ============================================================
       CLAVE DE LOCALSTORAGE
       EDITAR AQUÍ: Cambia este nombre si tienes varias instancias
       de la app y necesitas separarlas.
       ============================================================ */
    const STORAGE_KEY = 'yarnCraftsHub_patterns';

    /* ============================================================
       ESTADO DE LA APLICACIÓN
       ============================================================ */
    let patterns     = [];  // Todos los patrones cargados
    let filterColor  = 'Todos'; // Filtro activo de color
    let searchQuery  = '';      // Texto de búsqueda activo

    /* ============================================================
       UTILIDADES
       ============================================================ */

    /** Genera un ID único simple */
    function uid() {
      return 'p-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
    }

    /** Guarda los patrones en localStorage */
    function saveToStorage() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(patterns));
      } catch (e) {
        showToast('Error al guardar — localStorage lleno', 'error');
      }
    }

    /** Carga los patrones desde localStorage */
    function loadFromStorage() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          patterns = JSON.parse(raw);
        } else {
          // Primera visita: carga los datos de ejemplo
          patterns = MOCK_DATA;
          saveToStorage();
        }
      } catch (e) {
        patterns = MOCK_DATA;
      }
    }

    /**
     * Convierte cualquier URL de YouTube al formato embed.
     * Acepta: watch?v=, youtu.be/, shorts/, live/
     */
    function toEmbedUrl(url) {
      if (!url || !url.trim()) return '';
      try {
        // Extraer el ID del video con una expresión regular
        // EDITAR AQUÍ: Si necesitas soporte para otro proveedor de video, añade aquí
        const match = url.match(
          /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
        );
        if (match && match[1]) {
          return `https://www.youtube.com/embed/${match[1]}?rel=0`;
        }
        return '';
      } catch {
        return '';
      }
    }

    /**
     * Obtiene el color CSS de un nombre de color de estambre.
     * Lee directamente las variables CSS definidas en :root.
     */
    function getYarnColor(colorName) {
      const val = getComputedStyle(document.documentElement)
        .getPropertyValue(`--yarn-${colorName}`)
        .trim();
      return val || getComputedStyle(document.documentElement).getPropertyValue('--color-accent').trim();
    }

    /** Determina si un color es claro para usar texto oscuro encima */
    function isLightColor(hex) {
      const c = hex.replace('#', '');
      if (c.length < 6) return true;
      const r = parseInt(c.slice(0, 2), 16);
      const g = parseInt(c.slice(2, 4), 16);
      const b = parseInt(c.slice(4, 6), 16);
      return (r * 299 + g * 587 + b * 114) / 1000 > 160;
    }

    /** Muestra una notificación toast temporal */
    function showToast(message, type = 'default') {
      const container = document.getElementById('toast-container');
      const toast = document.createElement('div');
      toast.className = `toast ${type}`;
      toast.textContent = message;
      container.appendChild(toast);
      // Animar entrada
      requestAnimationFrame(() => {
        requestAnimationFrame(() => toast.classList.add('show'));
      });
      // Eliminar después de 3 segundos
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 350);
      }, 3000);
    }

    /* ============================================================
       FILTROS: Búsqueda + Color
       ============================================================ */

    /** Devuelve los patrones según los filtros activos */
    function getFilteredPatterns() {
      const q = searchQuery.toLowerCase().trim();
      return patterns.filter(p => {
        // Filtro de color
        if (filterColor !== 'Todos' && p.color !== filterColor) return false;
        // Filtro de búsqueda
        if (q) {
          const hay = `${p.titulo} ${p.personaje} ${p.saga} ${p.color}`.toLowerCase();
          if (!hay.includes(q)) return false;
        }
        return true;
      });
    }

    /* ============================================================
       RENDERIZADO: PALETA DE COLORES EN EL HEADER
       ============================================================ */
    function renderColorPalette() {
      const palette = document.getElementById('color-palette');
      // Limpiar manteniendo la etiqueta
      palette.innerHTML = '<span class="palette-label">🎨 Estambre:</span>';

      // Botón "Todos" (primero)
      const btnTodos = document.createElement('button');
      btnTodos.className = 'color-btn' + (filterColor === 'Todos' ? ' active' : '');
      btnTodos.dataset.color = 'Todos';
      btnTodos.title = 'Todos los colores';
      btnTodos.setAttribute('aria-pressed', filterColor === 'Todos');
      palette.appendChild(btnTodos);

      // Botones por cada color definido
      YARN_COLORS.forEach(({ name }) => {
        const cssColor = getYarnColor(name);
        const btn = document.createElement('button');
        btn.className = 'color-btn' + (filterColor === name ? ' active' : '');
        btn.dataset.color = name;
        btn.style.backgroundColor = cssColor;
        btn.title = name;
        btn.setAttribute('aria-pressed', filterColor === name);
        palette.appendChild(btn);
      });

      // Eventos de clic en la paleta
      palette.querySelectorAll('.color-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          filterColor = btn.dataset.color;
          renderColorPalette();
          renderCatalog();
        });
      });
    }

    /* ============================================================
       RENDERIZADO: CARRUSEL DE ÚLTIMOS AÑADIDOS
       ============================================================ */
    function renderCarousel() {
      const track = document.getElementById('carousel-track');
      // Tomar los últimos 5 patrones ordenados por fecha (más reciente primero)
      const recientes = [...patterns]
        .sort((a, b) => b.fecha - a.fecha)
        .slice(0, 5);

      if (recientes.length === 0) {
        track.innerHTML = '<p class="carousel-empty">Aún no has guardado ningún patrón.</p>';
        return;
      }

      track.innerHTML = recientes.map(p => {
        const yarnColor = getYarnColor(p.color);
        const embedUrl  = toEmbedUrl(p.url);
        // Ícono según si tiene video o no
        const thumb = embedUrl
          ? '▶️'
          : (p.personaje ? '🧶' : '✨');

        return `
          <div class="carousel-card" style="--yarn-color:${yarnColor}" data-id="${p.id}" role="button" tabindex="0" title="Ver ${p.titulo}">
            <div class="carousel-card-thumb">
              ${thumb}
            </div>
            <div class="carousel-card-body">
              <div class="carousel-card-title">${escHtml(p.titulo)}</div>
              <div class="carousel-card-sub">${escHtml(p.personaje)}${p.saga ? ' · ' + escHtml(p.saga) : ''}</div>
            </div>
          </div>
        `;
      }).join('');

      // Hacer scroll al patrón en el catálogo al hacer clic en el carrusel
      track.querySelectorAll('.carousel-card').forEach(card => {
        const activate = () => {
          const id = card.dataset.id;
          const target = document.querySelector(`.pattern-card[data-id="${id}"]`);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            target.style.outline = `3px solid ${getComputedStyle(document.documentElement).getPropertyValue('--color-accent')}`;
            setTimeout(() => { target.style.outline = ''; }, 1500);
          }
        };
        card.addEventListener('click', activate);
        card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') activate(); });
      });
    }

    /* ============================================================
       RENDERIZADO: CATÁLOGO PRINCIPAL (GRID DE TARJETAS)
       ============================================================ */
    function renderCatalog() {
      const grid  = document.getElementById('catalog-grid');
      const count = document.getElementById('catalog-count');
      const filtered = getFilteredPatterns();

      count.textContent = filtered.length === 1
        ? '1 patrón'
        : `${filtered.length} patrones`;

      if (filtered.length === 0) {
        grid.innerHTML = `
          <div class="catalog-empty">
            <span class="catalog-empty-icon">🔍</span>
            <h3>No se encontraron patrones</h3>
            <p>Prueba con otro color o término de búsqueda,<br>o agrega uno nuevo con el botón ＋</p>
          </div>
        `;
        return;
      }

      // Ordenar por fecha descendente para mostrar los más recientes primero
      const sorted = [...filtered].sort((a, b) => b.fecha - a.fecha);

      grid.innerHTML = sorted.map(p => renderPatternCard(p)).join('');

      // Eventos de eliminar en cada tarjeta
      grid.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.closest('.pattern-card').dataset.id;
          deletePattern(id);
        });
      });
    }

    /** Genera el HTML de una tarjeta de patrón */
    function renderPatternCard(p) {
      const yarnColor = getYarnColor(p.color);
      const embedUrl  = toEmbedUrl(p.url);
      const textColor = isLightColor(yarnColor) ? '#2d2040' : '#ffffff';

      // Sección de video o ícono decorativo
      const videoSection = embedUrl
        ? `<div class="card-video">
             <iframe
               src="${embedUrl}"
               title="${escHtml(p.titulo)}"
               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
               allowfullscreen
               loading="lazy">
             </iframe>
           </div>`
        : `<div class="card-no-video">
             <div class="card-no-video-inner">
               🧶
               <span>Sin video</span>
             </div>
           </div>`;

      return `
        <article class="pattern-card" data-id="${p.id}" style="--yarn-color:${yarnColor}">
          ${videoSection}
          <div class="card-body">
            <div class="card-header-row">
              <h3 class="card-title">${escHtml(p.titulo)}</h3>
            </div>
            <div class="card-meta">
              <span class="tag tag-persona">🎭 ${escHtml(p.personaje)}</span>
              ${p.saga ? `<span class="tag tag-saga">📺 ${escHtml(p.saga)}</span>` : ''}
              <span class="tag tag-color" style="background:${yarnColor};color:${textColor}">
                🧶 ${escHtml(p.color)}
              </span>
            </div>
            <div class="card-footer-row">
              <span class="card-views">👁 ${p.vistas || 0} vistas</span>
              <button class="btn-delete" data-id="${p.id}" title="Eliminar patrón">🗑 Eliminar</button>
            </div>
          </div>
        </article>
      `;
    }

    /** Escapa caracteres HTML para evitar XSS */
    function escHtml(str) {
      return String(str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

    /* ============================================================
       ACCIONES: CRUD DE PATRONES
       ============================================================ */

    /** Guarda un nuevo patrón desde el formulario modal */
    function savePattern() {
      const titulo     = document.getElementById('f-titulo').value.trim();
      const personaje  = document.getElementById('f-personaje').value.trim();
      const saga       = document.getElementById('f-saga').value.trim();
      const color      = document.getElementById('f-color').value;
      const url        = document.getElementById('f-url').value.trim();

      // Validación básica
      if (!titulo) { showToast('⚠️ El título es obligatorio', 'error'); return; }
      if (!personaje) { showToast('⚠️ El personaje es obligatorio', 'error'); return; }

      const nuevo = {
        id: uid(),
        titulo,
        personaje,
        saga,
        color,
        url,
        fecha: Date.now(),
        vistas: 0,
      };

      patterns.unshift(nuevo); // Agregar al inicio
      saveToStorage();
      renderAll();
      closeModal();
      showToast('✅ Patrón guardado con éxito', 'success');
    }

    /** Elimina un patrón por ID con confirmación del navegador */
    function deletePattern(id) {
      const pattern = patterns.find(p => p.id === id);
      if (!pattern) return;
      if (!confirm(`¿Eliminar el patrón "${pattern.titulo}"?\nEsta acción no se puede deshacer.`)) return;
      patterns = patterns.filter(p => p.id !== id);
      saveToStorage();
      renderAll();
      showToast('🗑 Patrón eliminado', 'default');
    }

    /* ============================================================
       MODAL: ABRIR / CERRAR
       ============================================================ */
    function openModal() {
      // Limpiar el formulario
      document.getElementById('f-titulo').value    = '';
      document.getElementById('f-personaje').value = '';
      document.getElementById('f-saga').value      = '';
      document.getElementById('f-color').value     = YARN_COLORS[0].name;
      document.getElementById('f-url').value       = '';
      updateColorPreview();

      document.getElementById('modal-overlay').classList.add('open');
      document.getElementById('f-titulo').focus();
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      document.getElementById('modal-overlay').classList.remove('open');
      document.body.style.overflow = '';
    }

    /* ============================================================
       FORMULARIO: VISTA PREVIA DE COLOR Y OPCIONES DEL SELECT
       ============================================================ */

    /** Construye las opciones del <select> de color en el formulario */
    function buildColorSelect() {
      const sel = document.getElementById('f-color');
      sel.innerHTML = YARN_COLORS.map(({ name, emoji }) =>
        `<option value="${name}">${emoji} ${name}</option>`
      ).join('');
      updateColorPreview();
    }

    /** Actualiza el swatch de vista previa cuando cambia el color seleccionado */
    function updateColorPreview() {
      const sel    = document.getElementById('f-color');
      const swatch = document.getElementById('color-preview-swatch');
      if (!sel || !swatch) return;
      const cssColor = getYarnColor(sel.value);
      swatch.style.backgroundColor = cssColor;
    }

    /* ============================================================
       RESPALDO: EXPORTAR E IMPORTAR JSON
       ============================================================ */

    /** Descarga todos los patrones como archivo JSON */
    function exportJSON() {
      const data     = JSON.stringify(patterns, null, 2);
      const blob     = new Blob([data], { type: 'application/json' });
      const url      = URL.createObjectURL(blob);
      const a        = document.createElement('a');
      const fecha    = new Date().toISOString().slice(0, 10);
      a.href         = url;
      a.download     = `yarn-crafts-hub-backup-${fecha}.json`;
      a.click();
      URL.revokeObjectURL(url);
      closeBackupMenu();
      showToast('📦 Copia exportada correctamente', 'success');
    }

    /** Abre el selector de archivos para importar un JSON */
    function triggerImport() {
      document.getElementById('import-file-input').click();
      closeBackupMenu();
    }

    /** Procesa el archivo JSON importado */
    function handleImportFile(e) {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const imported = JSON.parse(ev.target.result);
          if (!Array.isArray(imported)) throw new Error('Formato inválido');
          // Validación básica de cada elemento
          const valid = imported.filter(p =>
            typeof p.id === 'string' &&
            typeof p.titulo === 'string'
          );
          if (valid.length === 0) throw new Error('No hay patrones válidos en el archivo');

          // Preguntar si reemplazar o fusionar
          const merge = confirm(
            `Se encontraron ${valid.length} patrones.\n\n` +
            '• Haz clic en "Aceptar" para FUSIONAR con los actuales.\n' +
            '• Haz clic en "Cancelar" para REEMPLAZAR todo.'
          );

          if (merge) {
            // Fusionar: agregar sólo los que no existan (por ID)
            const existing = new Set(patterns.map(p => p.id));
            const nuevos   = valid.filter(p => !existing.has(p.id));
            patterns = [...patterns, ...nuevos];
            showToast(`✅ ${nuevos.length} patrones nuevos fusionados`, 'success');
          } else {
            patterns = valid;
            showToast(`✅ ${valid.length} patrones importados`, 'success');
          }

          saveToStorage();
          renderAll();
        } catch (err) {
          showToast(`❌ Error al importar: ${err.message}`, 'error');
        }
      };
      reader.readAsText(file);
      // Resetear el input para poder reimportar el mismo archivo
      e.target.value = '';
    }

    /* ============================================================
       MENÚ DE RESPALDO (DROPDOWN)
       ============================================================ */
    function toggleBackupMenu() {
      const menu = document.getElementById('backup-menu');
      menu.classList.toggle('open');
    }

    function closeBackupMenu() {
      document.getElementById('backup-menu').classList.remove('open');
    }

    /* ============================================================
       RENDERIZADO GLOBAL — Llama a todas las funciones de render
       ============================================================ */
    function renderAll() {
      renderColorPalette();
      renderCarousel();
      renderCatalog();
    }

    /* ============================================================
       INICIALIZACIÓN DE EVENTOS
       ============================================================ */
    function initEvents() {

      // Botón flotante "+"
      document.getElementById('fab-btn').addEventListener('click', openModal);

      // Cerrar modal con la X o con Escape
      document.getElementById('modal-close').addEventListener('click', closeModal);
      document.getElementById('form-cancel-btn').addEventListener('click', closeModal);
      document.getElementById('modal-overlay').addEventListener('click', e => {
        if (e.target === e.currentTarget) closeModal();
      });
      document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeModal();
      });

      // Guardar formulario
      document.getElementById('form-save-btn').addEventListener('click', savePattern);
      // También guardar al pulsar Enter en cualquier campo del formulario
      document.getElementById('modal-overlay').addEventListener('keydown', e => {
        if (e.key === 'Enter' && e.target.tagName !== 'BUTTON' && e.target.tagName !== 'TEXTAREA') {
          savePattern();
        }
      });

      // Vista previa de color al cambiar el select
      document.getElementById('f-color').addEventListener('change', updateColorPreview);

      // Búsqueda en tiempo real
      document.getElementById('search-input').addEventListener('input', e => {
        searchQuery = e.target.value;
        renderCatalog();
      });

      // Menú de respaldo
      document.getElementById('backup-btn').addEventListener('click', e => {
        e.stopPropagation();
        toggleBackupMenu();
      });
      document.getElementById('export-btn').addEventListener('click', exportJSON);
      document.getElementById('import-btn').addEventListener('click', triggerImport);
      document.getElementById('import-file-input').addEventListener('change', handleImportFile);

      // Cerrar menú de respaldo al hacer clic fuera
      document.addEventListener('click', e => {
        if (!e.target.closest('#backup-btn') && !e.target.closest('#backup-menu')) {
          closeBackupMenu();
        }
      });
    }

    /* ============================================================
       ARRANQUE DE LA APLICACIÓN
       ============================================================ */
    function init() {
      loadFromStorage();  // 1. Cargar datos
      buildColorSelect(); // 2. Poblar select de colores en el formulario
      initEvents();       // 3. Registrar eventos
      renderAll();        // 4. Pintar la interfaz

      // Mostrar bienvenida en la primera visita (sin mock data previo)
      const isFirstLoad = !localStorage.getItem(STORAGE_KEY + '_visited');
      if (isFirstLoad) {
        localStorage.setItem(STORAGE_KEY + '_visited', '1');
        setTimeout(() => showToast('¡Bienvenida a MAFURAFU & Crafts Hub! 🧶✨', 'success'), 500);
      }
    }

    // Esperar a que el DOM esté listo
    document.addEventListener('DOMContentLoaded', init);
