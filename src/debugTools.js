import {
  buildInitialGameState,
  getPuzzleById,
  puzzleDefinitions,
  submitPuzzleAnswer,
} from './gameData';

export const getPuzzleSolveOrder = (puzzleId, puzzleStatus, definitions = puzzleDefinitions) => {
  const ordered = [];
  const visited = new Set();
  const visit = (id) => {
    if (visited.has(id) || puzzleStatus[id]?.solved) return;
    const puzzle = definitions.find((entry) => entry.id === id);
    if (!puzzle) throw new Error(`Unknown debug puzzle: ${id}`);
    visited.add(id);
    puzzle.prerequisites.forEach(visit);
    ordered.push(puzzle);
  };

  visit(puzzleId);
  return ordered;
};

export const solvePuzzleForDebug = (state, puzzleId) => {
  const order = getPuzzleSolveOrder(puzzleId, state.puzzleStatus);
  let nextState = state;
  order.forEach((puzzle) => {
    const result = submitPuzzleAnswer(nextState, puzzle.id, puzzle.solution);
    if (!result.solved) {
      throw new Error(`Could not solve debug puzzle "${puzzle.id}": ${result.reason ?? 'unknown reason'}`);
    }
    nextState = result.state;
  });
  return { state: nextState, solvedIds: order.map((puzzle) => puzzle.id) };
};

export const resetPuzzleProgress = (state) => {
  const initial = buildInitialGameState();
  return {
    ...state,
    chapter: initial.chapter,
    puzzleStatus: initial.puzzleStatus,
    flags: initial.flags,
    events: initial.events,
    notebook: initial.notebook,
  };
};

export const getDebugPuzzleSolution = (puzzleId) => getPuzzleById(puzzleId)?.solution ?? '';
