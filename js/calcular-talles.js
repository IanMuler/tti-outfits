/* =============================================
   CALCULAR TALLES - Lógica central de reparación
   ============================================= */

var TTI = TTI || {};
TTI.talles = TTI.talles || {};

// Auxiliar para validación y limpieza de inputs
TTI.talles.validarInput = function(valor) {
  if (!valor) return null;
  var num = parseFloat(valor.toString().replace(",", "."));
  if (isNaN(num) || num <= 0) return null;
  return num;
};

// ---- REMERA ----
TTI.talles.remera = {
  sugerir: function(ancho) {
    var rangos = TTI.constantes.talles.remera.rangos;
    if (ancho < rangos.min || ancho > rangos.max) return "OUT";
    if (ancho <= rangos.M) return "M";
    if (ancho <= rangos.L) return "L";
    if (ancho <= rangos.XL) return "XL";
    return "XXL";
  },

  iniciar: function() {
    var self = this;
    var btn = document.getElementById('btnCalcularTalle');
    if (!btn) return;

    // Eliminar listeners previos para evitar duplicados
    var newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);

    newBtn.addEventListener('click', function(e) {
      e.preventDefault();
      var anchoRaw = document.getElementById('anchoInput').value;
      var ancho = TTI.talles.validarInput(anchoRaw);
      
      var errorBox = document.getElementById('talleError');
      var resBox = document.getElementById('talleResultado');

      if (ancho === null) {
        alert('Por favor, ingresá un ancho válido (ej: 54).');
        return;
      }

      var t = self.sugerir(ancho);
      if (t === "OUT") {
        resBox.style.display = 'none';
        errorBox.style.display = 'block';
        return;
      }

      errorBox.style.display = 'none';
      document.getElementById('talleSugerido').innerText = t;
      
      // Lógica de talle alternativo (más al cuerpo)
      var orden = TTI.constantes.talles.remera.orden;
      var i = orden.indexOf(t);
      var altCont = document.getElementById('talleAlternativoCont');
      var altVal = document.getElementById('talleSugeridoMenor');
      
      if (i > 0) {
        altVal.innerText = orden[i-1];
        altCont.style.display = 'block';
      } else {
        altCont.style.display = 'none';
      }

      resBox.style.display = 'block';
      resBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });

    // Botón borrar datos remera
    var btnClear = document.getElementById('btnLimpiarTalleRemera');
    if (btnClear) {
      btnClear.addEventListener('click', function() {
        document.getElementById('anchoInput').value = '';
        document.getElementById('largoInput').value = '';
        document.getElementById('talleError').style.display = 'none';
        document.getElementById('talleResultado').style.display = 'none';
      });
    }
  }
};

// ---- JOGGER ----
TTI.talles.jogger = {
  iniciar: function() {
    var btn = document.getElementById("btnCalcularTalleJogger");
    if (!btn) return;

    var newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);

    newBtn.addEventListener("click", function(e) {
      e.preventDefault();
      var tabla = TTI.constantes.talles.jogger;
      var cPlano = TTI.talles.validarInput(document.getElementById("cinturaJoggerInput").value);
      var errorBox = document.getElementById("talleJoggerError");
      var resBox = document.getElementById("talleJoggerResultado");

      if (cPlano === null) {
        alert("Ingresá la medida de cintura en plano.");
        return;
      }

      var cinturaTotal = cPlano * 2;
      var min = tabla[0].cinturaMin;
      var max = tabla[tabla.length - 1].cinturaMax;

      if (cinturaTotal < min || cinturaTotal > max) {
        resBox.style.display = "none";
        errorBox.style.display = "block";
        errorBox.textContent = "Medidas fuera de rango. Escribinos y te asesoramos.";
        return;
      }

      errorBox.style.display = "none";
      var talleBase = tabla[0];
      var idx = 0;
      for (var i = 0; i < tabla.length; i++) {
        if (cinturaTotal >= tabla[i].cinturaMin && cinturaTotal <= tabla[i].cinturaMax) {
          talleBase = tabla[i];
          idx = i;
          break;
        }
      }

      var formatearNum = function(n) {
        return Number.isInteger(n) ? n.toString() : n.toFixed(1).replace(".0", "");
      };

      document.getElementById("talleJoggerSugerido").textContent = talleBase.talle;
      document.getElementById("talleJoggerMedidas").innerHTML = 
        "La medida que ingresaste es de <span class='result-premium-highlight'>" + formatearNum(cPlano) + " cm</span> de cintura en plano, equivalente aproximadamente a <span class='result-premium-highlight'>" + formatearNum(cinturaTotal) + " cm</span> de contorno.";
      
      var altCont = document.getElementById("talleJoggerAlternativoCont");
      var altVal = document.getElementById("talleJoggerSugeridoMayor");
      
      if (idx < tabla.length - 1) {
        altVal.textContent = "talle " + tabla[idx + 1].talle;
        altCont.style.display = "block";
      } else {
        altCont.style.display = "none";
      }

      resBox.style.display = "block";
      resBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });

    // Botón borrar datos jogger
    var btnClear = document.getElementById("btnLimpiarTalleJogger");
    if (btnClear) {
      btnClear.addEventListener("click", function() {
        document.getElementById("cinturaJoggerInput").value = "";
        document.getElementById("tiroJoggerInput").value = "";
        document.getElementById("largoJoggerInput").value = "";
        document.getElementById("talleJoggerError").style.display = "none";
        document.getElementById("talleJoggerResultado").style.display = "none";
      });
    }
  }
};

// ---- BERMUDA ----
TTI.talles.bermuda = {
  iniciar: function() {
    var btn = document.getElementById("btnCalcularTalleBermuda");
    if (!btn) return;

    var newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);

    newBtn.addEventListener("click", function(e) {
      e.preventDefault();
      var tabla = TTI.constantes.talles.bermuda;
      var cPlano = TTI.talles.validarInput(document.getElementById("cinturaBermudaInput").value);
      var errorBox = document.getElementById("talleBermudaError");
      var resBox = document.getElementById("talleBermudaResultadoPremium");

      if (cPlano === null) {
        alert("Necesitamos la medida de cintura.");
        return;
      }

      var cinturaTotal = cPlano * 2;
      var globalMin = tabla[0].cintura - 3;
      var globalMax = tabla[tabla.length - 1].cintura + 3;

      if (cinturaTotal < globalMin || cinturaTotal > globalMax) {
        errorBox.textContent = "Medidas fuera de curva. Escribinos para asesorarte.";
        errorBox.style.display = "block";
        resBox.style.display = "none";
        return;
      }

      errorBox.style.display = "none";
      var mejor = tabla[0];
      var idx = 0;
      var mejorDiff = Math.abs(cinturaTotal - mejor.cintura);
      for (var i = 0; i < tabla.length; i++) {
        var diff = Math.abs(cinturaTotal - tabla[i].cintura);
        if (diff < mejorDiff) {
          mejor = tabla[i];
          mejorDiff = diff;
          idx = i;
        }
      }

      var formatearNum = function(n) {
        return Number.isInteger(n) ? n.toString() : n.toFixed(1).replace(".0", "");
      };

      document.getElementById("talleBermudaSugerido").textContent = mejor.talle;
      document.getElementById("talleBermudaInfoMedida").textContent = 
        "La medida que ingresaste corresponde aproximadamente a una cintura de " + formatearNum(cinturaTotal) + " cm de contorno.";

      var altCont = document.getElementById("talleBermudaAlternativoCont");
      var altVal = document.getElementById("talleBermudaSugeridoMayor");
      
      if (idx < tabla.length - 1) {
        altVal.textContent = "talle " + tabla[idx + 1].talle;
        altCont.style.display = "block";
      } else {
        altCont.style.display = "none";
      }

      resBox.style.display = "block";
      resBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });

    // Botón borrar datos bermuda
    var btnClear = document.getElementById("btnLimpiarTalleBermuda");
    if (btnClear) {
      btnClear.addEventListener("click", function() {
        document.getElementById("cinturaBermudaInput").value = "";
        document.getElementById("tiroBermudaInput").value = "";
        document.getElementById("largoBermudaInput").value = "";
        document.getElementById("talleBermudaError").style.display = "none";
        document.getElementById("talleBermudaResultadoPremium").style.display = "none";
      });
    }
  }
};

TTI.talles.iniciar = function() {
  TTI.talles.remera.iniciar();
  TTI.talles.jogger.iniciar();
  TTI.talles.bermuda.iniciar();
};