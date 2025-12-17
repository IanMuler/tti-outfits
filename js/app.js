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

// ---- UTILIDADES ----
TTI.utils.derivarColoresPorTipo = function(combos) {
  var resultado = {};
  combos.forEach(function(c) {
    // Colores de remera (siempre en top cuando top_type es Remera)
    if (c.top_type === 'Remera') {
      if (!resultado['Remera']) resultado['Remera'] = {};
      resultado['Remera'][c.top_color] = true;
    }
    // Colores de pantalón/bermuda
    if (c.bottom_type && c.bottom_type !== 'Remera') {
      if (!resultado[c.bottom_type]) resultado[c.bottom_type] = {};
      resultado[c.bottom_type][c.bottom_color] = true;
    }
  });
  // Convertir objetos a arrays ordenados
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
(function() {
  var appHasLoaded = false;

  function showApp() {
    if (appHasLoaded) return;
    appHasLoaded = true;

    document.body.classList.remove('is-loading');
    TTI.nav.mostrarBienvenida();
  }

  // Temporizador de seguridad
  var safetyTimeout = setTimeout(showApp, 4000);

  // Carga de datos e inicialización de la app
  document.addEventListener('DOMContentLoaded', function() {
    TTI.datos.cargar(function() {
      // Éxito: inicializar y mostrar
      clearTimeout(safetyTimeout);
      TTI.buscador.iniciar();
      TTI.talles.iniciar();
      showApp();
    }, function() {
      // Error: solo mostrar (la app quedará sin datos)
      clearTimeout(safetyTimeout);
      showApp();
    });
  });
})();
