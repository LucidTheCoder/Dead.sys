import { describe, expect, it } from 'vitest';
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
  mailMessages,
  migrateGameState,
  narrativeBible,
  puzzleDefinitions,
  recordCommand,
  recordRecentDocument,
  sortEvidenceTimeline,
  submitPuzzleAnswer,
  validatePuzzleGraph,
} from './gameData';

describe('NULL.HOME investigation', () => {
  it('starts with the new archive, story notes, and unsolved campaign', () => {
    const state = buildInitialGameState();
    expect(state.version).toBe(1);
    expect(state.settings.reduceAmbientEffects).toBe(false);
    expect(state.files.find((file) => file.id === 'file-address').content).toContain('no registered street');
    expect(state.stickyNotes).toHaveLength(5);
    expect(state.stickyNotes.every((note) => note.open)).toBe(true);
    expect(state.stickyNotes[2].text).toContain('2 doors? 3 doors?');
    expect(state.puzzleStatus['puzzle-account'].unlocked).toBe(true);
    expect(state.puzzleStatus['puzzle-boot'].unlocked).toBe(true);
    expect(narrativeBible.groundTruth.join(' ')).toContain('not independent proof');
  });

  it('accepts current findings and compatible legacy answer aliases', () => {
    expect(getPuzzleById('puzzle-account').validate('mara vale')).toBe(true);
    expect(getPuzzleById('puzzle-account').validate('MARA')).toBe(true);
    expect(getPuzzleById('puzzle-dossier').validate('1997-11-06')).toBe(true);
    expect(getPuzzleById('puzzle-dossier').validate('06/11/1997')).toBe(true);
    expect(getPuzzleById('puzzle-dossier').validate('11/06/1997')).toBe(false);
    expect(getPuzzleById('puzzle-trace').validate('1997-11-09')).toBe(true);
    expect(getPuzzleById('puzzle-chronology').validate('02/06/1997')).toBe(true);
    expect(getPuzzleById('puzzle-chronology').validate('06/02/1997')).toBe(false);
    expect(getPuzzleById('puzzle-remember').validate('NULL.HOME')).toBe(true);
    expect(getPuzzleById('puzzle-remember').validate('REMEMBER')).toBe(true);
    expect(getPuzzleById('puzzle-narrative').validate('MARA IS THE MEMORY')).toBe(true);
  });

  it('keeps record event dates separate from file-modified metadata and source claims', () => {
    expect(fileRecordDetails['file-staff'].contentDate).toContain('1997-06-02');
    expect(fileRecordDetails['file-staff'].contentDate).not.toContain('modified');
    expect(fileRecordDetails['file-system'].contentDate).toContain('1997-11-09');
    expect(fileRecordDetails['file-system'].contentDate).not.toContain('file modified');
    expect(fileRecordDetails['file-shopping'].contentDate).not.toContain('modified');
    expect(fileRecordDetails['file-guestbook'].contentDate).toContain('undated');
    expect(fileRecordDetails['file-snapshot'].provenance).toContain('not independent corroboration');
    expect(fileRecordDetails['file-last-room'].provenance).toContain('unresolved');
    expect(mailMessages.map((mail) => mail.sourceNote)).toHaveLength(3);
    expect(mailMessages[1].sourceNote).toContain('not an independent image record');
  });

  it('has a valid dependency graph and every puzzle is reachable', () => {
    expect(validatePuzzleGraph()).toBe(true);
    const solved = {};
    for (let pass = 0; pass < puzzleDefinitions.length; pass += 1) {
      puzzleDefinitions.forEach((puzzle) => {
        const status = Object.fromEntries(Object.entries(solved).map(([id]) => [id, { solved: true }]));
        if (isPuzzleUnlocked(puzzle.id, status)) solved[puzzle.id] = true;
      });
    }
    expect(Object.keys(solved)).toHaveLength(puzzleDefinitions.length);
  });

  it.each([
    ['profile first', ['puzzle-account', 'puzzle-boot']],
    ['registry first', ['puzzle-boot', 'puzzle-account']],
  ])('can complete the campaign from the %s starting order', (_label, startingOrder) => {
    let state = buildInitialGameState();
    const campaign = [
      ...startingOrder.map((id) => [
        id,
        id === 'puzzle-account' ? 'MARA VALE' : 'UNREGISTERED',
      ]),
      ['puzzle-dossier', '1997-11-06'],
      ['puzzle-trace', '1997-11-09'],
      ['puzzle-remember', 'NULL.HOME'],
      ['puzzle-hex', 'MARA VALE'],
      ['puzzle-command', 'TRACE'],
      ['puzzle-chronology', '1997-06-02'],
      ['puzzle-browser', 'NEXT'],
      ['puzzle-narrative', 'MARA IS THE MEMORY'],
    ];

    campaign.forEach(([id, answer]) => {
      const result = submitPuzzleAnswer(state, id, answer);
      expect(result.solved, id).toBe(true);
      state = result.state;
    });

    expect(state.flags.finalSequence).toBe(true);
    expect(state.chapter).toBe(4);
    expect(state.events.some((event) => event.type === 'ENDING_REACHED')).toBe(true);
    expect(state.events.find((event) => event.type === 'ENDING_REACHED').text).toBe(
      'The recovered record confirms that the machine remembers Mara. It cannot confirm whether the house or its resident existed outside the archive.',
    );
    expect(state.puzzleStatus['puzzle-narrative'].solved).toBe(true);
    expect(state.notebook.evidence.join(' ')).toContain('not independent proof');
    const endingRecord = state.files.find((file) => file.id === 'file-last-room');
    expect(endingRecord.content).toContain('A short system sample found no mounted volume; it cannot tell us what came before.');
    expect(endingRecord.content).not.toContain('no volume supplied it');
    expect(endingRecord.content).toContain('Welcome back.');
    expect(endingRecord.lockedBy).toBe('puzzle-narrative');

    const restored = migrateGameState(state);
    expect(restored.flags.finalSequence).toBe(true);
    expect(restored.puzzleStatus['puzzle-narrative'].solved).toBe(true);
    expect(restored.notebook.evidence.join(' ')).toContain('not independent proof');
    expect(restored.files.find((file) => file.id === 'file-last-room').content).toContain('Welcome back.');
  });

  it('enforces every declared prerequisite and rejects incorrect answers without solving', () => {
    const allSolved = Object.fromEntries(puzzleDefinitions.map((puzzle) => [
      puzzle.id,
      { solved: true, attempts: 0, unlocked: true },
    ]));

    puzzleDefinitions.forEach((puzzle) => {
      puzzle.prerequisites.forEach((dependency) => {
        const status = {
          ...allSolved,
          [puzzle.id]: { solved: false, attempts: 0, unlocked: false },
          [dependency]: { solved: false, attempts: 0, unlocked: false },
        };
        expect(isPuzzleUnlocked(puzzle.id, status), `${puzzle.id} requires ${dependency}`).toBe(false);
        const result = submitPuzzleAnswer({
          ...buildInitialGameState(),
          puzzleStatus: status,
        }, puzzle.id, puzzle.solution);
        expect(result.reason).toBe('locked');
        expect(result.state.puzzleStatus[puzzle.id].attempts).toBe(0);
      });
    });

    const wrong = submitPuzzleAnswer(buildInitialGameState(), 'puzzle-account', 'ELIAS ROWAN');
    expect(wrong.solved).toBe(false);
    expect(wrong.state.puzzleStatus['puzzle-account'].attempts).toBe(1);
  });

  it('queues the mount anomaly once and marks it seen when saved progress is restored', () => {
    let state = buildInitialGameState();
    [
      ['puzzle-account', 'MARA VALE'],
      ['puzzle-boot', 'UNREGISTERED'],
      ['puzzle-dossier', '1997-11-06'],
      ['puzzle-trace', '1997-11-09'],
    ].forEach(([id, answer]) => {
      const result = submitPuzzleAnswer(state, id, answer);
      expect(result.solved, id).toBe(true);
      state = result.state;
    });

    expect(state.flags.mountEchoPending).toBe(true);
    expect(state.flags.mountEchoSeen).toBe(false);
    expect(submitPuzzleAnswer(state, 'puzzle-trace', '1997-11-09').alreadySolved).toBe(true);

    const restored = migrateGameState(state);
    expect(restored.flags.mountEchoPending).toBe(false);
    expect(restored.flags.mountEchoSeen).toBe(true);
  });

  it('blocks locked submissions and persists graduated hints', () => {
    let initial = buildInitialGameState();
    const locked = submitPuzzleAnswer(initial, 'puzzle-trace', '1997-11-09');
    expect(locked.reason).toBe('locked');
    expect(locked.state.puzzleStatus['puzzle-trace'].attempts).toBe(0);

    initial = submitPuzzleAnswer(initial, 'puzzle-account', 'MARA VALE').state;
    let state = initial;
    for (let index = 0; index < 5; index += 1) {
      state = advancePuzzleHint(state, 'puzzle-dossier');
    }
    expect(state.puzzleStatus['puzzle-dossier'].hintLevel).toBe(4);
    expect(advancePuzzleHint(state, 'puzzle-dossier').puzzleStatus['puzzle-dossier'].hintLevel).toBe(4);
    expect(advancePuzzleHint(state, 'puzzle-trace').puzzleStatus['puzzle-trace'].hintLevel).toBe(0);
    expect(puzzleDefinitions.every((puzzle) => puzzle.hints.length === 4)).toBe(true);
    expect(state.puzzleStatus['puzzle-dossier']).toMatchObject({ solved: false, attempts: 0, hintLevel: 4 });
    expect(state.flags).toEqual(initial.flags);
    expect(state.notebook).toEqual(initial.notebook);
  });

  it('shows discovered records only and keeps ordinary reports free of answer spoilers', () => {
    const initial = buildInitialGameState();
    const history = recordRecentDocument(initial.investigationHistory, {
      id: 'file-profile',
      kind: 'explorer',
      openedAt: 'Mar 28, 11:11 AM',
    });
    const observed = { ...initial, investigationHistory: history, caseHypothesis: 'Maybe the copy created the profile.' };
    expect(getDiscoveredEvidence(initial)).toHaveLength(0);
    expect(getDiscoveredEvidence(observed).map((record) => record.id)).toEqual(['file-profile']);

    const ordinaryReport = buildCaseReport(observed);
    expect(ordinaryReport).toContain('profile.ini');
    expect(ordinaryReport).toContain('Player interpretation (not canonical evidence)');
    expect(ordinaryReport).not.toContain('MARA IS THE MEMORY');
    expect(ordinaryReport).not.toContain('last-room.txt');

    const spoilerReport = buildCaseReport(observed, { includeSpoilers: true });
    expect(spoilerReport).toContain('MARA IS THE MEMORY');
    expect(spoilerReport).toContain('LAST RECORD: The machine remembers Mara.');
    expect(spoilerReport).toContain('last-room.txt');
    expect(buildCaseReport(observed, { includePlayerHypothesis: false })).not.toContain('Maybe the copy created the profile.');
  });

  it('validates evidence catalogue links and persists bounded recent activity', () => {
    const evidenceIds = new Set(evidenceRecords.map((record) => record.id));
    expect(evidenceRecords.every((record) => record.relationships.every((relation) => evidenceIds.has(relation.id)))).toBe(true);
    expect(evidenceById['file-system'].dateType).toBeTruthy();
    const orderedTimeline = sortEvidenceTimeline([
      evidenceById['mail-2'],
      evidenceById['file-house'],
      evidenceById['page-guestbook'],
    ]);
    expect(orderedTimeline.map((record) => record.id)).toEqual(['file-house', 'mail-2', 'page-guestbook']);

    let history = recordRecentDocument({}, { id: 'file-profile', kind: 'explorer', openedAt: '11:11' });
    history = recordRecentDocument(history, { id: 'file-profile', kind: 'explorer', openedAt: '11:12' });
    history = recordCommand(history, 'HELP');
    expect(history.recentDocuments).toEqual([{ id: 'file-profile', kind: 'explorer', openedAt: '11:12' }]);
    expect(recordCommand({}, 'x'.repeat(180)).commands[0]).toHaveLength(160);
  });

  it('migrates old saves without losing progress, user notes, or sticky-note state', () => {
    const oldSave = buildInitialGameState();
    oldSave.notes = 'My own case notes';
    oldSave.settings.reduceAmbientEffects = true;
    oldSave.stickyNotes[0].x = 517;
    oldSave.stickyNotes[0].open = false;
    oldSave.puzzleStatus['puzzle-account'] = { solved: true, attempts: 2, unlocked: true };
    oldSave.files = [{ id: 'old-mara-file', content: 'old story' }];
    oldSave.events = [
      { id: 'puzzle-puzzle-account', type: 'PUZZLE_SOLVED', text: 'old Mara plot event' },
      { id: 'restart-1', type: 'SYSTEM_RESTARTED', text: 'The simulated operating system restarted.' },
    ];
    oldSave.investigationHistory = {
      recentDocuments: [
        { id: 'file-profile', kind: 'explorer', openedAt: '11:11' },
        { id: 'file-system', kind: 'registry', openedAt: '11:12' },
        { id: 'unknown', kind: 'explorer', openedAt: '11:13' },
      ],
      commands: ['HELP', 'x'.repeat(180)],
    };

    const migrated = migrateGameState(oldSave);
    expect(migrated.notes).toBe('My own case notes');
    expect(migrated.settings.reduceAmbientEffects).toBe(true);
    expect(migrated.stickyNotes[0]).toMatchObject({ x: 517, open: false });
    expect(migrated.stickyNotes[0].text).toContain('Call Eli back!');
    expect(migrated.puzzleStatus['puzzle-account']).toMatchObject({ solved: true, attempts: 2 });
    expect(migrated.files.some((file) => file.id === 'file-address')).toBe(true);
    expect(migrated.files.some((file) => file.id === 'old-mara-file')).toBe(false);
    expect(migrated.browserPages.find((page) => page.id === 'guestbook').sourceNote).toContain('Recovered browser-cache copy');
    expect(migrated.events.find((event) => event.id === 'puzzle-puzzle-account').text).toContain('Name on the profile');
    expect(migrated.events.some((event) => event.id === 'restart-1')).toBe(true);
    expect(migrated.investigationHistory.recentDocuments).toEqual([
      { id: 'file-profile', kind: 'explorer', openedAt: '11:11' },
    ]);
    expect(migrated.investigationHistory.commands).toEqual(['HELP', 'x'.repeat(160)]);
  });

  it('defaults the ambient-effects preference for saves created before the setting existed', () => {
    const legacySave = buildInitialGameState();
    delete legacySave.settings.reduceAmbientEffects;

    expect(migrateGameState(legacySave).settings.reduceAmbientEffects).toBe(false);
  });
});
