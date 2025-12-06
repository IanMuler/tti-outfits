/* =============================================
   CONSTANTES - Datos fijos de la aplicación
   ============================================= */

TTI.constantes = {
  // ---- BENEFICIOS ----
  beneficios: {
    remera: {
      "Negra": "La remera negra estiliza, aporta presencia y suma una formalidad madura sin exagerar.",
      "Blanca": "La remera blanca aporta limpieza visual, contraste y una sensación de frescura prolija.",
      "Gris Melange": "La remera gris melange suma suavidad y textura discreta, ideal para un look relajado pero prolijo.",
      "Arena": "La remera arena aporta calidez y luz, manteniendo un tono sobrio y fácil de combinar.",
      "Gris Topo": "La remera gris topo genera profundidad y un aire más sofisticado, perfecta para un estilo maduro.",
      "Verde": "La remera verde suma un toque de color sobrio, con personalidad pero sin estridencias.",
      "Azul": "La remera azul aporta un punto de color clásico, asociado a calma, confianza y presencia.",
      "Borravino": "La remera borravino aporta carácter y presencia madura, destacando sin volverse llamativa.",
      "default": "La remera aporta estructura y protagonismo a la parte superior, marcando el estilo del outfit."
    },
    pantalonBase: {
      "Jogger Cargo": "El jogger cargo suma estructura y un aire urbano prolijo, sin perder comodidad.",
      "Jogger Liso": "El jogger liso mantiene la línea limpia y prolija, ideal para contextos donde querés verte bien sin rigidez.",
      "Bermuda": "La bermuda relaja el outfit y lo lleva a un clima de verano y aire libre, manteniendo presencia sin exceso.",
      "default": "La parte inferior acompaña con comodidad y una línea visual prolija."
    },
    pantalonMatiz: {
      "Beige Claro": " El tono beige ilumina el conjunto y aporta calidez, equilibrando la parte superior.",
      "Beige": " El tono beige ilumina el conjunto y aporta calidez, equilibrando la parte superior.",
      "Negro": " El negro ancla el look, estiliza la pierna y suma un plus de formalidad.",
      "Gris": " El gris equilibra el conjunto y baja el contraste, dejando todo más armónico.",
      "Verde": " El verde aporta un toque de color sobrio que acompaña sin recargar."
    },
    conjuntoBase: {
      "Oficina/Facultad": "El conjunto completa un outfit prolijo y maduro, ideal para oficina o facultad sin perder comodidad.",
      "Urbano": "El resultado es un look urbano prolijo, perfecto para café, paseo o encuentros casuales.",
      "Verano": "El outfit acompaña bien el clima de verano y los momentos al aire libre, manteniendo prolijidad y presencia.",
      "Ciudad": "El conjunto funciona muy bien en la ciudad, after o salida relajada, con presencia sin exagerar."
    },
    conjuntoTiempo: {
      "día": " Pensado principalmente para el día, con luz y presencia equilibradas.",
      "noche": " Funciona especialmente bien de noche, aportando profundidad y presencia madura.",
      "default": " Se adapta tanto de día como de noche, sin desentonar en ninguno de los dos contextos."
    }
  },

  // ---- TALLES ----
  talles: {
    remera: {
      orden: ["M", "L", "XL", "XXL"],
      rangos: {
        min: 47,
        max: 62,
        M: 52.5,
        L: 55,
        XL: 58
      }
    },
    jogger: [
      { talle: "42", cinturaMin: 86, cinturaMax: 93 },
      { talle: "44", cinturaMin: 90, cinturaMax: 97 },
      { talle: "46", cinturaMin: 94, cinturaMax: 101 },
      { talle: "48", cinturaMin: 98, cinturaMax: 105 },
      { talle: "50", cinturaMin: 102, cinturaMax: 109 }
    ],
    bermuda: [
      { talle: 42, cintura: 84, tiro: 27.5, largo: 46 },
      { talle: 44, cintura: 88, tiro: 28, largo: 47 },
      { talle: 46, cintura: 92, tiro: 28.5, largo: 47 },
      { talle: 48, cintura: 96, tiro: 29, largo: 49 },
      { talle: 50, cintura: 110, tiro: 29.5, largo: 51 }
    ]
  }
};
