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

// ---- SERVICE WORKER (DISABLED) ----
// Se deshabilita y desregistra el Service Worker para evitar problemas de
// caché en webviews y navegadores, que es una de las causas probables
// de la pantalla blanca en la primera carga.
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for (let registration of registrations) {
      registration.unregister();
    }
  });
}

// ---- INICIALIZACIÓN ROBUSTA Y SISTEMA DE RESCATE ----

// Bandera global para asegurar que la inicialización ocurra solo una vez.
window.appInitialized = false;
// Bandera global para que el sistema de rescate sepa si la app cargó.
window.appLoaded = false;

// Contiene la lógica central de inicialización de la app.
function initApp() {
  // Si ya se inicializó, no hacer nada.
  if (window.appInitialized) {
    return;
  }
  window.appInitialized = true;

  TTI.datos.cargar(function() {
    // Éxito en la carga de datos: inicializar componentes.
    TTI.buscador.iniciar();
    TTI.talles.iniciar();
    TTI.nav.mostrarBienvenida(); // Punto de entrada de la app.
    
    // Marcar la app como completamente cargada para el sistema de rescate.
    window.appLoaded = true;
  }, function() {
    // Error en la carga de datos: aún así intentamos mostrar la app.
    TTI.nav.mostrarBienvenida();
    window.appLoaded = true; // Marcar como cargada para evitar reload en bucle.
  });
}

// Sistema de inicialización segura (anti-pantalla blanca).
// Intenta iniciar la app tan pronto como el DOM es interactivo,
// sin depender exclusivamente del evento DOMContentLoaded.
function safeInit() {
  if (window.appInitialized) {
    return;
  }
  
  // Si el DOM ya está listo (interactive o complete), iniciar la app.
  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    initApp();
  } else {
    // Si no, volver a intentar en 50ms.
    setTimeout(safeInit, 50);
  }
}

// Sistema de rescate automático silencioso.
// Si después de 1500ms la app no se ha marcado como 'cargada',
// forzamos un refresco. Esto es invisible para el usuario.
setTimeout(function() {
  if (!window.appLoaded) {
    location.reload();
  }
}, 1500);

// Iniciar el proceso de inicialización segura.
safeInit();
