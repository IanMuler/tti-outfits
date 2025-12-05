/* =============================================
   APP - Namespace, carga de datos, navegación e inicio
   ============================================= */

// Namespace global
var TTI = TTI || {};
TTI.datos = {};
TTI.nav = {};
TTI.buscador = {};
TTI.talles = {};
TTI.utils = {};

// ---- CARGA DE DATOS ----
TTI.datos.combos = [];

TTI.datos.cargar = function(callback) {
  fetch('./data/combos.json')
    .then(function(response) {
      if (!response.ok) throw new Error('Error al cargar combos.json');
      return response.json();
    })
    .then(function(data) {
      TTI.datos.combos = data;
      if (callback) callback();
    })
    .catch(function(err) {
      console.error('Error cargando combos:', err);
    });
};

// ---- NAVEGACIÓN ----
TTI.nav.pantallas = {
  bienvenida: 'welcomeScreen',
  buscador: 'outfitApp',
  talleRemera: 'talleRemeraScreen',
  talleJogger: 'talleJoggerScreen',
  talleBermuda: 'talleBermudaScreen',
  detalle: 'detailView'
};

// Guardar desde dónde vino el usuario a las pantallas de talle
TTI.nav.ultimaVistaTalle = 'welcome';

TTI.nav.ocultarTodas = function() {
  var p = TTI.nav.pantallas;
  var bienvenida = document.getElementById(p.bienvenida);
  var buscador = document.getElementById(p.buscador);
  var remera = document.getElementById(p.talleRemera);
  var jogger = document.getElementById(p.talleJogger);
  var bermuda = document.getElementById(p.talleBermuda);
  var detalle = document.getElementById(p.detalle);

  if (bienvenida) bienvenida.style.display = 'none';
  if (buscador) buscador.style.display = 'none';
  if (remera) remera.style.display = 'none';
  if (jogger) jogger.style.display = 'none';
  if (bermuda) bermuda.style.display = 'none';
  if (detalle) {
    detalle.classList.add('hidden');
    detalle.style.display = '';
  }
};

TTI.nav.mostrarBienvenida = function() {
  TTI.nav.ocultarTodas();
  var el = document.getElementById(TTI.nav.pantallas.bienvenida);
  if (el) el.style.display = 'flex';
  window.scrollTo(0, 0);
};

TTI.nav.entrarBuscador = function() {
  TTI.nav.ocultarTodas();
  var el = document.getElementById(TTI.nav.pantallas.buscador);
  if (el) el.style.display = 'block';
  window.scrollTo(0, 0);
};

TTI.nav.irATalleRemera = function() {
  TTI.nav.ocultarTodas();
  var el = document.getElementById(TTI.nav.pantallas.talleRemera);
  if (el) el.style.display = 'block';
  window.scrollTo(0, 0);
};

// Determinar desde dónde viene el usuario antes de ir a pantalla de talle
TTI.nav.registrarOrigen = function() {
  var p = TTI.nav.pantallas;
  var detalle = document.getElementById(p.detalle);
  var buscador = document.getElementById(p.buscador);

  if (detalle && !detalle.classList.contains('hidden')) {
    TTI.nav.ultimaVistaTalle = 'detail';
  } else if (buscador && buscador.style.display !== 'none') {
    TTI.nav.ultimaVistaTalle = 'app';
  } else {
    TTI.nav.ultimaVistaTalle = 'welcome';
  }
};

TTI.nav.irATalleRemera = function() {
  TTI.nav.registrarOrigen();
  TTI.nav.ocultarTodas();
  var el = document.getElementById(TTI.nav.pantallas.talleRemera);
  if (el) el.style.display = 'block';
  window.scrollTo(0, 0);
};

TTI.nav.irATalleJogger = function() {
  TTI.nav.registrarOrigen();
  TTI.nav.ocultarTodas();
  var el = document.getElementById(TTI.nav.pantallas.talleJogger);
  if (el) el.style.display = 'block';
  window.scrollTo(0, 0);
};

TTI.nav.irATalleBermuda = function() {
  TTI.nav.registrarOrigen();
  TTI.nav.ocultarTodas();
  var el = document.getElementById(TTI.nav.pantallas.talleBermuda);
  if (el) el.style.display = 'block';
  window.scrollTo(0, 0);
};

TTI.nav.volverDesdeTalle = function() {
  var p = TTI.nav.pantallas;
  var remera = document.getElementById(p.talleRemera);
  var jogger = document.getElementById(p.talleJogger);
  var bermuda = document.getElementById(p.talleBermuda);
  var buscador = document.getElementById(p.buscador);
  var detalle = document.getElementById(p.detalle);

  // Ocultar pantallas de talle
  if (remera) remera.style.display = 'none';
  if (jogger) jogger.style.display = 'none';
  if (bermuda) bermuda.style.display = 'none';

  if (TTI.nav.ultimaVistaTalle === 'detail') {
    // Volver al detalle del outfit
    if (buscador) buscador.style.display = 'block';
    if (detalle) {
      detalle.classList.remove('hidden');
      detalle.style.display = '';
    }
  } else if (TTI.nav.ultimaVistaTalle === 'app') {
    // Volver a la app de outfits
    if (buscador) buscador.style.display = 'block';
    if (detalle) {
      detalle.classList.add('hidden');
      detalle.style.display = '';
    }
  } else {
    // Caso por defecto: volver al inicio
    TTI.nav.mostrarBienvenida();
  }

  window.scrollTo(0, 0);
};

// Exponer funciones al scope global para onclick en HTML
window.entrarApp = TTI.nav.entrarBuscador;
window.volverInicio = TTI.nav.mostrarBienvenida;
window.irATalleRemera = TTI.nav.irATalleRemera;
window.irATalleJogger = TTI.nav.irATalleJogger;
window.irATalleBermuda = TTI.nav.irATalleBermuda;
window.volverDesdeTalle = TTI.nav.volverDesdeTalle;

// ---- SERVICE WORKER ----
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('./service-worker.js')
      .catch(function(err) { console.log('Error SW:', err); });
  });
}

// ---- INICIALIZACIÓN ----
document.addEventListener('DOMContentLoaded', function() {
  TTI.datos.cargar(function() {
    TTI.buscador.iniciar();
    TTI.talles.iniciar();
  });
});
