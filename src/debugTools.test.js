import { describe, expect, it } from 'vitest';
import { buildInitialGameState } from './gameData';
import {
  getDebugPuzzleSolution,
  getPuzzleSolveOrder,
  resetPuzzleProgress,
  solvePuzzleForDebug,
} from './debugTools';

describe('debug puzzle tools', () => {
  it('orders prerequisites before the requested puzzle and solves through real submissions', () => {
    const initial = buildInitialGameState();
    const order = getPuzzleSolveOrder('puzzle-chronology', initial.puzzleStatus);
    expect(order.map((puzzle) => puzzle.id)).toEqual([
      'puzzle-account',
      'puzzle-dossier',
      'puzzle-trace',
      'puzzle-chronology',
    ]);

    const result = solvePuzzleForDebug(initial, 'puzzle-chronology');
    expect(result.solvedIds).toEqual(order.map((puzzle) => puzzle.id));
    result.solvedIds.forEach((id) => expect(result.state.puzzleStatus[id].solved).toBe(true));
    expect(result.state.flags.mountEchoPending).toBe(true);
    expect(getDebugPuzzleSolution('puzzle-chronology')).toBe('1997-06-02');
  });

  it('does not resubmit already-solved prerequisites', () => {
    const initial = buildInitialGameState();
    const first = solvePuzzleForDebug(initial, 'puzzle-account');
    const second = solvePuzzleForDebug(first.state, 'puzzle-account');
    expect(second.solvedIds).toEqual([]);
    expect(second.state).toBe(first.state);
  });

  it('resets campaign progress while preserving other saved settings and user data', () => {
    const initial = buildInitialGameState();
    const solved = solvePuzzleForDebug(initial, 'puzzle-account').state;
    const customized = {
      ...solved,
      notes: 'Keep these user notes',
      settings: { ...solved.settings, reduceAmbientEffects: true },
      windows: [{ id: 'notepad-1', appId: 'notepad' }],
    };
    const reset = resetPuzzleProgress(customized);

    expect(reset.puzzleStatus['puzzle-account'].solved).toBe(false);
    expect(reset.flags.finalSequence).toBe(false);
    expect(reset.chapter).toBe(1);
    expect(reset.notes).toBe('Keep these user notes');
    expect(reset.settings.reduceAmbientEffects).toBe(true);
    expect(reset.windows).toEqual(customized.windows);
  });

  it('reports unknown puzzle identifiers rather than silently skipping them', () => {
    expect(() => getPuzzleSolveOrder('missing-puzzle', {})).toThrow('Unknown debug puzzle');
  });
});
