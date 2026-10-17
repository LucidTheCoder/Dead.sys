import { useEffect, useRef, useState } from 'react';
import AmbientEffects, { createAmbientEvent, getAmbientStage } from './AmbientEffects';
import {
  getDebugPuzzleSolution,
  resetPuzzleProgress,
  solvePuzzleForDebug,
} from './debugTools';
import {
  advancePuzzleHint,
  buildCaseReport,
  buildInitialGameState,
  evidenceById,
  evidenceRecords,
  fileRecordDetails,
  getDiscoveredEvidence,
  getPuzzleById,
  isPuzzleUnlocked,
  migrateGameState,
  puzzleDefinitions,
  recordCommand,
  recordRecentDocument,
  sortEvidenceTimeline,
  shellApps,
  submitPuzzleAnswer,
  validateSave,
} from './gameData';

const STORAGE_KEY = 'deadsys-save-v1';
const DEBUG_MODE = new URLSearchParams(window.location.search).get('debug') === '1';
const DEBUG_EVENT_TYPES = [
  ['tear', 'Horizontal tearing'],
  ['blocks', 'Corrupted pixel blocks'],
  ['image', 'Image corruption'],
  ['channel', 'Colour-channel shift'],
  ['stutter', 'Frame stutter'],
  ['scanline', 'Scanline disturbance'],
  ['flicker', 'Desktop flicker'],
  ['eyes', 'Pixelated eyes'],
  ['impossible', 'Impossible frame'],
];
const EVIDENCE_TABS = [
  ['map', 'Relationship Map'],
  ['timeline', 'Timeline'],
  ['report', 'Case Report'],
];
const motionIsReduced = (setting) => setting || (
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
);

const getSavedState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const valid = validateSave(parsed);
    if (!valid) {
      console.error('Ignoring an invalid DEAD.SYS save; starting a new archive.');
      return null;
    }
    const migrated = migrateGameState(valid);
    const windows = Array.isArray(valid.windows)
      ? valid.windows.filter((entry) => entry && defaultWindowMap[entry.appId]).map((entry) => ({
        ...entry,
        ...(entry.appId === 'remember' ? { title: 'Local Archive' } : {}),
        animationState: '',
        dragging: false,
      }))
      : migrated.windows;
    return {
      ...migrated,
      windows,
      activeWindowId: windows.some((entry) => entry.id === valid.activeWindowId)
        ? valid.activeWindowId
        : windows.at(-1)?.id ?? null,
    };
  } catch {
    console.error('Unable to read DEAD.SYS save; starting a new archive.');
    return null;
  }
};

const makeWindow = (appId, title, overrides = {}) => ({
  id: `${appId}-${Math.random().toString(36).slice(2, 8)}`,
  appId,
  title,
  x: 90 + Math.random() * 40,
  y: 80 + Math.random() * 40,
  width: overrides.width ?? 560,
  height: overrides.height ?? 360,
  minimized: false,
  maximized: false,
  focusOrder: 0,
  ...overrides,
});

const defaultWindowMap = {
  explorer: { title: 'My Computer', width: 680, height: 420 },
  evidence: { title: 'Evidence Map', width: 760, height: 510 },
  notepad: { title: 'Notepad', width: 540, height: 380 },
  mail: { title: 'Mail', width: 640, height: 420 },
  browser: { title: 'Browser', width: 760, height: 460 },
  remember: { title: 'Local Archive', width: 660, height: 420 },
  notebook: { title: 'Evidence Notebook', width: 550, height: 380 },
  cmd: { title: 'Command Prompt', width: 630, height: 370 },
  taskmanager: { title: 'Task Manager', width: 520, height: 340 },
  eventlog: { title: 'Event Viewer', width: 600, height: 360 },
  registry: { title: 'Registry Editor', width: 600, height: 390 },
  paint: { title: 'Paint', width: 620, height: 440 },
  media: { title: 'Media Player', width: 480, height: 360 },
  stickies: { title: 'Desktop Notes', width: 480, height: 360 },
};

const appContent = {
  explorer: 'Files',
  evidence: 'Evidence Map',
  notepad: 'Notes',
  mail: 'Mail',
  browser: 'Browser',
  remember: 'Local Archive',
  notebook: 'Notebook',
  cmd: 'Prompt',
  taskmanager: 'Processes',
  eventlog: 'Events',
  registry: 'Registry',
  paint: 'Paint',
  media: 'Media Player',
  stickies: 'Desktop Notes',
};

const shellIconMap = {
  explorer: '🗂️',
  evidence: '▦',
  notepad: '📝',
  mail: '✉️',
  browser: '🌐',
  remember: '▣',
  notebook: '📓',
  cmd: '⌨️',
  taskmanager: '📊',
  eventlog: '🧾',
  registry: '▤',
  paint: '▧',
  media: '♫',
  stickies: '▣',
};

const desktopShortcuts = [
  { id: 'computer', label: 'My Computer', icon: 'computer', app: 'explorer', folder: 'All' },
  { id: 'command', label: 'Command Prompt', icon: 'command', app: 'cmd' },
  { id: 'notepad', label: 'Notepad', icon: 'notepad', app: 'notepad' },
  { id: 'registry', label: 'Registry Editor', icon: 'registry', app: 'registry' },
  { id: 'paint', label: 'Paint', icon: 'paint', app: 'paint' },
  { id: 'media', label: 'Media Player', icon: 'media', app: 'media' },
  { id: 'documents', label: 'My Documents', icon: 'documents', app: 'explorer', folder: 'Documents' },
  { id: 'recycle', label: 'Recycle Bin', icon: 'recycle', app: 'explorer', folder: 'Recycle Bin' },
  { id: 'remember', label: 'NULL.HOME', icon: 'remember', app: 'remember' },
  { id: 'guestbook', label: 'Guestbook', icon: 'guestbook', app: 'browser', page: 'guestbook' },
  { id: 'personal', label: 'Personal Files', icon: 'folder', app: 'explorer', folder: 'Documents' },
  { id: 'knowledge', label: 'Knowledge Archive', icon: 'archive', app: 'notebook' },
  { id: 'evidence-map', label: 'Evidence Map', icon: 'archive', app: 'evidence' },
];

const PixelIcon = ({ type }) => (
  <svg className="pixel-icon" viewBox="0 0 32 32" aria-hidden="true" shapeRendering="crispEdges">
    {type === 'computer' && <><rect x="4" y="4" width="22" height="18" fill="#e6e6e6" stroke="#111" /><rect x="7" y="7" width="16" height="11" fill="#1671a8" /><rect x="12" y="22" width="7" height="3" fill="#aaa" /><rect x="9" y="25" width="13" height="3" fill="#777" /><rect x="5" y="26" width="4" height="3" fill="#2a9c44" /></>}
    {type === 'command' && <><rect x="3" y="5" width="26" height="21" fill="#c4c4c4" stroke="#111" /><rect x="6" y="8" width="20" height="14" fill="#050505" /><path d="M9 12h4l-3 3 3 3" fill="none" stroke="#9ef58b" strokeWidth="2" /><rect x="17" y="17" width="5" height="2" fill="#9ef58b" /><rect x="8" y="27" width="16" height="2" fill="#777" /></>}
    {type === 'notepad' && <><rect x="7" y="3" width="18" height="25" fill="#f7f7ef" stroke="#222" /><rect x="10" y="7" width="12" height="2" fill="#1a4a9a" /><path d="M10 13h12M10 17h12M10 21h9" stroke="#333" strokeWidth="1.5" /><rect x="7" y="3" width="18" height="4" fill="#2865b0" /></>}
    {type === 'registry' && <><rect x="4" y="6" width="23" height="21" fill="#eee" stroke="#222" /><rect x="4" y="6" width="23" height="5" fill="#1d539e" /><path d="M9 14v10m0-8h7m-7 5h12m-12 3h9" stroke="#333" strokeWidth="1.5" /><rect x="7" y="13" width="2" height="2" fill="#d6aa28" /></>}
    {type === 'paint' && <><rect x="3" y="5" width="26" height="21" fill="#ddd" stroke="#222" /><rect x="6" y="8" width="6" height="13" fill="#aaa" /><rect x="14" y="8" width="12" height="13" fill="#fff" /><rect x="15" y="9" width="4" height="4" fill="#d33" /><rect x="20" y="9" width="4" height="4" fill="#2764c2" /><rect x="15" y="15" width="4" height="4" fill="#f3d328" /><rect x="20" y="15" width="4" height="4" fill="#278b49" /></>}
    {type === 'media' && <><rect x="4" y="4" width="24" height="24" fill="#c9c9c9" stroke="#222" /><rect x="7" y="7" width="18" height="13" fill="#101b39" /><rect x="10" y="10" width="12" height="7" fill="#3575b9" /><circle cx="16" cy="23" r="3" fill="#555" /><path d="M15 21v4l4-2z" fill="#eee" /></>}
    {type === 'documents' && <><path d="M4 9h10l3 3h11v15H4z" fill="#e4b542" stroke="#222" /><path d="M5 13h22v12H5z" fill="#f0cc60" /></>}
    {type === 'recycle' && <><path d="M9 10h14l-2 17H11z" fill="#d4e6f2" stroke="#222" /><path d="M7 8h18M13 6h7" stroke="#222" strokeWidth="2" /><path d="M12 15l3 3 5-5" fill="none" stroke="#278c50" strokeWidth="2" /></>}
    {type === 'remember' && <><rect x="5" y="5" width="22" height="22" fill="#ddd" stroke="#222" /><path d="M10 20c0-7 3-11 6-11s6 4 6 11M12 18h8M13 14h6" fill="none" stroke="#4d5d89" strokeWidth="2" /><circle cx="16" cy="8" r="2" fill="#be5965" /></>}
    {type === 'guestbook' && <><rect x="5" y="4" width="20" height="24" fill="#f2ede0" stroke="#222" /><rect x="5" y="4" width="20" height="5" fill="#3463a1" /><path d="M9 13h12M9 17h9M9 21h11M9 25h7" stroke="#444" strokeWidth="1.5" /><rect x="24" y="8" width="4" height="17" fill="#c33" /></>}
    {type === 'folder' && <><path d="M3 9h11l3 3h12v15H3z" fill="#e3bd42" stroke="#222" /><path d="M4 14h24v11H4z" fill="#f1d36c" /></>}
    {type === 'archive' && <><rect x="4" y="6" width="24" height="21" fill="#c7b889" stroke="#222" /><rect x="7" y="9" width="18" height="4" fill="#725e37" /><rect x="7" y="16" width="18" height="2" fill="#5a503b" /><rect x="7" y="21" width="14" height="2" fill="#5a503b" /><rect x="13" y="13" width="6" height="3" fill="#d7bd76" /></>}
  </svg>
);

const getFileById = (files, id) => files.find((file) => file.id === id) ?? null;

function App() {
  const [game, setGame] = useState(() => getSavedState() ?? buildInitialGameState());
  const [bootComplete, setBootComplete] = useState(false);
  const [cmdInput, setCmdInput] = useState('');
  const [cmdHistoryIndex, setCmdHistoryIndex] = useState(null);
  const cmdDraft = useRef('');
  const [cmdDirectory, setCmdDirectory] = useState('C:\\');
  const [cmdHistory, setCmdHistory] = useState([
    'Microsoft(R) Windows 98 [Version 4.10.1998]',
    '(C)Copyright Microsoft Corp 1981-1998.',
    '',
    'DEAD.SYS virtual command environment.',
    'Type HELP for command list.',
  ]);
  const [publishMessage, setPublishMessage] = useState('');
  const [selectedShortcut, setSelectedShortcut] = useState(null);
  const [programsOpen, setProgramsOpen] = useState(false);
  const [dialog, setDialog] = useState(null);
  const [findText, setFindText] = useState('');
  const [runText, setRunText] = useState('');
  const [paintColor, setPaintColor] = useState('#111111');
  const [mediaPlaying, setMediaPlaying] = useState(false);
  const [clock, setClock] = useState(() => new Date('1998-03-28T11:11:00'));
  const [evidenceTab, setEvidenceTab] = useState('map');
  const [evidenceFilter, setEvidenceFilter] = useState('All types');
  const [selectedEvidenceId, setSelectedEvidenceId] = useState('');
  const [reportSpoilers, setReportSpoilers] = useState(false);
  const [reportHypothesis, setReportHypothesis] = useState(true);
  const [reportMessage, setReportMessage] = useState('');
  const [selectedPuzzleId, setSelectedPuzzleId] = useState('puzzle-account');
  const [puzzleAnswer, setPuzzleAnswer] = useState('');
  const [activeAnomaly, setActiveAnomaly] = useState(false);
  const [debugPanelOpen, setDebugPanelOpen] = useState(DEBUG_MODE);
  const [debugPuzzleId, setDebugPuzzleId] = useState('puzzle-account');
  const [debugPuzzleAnswer, setDebugPuzzleAnswer] = useState(() => getDebugPuzzleSolution('puzzle-account'));
  const [debugMessage, setDebugMessage] = useState('');
  const [debugEventType, setDebugEventType] = useState('eyes');
  const [debugEvent, setDebugEvent] = useState(null);
  const debugEventSequence = useRef(0);
  const [pageVisible, setPageVisible] = useState(() => !document.hidden);
  const stickyDrag = useRef(null);
  const windowDrag = useRef(null);
  const mediaAudio = useRef(null);
  const bootTimer = useRef(null);
  const anomalyTimer = useRef(null);
  const pendingAnimationSignature = game.windows
    .filter((entry) => entry.animationState)
    .map((entry) => `${entry.id}:${entry.animationState}`)
    .join('|');

  const completeWindowAnimation = (id, animationState) => {
    setGame((current) => {
      const windowState = current.windows.find((entry) => entry.id === id);
      if (!windowState || windowState.animationState !== animationState) return current;
      if (animationState === 'closing') {
        const windows = current.windows.filter((entry) => entry.id !== id);
        const nextActive = windows.find((entry) => !entry.minimized && entry.animationState !== 'closing');
        return {
          ...current,
          windows,
          activeWindowId: current.activeWindowId === id ? nextActive?.id ?? null : current.activeWindowId,
        };
      }
      return {
        ...current,
        windows: current.windows.map((entry) => entry.id === id
          ? { ...entry, minimized: animationState === 'minimizing', animationState: '' }
          : entry),
        activeWindowId: animationState === 'minimizing' && current.activeWindowId === id
          ? current.windows.find((entry) => entry.id !== id && !entry.minimized)?.id ?? null
          : current.activeWindowId,
      };
    });
  };

  useEffect(() => {
    bootTimer.current = window.setTimeout(() => setBootComplete(true), 1050);
    return () => window.clearTimeout(bootTimer.current);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(game));
    } catch (error) {
      console.error('Unable to save DEAD.SYS progress.', error);
    }
  }, [game]);

  useEffect(() => {
    const interval = window.setInterval(() => setClock((current) => new Date(current.getTime() + 60_000)), 60_000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const updateVisibility = () => setPageVisible(!document.hidden);
    document.addEventListener('visibilitychange', updateVisibility);
    return () => document.removeEventListener('visibilitychange', updateVisibility);
  }, []);

  useEffect(() => {
    if (!game.flags.mountEchoPending) return undefined;
    setGame((current) => ({
      ...current,
      flags: { ...current.flags, mountEchoPending: false, mountEchoSeen: true },
    }));
    if (motionIsReduced(game.settings.reducedMotion) || document.hidden) return undefined;
    setActiveAnomaly(true);
    return undefined;
  }, [game.flags.mountEchoPending, game.settings.reducedMotion]);

  useEffect(() => {
    if (!activeAnomaly || !pageVisible) return undefined;
    anomalyTimer.current = window.setTimeout(() => setActiveAnomaly(false), 560);
    return () => window.clearTimeout(anomalyTimer.current);
  }, [activeAnomaly, pageVisible]);

  useEffect(() => {
    if (!pendingAnimationSignature) return undefined;
    const timers = game.windows
      .filter((entry) => entry.animationState)
      .map((entry) => window.setTimeout(
        () => completeWindowAnimation(entry.id, entry.animationState),
        entry.animationState === 'closing' ? 180 : entry.animationState === 'minimizing' ? 205 : 280,
      ));
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [pendingAnimationSignature]);

  useEffect(() => {
    if (!game.settings.reducedMotion) return;
    setGame((current) => {
      let next = current;
      current.windows.filter((entry) => entry.animationState).forEach((entry) => {
        if (entry.animationState === 'closing') {
          const windows = next.windows.filter((windowState) => windowState.id !== entry.id);
          const activeWindow = windows.find((windowState) => !windowState.minimized && windowState.animationState !== 'closing');
          next = {
            ...next,
            windows,
            activeWindowId: next.activeWindowId === entry.id ? activeWindow?.id ?? null : next.activeWindowId,
          };
        } else {
          next = {
            ...next,
            windows: next.windows.map((windowState) => windowState.id === entry.id
              ? { ...windowState, minimized: entry.animationState === 'minimizing', animationState: '' }
              : windowState),
          };
        }
      });
      if (next.stickyNotes.some((note) => note.dismissing)) {
        next = {
          ...next,
          stickyNotes: next.stickyNotes.map((note) => note.dismissing ? { ...note, open: false, dismissing: false } : note),
        };
      }
      return next;
    });
  }, [game.settings.reducedMotion]);

  useEffect(() => {
    const onPointerMove = (event) => {
      if (stickyDrag.current) {
        const { id, startX, startY, x, y } = stickyDrag.current;
        const nextX = Math.max(180, Math.min(window.innerWidth - 175, x + event.clientX - startX));
        const nextY = Math.max(8, Math.min(window.innerHeight - 130, y + event.clientY - startY));
        setGame((current) => ({
          ...current,
          stickyNotes: current.stickyNotes.map((note) => note.id === id ? { ...note, x: nextX, y: nextY } : note),
        }));
      }
      if (windowDrag.current) {
        const { id, startX, startY, x, y, width } = windowDrag.current;
        const nextX = Math.max(0, Math.min(window.innerWidth - width, x + event.clientX - startX));
        const nextY = Math.max(0, Math.min(window.innerHeight - 70, y + event.clientY - startY));
        setGame((current) => ({
          ...current,
          windows: current.windows.map((entry) => entry.id === id
            ? { ...entry, x: nextX, y: nextY, dragging: true }
            : entry),
        }));
      }
    };
    const onPointerUp = () => {
      stickyDrag.current = null;
      const draggedWindowId = windowDrag.current?.id;
      windowDrag.current = null;
      if (draggedWindowId) {
        setGame((current) => ({
          ...current,
          windows: current.windows.map((entry) => entry.id === draggedWindowId ? { ...entry, dragging: false } : entry),
        }));
      }
    };
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, []);

  const openWindow = (appId) => {
    setGame((current) => {
      const openedRecordId = {
        explorer: current.selectedFileId,
        mail: current.selectedMailId,
        browser: `page-${current.browserPageId}`,
        registry: 'registry-status',
      }[appId];
      const record = openedRecordId ? evidenceById[openedRecordId] : null;
      const withActivity = (next) => record ? {
        ...next,
        investigationHistory: recordRecentDocument(next.investigationHistory, {
          id: record.id,
          kind: record.app,
          openedAt: clock.toLocaleString([], { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
        }),
      } : next;
      const existing = current.windows.find((win) => win.appId === appId);
      if (existing) {
        return withActivity({
          ...current,
          activeWindowId: existing.id,
          windows: current.windows.map((win) => win.id === existing.id
            ? {
              ...win,
              minimized: false,
              animationState: win.minimized || win.animationState === 'minimizing' ? (motionIsReduced(current.settings.reducedMotion) ? '' : 'restoring') : win.animationState,
            }
            : win),
          startMenuOpen: false,
        });
      }
      const config = defaultWindowMap[appId] ?? { title: appContent[appId] ?? 'App', width: 620, height: 360 };
      const nextWindow = makeWindow(appId, config.title, {
        width: config.width,
        height: config.height,
        animationState: motionIsReduced(current.settings.reducedMotion) ? '' : 'opening',
      });
      return withActivity({ ...current, windows: [...current.windows, nextWindow], activeWindowId: nextWindow.id, startMenuOpen: false });
    });
  };

  const removeWindow = (id) => {
    if (game.windows.find((win) => win.id === id)?.appId === 'media' && mediaAudio.current) {
      mediaAudio.current.stop();
      mediaAudio.current = null;
      setMediaPlaying(false);
    }
    setGame((current) => {
      const windows = current.windows.filter((win) => win.id !== id);
      const nextActive = windows.find((win) => !win.minimized && win.animationState !== 'closing');
      return {
        ...current,
        windows,
        activeWindowId: current.activeWindowId === id ? nextActive?.id ?? null : current.activeWindowId,
      };
    });
  };

  const closeWindow = (id) => {
    const target = game.windows.find((win) => win.id === id);
    if (!target || target.animationState === 'closing') return;
    if (target.appId === 'media' && mediaAudio.current) {
      mediaAudio.current.stop();
      mediaAudio.current = null;
      setMediaPlaying(false);
    }
    if (motionIsReduced(game.settings.reducedMotion)) {
      removeWindow(id);
      return;
    }
    setGame((current) => ({
      ...current,
      windows: current.windows.map((win) => win.id === id ? { ...win, animationState: 'closing' } : win),
    }));
  };

  const minimizeWindow = (id) => {
    if (motionIsReduced(game.settings.reducedMotion)) {
      setGame((current) => {
        const windows = current.windows.map((win) => win.id === id ? { ...win, minimized: true, animationState: '' } : win);
        const nextActive = windows.find((win) => win.id !== id && !win.minimized && win.animationState !== 'closing');
        return { ...current, windows, activeWindowId: current.activeWindowId === id ? nextActive?.id ?? null : current.activeWindowId };
      });
      return;
    }
    setGame((current) => ({
      ...current,
      windows: current.windows.map((win) => win.id === id ? { ...win, animationState: 'minimizing' } : win),
    }));
  };

  const toggleMaximizeWindow = (id) => setGame((current) => ({
    ...current,
    windows: current.windows.map((win) => win.id === id
      ? { ...win, maximized: !win.maximized, geometryTransition: !motionIsReduced(current.settings.reducedMotion) }
      : win),
  }));

  const finishWindowGeometryTransition = (event, id) => {
    if (event.target !== event.currentTarget || !['left', 'top', 'width', 'height'].includes(event.propertyName)) return;
    setGame((current) => ({
      ...current,
      windows: current.windows.map((entry) => entry.id === id ? { ...entry, geometryTransition: false } : entry),
    }));
  };

  const persistWindowSize = (event, id, maximized) => {
    if (maximized || window.innerWidth <= 900) return;
    const { width, height } = event.currentTarget.getBoundingClientRect();
    setGame((current) => ({
      ...current,
      windows: current.windows.map((entry) => entry.id === id && !entry.maximized
        ? { ...entry, width, height }
        : entry),
    }));
  };

  const handleWindowAnimationEnd = (event, id) => {
    if (event.target !== event.currentTarget) return;
    const windowState = game.windows.find((entry) => entry.id === id);
    if (windowState?.animationState) completeWindowAnimation(id, windowState.animationState);
  };

  const restoreTaskWindow = (windowState) => {
    if (windowState.minimized || windowState.animationState === 'minimizing') {
      setGame((current) => ({
        ...current,
        activeWindowId: windowState.id,
        windows: current.windows.map((entry) => entry.id === windowState.id
          ? { ...entry, minimized: false, animationState: motionIsReduced(current.settings.reducedMotion) ? '' : 'restoring' }
          : entry),
      }));
      return;
    }
    if (game.activeWindowId === windowState.id) {
      minimizeWindow(windowState.id);
      return;
    }
    setActiveWindow(windowState.id);
  };

  const setActiveWindow = (id) => setGame((current) => ({ ...current, activeWindowId: id }));

  const skipBoot = () => {
    window.clearTimeout(bootTimer.current);
    setBootComplete(true);
  };

  const beginWindowDrag = (event, windowState) => {
    if (event.target.closest('button') || windowState.maximized || windowState.animationState === 'closing') return;
    const element = event.currentTarget.closest('.window');
    windowDrag.current = {
      id: windowState.id,
      startX: event.clientX,
      startY: event.clientY,
      x: windowState.x,
      y: windowState.y,
      width: element?.getBoundingClientRect().width ?? windowState.width,
    };
    setGame((current) => ({
      ...current,
      activeWindowId: windowState.id,
      windows: current.windows.map((entry) => entry.id === windowState.id
        ? { ...entry, animationState: '', dragging: true }
        : entry),
    }));
  };

  const finishStickyDismiss = (event, id) => {
    if (event.target !== event.currentTarget) return;
    setGame((current) => ({
      ...current,
      stickyNotes: current.stickyNotes.map((entry) => entry.id === id ? { ...entry, open: false, dismissing: false } : entry),
    }));
  };

  const openShortcut = (shortcut) => {
    if (shortcut.folder) setExplorerFolder(shortcut.folder);
    if (shortcut.page) setBrowserPage(shortcut.page);
    openWindow(shortcut.app);
    setSelectedShortcut(shortcut.id);
  };

  const [explorerFolder, setExplorerFolder] = useState('All');

  const runStartAction = (action) => {
    setGame((current) => ({ ...current, startMenuOpen: false }));
    setProgramsOpen(false);
    if (action === 'programs') {
      setProgramsOpen(true);
      setGame((current) => ({ ...current, startMenuOpen: true }));
    } else if (action === 'documents') {
      setExplorerFolder('Documents');
      openWindow('explorer');
    } else if (action === 'settings') {
      setDialog('settings');
    } else if (action === 'find') {
      setFindText('');
      setDialog('find');
    } else if (action === 'help') {
      setBrowserPage('home');
      openWindow('browser');
    } else if (action === 'run') {
      setRunText('');
      setDialog('run');
    } else if (action === 'shutdown') {
      setDialog('shutdown');
    }
  };

  const launchRunCommand = () => {
    const command = runText.trim().toLowerCase();
    const aliases = {
      explorer: 'explorer', 'my computer': 'explorer', notepad: 'notepad',
      cmd: 'cmd', 'command prompt': 'cmd', mail: 'mail', browser: 'browser',
      remember: 'remember', 'null.home': 'remember', 'local archive': 'remember', paint: 'paint', 'media player': 'media',
      'registry editor': 'registry', 'desktop notes': 'stickies',
      notebook: 'notebook', 'event viewer': 'eventlog',
    };
    const appId = aliases[command];
    if (appId) {
      openWindow(appId);
      setDialog(null);
    } else {
      setPublishMessage(`Cannot find "${runText}".`);
    }
  };

  const updatePuzzleState = (id, value) => {
    const result = submitPuzzleAnswer(game, id, value);
    if (result.reason === 'locked') {
      setPublishMessage('This record is not available yet. Follow the unlocked entries in the Notebook.');
      return;
    }
    if (result.reason === 'unknown') {
      setPublishMessage('This record could not be opened.');
      return;
    }
    setGame(result.state);
    if (result.solved) {
      setPuzzleAnswer('');
      const puzzle = getPuzzleById(id);
      setPublishMessage(result.alreadySolved ? 'This record is already in the Notebook.' : `${puzzle.title} — ${puzzle.reward}`);
      const nextPuzzle = puzzleDefinitions.find((entry) => (
        !result.state.puzzleStatus[entry.id].solved && isPuzzleUnlocked(entry.id, result.state.puzzleStatus)
      ));
      if (nextPuzzle) setSelectedPuzzleId(nextPuzzle.id);
    } else {
      setPublishMessage('No match. Recheck the cited records, or request the next hint in the Notebook.');
    }
  };

  const submitDebugPuzzle = () => {
    const result = submitPuzzleAnswer(game, debugPuzzleId, debugPuzzleAnswer);
    if (result.reason === 'locked') {
      setDebugMessage('Locked as expected. Solve its prerequisite records or use “Solve + prerequisites”.');
      return;
    }
    if (result.reason === 'unknown') {
      setDebugMessage('The selected record could not be opened.');
      return;
    }
    setGame(result.state);
    if (result.solved) {
      setSelectedPuzzleId(debugPuzzleId);
      setDebugMessage(result.alreadySolved ? 'This puzzle is already solved.' : 'Answer accepted; progress and rewards were recorded.');
    } else {
      setDebugMessage('Answer rejected; the attempt was recorded. Check the puzzle validation behavior.');
    }
  };

  const solveDebugPuzzle = () => {
    const result = solvePuzzleForDebug(game, debugPuzzleId);
    setGame(result.state);
    setSelectedPuzzleId(debugPuzzleId);
    setDebugMessage(result.solvedIds.length
      ? `Solved ${result.solvedIds.length} puzzle${result.solvedIds.length === 1 ? '' : 's'} including prerequisites.`
      : 'This puzzle and its prerequisites were already solved.');
  };

  const triggerDebugEvent = () => {
    if (debugEventType === 'mount-echo') {
      setActiveAnomaly(true);
      setDebugMessage('Triggered the one-time mount-discovery echo.');
      return;
    }
    if (motionIsReduced(game.settings.reducedMotion)) {
      setDebugMessage('Ambient visuals are disabled by Reduced motion.');
      return;
    }
    const solvedCount = Object.values(game.puzzleStatus).filter((status) => status.solved).length;
    const event = createAmbientEvent(debugEventType, getAmbientStage(solvedCount));
    setDebugEvent({ ...event, debugVersion: ++debugEventSequence.current });
    setDebugMessage(`Triggered ${DEBUG_EVENT_TYPES.find(([id]) => id === debugEventType)?.[1] ?? 'visual event'}.`);
  };

  const resetDebugPuzzleCampaign = () => {
    setGame((current) => resetPuzzleProgress(current));
    setSelectedPuzzleId('puzzle-account');
    setDebugPuzzleId('puzzle-account');
    setDebugPuzzleAnswer(getDebugPuzzleSolution('puzzle-account'));
    setDebugMessage('Puzzle progress reset. Other saved settings, notes, and windows were preserved.');
  };

  const requestPuzzleHint = (id) => setGame((current) => advancePuzzleHint(current, id));
  const markRecentDocument = (id, kind) => {
    setGame((current) => ({
      ...current,
      investigationHistory: recordRecentDocument(current.investigationHistory, {
        id,
        kind,
        openedAt: clock.toLocaleString([], { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
      }),
    }));
  };

  const setBrowserPage = (pageId) => {
    setGame((current) => ({
      ...current,
      browserPageId: pageId,
      investigationHistory: recordRecentDocument(current.investigationHistory, {
        id: `page-${pageId}`,
        kind: 'browser',
        openedAt: clock.toLocaleString([], { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
      }),
    }));
  };

  const selectMailMessage = (mailId) => {
    setGame((current) => ({
      ...current,
      selectedMailId: mailId,
      investigationHistory: recordRecentDocument(current.investigationHistory, {
        id: mailId,
        kind: 'mail',
        openedAt: clock.toLocaleString([], { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
      }),
    }));
  };

  const openEvidenceRecord = (recordId) => {
    const record = evidenceById[recordId];
    if (!record || !getDiscoveredEvidence(game).some((entry) => entry.id === recordId)) return;
    markRecentDocument(record.id, record.app);
    if (record.app === 'explorer') {
      setExplorerFolder('All');
      setGame((current) => ({ ...current, selectedFileId: record.id }));
    } else if (record.app === 'browser') {
      setBrowserPage(record.id.replace(/^page-/, ''));
    } else if (record.app === 'mail') {
      selectMailMessage(record.id);
    } else if (record.app === 'registry') {
      openWindow('registry');
      return;
    }
    openWindow(record.app === 'browser' ? 'browser' : record.app === 'mail' ? 'mail' : 'explorer');
  };

  const copyCaseReport = async () => {
    try {
      if (!navigator.clipboard?.writeText) {
        setReportMessage('Clipboard access is unavailable. Select the report text and copy it manually.');
        return;
      }
      await navigator.clipboard.writeText(buildCaseReport(game, {
        includeSpoilers: reportSpoilers,
        includePlayerHypothesis: reportHypothesis,
      }));
      setReportMessage('Report copied to the clipboard. Nothing was sent to a server.');
    } catch (error) {
      setReportMessage(`Could not copy the report: ${error instanceof Error ? error.message : 'clipboard access was denied'}. You can select and copy the report text below.`);
    }
  };

  const downloadCaseReport = () => {
    try {
      const report = buildCaseReport(game, {
        includeSpoilers: reportSpoilers,
        includePlayerHypothesis: reportHypothesis,
      });
      const url = URL.createObjectURL(new Blob([report], { type: 'text/markdown;charset=utf-8' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = reportSpoilers ? 'null-home-case-report-spoilers.md' : 'null-home-case-report.md';
      try {
        link.click();
        setReportMessage('Report downloaded locally. Nothing was sent to a server.');
      } finally {
        window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      }
    } catch (error) {
      setReportMessage(`Could not create the report download: ${error instanceof Error ? error.message : 'browser download failed'}.`);
    }
  };

  const runCommand = () => {
    if (!cmdInput.trim()) return;
    const raw = cmdInput.trim();
    const input = raw.split(' ');
    const command = input[0].toUpperCase();
    const value = input.slice(1).join(' ');

    setCmdHistory((current) => [...current, `${cmdDirectory}> ${cmdInput}`]);
    setGame((current) => ({
      ...current,
      investigationHistory: recordCommand(current.investigationHistory, raw),
    }));

    if (command === 'HELP') {
      setCmdHistory((current) => [...current,
        'Commands: HELP, DIR, CD, TYPE, FIND, ATTRIB, TREE, CLS, DATE, TIME',
        'System diagnostics use the log basename as the command.',
      ]);
    } else if (command === 'DIR') {
      const folder = cmdDirectory.slice(3).replaceAll('\\', '/');
      const entries = folder === ''
        ? ['Desktop', 'Documents', 'System', 'Archive']
        : game.files.filter((file) => isFileVisible(file) && file.folder.toLowerCase() === folder.toLowerCase().replace('windows/', '')).map((file) => file.name);
      setCmdHistory((current) => [...current, ` Directory of ${cmdDirectory}`, ...entries, `${entries.length} item(s)`]);
    } else if (command === 'TYPE') {
      const chosen = game.files.find((file) => isFileVisible(file) && (file.name.toUpperCase() === value.toUpperCase() || file.id.toUpperCase() === value.toUpperCase()));
      setCmdHistory((current) => [...current, chosen ? chosen.content : 'The system cannot find the file specified.']);
    } else if (command === 'TRACE') {
      if (game.flags.traceUnlocked || game.puzzleStatus['puzzle-command'].solved) {
        setCmdHistory((current) => [...current, game.files.find((file) => file.id === 'file-system')?.content ?? 'TRACE: no local mount record.']);
      } else {
        setCmdHistory((current) => [...current, 'TRACE not available. Access denied.']);
      }
    } else if (command === 'CLS') {
      setCmdHistory(['SYSTEM READY']);
    } else if (command === 'DATE') {
      setCmdHistory((current) => [...current, 'Current date is Sat 03-28-1998']);
    } else if (command === 'TIME') {
      setCmdHistory((current) => [...current, `Current time is ${clock.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`]);
    } else if (command === 'FIND') {
      if (!value) {
        setCmdHistory((current) => [...current, 'Usage: FIND <text>']);
      } else {
        const result = game.files.filter((file) => isFileVisible(file) && `${file.name} ${file.content}`.toUpperCase().includes(value.toUpperCase()));
        setCmdHistory((current) => [...current, result.length ? result.map((file) => file.name).join(', ') : 'NO MATCHES']);
      }
    } else if (command === 'TREE') {
      setCmdHistory((current) => [...current, 'C:\\', '├─ Desktop', '├─ Documents', '├─ Windows\\System', '└─ Archive']);
    } else if (command === 'ATTRIB') {
      setCmdHistory((current) => [...current, 'H  S  C:\\Windows\\System\\trace.log']);
    } else if (command === 'CD') {
      if (!value || value === '\\') {
        setCmdDirectory('C:\\');
        setCmdHistory((current) => [...current, 'C:\\']);
      } else {
        const normalized = value.replaceAll('/', '\\').replace(/^C:\\/i, '').toLowerCase();
        const folders = ['desktop', 'documents', 'system', 'windows\\system', 'archive'];
        if (folders.includes(normalized)) {
          const path = normalized === 'system' ? 'Windows\\System' : normalized;
          setCmdDirectory(`C:\\${path}`);
          setCmdHistory((current) => [...current, `C:\\${path}`]);
        } else {
          setCmdHistory((current) => [...current, 'The system cannot find the path specified.']);
        }
      }
    } else {
      setCmdHistory((current) => [...current, `Unknown command: ${command}`]);
    }

    setCmdInput('');
    setCmdHistoryIndex(null);
    cmdDraft.current = '';
  };

  const adaptToPuzzleInput = (id, value) => {
    updatePuzzleState(id, value);
  };

  const activePage = game.browserPages.find((page) => page.id === game.browserPageId) ?? game.browserPages[0];
  const selectedFile = getFileById(game.files, game.selectedFileId) ?? game.files[0];
  const selectedEmail = game.emails.find((mail) => mail.id === game.selectedMailId) ?? game.emails[0];
  const isFileVisible = (file) => (
    (!file.hidden || game.puzzleStatus['puzzle-dossier']?.solved)
    && (!file.lockedBy || game.puzzleStatus[file.lockedBy]?.solved)
  );
  const visibleFiles = explorerFolder === 'All'
    ? game.files.filter(isFileVisible)
    : explorerFolder === 'Recycle Bin'
      ? []
      : game.files.filter((file) => file.folder === explorerFolder && isFileVisible(file));
  const discoveredEvidence = getDiscoveredEvidence(game);
  const discoveredEvidenceIds = new Set(discoveredEvidence.map((record) => record.id));
  const filteredEvidence = discoveredEvidence.filter((record) => evidenceFilter === 'All types' || record.type === evidenceFilter);
  const selectedEvidence = filteredEvidence.find((record) => record.id === selectedEvidenceId) ?? filteredEvidence[0] ?? null;
  const timelineEvidence = sortEvidenceTimeline(filteredEvidence);
  const recentDocuments = (game.investigationHistory?.recentDocuments ?? [])
    .map((entry) => ({ ...entry, record: evidenceById[entry.id] }))
    .filter((entry) => entry.record && discoveredEvidenceIds.has(entry.id));
  const reportText = buildCaseReport(game, {
    includeSpoilers: reportSpoilers,
    includePlayerHypothesis: reportHypothesis,
  });
  const selectedPuzzle = getPuzzleById(selectedPuzzleId) ?? puzzleDefinitions[0];
  const selectedPuzzleStatus = game.puzzleStatus[selectedPuzzle.id];
  const openedStickyNotes = game.stickyNotes.filter((note) => note.open || note.dismissing);
  const solvedPuzzleCount = Object.values(game.puzzleStatus).filter((status) => status.solved).length;

  return (
    <div className={`desktop-shell ${game.settings.crt ? 'crt-enabled' : ''} ${game.settings.reducedMotion ? 'reduced-motion' : ''} ${pageVisible ? '' : 'page-hidden'} ${activeAnomaly ? 'mount-echo' : ''}`} style={{ '--text-scale': game.settings.textScale ?? 1 }}>
      {!bootComplete && (
        <div className="boot-screen" aria-live="polite" onClick={skipBoot} onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') skipBoot();
        }} tabIndex={0} role="button" aria-label="Skip startup sequence">
          <div className="boot-logo">DEAD.SYS</div>
          <div className="boot-lines">
            <span>LOADING WINDOWS 98 REFERENCE IMAGE...</span>
            <span>CHECKING ARCHIVE STATE...</span>
            <span>PROFILE STATUS: UNREGISTERED</span>
            <span className="boot-skip">Click or press a key to continue</span>
          </div>
        </div>
      )}

      {bootComplete && (
        <>
          <div className="desktop-wallpaper" />
          <AmbientEffects
            enabled={!game.settings.reduceAmbientEffects}
            pageVisible={pageVisible}
            reducedMotion={game.settings.reducedMotion}
            solvedCount={solvedPuzzleCount}
            debugEvent={debugEvent}
            onDebugEventEnd={setDebugEvent}
          />

          {DEBUG_MODE && (
            <aside className="debug-tools">
              <button
                className="debug-tools-toggle"
                aria-expanded={debugPanelOpen}
                onClick={() => setDebugPanelOpen((open) => !open)}
              >{debugPanelOpen ? 'Hide Debug Tools' : 'Debug Tools'}</button>
              {debugPanelOpen && (
                <section className="debug-panel" aria-label="Debug tools">
                  <header className="debug-panel-title">
                    <strong>DEAD.SYS Debug</strong>
                    <button aria-label="Hide debug tools" onClick={() => setDebugPanelOpen(false)}>×</button>
                  </header>
                  <div className="debug-panel-content">
                    <fieldset>
                      <legend>Visual events</legend>
                      <label htmlFor="debug-event-type">Test event</label>
                      <select id="debug-event-type" value={debugEventType} onChange={(event) => setDebugEventType(event.target.value)}>
                        {DEBUG_EVENT_TYPES.map(([id, label]) => <option key={id} value={id}>{label}</option>)}
                        <option value="mount-echo">Mount discovery echo</option>
                      </select>
                      <button className="classic-button" onClick={triggerDebugEvent}>Trigger event</button>
                    </fieldset>

                    <fieldset>
                      <legend>Puzzle tests</legend>
                      <label htmlFor="debug-puzzle">Puzzle</label>
                      <select
                        id="debug-puzzle"
                        value={debugPuzzleId}
                        onChange={(event) => {
                          setDebugPuzzleId(event.target.value);
                          setDebugPuzzleAnswer(getDebugPuzzleSolution(event.target.value));
                          setDebugMessage('');
                        }}
                      >
                        {puzzleDefinitions.map((puzzle) => (
                          <option key={puzzle.id} value={puzzle.id}>
                            {game.puzzleStatus[puzzle.id]?.solved ? '[SOLVED] ' : ''}{puzzle.title}
                          </option>
                        ))}
                      </select>
                      <label htmlFor="debug-answer">Answer input</label>
                      <input
                        id="debug-answer"
                        value={debugPuzzleAnswer}
                        onChange={(event) => setDebugPuzzleAnswer(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter') submitDebugPuzzle();
                        }}
                      />
                      <div className="debug-button-row">
                        <button className="classic-button" onClick={submitDebugPuzzle}>Submit test answer</button>
                        <button className="classic-button" onClick={solveDebugPuzzle}>Solve + prerequisites</button>
                      </div>
                      <button className="classic-button debug-reset" onClick={resetDebugPuzzleCampaign}>Reset puzzle campaign</button>
                    </fieldset>
                    <p className="debug-save-warning">Puzzle tests change this browser's saved progress. Reset affects puzzle progress only.</p>
                    {debugMessage && <p className="debug-status" role="status">{debugMessage}</p>}
                  </div>
                </section>
              )}
            </aside>
          )}

          <div className="desktop-icons" aria-label="Desktop shortcuts">
            {desktopShortcuts.map((shortcut) => (
              <button
                key={shortcut.id}
                className={`desktop-icon ${selectedShortcut === shortcut.id ? 'selected' : ''}`}
                onClick={() => setSelectedShortcut(shortcut.id)}
                onDoubleClick={() => openShortcut(shortcut)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    openShortcut(shortcut);
                  }
                }}
                aria-label={`Open ${shortcut.label}`}
              >
                <PixelIcon type={shortcut.icon} />
                <span>{shortcut.label}</span>
              </button>
            ))}
          </div>

          {openedStickyNotes.map((note, index) => {
            const compactDesktop = window.innerWidth <= 1200;
            const narrowDesktop = window.innerWidth <= 520;
            const stickyLeft = narrowDesktop ? 205 : compactDesktop ? 260 + (index % 3) * 178 : note.x;
            const stickyTop = narrowDesktop
              ? 45 + index * 110
              : compactDesktop ? note.y + Math.floor(index / 3) * 110 : note.y;
            return (
            <section
              key={note.id}
              className={`sticky-note sticky-${note.color} ${note.dismissing ? 'note-dismissing' : ''}`}
              style={{ left: stickyLeft, top: stickyTop }}
              aria-label={`${note.title} sticky note`}
              onAnimationEnd={(event) => note.dismissing && finishStickyDismiss(event, note.id)}
            >
              <header
                className="sticky-titlebar"
                onPointerDown={(event) => {
                  if (event.target.closest('.sticky-close')) return;
                  stickyDrag.current = { id: note.id, startX: event.clientX, startY: event.clientY, x: note.x, y: note.y };
                  event.currentTarget.setPointerCapture?.(event.pointerId);
                }}
              >
                <span>{note.title}</span>
                <button
                  className="sticky-close"
                  aria-label={`Close ${note.title} note`}
                  onPointerDown={(event) => event.stopPropagation()}
                  onClick={(event) => {
                    event.stopPropagation();
                    if (motionIsReduced(game.settings.reducedMotion)) {
                      setGame((current) => ({
                        ...current,
                        stickyNotes: current.stickyNotes.map((entry) => entry.id === note.id ? { ...entry, open: false } : entry),
                      }));
                      return;
                    }
                    setGame((current) => ({
                      ...current,
                      stickyNotes: current.stickyNotes.map((entry) => entry.id === note.id ? { ...entry, dismissing: true } : entry),
                    }));
                  }}
                >×</button>
              </header>
              <p>{note.text}</p>
            </section>
            );
          })}

          {game.windows.map((windowState) => (
            <div
              key={windowState.id}
              className={`window ${game.activeWindowId === windowState.id ? 'focused' : ''} ${windowState.minimized ? 'minimized' : ''} ${windowState.dragging ? 'window-dragging' : ''} ${windowState.geometryTransition ? 'geometry-transition' : ''} ${windowState.animationState ? `window-${windowState.animationState}` : ''}`}
              style={{
                left: windowState.maximized ? 0 : windowState.x,
                top: windowState.maximized ? 0 : windowState.y,
                width: windowState.maximized ? '100%' : windowState.width,
                height: windowState.maximized
                  ? 'calc(100% - 42px)'
                  : Math.min(windowState.height, Math.max(96, window.innerHeight - 42 - windowState.y)),
                zIndex: game.activeWindowId === windowState.id ? 30 : 10,
              }}
              onMouseDown={() => setActiveWindow(windowState.id)}
              onAnimationEnd={(event) => handleWindowAnimationEnd(event, windowState.id)}
              onTransitionEnd={(event) => finishWindowGeometryTransition(event, windowState.id)}
              onPointerUp={(event) => persistWindowSize(event, windowState.id, windowState.maximized)}
            >
              <div
                className="window-bar"
                onPointerDown={(event) => beginWindowDrag(event, windowState)}
                onDoubleClick={(event) => {
                  if (!event.target.closest('button')) toggleMaximizeWindow(windowState.id);
                }}
              >
                <div className="window-title">{windowState.title}</div>
                <div className="window-controls">
                  <button aria-label="Minimize window" disabled={windowState.animationState === 'closing' || windowState.animationState === 'minimizing'} onClick={() => minimizeWindow(windowState.id)}>_</button>
                  <button aria-label={windowState.maximized ? 'Restore window' : 'Maximize window'} disabled={windowState.animationState === 'closing'} onClick={() => toggleMaximizeWindow(windowState.id)}>{windowState.maximized ? '❐' : '□'}</button>
                  <button aria-label="Close window" disabled={windowState.animationState === 'closing'} onClick={() => closeWindow(windowState.id)}>×</button>
                </div>
              </div>

              <div className="window-body">
                {windowState.appId === 'evidence' && (
                  <div className="evidence-map">
                    <div className="evidence-toolbar" role="tablist" aria-label="Evidence Map views">
                      {EVIDENCE_TABS.map(([tab, label], index) => (
                        <button
                          key={tab}
                          role="tab"
                          data-evidence-tab={tab}
                          tabIndex={evidenceTab === tab ? 0 : -1}
                          aria-selected={evidenceTab === tab}
                          className={evidenceTab === tab ? 'selected' : ''}
                          onClick={() => setEvidenceTab(tab)}
                          onKeyDown={(event) => {
                            const offset = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
                            if (!offset && event.key !== 'Home' && event.key !== 'End') return;
                            event.preventDefault();
                            const nextIndex = event.key === 'Home'
                              ? 0
                              : event.key === 'End'
                                ? EVIDENCE_TABS.length - 1
                                : (index + offset + EVIDENCE_TABS.length) % EVIDENCE_TABS.length;
                            const [nextTab] = EVIDENCE_TABS[nextIndex];
                            setEvidenceTab(nextTab);
                            event.currentTarget.parentElement.querySelector(`[data-evidence-tab="${nextTab}"]`)?.focus();
                          }}
                        >{label}</button>
                      ))}
                    </div>
                    {evidenceTab !== 'report' && (
                      <label className="evidence-filter">
                        Filter records
                        <select aria-label="Filter evidence by type" value={evidenceFilter} onChange={(event) => setEvidenceFilter(event.target.value)}>
                          <option>All types</option>
                          {[...new Set(discoveredEvidence.map((record) => record.type))].sort().map((type) => <option key={type}>{type}</option>)}
                        </select>
                      </label>
                    )}
                    {evidenceTab === 'map' && (
                      <div className="evidence-map-grid">
                        <section className="evidence-record-list" aria-label="Discovered evidence records">
                          <h3>Opened records</h3>
                          {filteredEvidence.length === 0 && <p className="evidence-empty">No records recorded yet. Open a file, message, registry entry, or cached page to add it to this map.</p>}
                          {filteredEvidence.map((record) => (
                            <button
                              key={record.id}
                              className={`evidence-record ${selectedEvidence?.id === record.id ? 'selected' : ''}`}
                              aria-pressed={selectedEvidence?.id === record.id}
                              onClick={() => setSelectedEvidenceId(record.id)}
                            >
                              <strong>{record.title}</strong><small>{record.type}</small>
                            </button>
                          ))}
                        </section>
                        <section className="evidence-detail" aria-live="polite">
                          {selectedEvidence ? (
                            <>
                              <h3>{selectedEvidence.title}</h3>
                              <p className="evidence-kind">{selectedEvidence.type}</p>
                              <dl>
                                <div><dt>Observation</dt><dd>{selectedEvidence.claim}</dd></div>
                                <div><dt>{selectedEvidence.dateType}</dt><dd>{selectedEvidence.date}</dd></div>
                                {selectedEvidence.fileModified && <div><dt>Filesystem modified</dt><dd>{selectedEvidence.fileModified} (metadata; not necessarily an event date)</dd></div>}
                                <div><dt>Source limitation</dt><dd>{selectedEvidence.provenance}</dd></div>
                              </dl>
                              <h4>Recorded relationships</h4>
                              {selectedEvidence.relationships.filter((relation) => discoveredEvidenceIds.has(relation.id)).length
                                ? <ul className="evidence-relationships">
                                  {selectedEvidence.relationships.filter((relation) => discoveredEvidenceIds.has(relation.id)).map((relation) => (
                                    <li key={`${relation.id}-${relation.type}`}>
                                      <button className="evidence-link" onClick={() => {
                                        setEvidenceFilter('All types');
                                        setSelectedEvidenceId(relation.id);
                                      }}>{evidenceById[relation.id].title}</button>
                                      <span>{relation.type}</span>
                                      <small>{relation.certainty === 'uncertain' ? 'Relationship uncertain' : 'Relationship recorded; not necessarily independent evidence'}</small>
                                    </li>
                                  ))}
                                </ul>
                                : <p>No linked record has been opened yet. Connections appear only after both records are discovered.</p>}
                              <button className="classic-button" onClick={() => openEvidenceRecord(selectedEvidence.id)}>Open source in {selectedEvidence.app === 'explorer' ? 'My Computer' : selectedEvidence.app === 'registry' ? 'Registry Editor' : selectedEvidence.app === 'mail' ? 'Mail' : 'Browser'}</button>
                            </>
                          ) : (
                            <>
                              <h3>Evidence Map</h3>
                              <p>Only records you have opened or findings you have recorded appear here. Relationships describe provenance or disagreement; they do not turn copies into independent witnesses.</p>
                            </>
                          )}
                          <details className="evidence-legend">
                            <summary>Relationship legend</summary>
                            <p>“Uncertain” marks a possible relationship; “recorded” describes what the archive links or juxtaposes. Neither label means the source independently verifies the other.</p>
                          </details>
                        </section>
                      </div>
                    )}
                    {evidenceTab === 'timeline' && (
                      <section className="evidence-timeline" aria-label="Evidence timeline">
                        <p>Dates retain their record-specific meaning. Unknown and undated content remains undated; file timestamps are shown separately.</p>
                        {filteredEvidence.length === 0 && <p className="evidence-empty">Open records to build a timeline from discovered material.</p>}
                        {timelineEvidence.map((record) => (
                          <article className="timeline-record" key={record.id}>
                            <h3>{record.title} <small>({record.type})</small></h3>
                            <dl>
                              <div><dt>{record.dateType}</dt><dd>{record.date}</dd></div>
                              {record.fileModified && <div><dt>Filesystem modified</dt><dd>{record.fileModified} — file metadata only</dd></div>}
                              <div><dt>Source limitation</dt><dd>{record.provenance}</dd></div>
                            </dl>
                            <button className="classic-button" onClick={() => openEvidenceRecord(record.id)}>Open record</button>
                          </article>
                        ))}
                      </section>
                    )}
                    {evidenceTab === 'report' && (
                      <section className="case-report">
                        <h3>Investigation Export</h3>
                        <p>Generated locally from discovered records and notebook progress. Player activity is separated from archive evidence. Nothing is uploaded.</p>
                        <label><input type="checkbox" checked={reportSpoilers} onChange={(event) => { setReportSpoilers(event.target.checked); setReportMessage(''); }} /> Include complete spoiler section and answer key</label>
                        <label><input type="checkbox" checked={reportHypothesis} onChange={(event) => setReportHypothesis(event.target.checked)} /> Include my interpretation</label>
                        <label htmlFor="case-hypothesis">My interpretation (not canonical evidence)</label>
                        <textarea
                          id="case-hypothesis"
                          maxLength={2000}
                          value={game.caseHypothesis}
                          onChange={(event) => setGame((current) => ({ ...current, caseHypothesis: event.target.value }))}
                          placeholder="Write a private theory if you want it in your report."
                        />
                        <div className="report-actions">
                          <button className="classic-button" onClick={copyCaseReport}>Copy report</button>
                          <button className="classic-button" onClick={downloadCaseReport}>Download Markdown</button>
                        </div>
                        <p role="status" className="report-status">{reportMessage}</p>
                        <label htmlFor="case-report-preview">Report preview — review before sharing</label>
                        <textarea id="case-report-preview" readOnly value={reportText} />
                      </section>
                    )}
                  </div>
                )}

                {windowState.appId === 'explorer' && (
                  <div className="explorer-panel">
                    <aside className="sidebar">
                      <strong>Folders</strong>
                      {['All', 'Desktop', 'Documents', 'System', 'Archive', 'Recycle Bin'].map((folder) => (
                        <button key={folder} className={`folder-item ${explorerFolder === folder ? 'selected' : ''}`} onClick={() => setExplorerFolder(folder)}>{folder}</button>
                      ))}
                      <button className={`folder-item ${explorerFolder === 'Recent Documents' ? 'selected' : ''}`} onClick={() => setExplorerFolder('Recent Documents')}>Recent Documents</button>
                    </aside>
                    <section className="content-pane">
                      <div className="toolbar">{explorerFolder === 'Recent Documents' ? 'Recent Documents — your activity, not archive evidence' : explorerFolder === 'Recycle Bin' ? 'Recycle Bin' : selectedFile?.path ?? `C:/${explorerFolder}`}</div>
                      {explorerFolder === 'Recent Documents' ? (
                        <div className="recent-documents">
                          <h3>Recently opened</h3>
                          {recentDocuments.length === 0 && <p>You have not opened any records yet. Opening a file, cached page, message, or registry entry adds it here.</p>}
                          {recentDocuments.map((entry) => (
                            <button key={`${entry.kind}-${entry.id}`} className="recent-document" onClick={() => openEvidenceRecord(entry.id)}>
                                <strong>{entry.record.title}</strong><span>{entry.record.type} · {entry.kind}</span><small>Opened {entry.openedAt}</small>
                            </button>
                          ))}
                          <h3>Recent commands</h3>
                          {game.investigationHistory.commands.length
                            ? <ul>{game.investigationHistory.commands.slice(-10).reverse().map((command, index) => <li key={`${command}-${index}`}><code>{command}</code></li>)}</ul>
                            : <p>No commands entered in this session history.</p>}
                        </div>
                      ) : (
                      <div className="file-list">
                        {visibleFiles.map((file) => (
                          <button key={file.id} className={`file-row ${game.selectedFileId === file.id ? 'selected' : ''}`} onClick={() => {
                            setGame((current) => ({ ...current, selectedFileId: file.id }));
                            markRecentDocument(file.id, 'explorer');
                          }} onDoubleClick={() => setPublishMessage(`Opened ${file.name}`)}>
                            <span>{file.type === 'binary' ? '▣' : '📄'}</span>
                            <span>{file.name}</span>
                            <span className="meta">{file.modified}</span>
                          </button>
                        ))}
                      </div>
                      )}
                      {explorerFolder !== 'Recent Documents' && visibleFiles.length === 0 && <p className="empty-folder">This folder is empty.</p>}
                      {selectedFile && visibleFiles.some((file) => file.id === selectedFile.id) && (
                        <div className="file-preview">
                          <h4>{selectedFile.name}</h4>
                          <dl className="file-record-details">
                            <div><dt>File modified</dt><dd>{selectedFile.modified || 'Not recorded'}</dd></div>
                            <div><dt>Content / event date</dt><dd>{fileRecordDetails[selectedFile.id]?.contentDate ?? 'Not stated in the record'}</dd></div>
                            <div><dt>Source / provenance</dt><dd>{fileRecordDetails[selectedFile.id]?.provenance ?? 'Origin not independently verified.'}</dd></div>
                          </dl>
                          <p>{selectedFile.content}</p>
                        </div>
                      )}
                    </section>
                  </div>
                )}

                {windowState.appId === 'notepad' && (
                  <div className="plain-panel">
                    <textarea value={game.notes} onChange={(event) => setGame((current) => ({ ...current, notes: event.target.value }))} />
                  </div>
                )}

                {windowState.appId === 'mail' && (
                  <div className="mail-panel">
                    <aside className="sidebar">
                      {game.emails.map((mail) => (
                        <button key={mail.id} className={`mail-item ${game.selectedMailId === mail.id ? 'selected' : ''}`} onClick={() => selectMailMessage(mail.id)}>
                          <strong>{mail.subject}</strong>
                          <small>{mail.from}</small>
                        </button>
                      ))}
                    </aside>
                    <section className="mail-content">
                      <h4>{selectedEmail.subject}</h4>
                      <p>From: {selectedEmail.from}</p>
                      <p>Message date: {selectedEmail.date}</p>
                      <p><strong>Source note:</strong> {selectedEmail.sourceNote}</p>
                      <p>{selectedEmail.body}</p>
                    </section>
                  </div>
                )}

                {windowState.appId === 'browser' && (
                  <div className="browser-panel">
                    <div className="browser-bar">
                      <button onClick={() => setBrowserPage('home')}>Home</button>
                      <button onClick={() => setBrowserPage('staff')}>Address Index</button>
                      <button onClick={() => setBrowserPage('guestbook')}>Guestbook</button>
                      <button onClick={() => setBrowserPage('bulletin')}>Local Index</button>
                      <button disabled={!game.flags.memoryIndexUnlocked} onClick={() => setBrowserPage('index')}>Recovered Copy</button>
                    </div>
                    <div className="browser-page">
                      <h3>{activePage.title}</h3>
                      <pre>{activePage.body}</pre>
                      <p className="browser-source-note"><strong>Source note:</strong> {activePage.sourceNote}</p>
                      {activePage.id === 'staff' && (
                        <button
                          disabled={!game.flags.memoryIndexUnlocked}
                          onClick={() => setBrowserPage('index')}
                        >NEXT</button>
                      )}
                    </div>
                  </div>
                )}

                {windowState.appId === 'remember' && (
                  <div className="remember-panel">
                    <div className="remember-archive">
                      <h3>NULL.HOME / local index</h3>
                      <p>This directory came from the local archive. It is not an address and cannot be resolved to a physical location.</p>
                      <pre>{game.flags.finalSequence
                        ? 'LAST RECORD: The machine remembers Mara. No independent record confirms the house or its resident.\n\nThe field outside the window is still clear.\n\nWelcome back.'
                        : 'Resident: [unverified]\nAddress: [null]\nSource volume: [not mounted]\n\nUse the Evidence Notebook to compare the files. No external search is required.'}</pre>
                      <button className="classic-button" onClick={() => openWindow('notebook')}>Open Evidence Notebook</button>
                    </div>
                  </div>
                )}

                {windowState.appId === 'notebook' && (
                  <div className="notebook-panel">
                    <div className="notebook-index">
                      <strong>Investigation records</strong>
                      {puzzleDefinitions.map((puzzle) => {
                        const unlocked = isPuzzleUnlocked(puzzle.id, game.puzzleStatus);
                        const solved = game.puzzleStatus[puzzle.id]?.solved;
                        return (
                          <button
                            key={puzzle.id}
                            className={`puzzle-entry ${selectedPuzzle.id === puzzle.id ? 'selected' : ''}`}
                            disabled={!unlocked}
                            onClick={() => {
                              setSelectedPuzzleId(puzzle.id);
                              setPuzzleAnswer('');
                            }}
                          >
                            <span>{solved ? '[x]' : unlocked ? '[ ]' : '[-]'}</span>
                            <span>{puzzle.title}</span>
                          </button>
                        );
                      })}
                      <div className="notebook-evidence">
                        <strong>Established so far</strong>
                        {game.notebook.evidence.map((item, index) => (
                          <p key={`${item}-${index}`}>{item}</p>
                        ))}
                      </div>
                    </div>
                    <div className="puzzle-panel">
                      <div className="puzzle-record-heading">
                        <strong>{selectedPuzzle.title}</strong>
                        <span>{selectedPuzzleStatus?.solved ? 'Recorded' : isPuzzleUnlocked(selectedPuzzle.id, game.puzzleStatus) ? 'Available' : 'Locked'}</span>
                      </div>
                      <p className="puzzle-prompt">{selectedPuzzle.prompt}</p>
                      <small>Start here: {selectedPuzzle.entry}</small>
                      {selectedPuzzle.clues.length > 0 && (
                        <ul className="puzzle-clues">
                          {selectedPuzzle.clues.map((clue) => <li key={clue}>{clue}</li>)}
                        </ul>
                      )}
                      {isPuzzleUnlocked(selectedPuzzle.id, game.puzzleStatus) ? (
                        <>
                          <label htmlFor="puzzle-answer">Your finding</label>
                          <input
                            id="puzzle-answer"
                            value={puzzleAnswer}
                            disabled={selectedPuzzleStatus?.solved}
                            onChange={(event) => setPuzzleAnswer(event.target.value)}
                            onKeyDown={(event) => {
                              if (event.key === 'Enter' && !selectedPuzzleStatus?.solved) {
                                event.preventDefault();
                                adaptToPuzzleInput(selectedPuzzle.id, puzzleAnswer);
                              }
                            }}
                            aria-describedby="puzzle-feedback"
                          />
                          <button
                            disabled={selectedPuzzleStatus?.solved}
                            onClick={() => adaptToPuzzleInput(selectedPuzzle.id, puzzleAnswer)}
                          >{selectedPuzzleStatus?.solved ? 'Recorded' : 'Submit finding'}</button>
                          {!selectedPuzzleStatus?.solved && selectedPuzzleStatus?.hintLevel < selectedPuzzle.hints.length && (
                            <button className="classic-button" onClick={() => requestPuzzleHint(selectedPuzzle.id)}>
                              Show hint {Math.min(selectedPuzzleStatus.hintLevel + 1, selectedPuzzle.hints.length)} of {selectedPuzzle.hints.length}
                            </button>
                          )}
                          {selectedPuzzleStatus?.hintLevel > 0 && (
                            <section className="puzzle-hint-ladder" aria-label="Hints revealed">
                              <h4>Hints revealed</h4>
                              <ol>
                                {selectedPuzzle.hints.slice(0, selectedPuzzleStatus.hintLevel).map((hint, index) => (
                                  <li key={`${selectedPuzzle.id}-hint-${index}`}>
                                    <strong>{index === selectedPuzzle.hints.length - 1 ? 'Answer and reasoning' : `Hint ${index + 1}`}</strong>
                                    <p>{hint}</p>
                                  </li>
                                ))}
                              </ol>
                              <small>Hints do not solve records or change campaign progress.</small>
                            </section>
                          )}
                          {selectedPuzzleStatus?.solved && (
                            <div className="puzzle-explanation">
                              <strong>Record added</strong>
                              <p>{selectedPuzzle.explanation}</p>
                              {selectedPuzzle.id === 'puzzle-narrative' && (
                                <div className="ending-actions">
                                  <button className="classic-button" onClick={() => {
                                    setExplorerFolder('Archive');
                                    setGame((current) => ({ ...current, selectedFileId: 'file-last-room' }));
                                    openWindow('explorer');
                                  }}>Read last-room.txt</button>
                                  <button className="classic-button" onClick={() => openWindow('remember')}>Open the local index</button>
                                </div>
                              )}
                            </div>
                          )}
                        </>
                      ) : (
                        <p className="puzzle-locked">Unlock first: {selectedPuzzle.prerequisites.map((id) => getPuzzleById(id).title).join(', ')}</p>
                      )}
                      <p id="puzzle-feedback" className="puzzle-feedback" role="status">{publishMessage}</p>
                    </div>
                  </div>
                )}

                {windowState.appId === 'cmd' && (
                  <div className="terminal-panel">
                    <div className="terminal-output" aria-live="polite">
                      {cmdHistory.map((entry, index) => (
                        <div key={`${entry}-${index}`} className={entry.startsWith('C:\\') && entry.includes('>') ? 'terminal-command' : 'terminal-response'}>{entry}</div>
                      ))}
                    </div>
                    <div className="terminal-input-row">
                      <label htmlFor="cmd-line">{cmdDirectory}&gt;</label>
                      <input
                        id="cmd-line"
                        autoFocus
                        autoComplete="off"
                        spellCheck="false"
                        maxLength={160}
                        value={cmdInput}
                        onChange={(event) => {
                          cmdDraft.current = event.target.value;
                          setCmdInput(event.target.value);
                          setCmdHistoryIndex(null);
                        }}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter') runCommand();
                          if (!['ArrowUp', 'ArrowDown'].includes(event.key)) return;
                          if (event.key === 'ArrowDown' && cmdHistoryIndex === null) return;
                          const commands = game.investigationHistory.commands;
                          if (!commands.length) return;
                          event.preventDefault();
                          if (event.key === 'ArrowUp' && cmdHistoryIndex === null) cmdDraft.current = cmdInput;
                          const nextIndex = event.key === 'ArrowUp'
                            ? Math.max(0, (cmdHistoryIndex ?? commands.length) - 1)
                            : cmdHistoryIndex >= commands.length - 1
                              ? null
                              : cmdHistoryIndex + 1;
                          setCmdHistoryIndex(nextIndex);
                          setCmdInput(nextIndex === null ? cmdDraft.current : commands[nextIndex]);
                        }}
                        aria-label="Command prompt input"
                      />
                      <button onClick={runCommand} aria-label="Run command">Enter</button>
                    </div>
                  </div>
                )}

                {windowState.appId === 'taskmanager' && (
                  <div className="task-panel">
                    <div className="task-row"><span>Process</span><span>State</span></div>
                    {['explorer.exe', 'mail.exe', 'localindex.exe', 'systemsvc.exe'].map((proc) => (
                      <div key={proc} className="task-row"><span>{proc}</span><span>{proc === 'systemsvc.exe' ? 'Running' : 'Suspended'}</span></div>
                    ))}
                  </div>
                )}

                {windowState.appId === 'eventlog' && (
                  <div className="event-panel">
                    {game.events.map((event) => (
                      <div key={event.id} className="event-row">
                        <strong>{event.type}</strong>
                        <span>{event.text}</span>
                      </div>
                    ))}
                  </div>
                )}

                {windowState.appId === 'registry' && (
                  <div className="registry-panel">
                    <div className="toolbar">Registry Editor — C:\SYSTEM.DAT</div>
                    <div className="registry-tree">
                      <strong>My Computer</strong>
                      <ul>
                        <li>HKEY_CLASSES_ROOT
                          <ul><li>.home → LocalProfile</li><li>.idx → HouseholdIndex</li></ul>
                        </li>
                        <li>HKEY_CURRENT_USER
                          <ul><li>Identity → Unregistered</li><li>LastUser → Mara Vale</li><li>ProfileHome → C:\Users\NULL.HOME</li></ul>
                        </li>
                        <li>HKEY_LOCAL_MACHINE
                          <ul><li>Software\NorthCounty\LocalIndex</li><li>SourceVolume → Not mounted</li></ul>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}

                {windowState.appId === 'paint' && (
                  <div className="paint-panel">
                    <div className="paint-tools">
                      {['#111111', '#bd2424', '#2254a4', '#228744', '#e2bf28', '#ffffff'].map((color) => (
                        <button
                          key={color}
                          aria-label={`Select ${color} paint`}
                          className={`paint-swatch ${paintColor === color ? 'active' : ''}`}
                          style={{ backgroundColor: color }}
                          onClick={() => setPaintColor(color)}
                        />
                      ))}
                      <button className="classic-button" onClick={() => {
                        const canvas = document.getElementById(`paint-${windowState.id}`);
                        canvas?.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
                      }}>Clear</button>
                    </div>
                    <canvas
                      id={`paint-${windowState.id}`}
                      className="paint-canvas"
                      width="560"
                      height="300"
                      aria-label="Paint canvas. Use the pointer to draw."
                      onPointerDown={(event) => {
                        const rect = event.currentTarget.getBoundingClientRect();
                        const context = event.currentTarget.getContext('2d');
                        context.strokeStyle = paintColor;
                        context.lineWidth = 3;
                        context.lineCap = 'square';
                        context.beginPath();
                        context.moveTo((event.clientX - rect.left) * event.currentTarget.width / rect.width, (event.clientY - rect.top) * event.currentTarget.height / rect.height);
                        event.currentTarget.setPointerCapture(event.pointerId);
                      }}
                      onPointerMove={(event) => {
                        if (event.buttons !== 1) return;
                        const rect = event.currentTarget.getBoundingClientRect();
                        const context = event.currentTarget.getContext('2d');
                        context.lineTo((event.clientX - rect.left) * event.currentTarget.width / rect.width, (event.clientY - rect.top) * event.currentTarget.height / rect.height);
                        context.stroke();
                      }}
                    />
                    <p className="paint-caption">A blank page. No date in the corner.</p>
                  </div>
                )}

                {windowState.appId === 'media' && (
                  <div className="media-panel">
                    <div className="media-display">
                      <div className="media-reel">◉</div>
                      <div>
                        <strong>ARCHIVE-CARRIER.WAV</strong>
                        <p>Recovered system tone · 00:18</p>
                      </div>
                    </div>
                    <div className="media-controls">
                      <button className="classic-button" onClick={() => {
                        if (mediaPlaying) {
                          mediaAudio.current?.stop();
                          mediaAudio.current = null;
                          setMediaPlaying(false);
                          return;
                        }
                        try {
                          const AudioContextClass = window.AudioContext || window.webkitAudioContext;
                          if (!AudioContextClass) throw new Error('Web Audio is not available in this browser.');
                          const context = new AudioContextClass();
                          const oscillator = context.createOscillator();
                          const gain = context.createGain();
                          oscillator.type = 'sine';
                          oscillator.frequency.value = 174;
                          gain.gain.value = 0.025 * (game.settings.sound ?? 1);
                          oscillator.connect(gain);
                          gain.connect(context.destination);
                          oscillator.start();
                          mediaAudio.current = { stop: () => { oscillator.stop(); context.close(); } };
                          setMediaPlaying(true);
                        } catch (error) {
                          setPublishMessage(`Playback unavailable: ${error.message}`);
                        }
                      }}>{mediaPlaying ? '■ Stop' : '▶ Play'}</button>
                      <input aria-label="Recording position" type="range" min="0" max="18" defaultValue="0" />
                      <span>{mediaPlaying ? '00:01' : '00:00'} / 00:18</span>
                    </div>
                    <div className="media-transcript">
                      <strong>Reconstruction note / visual alternative</strong>
                      <p>[low carrier tone] The archived transcript reads: “The hall clock is seven minutes slow. Please leave it. I like knowing when I have been home.”</p>
                      <small>Audio clue transcript is available without playback.</small>
                    </div>
                  </div>
                )}

                {windowState.appId === 'stickies' && (
                  <div className="sticky-manager">
                    <p>Desktop notes are saved with this profile. Closed notes remain here until restored.</p>
                    {game.stickyNotes.map((note) => (
                      <div className="sticky-manager-row" key={note.id}>
                        <span className={`sticky-dot sticky-${note.color}`} />
                        <span>{note.title}: {note.text.replaceAll('\n', ' ')}</span>
                        <button className="classic-button" disabled={note.open} onClick={() => setGame((current) => ({
                          ...current,
                          stickyNotes: current.stickyNotes.map((item) => item.id === note.id ? { ...item, open: true } : item),
                        }))}>{note.open ? 'On desktop' : 'Restore'}</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {game.startMenuOpen && (
            <div className="start-menu" role="menu" aria-label="Start menu">
              <div className="start-banner"><strong>DEAD.SYS</strong><span>98</span></div>
              <div className="start-menu-items">
                <div className="start-menu-entry-wrap">
                  <button className={`start-menu-entry ${programsOpen ? 'menu-selected' : ''}`} onClick={() => setProgramsOpen((open) => !open)}>
                    <span className="menu-glyph">▦</span><span>Programs</span><span className="menu-arrow">▶</span>
                  </button>
                  {programsOpen && (
                    <div className="programs-submenu">
                      {shellApps.map((app) => (
                        <button key={app.id} className="start-menu-entry" onClick={() => openWindow(app.id)}>
                          <span className="menu-glyph">{shellIconMap[app.id]}</span><span>{app.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button className="start-menu-entry" onClick={() => runStartAction('documents')}><span className="menu-glyph">▰</span><span>Documents</span><span className="menu-arrow">▶</span></button>
                <button className="start-menu-entry" onClick={() => runStartAction('settings')}><span className="menu-glyph">⚙</span><span>Settings</span><span className="menu-arrow">▶</span></button>
                <button className="start-menu-entry" onClick={() => runStartAction('find')}><span className="menu-glyph">⌕</span><span>Find</span><span className="menu-arrow">▶</span></button>
                <button className="start-menu-entry" onClick={() => runStartAction('help')}><span className="menu-glyph">?</span><span>Help</span></button>
                <button className="start-menu-entry" onClick={() => runStartAction('run')}><span className="menu-glyph">▸</span><span>Run...</span></button>
                <div className="menu-separator" />
                <button className="start-menu-entry" onClick={() => runStartAction('shutdown')}><span className="menu-glyph">⏻</span><span>Shut Down...</span></button>
              </div>
            </div>
          )}

          <div className="taskbar">
            <button className={`start-button ${game.startMenuOpen ? 'pressed' : ''}`} onClick={() => {
              setProgramsOpen(false);
              setGame((current) => ({ ...current, startMenuOpen: !current.startMenuOpen }));
            }}><span className="windows-flag" aria-hidden="true"><i /><i /><i /><i /></span>Start</button>
            <span className="save-indicator" title="Progress is saved in this browser">●</span>
            <div className="task-icons">
              {game.windows.map((win) => (
                <button
                  key={win.id}
                  className={`task-item ${game.activeWindowId === win.id && !win.minimized ? 'task-active' : ''} ${win.minimized || win.animationState === 'minimizing' ? 'task-minimized' : ''}`}
                  aria-label={`${win.title}, ${win.minimized || win.animationState === 'minimizing' ? 'minimized' : game.activeWindowId === win.id ? 'active' : 'open'}`}
                  onClick={() => restoreTaskWindow(win)}
                >
                  <span className="task-app-icon">{shellIconMap[win.appId] ?? '▣'}</span>{win.title}
                </button>
              ))}
            </div>
            <div className="system-tray">
              <span aria-label="Sound enabled" title="Sound">🔊</span>
              <span className="tray-divider" />
              <div className="clock" title="Saturday, 28 March 1998">{clock.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            </div>
          </div>

          {dialog && dialog !== 'powered-off' && (
            <div className="dialog-shade" role="presentation">
              <section className="system-dialog" role="dialog" aria-modal="true" aria-label={`${dialog} dialog`}>
                <header className="dialog-titlebar">
                  <strong>{dialog === 'settings' ? 'Settings' : dialog === 'find' ? 'Find' : dialog === 'run' ? 'Run' : 'Shut Down Windows'}</strong>
                  <button aria-label="Close dialog" onClick={() => setDialog(null)}>×</button>
                </header>
                {dialog === 'settings' && (
                  <div className="dialog-content settings-content">
                    <label><input type="checkbox" checked={game.settings.crt} onChange={(event) => setGame((current) => ({ ...current, settings: { ...current.settings, crt: event.target.checked } }))} /> CRT scanlines</label>
                    <label><input type="checkbox" checked={game.settings.reducedMotion} onChange={(event) => setGame((current) => ({ ...current, settings: { ...current.settings, reducedMotion: event.target.checked } }))} /> Reduced motion</label>
                    <label><input type="checkbox" checked={game.settings.reduceAmbientEffects} onChange={(event) => setGame((current) => ({ ...current, settings: { ...current.settings, reduceAmbientEffects: event.target.checked } }))} /> Reduce intense ambient effects</label>
                    <label>Text size <input type="range" min="0.9" max="1.25" step="0.05" value={game.settings.textScale} onChange={(event) => setGame((current) => ({ ...current, settings: { ...current.settings, textScale: Number(event.target.value) } }))} /></label>
                    <label>Volume <input type="range" min="0" max="1" step="0.05" value={game.settings.sound} onChange={(event) => setGame((current) => ({ ...current, settings: { ...current.settings, sound: Number(event.target.value) } }))} /></label>
                  </div>
                )}
                {dialog === 'find' && (
                  <div className="dialog-content">
                    <label htmlFor="find-files">Find files containing:</label>
                    <input id="find-files" autoFocus value={findText} onChange={(event) => setFindText(event.target.value)} />
                    <div className="find-results">
                      {findText && game.files.filter((file) => isFileVisible(file) && `${file.name} ${file.content}`.toLowerCase().includes(findText.toLowerCase())).map((file) => (
                        <button key={file.id} onClick={() => {
                          setGame((current) => ({ ...current, selectedFileId: file.id, startMenuOpen: false }));
                          setExplorerFolder(file.folder);
                          openWindow('explorer');
                          setDialog(null);
                        }}>{file.path}</button>
                      ))}
                    </div>
                    <div className="dialog-actions"><button className="classic-button" onClick={() => setDialog(null)}>Close</button></div>
                  </div>
                )}
                {dialog === 'run' && (
                  <div className="dialog-content">
                    <p>Type the name of an in-game application.</p>
                    <label htmlFor="run-command">Open:</label>
                    <input id="run-command" autoFocus value={runText} onChange={(event) => setRunText(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') launchRunCommand(); }} />
                    <div className="dialog-actions"><button className="classic-button" onClick={launchRunCommand}>OK</button><button className="classic-button" onClick={() => setDialog(null)}>Cancel</button></div>
                  </div>
                )}
                {dialog === 'shutdown' && (
                  <div className="dialog-content shutdown-content">
                    <p>What do you want the computer to do?</p>
                    <button className="shutdown-choice" onClick={() => {
                      setGame((current) => ({
                        ...current,
                        windows: [],
                        activeWindowId: null,
                        startMenuOpen: false,
                        events: [{ id: `restart-${Date.now()}`, type: 'SYSTEM_RESTARTED', text: 'The simulated operating system restarted.' }, ...current.events].slice(0, 18),
                      }));
                      setBootComplete(false);
                      setDialog(null);
                      window.setTimeout(() => setBootComplete(true), 2200);
                    }}>↻ Restart the computer</button>
                    <button className="shutdown-choice" onClick={() => {
                      setDialog('powered-off');
                      setBootComplete(false);
                    }}>⏻ Shut down the computer</button>
                  </div>
                )}
              </section>
            </div>
          )}

          {dialog === 'powered-off' && (
            <div className="shutdown-screen">
              <div>It is now safe to turn off your computer.</div>
              <button className="classic-button" onClick={() => { setDialog(null); setBootComplete(true); }}>Return to desktop</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
