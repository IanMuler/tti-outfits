# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Descripción del proyecto

PWA de una marca de ropa masculina. Permite buscar combinaciones de outfits y calcular talles de remeras y joggers.

## Arquitectura

Proyecto vanilla HTML/CSS/JS sin build system. Usa patrón namespace (`TTI`) para comunicación entre módulos.

### Estructura de archivos

```
tti-outfits/
├── index.html              # Solo estructura HTML
├── manifest.json           # Manifest PWA
├── service-worker.js       # Cache offline (network-first)
├── data/
│   └── combos.json         # 67 combinaciones de outfits
├── css/
│   ├── base.css            # Variables, reset, layout, componentes
│   ├── bienvenida.css      # Pantalla de bienvenida
│   ├── buscador.css        # Hero, controles, tarjetas, detalle
│   └── talles.css          # Calculadoras de talle
├── js/
│   ├── app.js              # Namespace, carga datos, navegación, init
│   ├── buscador-outfits.js # Búsqueda, filtros, beneficios
│   └── calcular-talles.js  # Calculadoras remera y jogger
└── icons/
```

### Namespace

Todo se agrupa bajo el objeto global `TTI`:
- `TTI.datos` - Datos de combos
- `TTI.nav` - Navegación entre pantallas
- `TTI.buscador` - Buscador y beneficios
- `TTI.talles` - Calculadoras de talle
- `TTI.utils` - Utilidades compartidas

### Orden de carga de scripts

```html
<script src="js/app.js"></script>
<script src="js/buscador-outfits.js"></script>
<script src="js/calcular-talles.js"></script>
```

## Desarrollo

```bash
npx serve .
```

## Deploy

Vercel. Al actualizar cache, incrementar `CACHE_NAME` en `service-worker.js`.

### Service Worker (PWA)

Estrategia **network-first**: siempre busca en la red primero, el cache solo se usa cuando no hay conexión (offline).

- Garantiza que los usuarios siempre vean la última versión
- El cache sirve como fallback para modo offline
- Al hacer cambios, incrementar `CACHE_NAME` (ej: `v6` → `v7`)

---

## Reglas de organización del código

### Nombres de archivos
- **En español** para archivos específicos del proyecto
- Usar kebab-case: `buscador-outfits.js`, `calcular-talles.js`

### Tamaño de archivos
- **Máximo ~400 líneas** por archivo
- Si tiene sentido conceptual, puede exceder el límite

### Agrupación por concepto
- Agrupar funciones relacionadas en el mismo archivo
- Ejemplo: `calcular-talles.js` contiene tanto remera como jogger
- No separar en archivos solo por separar

### Principios aplicados

**Single Responsibility (SRP)**
- Cada archivo tiene una responsabilidad clara:
  - `app.js` → inicialización y navegación
  - `buscador-outfits.js` → búsqueda y visualización
  - `calcular-talles.js` → cálculo de talles

**Open/Closed (OCP)**
- Agregar nuevos colores/beneficios solo modifica `buscador-outfits.js`
- Agregar nuevos talles solo modifica `calcular-talles.js`

### CSS
- Agrupar estilos relacionados visualmente
- Usar comentarios de sección: `/* === NOMBRE === */`
- Variables CSS en `base.css`

### JavaScript
- Usar `var` para compatibilidad con navegadores antiguos
- No usar arrow functions
- Documentar módulos con comentario de cabecera
