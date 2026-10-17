import { act, cleanup, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import AmbientEffects, {
  createAmbientEvent,
  createAmbientPlan,
  getAmbientStage,
  isMajorCooldownElapsed,
} from './AmbientEffects';

describe('ambient effects', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('scales eligible events with campaign progress and the reduced-intensity setting', () => {
    expect(getAmbientStage(0)).toBe('early');
    expect(getAmbientStage(4)).toBe('middle');
    expect(getAmbientStage(8)).toBe('late');

    const plan = createAmbientPlan({
      solvedCount: 8,
      reduceIntense: false,
    }, () => 0.5);
    expect(plan.majorDelay).toBeGreaterThanOrEqual(180_000);
    expect(plan.majorDelay).toBeLessThanOrEqual(420_000);
    expect(plan.minorDelay).toBeGreaterThanOrEqual(20_000);
    expect(plan.minorDelay).toBeLessThanOrEqual(60_000);
    expect(plan.eyesDelay).toBeGreaterThanOrEqual(45_000);
    expect(plan.eyesDelay).toBeLessThanOrEqual(120_000);

    const suppressed = createAmbientPlan({
      solvedCount: 8,
      reduceIntense: true,
    }, () => 0.5);
    expect(suppressed.eyesDelay).toBeNull();
    expect(suppressed.majorDelay).toBeNull();

    const early = createAmbientPlan({
      solvedCount: 0,
      reduceIntense: false,
    }, () => 0.5);
    const middle = createAmbientPlan({
      solvedCount: 4,
      reduceIntense: false,
    }, () => 0.5);
    expect(early.eyeChance).toBeLessThan(middle.eyeChance);
    expect(early.eyesDelay).toBeGreaterThan(middle.eyesDelay);
    expect(early.majorDelay).toBeNull();
    expect(isMajorCooldownElapsed(1_000_000, 820_000)).toBe(true);
    expect(isMajorCooldownElapsed(1_000_000, 990_000)).toBe(false);
  });

  it('randomizes eye appearance properties and respects effect duration bounds', () => {
    let seed = 1;
    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    const first = createAmbientEvent('eyes', 'early', random);
    const second = createAmbientEvent('eyes', 'late', random);
    expect(first).not.toMatchObject({ x: second.x, y: second.y, palette: second.palette });
    expect(first.duration).toBeGreaterThanOrEqual(280);
    expect(first.duration).toBeLessThanOrEqual(760);
    expect(second.scale).toBeGreaterThan(first.scale);
  });

  it('waits before the first event and clears its pending timer on unmount', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const { container, unmount } = render(
      <AmbientEffects enabled pageVisible reducedMotion={false} solvedCount={0} />,
    );

    act(() => vi.advanceTimersByTime(44_999));
    expect(container.querySelector('.ambient-layer')).toBeNull();
    act(() => vi.advanceTimersByTime(1));
    expect(container.querySelector('.ambient-tear')).not.toBeNull();

    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('runs one effect at a time and reschedules after it ends', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const { container, unmount } = render(
      <AmbientEffects enabled pageVisible reducedMotion={false} solvedCount={0} />,
    );

    act(() => vi.advanceTimersByTime(45_000));
    expect(container.querySelector('.ambient-tear')).not.toBeNull();
    expect(vi.getTimerCount()).toBe(1);

    act(() => vi.advanceTimersByTime(180));
    expect(container.querySelector('.ambient-layer')).toBeNull();
    expect(vi.getTimerCount()).toBe(1);
    act(() => vi.advanceTimersByTime(19_999));
    expect(container.querySelector('.ambient-layer')).toBeNull();
    act(() => vi.advanceTimersByTime(1));
    expect(container.querySelector('.ambient-tear')).not.toBeNull();

    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('does not schedule effects while hidden or when motion is reduced', () => {
    const hidden = render(<AmbientEffects enabled pageVisible={false} reducedMotion={false} solvedCount={0} />);
    expect(vi.getTimerCount()).toBe(0);
    hidden.unmount();

    const reduced = render(<AmbientEffects enabled pageVisible reducedMotion solvedCount={0} />);
    expect(vi.getTimerCount()).toBe(0);
    expect(reduced.container.querySelector('.ambient-layer')).toBeNull();
  });

  it('clears pending work while hidden and starts a fresh schedule when visible again', () => {
    const { container, rerender, unmount } = render(
      <AmbientEffects enabled pageVisible reducedMotion={false} solvedCount={0} />,
    );
    expect(vi.getTimerCount()).toBe(1);

    rerender(<AmbientEffects enabled pageVisible={false} reducedMotion={false} solvedCount={0} />);
    expect(vi.getTimerCount()).toBe(0);
    act(() => vi.advanceTimersByTime(60_000));
    expect(container.querySelector('.ambient-layer')).toBeNull();

    rerender(<AmbientEffects enabled pageVisible reducedMotion={false} solvedCount={0} />);
    expect(vi.getTimerCount()).toBe(1);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});
