import { Suspense, lazy, useEffect } from "react";
import { HashRouter, Navigate, Route, Routes, useLocation, useSearchParams } from "react-router-dom";
import { GameStateProvider } from "./state/gameState";
import RequireZone from "./components/RequireZone";
import RealtimeProvider from "./components/realtime/RealtimeProvider";
import MapScreen from "./screens/MapScreen";
import RoomLobby from "./screens/RoomLobby";
import RoomChat from "./components/realtime/RoomChat";
import RealtimeErrorBoundary from "./components/realtime/RealtimeErrorBoundary";
import { useRealtimeRoom } from "./components/realtime/RealtimeProvider";

const MissionExplorar = lazy(() => import("./screens/MissionExplorar"));
const MissionOrientar = lazy(() => import("./screens/MissionOrientar"));
const MissionActuar = lazy(() => import("./screens/MissionActuar"));
const MissionAcompanar = lazy(() => import("./screens/MissionAcompanar"));
const MissionCompartir = lazy(() => import("./screens/MissionCompartir"));
const CuadernoScreen = lazy(() => import("./screens/CuadernoScreen"));
const CompletadoScreen = lazy(() => import("./screens/CompletadoScreen"));
const DataStationScreen = lazy(() => import("./screens/DataStationScreen"));

function RouteFallback() { return <div className="app-shell" aria-hidden="true" />; }

const ACTIVE_ROOM_KEY = "brujula:active-room:v1";

function CollaborationSurface({ children, showOnRoom }) {
  const { sessionStarted } = useRealtimeRoom();
  return (
    <>
      {children}
      {(showOnRoom || sessionStarted) && (
        <RealtimeErrorBoundary><RoomChat /></RealtimeErrorBoundary>
      )}
    </>
  );
}

function AppShell() {
  const [params] = useSearchParams();
  const roomFromUrl = params.get("room");
  const location = useLocation();

  // Keep the collaboration room stable while the user navigates through
  // stations. Mission screens historically used navigate("/mapa") etc.
  // without carrying the query string, which silently remounted the whole
  // realtime provider on the second station. The active room now survives
  // route changes within this browser tab.
  useEffect(() => {
    if (roomFromUrl) window.sessionStorage.setItem(ACTIVE_ROOM_KEY, roomFromUrl);
  }, [roomFromUrl]);

  const activeRoom = roomFromUrl || window.sessionStorage.getItem(ACTIVE_ROOM_KEY) || "local";

  return (
    <GameStateProvider key={activeRoom} roomId={activeRoom}>
      <RealtimeProvider roomId={`brujula-${activeRoom.toLowerCase()}`}>
        <Suspense fallback={<RouteFallback />}>
          <CollaborationSurface showOnRoom={location.pathname === "/sala"}>
            <Routes>
              <Route path="/" element={<Navigate to="/mapa" replace />} />
              <Route path="/sala" element={<RoomLobby />} />
              <Route path="/mapa" element={<MapScreen />} />
              <Route path="/mision/explorar" element={<RequireZone zone="explorar"><MissionExplorar /></RequireZone>} />
              <Route path="/mision/orientar" element={<RequireZone zone="orientar"><MissionOrientar /></RequireZone>} />
              <Route path="/mision/actuar" element={<RequireZone zone="actuar"><MissionActuar /></RequireZone>} />
              <Route path="/mision/acompanar" element={<RequireZone zone="acompanar"><MissionAcompanar /></RequireZone>} />
              <Route path="/mision/compartir" element={<RequireZone zone="compartir"><MissionCompartir /></RequireZone>} />
              <Route path="/cuaderno" element={<CuadernoScreen />} />
              <Route path="/data-station" element={<DataStationScreen />} />
              <Route path="/completado" element={<CompletadoScreen />} />
              <Route path="*" element={<Navigate to="/mapa" replace />} />
            </Routes>
          </CollaborationSurface>
        </Suspense>
      </RealtimeProvider>
    </GameStateProvider>
  );
}

export default function App() {
  return <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><AppShell /></HashRouter>;
}
