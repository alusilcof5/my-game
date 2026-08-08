# Brújula v11 — Sala accesible durante toda la sesión

## Corrección principal
La sala ya no redirige automáticamente al mapa cuando la sesión está iniciada. Esto permitía entrar a la sala al principio, pero hacía imposible volver a ella mediante `VER SALA`: al montar `/sala`, un efecto detectaba `sessionStarted` y devolvía inmediatamente a `/mapa`.

Ahora:
- `VER SALA` abre y mantiene `/sala`.
- La presencia realtime de Portal se muestra en la sala.
- `COMENZAR EXPERIENCIA` sigue llevando al mapa.
- `VOLVER AL MAPA` conserva el `roomId`.
- El `roomId` se conserva durante la navegación por las estaciones.
- React Router v7 future flags siguen activas.

## Ejecutar
```bash
npm install
npm run dev
```
