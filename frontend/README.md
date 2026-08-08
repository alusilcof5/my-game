# Brújula — mapa + sala colaborativa de Bruix (v7)

Flujo: **Mapa → Bruix → Sala de trabajo (2–5 docentes) → Comenzar → Mapa + guía realtime**.

## Portal

La integración usa únicamente la superficie documentada de Portal: `PortalProvider`, `useChannel({ channelId, history })`, `messages`, `send`, `presence` y `status`.

1. `npm install @portalsdk/core @portalsdk/react`
2. Crea `.env` con `VITE_PORTAL_API_KEY=pk_...`
3. `npm run dev`

Portal ofrece modo anónimo sin backend y una identidad anónima estable por navegador. La presencia detallada expone `participants` con ids únicos. La membresía y los límites estrictos de acceso son responsabilidad server-side en `portal.config.ts`; esta versión aplica el límite 2–5 en la experiencia cliente.

## Bruix como facilitador

Al comenzar la sala, Bruix abre una secuencia colaborativa:
- ronda de observaciones individuales;
- contraste entre las miradas;
- decisión compartida;
- acompañamiento al pasar de estación;
- cierre con evidencias.

Solo un participante actúa como anfitrión de Bruix para evitar mensajes duplicados.

## Estabilidad

La configuración de `useChannel` se mantiene deliberadamente mínima y estable. No se pasa metadata mutable ni callbacks recreados al hook, evitando ciclos de suscripción/renderizado.
