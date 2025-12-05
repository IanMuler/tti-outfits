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

// ---- BENEFICIOS ----
TTI.buscador.beneficioRemera = function(color) {
  var textos = {
    "Negra": "La remera negra estiliza, aporta presencia y suma una formalidad madura sin exagerar.",
    "Blanca": "La remera blanca aporta limpieza visual, contraste y una sensación de frescura prolija.",
    "Gris Melange": "La remera gris melange suma suavidad y textura discreta, ideal para un look relajado pero prolijo.",
    "Arena": "La remera arena aporta calidez y luz, manteniendo un tono sobrio y fácil de combinar.",
    "Gris Topo": "La remera gris topo genera profundidad y un aire más sofisticado, perfecta para un estilo maduro.",
    "Verde": "La remera verde suma un toque de color sobrio, con personalidad pero sin estridencias.",
    "Azul": "La remera azul aporta un punto de color clásico, asociado a calma, confianza y presencia.",
    "Borravino": "La remera borravino aporta carácter y presencia madura, destacando sin volverse llamativa."
  };
  return textos[color] || "La remera aporta estructura y protagonismo a la parte superior.";
};

TTI.buscador.beneficioPantalon = function(tipo, color) {
  var base = {
    "Jogger Cargo": "El jogger cargo suma estructura y un aire urbano prolijo, sin perder comodidad.",
    "Jogger Liso": "El jogger liso mantiene la línea limpia y prolija, ideal para contextos donde querés verte bien sin rigidez.",
    "Bermuda": "La bermuda relaja el outfit y lo lleva a un clima de verano y aire libre, manteniendo presencia sin exceso."
  };
  var matiz = {
    "Beige Claro": " El tono beige ilumina el conjunto y aporta calidez, equilibrando la parte superior.",
    "Beige": " El tono beige ilumina el conjunto y aporta calidez, equilibrando la parte superior.",
    "Negro": " El negro ancla el look, estiliza la pierna y suma un plus de formalidad.",
    "Gris": " El gris equilibra el conjunto y baja el contraste, dejando todo más armónico.",
    "Verde": " El verde aporta un toque de color sobrio que acompaña sin recargar."
  };
  return (base[tipo] || "La parte inferior acompaña con comodidad.") + (matiz[color] || "");
};

TTI.buscador.beneficioConjunto = function(c) {
  var ocNorm = TTI.utils.normalizarOcasion(c.occasion);
  var bases = {
    "Oficina/Facultad": "El conjunto completa un outfit prolijo y maduro, ideal para oficina o facultad sin perder comodidad.",
    "Urbano": "El resultado es un look urbano prolijo, perfecto para café, paseo o encuentros casuales.",
    "Verano": "El outfit acompaña bien el clima de verano y los momentos al aire libre, manteniendo prolijidad y presencia.",
    "Ciudad": "El conjunto funciona muy bien en la ciudad, after o salida relajada, con presencia sin exagerar."
  };
  var tiempos = {
    "día": " Pensado principalmente para el día, con luz y presencia equilibradas.",
    "noche": " Funciona especialmente bien de noche, aportando profundidad y presencia madura."
  };
  return (bases[ocNorm] || bases["Ciudad"]) + (tiempos[c.time_of_day] || " Se adapta tanto de día como de noche.");
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
  var colores = {};
  TTI.datos.combos.forEach(function(c) {
    if (tipo === 'todos') {
      colores[c.top_color] = true;
      colores[c.bottom_color] = true;
    } else if (tipo === 'Remera') {
      colores[c.top_color] = true;
    } else if (tipo === c.bottom_type) {
      colores[c.bottom_color] = true;
    }
  });
  var sel = TTI.buscador.el.colorSelect;
  sel.innerHTML = '<option value="todos">Color: Todos</option>';
  Object.keys(colores).sort().forEach(function(col) {
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
    card.innerHTML =
      '<div class="card-top">' + c.top_type + ' · ' + c.bottom_type + '</div>' +
      '<div class="card-main">Remera ' + c.top_color + ' + ' + c.bottom_type + ' ' + c.bottom_color + '</div>' +
      '<div class="card-meta"><b>Calzado recomendado:</b> ' + c.footwear + '</div>' +
      '<div class="card-meta"><b>Ocasión:</b> ' + c.occasion + '</div>' +
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
  el.detailList.innerHTML =
    '<li><b>Parte superior:</b> ' + TTI.buscador.beneficioRemera(c.top_color) + '</li>' +
    '<li><b>Parte inferior:</b> ' + TTI.buscador.beneficioPantalon(c.bottom_type, c.bottom_color) + '</li>' +
    '<li><b>Outfit completo:</b> ' + TTI.buscador.beneficioConjunto(c) + '</li>' +
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
