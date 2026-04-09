# Neura — Guía de estilos

Referencia de diseño para el proyecto Neura. Todo cambio visual debe validarse contra esta guía antes de aplicarse.

> **Contexto de uso:** La app está diseñada para personas con migraña activa. Cada decisión visual prioriza baja carga cognitiva, mínimo contraste agresivo y cero distracciones.

---

## Índice

1. [Principios de diseño](#1-principios-de-diseño)
2. [Paleta de colores](#2-paleta-de-colores)
3. [Tipografía](#3-tipografía)
4. [Tokens de diseño](#4-tokens-de-diseño)
5. [Jerarquía visual](#5-jerarquía-visual)
6. [Componentes](#6-componentes)
7. [Fondo decorativo](#7-fondo-decorativo)
8. [Espaciado y layout](#8-espaciado-y-layout)
9. [Interacciones y estados](#9-interacciones-y-estados)
10. [Restricciones estrictas](#10-restricciones-estrictas)
11. [Checklist antes de aplicar cambios](#11-checklist-antes-de-aplicar-cambios)

---

## 1. Principios de diseño

| Principio | Descripción |
|---|---|
| **Calmada** | Sin elementos que compitan por atención. Fondo oscuro, baja saturación. |
| **Enfocada** | Un solo CTA principal. El usuario no toma decisiones innecesarias. |
| **Con identidad** | Oscuridad con profundidad. Ondas, partículas y capas de superficie dan vida sin saturar. |
| **Accesible en crisis** | La UI debe funcionar bien con dolor de cabeza: fuente legible, contraste suficiente, botón grande. |

---

## 2. Paleta de colores

Estos son los **únicos colores permitidos**. No introducir tonos nuevos ni variaciones saturadas.

### Fondos

| Token | Hex | Uso |
|---|---|---|
| `--c-bg` | `#0f1319` | Fondo principal del shell |
| `--c-bg-alt` | `#0d111f` | Fondo profundo (final del gradiente) |

### Superficies

| Token | Hex | Uso |
|---|---|---|
| `--c-surface` | `#191f37` | Capa base (card, ondas) |
| `--c-surface-2` | `#282d51` | Capa media (botón base, separadores) |
| `--c-surface-3` | `#3c3c6d` | Capa alta (borde superior del botón, icono) |

### Texto

| Token | Hex | Uso |
|---|---|---|
| `--c-text` | `#c8cef0` | Texto general del body |
| `--c-text-muted` | `#808ab8` | Labels secundarios, subtítulos, footer |
| `--c-text-strong` | `#e8ebff` | Textos prominentes dentro del botón |

### Acento / Título

| Token | Hex | Uso |
|---|---|---|
| `--c-title` | `#7b87d4` | Título "Neura" y color del ícono CTA |

### Bordes

| Token | Valor | Uso |
|---|---|---|
| `--c-border` | `rgba(114, 128, 210, 0.22)` | Bordes sutiles de cards |

> El valor RGB `114, 128, 210` es la descomposición de `#7280d2`, derivada de la paleta de superficies. No introducir otros valores RGB para bordes.

---

## 3. Tipografía

**Fuente única:** `'Inter'`, con fallback `system-ui, -apple-system, 'Segoe UI', sans-serif`.

| Elemento | Size | Weight | Color |
|---|---|---|---|
| Título "Neura" | `3.2rem` | `500` | `var(--c-title)` |
| CTA principal | `1.45rem` | `600` | `var(--c-text-strong)` |
| CTA subtítulo | `0.88rem` | `400` | `var(--c-text-muted)` |
| Card label | `0.8rem` | `400` | `var(--c-text-muted)` |
| Card valor | `1rem` | `600` | `var(--c-text-strong)` |
| Subtítulo hero | `0.93rem` | `400` | `var(--c-text-muted)` |
| Footer privacy | `0.8rem` | `400` | `var(--c-text-muted)` |

**Reglas:**
- Pesos permitidos: `400`, `500`, `600` únicamente
- No usar `italic` ni `uppercase` en bloques de texto
- `letter-spacing: 1px` solo en el título "Neura"

---

## 4. Tokens de diseño

Definidos en `:root` dentro de `src/styles/index.css`.

```css
--r-shell: 36px   /* border-radius del contenedor principal (desktop) */
--r-btn:   56px   /* border-radius del botón CTA */
--r-card:  18px   /* border-radius de cards */
```

---

## 5. Jerarquía visual

El orden de prioridad visual **no debe modificarse**:

```
1. Botón "Tengo migraña"   ← máxima prioridad
2. Título "Neura"
3. Card "Última migraña"
4. Decoración (ondas, estrellas, footer)   ← mínima prioridad
```

El botón debe ser siempre el elemento más llamativo de la pantalla.

---

## 6. Componentes

### Shell (`.neura-shell`)

- `max-width: 390px` — simula pantalla de móvil
- `padding: 56px 28px 32px`
- Gradiente vertical: `--c-bg` → `--c-bg-alt`
- En desktop (`≥ 480px`): bordes redondeados `--r-shell` + sombra exterior `0 24px 64px rgba(0,0,0,0.7)`

### Hero (`.neura-hero`)

- Centrado horizontal
- Contiene: título, separador decorativo (`· ~~~ ·`), subtítulo
- El separador usa `--c-surface-3` con `opacity: 0.7–0.8`

### Título (`.neura-title`)

```css
font-size: 3.2rem;
font-weight: 500;
letter-spacing: 1px;
color: var(--c-title);   /* #7b87d4 */
opacity: 0.9;
```

### Botón CTA (`.migraine-cta`)

```css
min-height: 112px;
padding: 32px 24px 20px;
border-radius: var(--r-btn);        /* 56px */
border: 1px solid rgba(114, 128, 210, 0.35);
background: linear-gradient(160deg, --c-surface-3, --c-surface-2, --c-surface);
box-shadow:
  inset 0 1px 0 rgba(255, 255, 255, 0.06),
  0 12px 32px rgba(0, 0, 0, 0.45),
  0 0 25px rgba(60, 60, 109, 0.25);  /* presencia sutil */
```

- El ícono (`Zap` de lucide-react) flota sobre el borde superior en un círculo de `52×52px`
- `top: -26px` — mitad del círculo por encima del botón
- Color del ícono: `#c8d0f8` (derivado de `--c-text`)
- `strokeWidth: 2.2`

### Card "Última migraña" (`.last-migraine-card`)

```css
border-radius: var(--r-card);               /* 18px */
border: 1px solid rgba(114, 128, 210, 0.30);
background: rgba(25, 31, 55, 0.72);         /* --c-surface al 72% */
padding: 14px 16px;
```

- Íconos: `CalendarDays` y `ChevronRight` de lucide-react
- `strokeWidth: 1.5` para íconos informativos, `1.8` para el chevron
- Color del ícono: `--c-surface-3`

### Footer privacy (`.neura-privacy`)

- `margin-top: auto` — empujado al fondo del flex container
- `opacity: 0.75`
- Ícono: `ShieldCheck` 14px, `strokeWidth: 1.8`

---

## 7. Fondo decorativo

Implementado en `WaveBackground.tsx`. Es `aria-hidden="true"`, `pointer-events: none`, `z-index: 0`.

### Estrellas

- Máximo **10 puntos**
- Opacidad por punto: `0.10 – 0.18` (nunca superar `0.20`)
- Radios: `0.7 – 1.4px`
- Color: `white` implícito a opacidad muy baja
- Capa SVG estática, renderizada detrás de las ondas

### Ondas SVG

Tres capas apiladas, de atrás hacia adelante:

| Capa | Fill | Opacity | Descripción |
|---|---|---|---|
| Layer 1 | `#191f37` (`--c-surface`) | `0.65` | Swell profundo |
| Layer 2 | `#282d51` (`--c-surface-2`) | `0.45` | Ola media |
| Layer 3 | `#3c3c6d` (`--c-surface-3`) | `0.28` | Ondulación superficial |

- Altura del contenedor: `380px`
- Animación `wave-slide` desactivada por defecto; activar con variable de entorno `VITE_WAVE_ANIMATED=true`
- Respeta `prefers-reduced-motion`

---

## 8. Espaciado y layout

| Propiedad | Valor |
|---|---|
| Padding del shell | `56px 28px 32px` |
| Gap entre acciones | `18px` |
| Margin-top de acciones desde hero | `52px` |
| Max-width del shell | `390px` |

---

## 9. Interacciones y estados

### Botón CTA

| Estado | Efecto |
|---|---|
| `:hover` | `translateY(-1px)` + sombra ligeramente mayor |
| `:active` | `translateY(0)` — vuelve a posición base |
| `:focus-visible` | `outline: 2px solid rgba(114,128,210,0.7)`, `offset: 3px` |

- Transición: `0.18s ease` en `transform` y `box-shadow`
- No agregar transiciones de color, brillo ni escala

---

## 10. Restricciones estrictas

### No hacer

- Agregar nuevas secciones, componentes, textos o iconografía
- Cambiar el layout o la posición de cualquier elemento
- Introducir colores fuera de la paleta definida en esta guía
- Agregar gradientes llamativos, glow intenso o animaciones nuevas
- Usar `backdrop-filter`, `filter` u otros efectos CSS no contemplados
- Agregar navbar, menús, dashboards o tooltips

### Cambios permitidos

- Ajustes de opacidad dentro de rangos existentes
- Sombras suaves compuestas de colores de paleta
- Pequeños ajustes de contraste (border-opacity, background-opacity)
- Refinamiento conservador de `letter-spacing` o `line-height`

---

## 11. Checklist antes de aplicar cambios

Antes de cualquier modificación visual, responder **sí** a todas:

- [ ] ¿El cambio usa solo colores de la paleta definida?
- [ ] ¿El botón sigue siendo el elemento más prominente?
- [ ] ¿La UI sigue siendo calmada (sin sobrecarga sensorial)?
- [ ] ¿Se mantiene la identidad visual (profundidad, ondas, oscuridad)?
- [ ] ¿No se agregó ningún elemento nuevo (texto, ícono, sección)?
- [ ] ¿Pasa `npm run lint && npm run build` sin errores?

Si alguna respuesta es **no** → no aplicar.
