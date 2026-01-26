/* =============================================
   BUSCADOR OUTFITS - Búsqueda, filtros y beneficios
   ============================================= */

// ---- UTILIDADES ----
TTI.utils.normalizarOcasion = function(oc) {
  var txt = oc.toLowerCase();
  if (txt.indexOf("oficina") !== -1 || txt.indexOf("facultad") !== -1) return "Oficina/Facultad";
  if (txt.indexOf("verano") !== -1 || txt.indexOf("aire libre") !== -1) return "Verano";
  if (txt.indexOf("urbano") !== -1) return "Urbano";
  return "Ciudad";
};

// ---- LÓGICA DE CALZADO ----
TTI.buscador.getCalzadoRecomendado = function(c) {
  var bottomType = c.bottom_type;
  var bottomColor = c.bottom_color;

  // La regla principal aplica solo a joggers.
  // Si no es jogger, devolvemos el valor original para no afectar otros outfits.
  if (bottomType.indexOf("Jogger") === -1) {
    return c.footwear;
  }

  // Si es Jogger, aplicamos la nueva lógica estricta.
  var defaultShoe = "Zapatillas blancas";
  var alternatives = [];

  // Asignación por color de jogger
  switch (bottomColor) {
    case "Negro":
      defaultShoe = "Zapatillas blancas";
      alternatives = ["zapatillas negras", "zapatillas gris claro"];
      break;
    case "Gris":
    case "Gris Topo":
    case "Gris Melange":
      defaultShoe = "Zapatillas blancas";
      alternatives = ["zapatillas gris claro", "zapatillas negras", "zapatillas beige claro"];
      break;
    case "Beige":
    case "Arena":
    case "Beige Claro":
      defaultShoe = "Zapatillas blancas";
      alternatives = ["zapatillas beige claro", "zapatillas off-white", "zapatillas gris claro"];
      break;
    case "Verde":
      defaultShoe = "Zapatillas blancas";
      alternatives = ["zapatillas beige", "zapatillas gris claro"];
      // Lógica condicional para zapatillas negras
      if (c.top_color === "Negra" || c.top_color === "Gris Topo") {
        alternatives.push("zapatillas negras");
      }
      break;
    default:
      // Fallback: si el color no es reconocido, solo zapatillas blancas.
      return "Zapatillas blancas";
  }

  // Priorizar estilo según tipo de jogger
  var styleAdjective = (bottomType === "Jogger Liso") ? "minimalistas" : "urbanas";
  
  var result = defaultShoe + " " + styleAdjective;

  // Construir el string final con un máximo de 3 opciones.
  if (alternatives.length > 0) {
    result += " o " + alternatives.slice(0, 2).join(" / ");
  }

  return result;
};


// ---- BENEFICIOS ----
TTI.buscador.beneficioRemera = function(color) {
  var textos = TTI.constantes.beneficios.remera;
  return textos[color] || textos["default"];
};

TTI.buscador.beneficioPantalon = function(tipo, color) {
  var base = TTI.constantes.beneficios.pantalonBase;
  var matiz = TTI.constantes.beneficios.pantalonMatiz;
  return (base[tipo] || base["default"]) + (matiz[color] || "");
};

TTI.buscador.beneficioConjunto = function(c) {
  var ocNorm = TTI.utils.normalizarOcasion(c.occasion);
  var bases = TTI.constantes.beneficios.conjuntoBase;
  var tiempos = TTI.constantes.beneficios.conjuntoTiempo;
  return (bases[ocNorm] || bases["Ciudad"]) + (tiempos[c.time_of_day] || tiempos["default"]);
};

TTI.buscador.resumenConjunto = function(c) {
  return "Remera " + c.top_color + " con " + c.bottom_type.toLowerCase() + " " +
         c.bottom_color.toLowerCase() + " que equilibra color, presencia y comodidad para un look " +
         TTI.utils.normalizarOcasion(c.occasion).toLowerCase() + " con identidad madura.";
};

// ---- ELEMENTOS DOM ----
TTI.buscador.el = {};

// ---- POBLAR COLORES ----
TTI.buscador.poblarColores = function() {
  var tipo = TTI.buscador.el.tipoSelect.value;
  var colores = [];

  if (tipo === 'todos') {
    // Unir todos los colores de todos los tipos
    var todos = {};
    Object.keys(TTI.datos.coloresPorTipo).forEach(function(t) {
      TTI.datos.coloresPorTipo[t].forEach(function(c) {
        todos[c] = true;
      });
    });
    colores = Object.keys(todos).sort();
  } else {
    colores = TTI.datos.coloresPorTipo[tipo] || [];
  }

  var sel = TTI.buscador.el.colorSelect;
  sel.innerHTML = '<option value="todos">Color: Todos</option>';
  colores.forEach(function(col) {
    var opt = document.createElement('option');
    opt.value = col;
    opt.textContent = col;
    sel.appendChild(opt);
  });
};

// ---- RENDERIZAR ----
TTI.buscador.renderizar = function() {
  var tipo = TTI.buscador.el.tipoSelect.value;
  var color = TTI.buscador.el.colorSelect.value;
  var oc = TTI.buscador.el.ocasionSelect.value;
  var clima = TTI.buscador.el.climaSelect.value;
  var busqueda = TTI.buscador.el.searchInput.value.toLowerCase();
  var resultados = TTI.buscador.el.results;
  var combos = TTI.datos.combos;

  resultados.innerHTML = '';

  var filtrados = combos.filter(function(c) {
    if (tipo !== 'todos') {
      if (tipo === 'Remera' && c.top_type !== 'Remera') return false;
      if (tipo !== 'Remera' && c.bottom_type !== tipo) return false;
    }
    if (color !== 'todos') {
      if (tipo === 'todos') {
        if (c.top_color !== color && c.bottom_color !== color) return false;
      } else if (tipo === 'Remera') {
        if (c.top_color !== color) return false;
      } else {
        if (c.bottom_color !== color) return false;
      }
    }
    // Filtro de clima
    if (clima !== 'todos' && c.clima !== clima) return false;

    // Filtro de ocasión
    if (oc !== 'todas') {
      var time = c.time_of_day;
      var occTxt = c.occasion.toLowerCase();

      // Filtros por momento del día
      if (oc === 'dia' && !(time === 'día' || time === 'ambos')) return false;
      if (oc === 'noche' && !(time === 'noche' || time === 'ambos')) return false;
      if (oc === 'diaynoche' && time !== 'ambos') return false;

      // Filtros por contexto
      if (oc === 'ciudad') {
        if (occTxt.indexOf('ciudad') === -1 && occTxt.indexOf('urbano') === -1 && occTxt.indexOf('paseo') === -1 && occTxt.indexOf('after') === -1) return false;
      }
      if (oc === 'airelibre') {
        if (occTxt.indexOf('verano') === -1 && occTxt.indexOf('aire libre') === -1) return false;
      }
      if (oc === 'oficina') {
        if (occTxt.indexOf('oficina') === -1 && occTxt.indexOf('facultad') === -1) return false;
      }
    }
    var texto = (c.top_type + ' ' + c.top_color + ' ' + c.bottom_type + ' ' + c.bottom_color + ' ' + c.footwear + ' ' + c.occasion).toLowerCase();
    if (busqueda && texto.indexOf(busqueda) === -1) return false;
    return true;
  });

  if (!filtrados.length) {
    resultados.innerHTML = '<p style="grid-column:1/-1;text-align:center;font-size:1.1rem;color:#777;">No hay combinaciones para ese filtro.</p>';
    return;
  }

  filtrados.forEach(function(c) {
    var card = document.createElement('article');
    card.className = 'card';
    var idx = combos.indexOf(c);
    var tiempo = c.time_of_day === "día" ? "Ideal para el día" : (c.time_of_day === "noche" ? "Ideal para la noche" : "Se puede usar tanto de día como de noche");
    var calzado = TTI.buscador.getCalzadoRecomendado(c);
    card.innerHTML =
      '<div class="card-top">' + c.top_type + ' · ' + c.bottom_type + '</div>' +
      '<div class="card-main">Remera ' + c.top_color + ' + ' + c.bottom_type + ' ' + c.bottom_color + '</div>' +
      '<div class="card-meta"><b>Calzado recomendado:</b> ' + calzado + '</div>' +
      '<div class="card-meta"><b>Ocasión:</b> ' + c.occasion + '</div>' +
      '<div class="card-meta"><b>Clima:</b> ' + c.clima + '</div>' +
      '<div class="card-meta">' + tiempo + '</div>' +
      '<div class="chip-row"><span class="chip">' + c.top_type + '</span><span class="chip">' + c.bottom_type + '</span><span class="chip">' + c.top_color + '</span><span class="chip">' + c.bottom_color + '</span></div>' +
      '<button class="benefits-btn" data-index="' + idx + '">Ver beneficios del outfit</button>';
    resultados.appendChild(card);
  });
};

// ---- ABRIR DETALLE ----
TTI.buscador.abrirDetalle = function(index) {
  var c = TTI.datos.combos[index];
  if (!c) return;
  var el = TTI.buscador.el;
  el.detailTitle.textContent = 'Remera ' + c.top_color + ' + ' + c.bottom_type + ' ' + c.bottom_color;
  el.detailSummary.textContent = TTI.buscador.resumenConjunto(c);
  var topLink = (TTI.constantes.links[c.top_type] || {})[c.top_color];
  var bottomLink = (TTI.constantes.links[c.bottom_type] || {})[c.bottom_color];

  var topHTML = '<li class="detail-garment-item"><span class="detail-garment-name">' + c.top_type + ' ' + c.top_color + ':</span> <span class="detail-benefit-text">' + TTI.buscador.beneficioRemera(c.top_color) + '</span>';
  if (topLink) {
    topHTML += '<a href="' + topLink + '" class="btn-comprar">COMPRAR ONLINE</a>';
  }
  topHTML += '</li>';

  var bottomHTML = '<li class="detail-garment-item"><span class="detail-garment-name">' + c.bottom_type + ' ' + c.bottom_color + ':</span> <span class="detail-benefit-text">' + TTI.buscador.beneficioPantalon(c.bottom_type, c.bottom_color) + '</span>';
  if (bottomLink) {
    bottomHTML += '<a href="' + bottomLink + '" class="btn-comprar">COMPRAR ONLINE</a>';
  }
  bottomHTML += '</li>';

  el.detailList.innerHTML =
    topHTML +
    bottomHTML +
    '<li class="detail-garment-item"><span class="detail-garment-name">Outfit completo:</span> <span class="detail-benefit-text">' + TTI.buscador.beneficioConjunto(c) + '</span></li>' +
    '<li class="detail-tools">' +
      '<button class="detail-tool-btn" onclick="irATalleRemera()">Calcular mi talle de remera</button>' +
      '<button class="detail-tool-btn" onclick="irATalleJogger()">Calcular mi talle de jogger</button>' +
      '<button class="detail-tool-btn" onclick="irATalleBermuda()">Calcular mi talle de bermuda</button>' +
    '</li>';
  el.detailView.classList.remove('hidden');
  window.scrollTo(0, 0);
};

// ---- INICIAR ----
TTI.buscador.iniciar = function() {
  var el = TTI.buscador.el;
  el.tipoSelect = document.getElementById('tipoSelect');
  el.colorSelect = document.getElementById('colorSelect');
  el.ocasionSelect = document.getElementById('ocasionSelect');
  el.climaSelect = document.getElementById('climaSelect');
  el.searchInput = document.getElementById('searchInput');
  el.applyBtn = document.getElementById('applyBtn');
  el.results = document.getElementById('results');
  el.detailView = document.getElementById('detailView');
  el.detailBack = document.getElementById('detailBack');
  el.detailTitle = document.getElementById('detailTitle');
  el.detailSummary = document.getElementById('detailSummary');
  el.detailList = document.getElementById('detailList');

  el.tipoSelect.addEventListener('change', TTI.buscador.poblarColores);
  el.applyBtn.addEventListener('click', TTI.buscador.renderizar);
  el.detailBack.addEventListener('click', function() { el.detailView.classList.add('hidden'); });
  el.results.addEventListener('click', function(e) {
    var btn = e.target.closest('.benefits-btn');
    if (btn) TTI.buscador.abrirDetalle(Number(btn.getAttribute('data-index')));
  });

  TTI.buscador.poblarColores();
  TTI.buscador.renderizar();
};
