/* =============================================
   CALCULAR TALLES - Remera y Jogger
   ============================================= */

// ---- REMERA ----
TTI.talles.remera = {
  orden: ["M", "L", "XL", "XXL"],

  sugerir: function(ancho) {
    if (ancho < 47 || ancho > 62) return "OUT";
    if (ancho <= 52.5) return "M";
    if (ancho <= 55) return "L";
    if (ancho <= 58) return "XL";
    return "XXL";
  },

  vecinoMenos: function(t) {
    var i = this.orden.indexOf(t);
    return i > 0 ? this.orden[i - 1] : t;
  },

  vecinoMas: function(t) {
    var i = this.orden.indexOf(t);
    return i < this.orden.length - 1 ? this.orden[i + 1] : t;
  },

  iniciar: function() {
    var self = this;
    var btn = document.getElementById('btnCalcularTalle');
    if (!btn) return;

    btn.addEventListener('click', function() {
      var ancho = parseFloat(document.getElementById('anchoInput').value);
      var errorBox = document.getElementById('talleError');
      var resBox = document.getElementById('talleResultado');

      errorBox.style.display = 'none';
      resBox.style.display = 'none';

      if (isNaN(ancho)) {
        alert('Ingresá el ancho en centímetros.');
        return;
      }

      var t = self.sugerir(ancho);
      if (t === "OUT") {
        errorBox.style.display = 'block';
        return;
      }

      document.getElementById('talleSugerido').innerText = t;
      document.getElementById('talleTexto').innerText = 'Corte medio clásico: comodidad, presencia limpia y calce prolijo.';

      var recom = '';
      var tMenos = self.vecinoMenos(t);
      var tMas = self.vecinoMas(t);
      if (tMenos !== t) recom += 'Más entallado: ' + tMenos + '. ';
      if (tMas !== t) recom += 'Más suelto: ' + tMas + '.';
      document.getElementById('talleRecom').innerText = recom;

      resBox.style.display = 'block';
    });
  }
};

// ---- JOGGER ----
TTI.talles.jogger = {
  tabla: [
    { talle: "42", cinturaMin: 86, cinturaMax: 93 },
    { talle: "44", cinturaMin: 90, cinturaMax: 97 },
    { talle: "46", cinturaMin: 94, cinturaMax: 101 },
    { talle: "48", cinturaMin: 98, cinturaMax: 105 },
    { talle: "50", cinturaMin: 102, cinturaMax: 109 }
  ],

  el: {},

  limpiar: function() {
    this.el.errorBox.style.display = "none";
    this.el.resultBox.style.display = "none";
  },

  calcular: function() {
    var self = this;
    self.limpiar();

    var cPlano = parseFloat((self.el.cinturaInput.value || "").replace(",", "."));

    if (isNaN(cPlano)) {
      self.el.errorBox.style.display = "block";
      self.el.errorBox.textContent = "Ingresá la medida de cintura.";
      return;
    }

    var cinturaTotal = cPlano * 2;
    var min = self.tabla[0].cinturaMin;
    var max = self.tabla[self.tabla.length - 1].cinturaMax;

    if (cinturaTotal < min || cinturaTotal > max) {
      self.el.errorBox.style.display = "block";
      self.el.errorBox.textContent = "Cintura " + cinturaTotal.toFixed(1) + " cm fuera de rango. Escribinos por WhatsApp.";
      return;
    }

    var talleBase = self.tabla[0];
    var idxBase = 0;
    for (var i = 0; i < self.tabla.length; i++) {
      if (cinturaTotal >= self.tabla[i].cinturaMin && cinturaTotal <= self.tabla[i].cinturaMax) {
        talleBase = self.tabla[i];
        idxBase = i;
        break;
      }
    }

    self.el.resultMain.textContent = talleBase.talle;

    var tiroTxt = self.el.tiroInput.value ? "Tiro: " + self.el.tiroInput.value + " cm. " : "";
    var largoTxt = self.el.largoInput.value ? "Largo: " + self.el.largoInput.value + " cm." : "";

    self.el.resultTexto.innerHTML =
      "Cintura " + cPlano.toFixed(1) + " cm en plano (≈" + cinturaTotal.toFixed(1) + " cm contorno). " +
      "Talle recomendado: <strong>" + talleBase.talle + "</strong>.<br>" +
      (tiroTxt || largoTxt ? "<br>" + tiroTxt + largoTxt : "");

    var recom = "";
    if (idxBase > 0) recom += "Más ajustado: talle " + self.tabla[idxBase - 1].talle + ". ";
    if (idxBase < self.tabla.length - 1) recom += "Más suelto: talle " + self.tabla[idxBase + 1].talle + ".";
    self.el.resultRecom.textContent = recom;

    self.el.resultBox.style.display = "block";
  },

  iniciar: function() {
    var self = this;
    self.el.cinturaInput = document.getElementById("cinturaJoggerInput");
    self.el.tiroInput = document.getElementById("tiroJoggerInput");
    self.el.largoInput = document.getElementById("largoJoggerInput");
    self.el.btnCalcular = document.getElementById("btnCalcularTalleJogger");
    self.el.btnLimpiar = document.getElementById("btnLimpiarTalleJogger");
    self.el.errorBox = document.getElementById("talleJoggerError");
    self.el.resultBox = document.getElementById("talleJoggerResultado");
    self.el.resultMain = document.getElementById("talleJoggerSugerido");
    self.el.resultTexto = document.getElementById("talleJoggerTexto");
    self.el.resultRecom = document.getElementById("talleJoggerRecom");

    if (!self.el.cinturaInput || !self.el.btnCalcular) return;

    self.el.btnCalcular.addEventListener("click", function() { self.calcular(); });
    self.el.btnLimpiar.addEventListener("click", function() {
      self.el.cinturaInput.value = "";
      self.el.tiroInput.value = "";
      self.el.largoInput.value = "";
      self.limpiar();
    });
  }
};

// ---- BERMUDA ----
TTI.talles.bermuda = {
  tabla: [
    { talle: 42, cintura: 84, tiro: 27.5, largo: 46 },
    { talle: 44, cintura: 88, tiro: 28, largo: 47 },
    { talle: 46, cintura: 92, tiro: 28.5, largo: 47 },
    { talle: 48, cintura: 96, tiro: 29, largo: 49 },
    { talle: 50, cintura: 110, tiro: 29.5, largo: 51 }
  ],

  el: {},

  limpiar: function() {
    this.el.errorBox.style.display = "none";
    this.el.resultMain.textContent = "Esperando tus medidas";
    this.el.resultTexto.textContent = "Calculamos tu talle en función de la cintura y del calce real de nuestras bermudas.";
    this.el.resultDetalle.textContent = "Nuestras bermudas corte chino están pensadas para un calce limpio y cómodo, sin quedar ni demasiado sueltas ni apretadas.";
  },

  calcular: function() {
    var self = this;
    self.el.errorBox.style.display = "none";

    var cPlano = parseFloat((self.el.cinturaInput.value || "").replace(",", "."));

    if (isNaN(cPlano)) {
      self.el.errorBox.textContent = "Necesitamos la medida de cintura para poder sugerir un talle.";
      self.el.errorBox.style.display = "block";
      return;
    }

    var cinturaTotal = cPlano * 2;
    var globalMin = self.tabla[0].cintura - 2;
    var globalMax = self.tabla[self.tabla.length - 1].cintura + 2;

    if (cinturaTotal < globalMin || cinturaTotal > globalMax) {
      self.el.errorBox.textContent = "Las medidas cargadas quedan por fuera de nuestra curva de talles. Escribinos y te asesoramos.";
      self.el.errorBox.style.display = "block";
      self.limpiar();
      return;
    }

    // Buscar el talle más cercano
    var mejor = self.tabla[0];
    var mejorDiff = Math.abs(cinturaTotal - mejor.cintura);

    for (var i = 0; i < self.tabla.length; i++) {
      var diff = Math.abs(cinturaTotal - self.tabla[i].cintura);
      if (diff < mejorDiff) {
        mejor = self.tabla[i];
        mejorDiff = diff;
      }
    }

    self.el.resultMain.textContent = "Talle " + mejor.talle;
    self.el.resultTexto.textContent =
      "Según las medidas cargadas, el talle sugerido en nuestras bermudas corte chino es el " + mejor.talle + ". " +
      "Buscamos un calce firme, prolijo y cómodo, con presencia adulta limpia y equilibrada.";

    var detalle = "Referencia técnica TETELESTAI para el talle " + mejor.talle + ": cintura aproximada " + mejor.cintura + " cm, " +
      "tiro " + mejor.tiro + " cm y largo " + mejor.largo + " cm. ";

    if (self.el.tiroInput.value || self.el.largoInput.value) {
      detalle += "Usamos la cintura como eje principal y el tiro/largo como apoyo para acercarnos a tu calce ideal.";
    } else {
      detalle += "Si podés, medí también tiro y largo para tener una referencia aún más precisa.";
    }

    detalle += " Los valores pueden variar unos milímetros según la partida, pero siempre dentro del estándar TETELESTAI.";

    self.el.resultDetalle.textContent = detalle;
  },

  iniciar: function() {
    var self = this;
    self.el.cinturaInput = document.getElementById("cinturaBermudaInput");
    self.el.tiroInput = document.getElementById("tiroBermudaInput");
    self.el.largoInput = document.getElementById("largoBermudaInput");
    self.el.btnCalcular = document.getElementById("btnCalcularTalleBermuda");
    self.el.btnLimpiar = document.getElementById("btnLimpiarTalleBermuda");
    self.el.btnGuia = document.getElementById("guiaBtnBermuda");
    self.el.errorBox = document.getElementById("talleBermudaError");
    self.el.resultMain = document.getElementById("talleBermudaResultado");
    self.el.resultTexto = document.getElementById("talleBermudaMensaje");
    self.el.resultDetalle = document.getElementById("talleBermudaDetalle");

    if (!self.el.cinturaInput || !self.el.btnCalcular) return;

    self.el.btnCalcular.addEventListener("click", function() { self.calcular(); });
    self.el.btnLimpiar.addEventListener("click", function() {
      self.el.cinturaInput.value = "";
      self.el.tiroInput.value = "";
      self.el.largoInput.value = "";
      self.limpiar();
    });
    self.el.btnGuia.addEventListener("click", function() {
      window.open("https://wa.me/p/25334997052832175/5491157365177", "_blank");
    });
  }
};

// ---- INICIAR TODOS ----
TTI.talles.iniciar = function() {
  TTI.talles.remera.iniciar();
  TTI.talles.jogger.iniciar();
  TTI.talles.bermuda.iniciar();
};
