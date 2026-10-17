import { useEffect, useRef, useState } from 'react';
import './ambientEffects.css';

const INITIAL_DELAY = [25_000, 45_000];
const EVENT_DELAYS = {
  minor: [20_000, 60_000],
  major: [180_000, 420_000],
};
const EYE_DELAYS = {
  early: [90_000, 180_000],
  middle: [60_000, 150_000],
  late: [45_000, 120_000],
};
const EYE_CHANCES = { early: 0.12, middle: 0.28, late: 0.38 };
const MAJOR_COOLDOWN = 180_000;
const DURATIONS = {
  tear: [180, 320],
  blocks: [220, 420],
  image: [260, 440],
  channel: [160, 260],
  stutter: [180, 260],
  scanline: [260, 460],
  flicker: [140, 220],
  impossible: [260, 520],
  eyes: [280, 760],
};
const EYE_PALETTES = ['pale', 'hollow', 'red', 'corrupt', 'sickly'];
const EYE_VARIANTS = ['balanced', 'uneven', 'single', 'narrow'];
const MINOR_EFFECTS = ['tear', 'blocks', 'image', 'channel', 'stutter', 'scanline', 'flicker'];

const between = (range, random) => Math.round(range[0] + random() * (range[1] - range[0]));

export const getAmbientStage = (solvedCount) => (
  solvedCount >= 7 ? 'late' : solvedCount >= 3 ? 'middle' : 'early'
);

export const createAmbientPlan = ({ solvedCount, reduceIntense }, random = Math.random) => {
  const stage = getAmbientStage(solvedCount);
  return {
    stage,
    eyeChance: reduceIntense ? 0 : EYE_CHANCES[stage],
    minorDelay: between(EVENT_DELAYS.minor, random),
    eyesDelay: reduceIntense ? null : between(EYE_DELAYS[stage], random),
    majorDelay: reduceIntense || stage === 'early' ? null : between(EVENT_DELAYS.major, random),
  };
};

export const isMajorCooldownElapsed = (now, lastMajorAt) => now - lastMajorAt >= MAJOR_COOLDOWN;

export const createAmbientEvent = (type, stage, random = Math.random) => {
  if (type === 'eyes') {
    const behaviorRoll = random();
    const behavior = behaviorRoll < 0.08
      ? 'blink'
      : behaviorRoll < 0.2
        ? 'split'
        : behaviorRoll < 0.23 ? 'linger' : 'still';
    return {
      type,
      stage,
      duration: behavior === 'linger' ? between([700, 1_500], random) : between(DURATIONS.eyes, random),
      x: Math.round(8 + random() * 84),
      y: Math.round(8 + random() * 78),
      scale: Number((0.55 + random() * (stage === 'late' ? 2.1 : 0.55)).toFixed(2)),
      palette: EYE_PALETTES[Math.floor(random() * EYE_PALETTES.length)],
      variant: EYE_VARIANTS[Math.floor(random() * EYE_VARIANTS.length)],
      rotation: Math.round(-8 + random() * 16),
    };
  }
  return {
    type,
    stage,
    duration: between(DURATIONS[type] ?? DURATIONS.tear, random),
    x: Math.round(12 + random() * 76),
    y: Math.round(10 + random() * 72),
    layer: type === 'impossible' ? 'screen' : 'desktop',
  };
};

function PixelEyes({ palette, behavior, variant = 'balanced', rotation = 0 }) {
  return (
    <svg
      className={`ambient-eyes-art eyes-${palette} eyes-${behavior} eyes-${variant}`}
      style={{ '--eye-rotation': `${rotation}deg` }}
      viewBox="0 0 40 18"
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      <path className="eye-socket eye-left" d="M1 8 5 3h10l5 5-5 6H5z" />
      <path className="eye-socket eye-right" d="m20 8 5-5h10l5 5-5 6H25z" />
      <path className="eye-white eye-left" d="m4 8 3-3h7l3 3-3 4H7z" />
      <path className="eye-white eye-right" d="m23 8 3-3h7l3 3-3 4h-7z" />
      <path className="eye-pupil eye-left" d="M9 6h4v6H9z" />
      <path className="eye-pupil eye-right" d="M28 6h4v6h-4z" />
      <path className="eye-shine eye-left" d="M7 5h2v2H7z" />
      <path className="eye-shine eye-right" d="M26 5h2v2h-2z" />
      <path className="eye-noise" d="M0 1h5v1H0zm27 15h7v1h-7zM16 0h2v2h-2z" />
    </svg>
  );
}

function EffectArtwork({ event }) {
  if (event.type === 'eyes') {
    return <PixelEyes palette={event.palette} behavior={event.behavior} variant={event.variant} rotation={event.rotation} />;
  }
  if (event.type === 'blocks') {
    return <div className="ambient-blocks">{Array.from({ length: 7 }, (_, index) => <i key={index} />)}</div>;
  }
  if (event.type === 'image') {
    return <div className="ambient-image-fragments">{Array.from({ length: 5 }, (_, index) => <i key={index} />)}</div>;
  }
  if (event.type === 'impossible') return <div className="ambient-impossible" aria-hidden="true"><PixelEyes palette="corrupt" behavior="still" /></div>;
  return null;
}

export default function AmbientEffects({
  enabled,
  pageVisible,
  reducedMotion,
  solvedCount,
  debugEvent = null,
  onDebugEventEnd,
}) {
  const [event, setEvent] = useState(null);
  const [systemReduced, setSystemReduced] = useState(() => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false);
  const lastMajorAt = useRef(0);
  const motionDisabled = reducedMotion || systemReduced;

  useEffect(() => {
    const media = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!media) return undefined;
    const update = () => setSystemReduced(media.matches);
    media.addEventListener?.('change', update);
    return () => media.removeEventListener?.('change', update);
  }, []);

  useEffect(() => {
    if (!enabled || !pageVisible || motionDisabled || debugEvent) {
      setEvent(null);
      return undefined;
    }

    let timer;
    let cancelled = false;
    const stage = getAmbientStage(solvedCount);
    const scheduleNext = (deadlines) => {
      if (cancelled) return;
      const [category, dueAt] = Object.entries(deadlines)
        .filter(([, due]) => due !== null)
        .sort((a, b) => a[1] - b[1])[0] ?? [];
      if (!category) return;
      timer = window.setTimeout(() => {
        if (cancelled) return;
        const now = Date.now();
        if (category === 'major' && !isMajorCooldownElapsed(now, lastMajorAt.current)) {
          deadlines.major = now + MAJOR_COOLDOWN - (now - lastMajorAt.current);
          scheduleNext(deadlines);
          return;
        }
        if (category === 'eyes' && Math.random() >= EYE_CHANCES[stage]) {
          deadlines.eyes = now + between(EYE_DELAYS[stage], Math.random);
          scheduleNext(deadlines);
          return;
        }

        const type = category === 'major'
          ? 'impossible'
          : category === 'eyes'
            ? 'eyes'
            : MINOR_EFFECTS[Math.floor(Math.random() * MINOR_EFFECTS.length)];
        const nextEvent = createAmbientEvent(type, stage);
        if (category === 'major') lastMajorAt.current = now;
        setEvent(nextEvent);
        timer = window.setTimeout(() => {
          if (cancelled) return;
          setEvent(null);
          const finishedAt = Date.now();
          const nextPlan = createAmbientPlan({ solvedCount, reduceIntense: false });
          deadlines[category] = finishedAt + nextPlan[`${category}Delay`];
          Object.entries(deadlines).forEach(([key, due]) => {
            if (key !== category && due !== null && due <= finishedAt) {
              deadlines[key] = finishedAt + nextPlan[`${key}Delay`];
            }
          });
          scheduleNext(deadlines);
        }, nextEvent.duration);
      }, Math.max(0, dueAt - Date.now()));
    };

    timer = window.setTimeout(() => {
      if (cancelled) return;
      const plan = createAmbientPlan({ solvedCount, reduceIntense: false });
      const now = Date.now();
      const deadlines = {
        minor: now + plan.minorDelay,
        eyes: plan.eyesDelay === null ? null : now + plan.eyesDelay,
        major: plan.majorDelay === null ? null : now + plan.majorDelay,
      };
      scheduleNext(deadlines);
    }, between(INITIAL_DELAY, Math.random));
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      setEvent(null);
    };
  }, [enabled, pageVisible, motionDisabled, solvedCount, debugEvent]);

  useEffect(() => {
    if (!debugEvent || !pageVisible || motionDisabled) return undefined;
    setEvent(debugEvent);
    const timer = window.setTimeout(() => {
      setEvent(null);
      onDebugEventEnd?.(null);
    }, debugEvent.duration);
    return () => {
      window.clearTimeout(timer);
      setEvent(null);
    };
  }, [debugEvent, pageVisible, motionDisabled, onDebugEventEnd]);

  if (!event || motionDisabled || !pageVisible) return null;
  const style = {
    '--event-duration': `${event.duration}ms`,
    '--event-x': `${event.x}%`,
    '--event-y': `${event.y}%`,
    '--eye-scale': event.scale,
  };
  return (
    <div key={event.debugVersion ?? event.type} className={`ambient-layer ambient-${event.type} ${event.layer === 'screen' ? 'ambient-screen-layer' : ''}`} style={style} aria-hidden="true">
      <EffectArtwork event={event} />
    </div>
  );
}
