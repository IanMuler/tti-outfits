/* =============================================
   APP - Namespace, carga de datos, navegación e inicio
   ============================================= */

// Namespace global
var TTI = TTI || {};
TTI.datos = TTI.datos || {};
TTI.nav = TTI.nav || {};
TTI.talles = TTI.talles || {};
TTI.utils = TTI.utils || {};

// ---- UTILIDADES ----
TTI.utils.derivarColoresPorTipo = function(combos) {
  var resultado = {};
  combos.forEach(function(c) {
    if (c.top_type === 'Remera') {
      if (!resultado['Remera']) resultado['Remera'] = {};
      resultado['Remera'][c.top_color] = true;
    }
    if (c.bottom_type && c.bottom_type !== 'Remera') {
      if (!resultado[c.bottom_type]) resultado[c.bottom_type] = {};
      resultado[c.bottom_type][c.bottom_color] = true;
    }
  });
  Object.keys(resultado).forEach(function(tipo) {
    resultado[tipo] = Object.keys(resultado[tipo]).sort();
  });
  return resultado;
};

// ---- CARGA DE DATOS ----
TTI.datos.combos = [];
TTI.datos.coloresPorTipo = {};

TTI.datos.cargar = function(callback, onError) {
  fetch('./data/combos.json')
    .then(function(response) {
      if (!response.ok) throw new Error('Error al cargar combos.json');
      return response.json();
    })
    .then(function(data) {
      TTI.datos.combos = data;
      TTI.datos.coloresPorTipo = TTI.utils.derivarColoresPorTipo(data);
      if (callback) callback();
    })
    .catch(function(err) {
      console.error('Error cargando combos:', err);
      if (onError) onError();
    });
};

// ---- NAVEGACIÓN ----
TTI.nav.pantallas = {
  bienvenida: 'welcomeScreen',
  talleRemera: 'talleRemeraScreen',
  talleJogger: 'talleJoggerScreen',
  talleBermuda: 'talleBermudaScreen'
};

TTI.nav.ocultarTodas = function() {
  var p = TTI.nav.pantallas;
  var bienvenida = document.getElementById(p.bienvenida);
  var remera = document.getElementById(p.talleRemera);
  var jogger = document.getElementById(p.talleJogger);
  var bermuda = document.getElementById(p.talleBermuda);

  if (bienvenida) bienvenida.style.display = 'none';
  if (remera) remera.style.display = 'none';
  if (jogger) jogger.style.display = 'none';
  if (bermuda) bermuda.style.display = 'none';
};

TTI.nav.mostrarBienvenida = function() {
  TTI.nav.ocultarTodas();
  var el = document.getElementById(TTI.nav.pantallas.bienvenida);
  if (el) el.style.display = 'flex';
  window.scrollTo(0, 0);
};

TTI.nav.irATalleRemera = function() {
  TTI.nav.ocultarTodas();
  var el = document.getElementById(TTI.nav.pantallas.talleRemera);
  if (el) el.style.display = 'block';
  window.scrollTo(0, 0);
};

TTI.nav.irATalleJogger = function() {
  TTI.nav.ocultarTodas();
  var el = document.getElementById(TTI.nav.pantallas.talleJogger);
  if (el) el.style.display = 'block';
  window.scrollTo(0, 0);
};

TTI.nav.irATalleBermuda = function() {
  TTI.nav.ocultarTodas();
  var el = document.getElementById(TTI.nav.pantallas.talleBermuda);
  if (el) el.style.display = 'block';
  window.scrollTo(0, 0);
};

TTI.nav.volverDesdeTalle = function() {
  TTI.nav.mostrarBienvenida();
};

// Exponer funciones al scope global para onclick en HTML
window.volverInicio = TTI.nav.mostrarBienvenida;
window.irATalleRemera = TTI.nav.irATalleRemera;
window.irATalleJogger = TTI.nav.irATalleJogger;
window.irATalleBermuda = TTI.nav.irATalleBermuda;
window.volverDesdeTalle = TTI.nav.volverDesdeTalle;

// ---- INICIALIZACIÓN ROBUSTA ----

window.appInitialized = false;
window.appLoaded = false;

function initApp() {
  if (window.appInitialized) return;
  window.appInitialized = true;

  // Inicializar talles
  if (TTI.talles && typeof TTI.talles.iniciar === 'function') {
    TTI.talles.iniciar();
  }

  // Mostrar bienvenida
  TTI.nav.mostrarBienvenida();

  // Carga asíncrona de datos secundarios
  TTI.datos.cargar(function() {
    window.appLoaded = true;
  }, function() {
    window.appLoaded = true; // No bloquear la app si falla el JSON
  });
}

function safeInit() {
  if (window.appInitialized) return;
  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    initApp();
  } else {
    setTimeout(safeInit, 30);
  }
}

safeInit();