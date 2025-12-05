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
  detalle: 'detailView'
};

TTI.nav.ocultarTodas = function() {
  var p = TTI.nav.pantallas;
  var bienvenida = document.getElementById(p.bienvenida);
  var buscador = document.getElementById(p.buscador);
  var remera = document.getElementById(p.talleRemera);
  var jogger = document.getElementById(p.talleJogger);
  var detalle = document.getElementById(p.detalle);

  if (bienvenida) bienvenida.style.display = 'none';
  if (buscador) buscador.style.display = 'none';
  if (remera) remera.style.display = 'none';
  if (jogger) jogger.style.display = 'none';
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

TTI.nav.irATalleJogger = function() {
  TTI.nav.ocultarTodas();
  var el = document.getElementById(TTI.nav.pantallas.talleJogger);
  if (el) el.style.display = 'block';
  window.scrollTo(0, 0);
};

// Exponer funciones al scope global para onclick en HTML
window.entrarApp = TTI.nav.entrarBuscador;
window.volverInicio = TTI.nav.mostrarBienvenida;
window.irATalleRemera = TTI.nav.irATalleRemera;
window.irATalleJogger = TTI.nav.irATalleJogger;

// ---- SERVICE WORKER ----
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('./service-worker.js')
      .then(function(reg) { console.log('SW registrado:', reg.scope); })
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
