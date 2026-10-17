import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import App from './App';
import {
  buildInitialGameState,
  isPuzzleUnlocked,
  puzzleDefinitions,
  submitPuzzleAnswer,
} from './gameData';

const enterDesktop = () => {
  fireEvent.click(screen.getByRole('button', { name: 'Skip startup sequence' }));
};

const completedCampaign = () => {
  let state = buildInitialGameState();
  for (let pass = 0; pass < puzzleDefinitions.length; pass += 1) {
    puzzleDefinitions.forEach((puzzle) => {
      if (state.puzzleStatus[puzzle.id].solved || !isPuzzleUnlocked(puzzle.id, state.puzzleStatus)) return;
      const result = submitPuzzleAnswer(state, puzzle.id, puzzle.solution);
      state = result.state;
    });
  }
  return state;
};

afterEach(() => {
  cleanup();
  localStorage.clear();
});

describe('desktop evidence presentation', () => {
  it('shows the diagnostic hint without listing TRACE among ordinary commands', () => {
    render(<App />);
    enterDesktop();
    fireEvent.doubleClick(screen.getByRole('button', { name: 'Open Command Prompt' }));

    const input = screen.getByRole('textbox', { name: 'Command prompt input' });
    fireEvent.change(input, { target: { value: 'HELP' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(screen.getByText('Commands: HELP, DIR, CD, TYPE, FIND, ATTRIB, TREE, CLS, DATE, TIME')).toBeInTheDocument();
    expect(screen.getByText('System diagnostics use the log basename as the command.')).toBeInTheDocument();
    expect(screen.queryByText(/Commands:.*TRACE/)).not.toBeInTheDocument();
  });

  it('uses custom local SVG icons throughout the Programs menu', () => {
    render(<App />);
    enterDesktop();
    fireEvent.click(screen.getByRole('button', { name: 'Start' }));
    fireEvent.click(screen.getByRole('button', { name: /Programs/ }));

    const programs = document.querySelector('.programs-submenu');
    expect(programs.querySelectorAll('svg.menu-icon')).toHaveLength(13);
    expect(within(programs).getByRole('button', { name: /Task Manager/ }).querySelector('svg')).toBeInTheDocument();
  });

  it('labels file metadata separately from browser-cache provenance', () => {
    render(<App />);
    enterDesktop();
    fireEvent.doubleClick(screen.getByRole('button', { name: 'Open My Computer' }));

    expect(screen.getByText('File modified')).toBeInTheDocument();
    expect(screen.getByText('Content / event date')).toBeInTheDocument();
    expect(screen.getByText('Source / provenance')).toBeInTheDocument();

    fireEvent.doubleClick(screen.getByRole('button', { name: 'Open Guestbook' }));
    expect(screen.getByText(/Recovered browser-cache copy/)).toBeInTheDocument();
  });

  it('offers a direct, non-forced path to the last-room record after the synthesis', () => {
    localStorage.setItem('deadsys-save-v1', JSON.stringify(completedCampaign()));
    render(<App />);
    enterDesktop();
    fireEvent.doubleClick(screen.getByRole('button', { name: 'Open Knowledge Archive' }));
    fireEvent.click(screen.getByRole('button', { name: /What the machine remembers/ }));

    fireEvent.click(screen.getByRole('button', { name: 'Read last-room.txt' }));
    expect(screen.getByRole('heading', { name: 'last-room.txt' })).toBeInTheDocument();
    expect(screen.getByText(/The records do not establish a resident/)).toBeInTheDocument();
  });

  it('keeps the Evidence Map undiscovered-only and builds a local case report', () => {
    render(<App />);
    enterDesktop();
    fireEvent.doubleClick(screen.getByRole('button', { name: 'Open Evidence Map' }));

    expect(screen.getByText(/No records recorded yet/)).toBeInTheDocument();
    expect(screen.queryByText('trace.log')).not.toBeInTheDocument();
    expect(screen.queryByText('last-room.txt')).not.toBeInTheDocument();

    fireEvent.doubleClick(screen.getByRole('button', { name: 'Open My Computer' }));
    fireEvent.click(screen.getByRole('button', { name: /address-search\.txt/ }));
    fireEvent.doubleClick(screen.getByRole('button', { name: 'Open Evidence Map' }));

    const recordList = screen.getByRole('region', { name: 'Discovered evidence records' });
    expect(within(recordList).getByText('address-search.txt')).toBeInTheDocument();
    expect(within(recordList).queryByText('trace.log')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', { name: 'Case Report' }));
    const preview = screen.getByLabelText('Report preview — review before sharing');
    expect(preview.value).toContain('address-search.txt');
    expect(preview.value).not.toContain('MARA IS THE MEMORY');
    fireEvent.click(screen.getByLabelText('Include complete spoiler section and answer key'));
    expect(preview.value).toContain('MARA IS THE MEMORY');
    expect(preview.value).toContain('LAST RECORD: The machine remembers Mara.');
  });

  it('records actual application opens and persisted command history in Recent Documents', () => {
    render(<App />);
    enterDesktop();
    fireEvent.doubleClick(screen.getByRole('button', { name: 'Open My Computer' }));
    fireEvent.click(screen.getByRole('button', { name: 'Recent Documents' }));
    expect(screen.getByRole('button', { name: /profile.ini/ })).toBeInTheDocument();

    fireEvent.doubleClick(screen.getByRole('button', { name: 'Open Command Prompt' }));
    const input = screen.getByRole('textbox', { name: 'Command prompt input' });
    fireEvent.change(input, { target: { value: 'HELP' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    fireEvent.doubleClick(screen.getByRole('button', { name: 'Open My Computer' }));
    fireEvent.click(screen.getByRole('button', { name: 'Recent Documents' }));
    expect(screen.getByText('HELP', { selector: 'code' })).toBeInTheDocument();
    fireEvent.doubleClick(screen.getByRole('button', { name: 'Open Command Prompt' }));
    fireEvent.keyDown(input, { key: 'ArrowUp' });
    expect(input).toHaveValue('HELP');
  });

  it('follows discovered map relationships across active type filters', () => {
    const state = buildInitialGameState();
    state.investigationHistory.recentDocuments = [
      { id: 'file-profile', kind: 'explorer', openedAt: '11:11' },
      { id: 'file-staff', kind: 'explorer', openedAt: '11:12' },
    ];
    localStorage.setItem('deadsys-save-v1', JSON.stringify(state));
    render(<App />);
    enterDesktop();
    fireEvent.doubleClick(screen.getByRole('button', { name: 'Open Evidence Map' }));
    fireEvent.change(screen.getByRole('combobox', { name: 'Filter evidence by type' }), { target: { value: 'Profile claim' } });

    fireEvent.click(screen.getByRole('button', { name: 'roster.txt' }));
    expect(screen.getByRole('heading', { name: 'roster.txt' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Filter evidence by type' })).toHaveValue('All types');
  });

  it('reveals the graduated hint ladder without solving or advancing the puzzle', () => {
    let state = buildInitialGameState();
    state = submitPuzzleAnswer(state, 'puzzle-account', 'MARA VALE').state;
    localStorage.setItem('deadsys-save-v1', JSON.stringify(state));
    render(<App />);
    enterDesktop();
    fireEvent.doubleClick(screen.getByRole('button', { name: 'Open Knowledge Archive' }));
    fireEvent.click(screen.getByRole('button', { name: /Date of the transfer/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Show hint 1 of 4' }));
    fireEvent.click(screen.getByRole('button', { name: 'Show hint 2 of 4' }));
    fireEvent.click(screen.getByRole('button', { name: 'Show hint 3 of 4' }));
    fireEvent.click(screen.getByRole('button', { name: 'Show hint 4 of 4' }));

    expect(screen.getByText('Answer and reasoning')).toBeInTheDocument();
    expect(screen.getByText(/Answer 1997-11-06/)).toBeInTheDocument();
    const saved = JSON.parse(localStorage.getItem('deadsys-save-v1'));
    expect(saved.puzzleStatus['puzzle-dossier']).toMatchObject({ solved: false, attempts: 0, hintLevel: 4 });
  });
});
