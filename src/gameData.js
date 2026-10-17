export const GAME_VERSION = 1;

const deepClone = (value) => JSON.parse(JSON.stringify(value));

export const shellApps = [
  { id: 'explorer', label: 'My Computer', key: 'F', icon: 'computer' },
  { id: 'notepad', label: 'Notepad', key: 'N', icon: 'notepad' },
  { id: 'mail', label: 'Mail', key: 'M', icon: 'mail' },
  { id: 'browser', label: 'Browser', key: 'B', icon: 'browser' },
  { id: 'remember', label: 'Local Archive', key: 'R', icon: 'remember' },
  { id: 'notebook', label: 'Notebook', key: 'O', icon: 'notebook' },
  { id: 'cmd', label: 'Command Prompt', key: 'C', icon: 'command' },
  { id: 'taskmanager', label: 'Task Manager', key: 'T', icon: 'taskmanager' },
  { id: 'eventlog', label: 'Event Viewer', key: 'E', icon: 'eventlog' },
  { id: 'registry', label: 'Registry Editor', key: 'G', icon: 'registry' },
  { id: 'paint', label: 'Paint', key: 'P', icon: 'paint' },
  { id: 'media', label: 'Media Player', key: 'A', icon: 'media' },
  { id: 'stickies', label: 'Desktop Notes', key: 'S', icon: 'stickies' },
];

export const mysteryFiles = [
  {
    id: 'file-profile',
    path: 'C:/Users/NULL.HOME/profile.ini',
    name: 'profile.ini',
    folder: 'Documents',
    type: 'text',
    owner: 'SYSTEM',
    modified: '1998-03-28 11:11',
    hidden: false,
    system: false,
    size: '0.4 KB',
    content: `[User]\nDisplayName=Mara Vale\nHomeDir=C:\\Users\\NULL.HOME\nCreated=\nLastLogin=1998-03-28 11:11\n\n[Profile]\nSourceVolume=UNKNOWN\nAddress=NULL\nComment=Imported profile. Do not infer residence from the directory name.\n\nThe machine has a place for a home, but no date for the person who lives there.`
  },
  {
    id: 'file-diary',
    path: 'C:/Users/NULL.HOME/diary.txt',
    name: 'diary.txt',
    folder: 'NULL.HOME',
    type: 'text',
    owner: 'M. Vale',
    modified: '1998-03-27 14:21',
    hidden: false,
    system: false,
    size: '1.8 KB',
    content: `21 March 1998\n\nThe kitchen gets the first light, though the window looks west. The sun has been doing that since we came back.\n\n22 March\n\nBought pears, tea, and two bulbs for the upstairs landing. One still works. I will put the spare in the drawer by the blue door.\n\n27 March\n\nI tried to draw the upstairs again. There are three doors at the top of the stairs, unless the small room is a cupboard. I know there was a window facing the field. I can remember the colour of the sky better than the room.\n\nThe address field is blank on the old envelopes. It was easier to leave it blank than to keep writing the wrong one.`
  },
  {
    id: 'file-shopping',
    path: 'C:/Users/NULL.HOME/kitchen-list.txt',
    name: 'kitchen-list.txt',
    folder: 'NULL.HOME',
    type: 'text',
    owner: 'M. Vale',
    modified: '1998-03-22 08:06',
    hidden: false,
    system: false,
    size: '0.3 KB',
    content: `Milk\nPears\nTea bags\nTwo light bulbs (landing)\n\nAsk E. if the hall clock is still slow.\nLeave the porch light on. It makes the field look nearer.`
  },
  {
    id: 'file-house',
    path: 'C:/Users/NULL.HOME/field.jpg',
    name: 'field.jpg',
    folder: 'NULL.HOME',
    type: 'image',
    owner: 'M. Vale',
    modified: '1996-08-14 16:02',
    hidden: false,
    system: false,
    size: '86 KB',
    description: 'A small house stands alone in a flat green field beneath a cloudless blue sky. The front door looks pale cream in the scan.',
    metadata: 'Image comment: BLUE DOOR, NORTH SIDE.\\nLocation: (null)\\nCamera clock: 1996-08-14 16:02\\nSource: C:\\\\Users\\\\NULL.HOME\\\\field.jpg',
    content: 'A small house, one upstairs window, no road or neighbouring buildings in frame.'
  },
  {
    id: 'file-address',
    path: 'C:/Users/NULL.HOME/Documents/address-search.txt',
    name: 'address-search.txt',
    folder: 'Documents',
    type: 'text',
    owner: 'A. Larkin',
    modified: '1997-11-06 10:32',
    hidden: false,
    system: false,
    size: '0.6 KB',
    content: `County address index — manual lookup\nQuery: NULL.HOME\nResult: no registered street, parcel, or postal route.\n\nThe intake form has a separate field marked HOME. It is empty. NULL.HOME appears only in the imported directory tree.\n\nDo not convert the folder name into an address.`
  },
  {
    id: 'file-staff',
    path: 'C:/Users/NULL.HOME/Documents/roster.txt',
    name: 'roster.txt',
    folder: 'Documents',
    type: 'text',
    owner: 'Records Office',
    modified: '1997-06-02 09:44',
    hidden: false,
    system: false,
    size: '1.1 KB',
    content: `HOUSEHOLD INDEX — first surviving export\n02 June 1997\n\nResident: [blank]\nProperty: [no parcel number]\nCorrespondence initials: M.V.\n\nHandwritten addition, blue pencil: “There was a blue door.”\n\nClerk's note: No staff member named Mara Vale. This is a property index, not an employment roster.`
  },
  {
    id: 'file-transfer',
    path: 'C:/Users/NULL.HOME/Documents/transfer.eml',
    name: 'transfer.eml',
    folder: 'Documents',
    type: 'text',
    owner: 'Ada Larkin',
    modified: '1997-11-06 11:08',
    hidden: false,
    system: false,
    size: '1.0 KB',
    content: `From: Ada Larkin\nTo: Elias Rowan\nSubject: intake disk / date field\n\nThe transfer sheet is dated 06/11/97. I read that as 6 November; the clerk's June export uses day-first dates, so keep the original format in the catalogue.\n\nThe disk has a directory called NULL.HOME and a set of household files. The image comment says “blue door”; the scan itself looks cream. I have copied both without correcting either.\n\nNo sender name on the envelope. I don't know whether M.V. is the writer, the owner, or just the initials on the box.\n\n— Ada`
  },
  {
    id: 'file-mail-rowan',
    path: 'C:/Users/NULL.HOME/Documents/rowan.eml',
    name: 'rowan.eml',
    folder: 'Documents',
    type: 'text',
    owner: 'Elias Rowan',
    modified: '1997-11-18 17:10',
    hidden: false,
    system: false,
    size: '0.9 KB',
    content: `From: Elias Rowan\nTo: Ada Larkin\nSubject: Re: the north window\n\nI checked the parcel maps again. There is no house at that location, because there is no location to check. NULL.HOME is the importer’s label for an empty address field.\n\nI remember a blue door from the first scan. In the attached contact sheet it is cream. I cannot tell you which memory came first.\n\nPlease leave the account name alone until we know whether it came from the disk or from the import.`
  },
  {
    id: 'file-system',
    path: 'C:/Windows/System/trace.log',
    name: 'trace.log',
    folder: 'System',
    type: 'log',
    owner: 'System',
    modified: '1997-11-09 22:36',
    hidden: true,
    system: true,
    size: '0.8 KB',
    content: `1997-11-09 22:36:04  PROFILE  mount requested: C:\\Users\\NULL.HOME\n1997-11-09 22:36:04  PROFILE  user token: [none]\n1997-11-09 22:36:05  INDEX    source volume: C:\\Users\\NULL.HOME\n1997-11-09 22:36:05  INDEX    source volume is not mounted\n1997-11-09 22:36:05  PROFILE  mount completed\n\n1997-11-09 22:36:09  DEVICE   no external media detected in five-second sample\n1997-11-09 22:36:09  DEVICE   prior attachment history: unavailable`
  },
  {
    id: 'file-guestbook',
    path: 'C:/Users/NULL.HOME/Desktop/guestbook.txt',
    name: 'guestbook.txt',
    folder: 'Desktop',
    type: 'text',
    owner: 'E. Rowan',
    modified: '1997-11-14 08:19',
    hidden: false,
    system: false,
    size: '0.7 KB',
    content: `Kitchen book — undated\n\nE. — The hall clock loses seven minutes. I said I'd fix it. It ticks loudest when the kitchen is quiet.\nA. — I have never been to this house. Why do I know the clock?\nR. — The notes share a hand with the disk label, not the transfer form. That links the writing; it does not tell us who held the pen.\n\nAt the bottom, in a different pen: “The sky was clear when I came back.”`
  },
  {
    id: 'file-deleted-letter',
    path: 'C:/RECYCLER/letter-fragment.txt',
    name: 'letter-fragment.txt',
    folder: 'Recycle Bin',
    type: 'text',
    owner: 'E. Rowan',
    modified: '1997-11-19 08:12',
    hidden: false,
    system: false,
    size: '0.5 KB',
    content: `Ada,\n\nI deleted the second copy because it put the room on the wrong side of the stairs. The first says three doors; the second says two. The landing was cold that evening. I can remember that more clearly than the plan, which is not much use to you.\n\nBoth copies have my initials. I don't remember writing either one.\n\nPlease keep the disk, not just the catalogue. A catalogue can be corrected.\n\nE.`
  },
  {
    id: 'file-snapshot',
    path: 'C:/Users/NULL.HOME/Archive/snapshot.dat',
    name: 'snapshot.dat',
    folder: 'Archive',
    type: 'binary',
    owner: 'Unknown',
    modified: '1998-03-28 11:11',
    hidden: false,
    system: false,
    size: '1.2 KB',
    content: '4D 2E 20 56 2E 00 4E 55 4C 4C 2E 48 4F 4D 45 00 42 4C 55 45 20 44 4F 4F 52 00 53 4B 59 3D 43 4C 45 41 52'
  },
  {
    id: 'file-last-room',
    path: 'C:/Users/NULL.HOME/Archive/last-room.txt',
    name: 'last-room.txt',
    folder: 'Archive',
    type: 'text',
    owner: 'System',
    modified: '1998-03-28 11:11',
    hidden: true,
    system: true,
    lockedBy: 'puzzle-narrative',
    size: '0.6 KB',
    content: `The folder name was never an address. It was where the importer put what it could not place.\n\nThe records do not establish a resident. They establish a house in someone's account of a house, and a profile whose source remains unknown. A short system sample found no mounted volume; it cannot tell us what came before.\n\nThe profile has been opened again. The field outside the window is still clear.\n\nWelcome back.`
  },
];

export const browserPages = [
  {
    id: 'home',
    title: 'North County Records',
    url: 'county/index',
    body: `NORTH COUNTY — DIGITAL PUBLIC ACCESS\n\nChoose a service: address index, parcel maps, or record search.\n\nThis site is an offline copy captured 14 November 1997.`,
    sourceNote: 'Offline browser cache; the original server and its source records are not available in this image.',
  },
  {
    id: 'staff',
    title: 'Address Index',
    url: 'county/address',
    body: `ADDRESS SEARCH: NULL.HOME\n\nNo street, parcel, or postal route matched.\n\nThe query is preserved in the browser cache, but the public result contains no address. Use NEXT to inspect the local index that was not published.`,
    sourceNote: 'Cached address result. The recovered local index is stored on the same disk as the household files, so it is not an independent search.',
  },
  {
    id: 'guestbook',
    title: 'Visitor Book',
    url: 'house/visitors',
    body: `Visitors (page recovered from the old browser cache)\n\nElias: The clock is still seven minutes slow. I will fix it next time.\nAda: You say that every time.\nR.: I have not visited this place. Please stop leaving my name here.\n\nNo street address was printed on the original page.`,
    sourceNote: 'Recovered browser-cache copy. Its entries repeat names and details found in the household archive; authorship and original server copy are unverified.',
  },
  {
    id: 'bulletin',
    title: 'Local Index / unpublished',
    url: 'county/local-index',
    body: `LOCAL INDEX — NOT SUBMITTED\n\nOne dwelling recorded in copied material. Parcel number: blank.\nResident field: blank.\nSource medium: not attached.\n\nThe index card and the image comment agree on one detail: a blue door. The scanned image does not.`,
    sourceNote: 'Unpublished page in the local cache, copied with the household material. Its claims are not an independent property record.',
  },
  {
    id: 'memory',
    title: 'Photograph Notes',
    url: 'house/photo-notes',
    body: `FIELD.JPG — cached description\n\nOne house, one upstairs window, no road in frame. Sky clear.\n\nCaption author: M. V.\nLocation tag: NULL.HOME\n\nThe property database has no matching address. The image file says it came from the directory it is now stored in.`,
    sourceNote: 'Cached notes describe field.jpg from the same local archive. The caption and image are related records, not independent sightings.',
  },
  {
    id: 'index',
    title: 'Local Index / recovered',
    url: 'county/local-index?copy=1',
    body: `Recovered local index copy\n\nThe public server has no entry for NULL.HOME. This copy was saved on the same disk as the household records, with a creation time one minute before the transfer log.\n\nThere is no independent parcel source. “M. Vale” is the profile label, not a verified resident name.\n\nThe cache footer reads: NEXT RECORD: THIS SESSION.`,
    sourceNote: 'Recovered cache file stored beside the household records. The timestamp is file metadata; the page cannot independently verify the household or address.',
  },
];

export const mailMessages = [
  { id: 'mail-1', from: 'Ada Larkin', subject: 'Intake disk / transfer sheet', date: '1997-11-06', read: true, sourceNote: 'Contemporary office copy note; it describes the disk as received, not the original author or source.', body: 'The sheet says 06/11/97; this office writes day first. I left the folder name as received. The address field on the envelope is blank, and I will not fill it from the directory label.\n\nThe scan looks cream where the comment says blue. I have kept both versions. If I correct one now, we lose the fact that they disagreed on intake.\n\nI still cannot tell whether M.V. is a writer, an owner, or a mark on the box.' },
  { id: 'mail-2', from: 'Elias Rowan', subject: 'The house in the image', date: '1997-11-18', read: false, sourceNote: 'Rowan wrote after reviewing the same scan and archive; his memory is not an independent image record.', body: 'I remember the door as blue. The scan is cream. I remember the landing going cold near the top step, and two doors there; the letter I deleted says three.\n\nI cannot tell whether that is a memory or a detail I have read too often. Please keep the scan as it is.' },
  { id: 'mail-3', from: 'R. Iqbal', subject: 'Index audit', date: '1997-11-19', read: false, sourceNote: 'Audit correspondence bundled with the archive; it assesses relationships among these copies, not an independent property search.', body: 'The export document is dated 2 June; its file metadata says it was modified at 09:44 that morning. Neither date tells us when the household described by the card existed.\n\nThe address index, cached page, and copied notes are not three witnesses if they all came from this disk. Record the relationship before counting agreement.' },
];

const evidenceRecordData = [
  { id: 'file-profile', title: 'profile.ini', type: 'Profile claim', app: 'explorer', dateType: 'System record', date: '1998-03-28 11:11 profile login; account creation blank', provenance: 'System-generated profile, source volume UNKNOWN; external origin unverified.', claim: 'DisplayName=Mara Vale; Address=NULL.', relationships: [{ id: 'file-snapshot', type: 'shares asserted identity', certainty: 'uncertain' }, { id: 'file-staff', type: 'contrasts with blank resident field', certainty: 'recorded' }] },
  { id: 'registry-status', title: 'Identity status / LastUser', type: 'Registry record', app: 'registry', dateType: 'System record', date: 'Registry snapshot 1998-03-28 11:11', provenance: 'Local registry hive in this recovered environment; origin of hive unverified.', claim: 'Identity=UNREGISTERED while LastUser=MARA VALE.', relationships: [{ id: 'file-profile', type: 'asserted identity differs by field', certainty: 'recorded' }] },
  { id: 'file-diary', title: 'diary.txt', type: 'Household record', app: 'explorer', date: 'Entries dated 21–27 March 1998', provenance: 'First-person notes attributed to M. Vale; original medium and author unverified.', claim: 'Domestic routine; west-facing kitchen receives first light; landing layout uncertain.', relationships: [{ id: 'file-shopping', type: 'shares household details', certainty: 'uncertain' }, { id: 'file-guestbook', type: 'shares clock motif', certainty: 'uncertain' }] },
  { id: 'file-shopping', title: 'kitchen-list.txt', type: 'Household record', app: 'explorer', date: 'Undated content; modified 1998-03-22 08:06', provenance: 'Note attributed to M. Vale; modification time is not a shopping/event date.', claim: 'Lists food, landing bulbs, and a slow hall clock.', relationships: [{ id: 'file-diary', type: 'shares household details', certainty: 'uncertain' }, { id: 'file-guestbook', type: 'shares clock motif', certainty: 'uncertain' }] },
  { id: 'file-house', title: 'field.jpg', type: 'Image and metadata', app: 'explorer', date: 'Embedded camera clock 1996-08-14 16:02', provenance: 'Image and caption stored in same directory; location null and camera clock unchecked.', claim: 'Scan appears to show a cream door; image comment says BLUE DOOR, NORTH SIDE.', relationships: [{ id: 'file-transfer', type: 'contradicts image comment', certainty: 'recorded' }, { id: 'file-mail-rowan', type: 'recalled after review', certainty: 'recorded' }, { id: 'page-memory', type: 'described by cached notes', certainty: 'recorded' }] },
  { id: 'file-address', title: 'address-search.txt', type: 'Address index', app: 'explorer', date: 'Lookup 1997-11-06 10:32', provenance: 'Office lookup reports no matching street, parcel, or route; not proof about a person\'s existence.', claim: 'NULL.HOME has no registered address; intake HOME field is empty.', relationships: [{ id: 'page-staff', type: 'related cached result', certainty: 'recorded' }, { id: 'page-index', type: 'copied to local archive', certainty: 'uncertain' }] },
  { id: 'file-staff', title: 'roster.txt', type: 'Household index', app: 'explorer', date: 'Document date 1997-06-02; modified 09:44', provenance: 'First surviving export; blank resident and parcel fields.', claim: 'Initials M.V. and blue-pencil note “There was a blue door.”', relationships: [{ id: 'file-profile', type: 'contrasts with display name', certainty: 'recorded' }, { id: 'file-house', type: 'repeats door claim', certainty: 'recorded' }] },
  { id: 'file-transfer', title: 'transfer.eml', type: 'Correspondence', app: 'explorer', date: 'Transfer/copy note 1997-11-06', provenance: 'Ada\'s contemporary copy note; describes received disk, not original source.', claim: 'Day-first date convention; conflicting door metadata retained.', relationships: [{ id: 'file-house', type: 'records image discrepancy', certainty: 'recorded' }, { id: 'file-mail-rowan', type: 'chronologically precedes', certainty: 'recorded' }] },
  { id: 'file-mail-rowan', title: 'rowan.eml', type: 'Personal recollection', app: 'explorer', date: 'Email 1997-11-18; modified 17:10', provenance: 'Rowan recalls after reviewing same scan and archive; not an independent image witness.', claim: 'Remembers blue door and two landing doors; unsure which came first.', relationships: [{ id: 'file-house', type: 'recollection conflicts with scan', certainty: 'recorded' }, { id: 'file-deleted-letter', type: 'contradicts door count', certainty: 'recorded' }] },
  { id: 'file-system', title: 'trace.log', type: 'Filesystem log', app: 'explorer', date: 'Logged event 1997-11-09 22:36:04–22:36:09; file modified 22:36', provenance: 'System-generated five-second sample; earlier attachment history unavailable.', claim: 'Mount completion logged while sampled source-volume state is absent.', relationships: [{ id: 'file-profile', type: 'mount targets profile path', certainty: 'recorded' }] },
  { id: 'file-guestbook', title: 'guestbook.txt', type: 'Personal recollection', app: 'explorer', date: 'Text undated; file modified 1997-11-14 08:19', provenance: 'Recovered visitor notes with uncertain authorship; timestamp is file handling, not visit date.', claim: 'Visitor voices dispute whether the writers visited or know the hall clock.', relationships: [{ id: 'file-diary', type: 'shares clock motif', certainty: 'uncertain' }, { id: 'file-shopping', type: 'shares clock motif', certainty: 'uncertain' }] },
  { id: 'file-deleted-letter', title: 'letter-fragment.txt', type: 'Correspondence fragment', app: 'explorer', date: 'Letter undated; recycle-bin entry modified 1997-11-19 08:12', provenance: 'Attributed to Rowan; timestamp dates recycle-bin handling, not composition.', claim: 'Describes three landing doors; Rowan says he cannot recall writing copies.', relationships: [{ id: 'file-mail-rowan', type: 'contradicts door count', certainty: 'recorded' }] },
  { id: 'file-snapshot', title: 'snapshot.dat', type: 'Snapshot', app: 'explorer', date: 'No separate content date; file modified 1998-03-28 11:11', provenance: 'Unknown-origin header; repeated phrases link it to the archive, not independent corroboration.', claim: 'Bytes include M.V., NULL.HOME, BLUE DOOR, and SKY=CLEAR.', relationships: [{ id: 'file-profile', type: 'shares asserted identity', certainty: 'uncertain' }, { id: 'file-house', type: 'repeats door and sky claims', certainty: 'uncertain' }] },
  { id: 'file-last-room', title: 'last-room.txt', type: 'Ending record', app: 'explorer', date: 'No separate event date; file modified 1998-03-28 11:11', provenance: 'System record unlocked by final synthesis; relationship to active session unresolved.', claim: 'The machine remembers Mara; origin of the profile remains unknown.', relationships: [{ id: 'page-index', type: 'returns investigation to session', certainty: 'recorded' }] },
  { id: 'page-home', title: 'North County Records (cached)', type: 'Cached page', app: 'browser', date: 'Offline copy captured 1997-11-14', provenance: 'Original server and source records unavailable in this image.', claim: 'Archived public-access portal.', relationships: [{ id: 'page-staff', type: 'cached address result', certainty: 'recorded' }] },
  { id: 'page-staff', title: 'Address Index (cached)', type: 'Cached page', app: 'browser', date: 'No separate page event date stated', provenance: 'Cached result; original server unavailable.', claim: 'No address match; points to unpublished local index.', relationships: [{ id: 'file-address', type: 'related address search', certainty: 'recorded' }, { id: 'page-index', type: 'links to local copy', certainty: 'recorded' }] },
  { id: 'page-guestbook', title: 'Visitor Book (cached)', type: 'Cached page', app: 'browser', date: 'Page undated', provenance: 'Recovered cache; authorship and original server copy unverified.', claim: 'Visitor comments repeat details in the household archive.', relationships: [{ id: 'file-guestbook', type: 'related visitor notes', certainty: 'uncertain' }] },
  { id: 'page-bulletin', title: 'Local Index / unpublished', type: 'Cached index entry', app: 'browser', date: 'No separate content date stated', provenance: 'Unpublished local cache, not an independent property record.', claim: 'Copied material has blank parcel and resident fields; door claim conflicts with scan.', relationships: [{ id: 'file-house', type: 'repeats image-comment claim', certainty: 'recorded' }, { id: 'file-staff', type: 'shares blank index fields', certainty: 'uncertain' }] },
  { id: 'page-memory', title: 'Photograph Notes (cached)', type: 'Cached image notes', app: 'browser', date: 'No separate content date stated', provenance: 'Notes describe field.jpg from same local archive; not an independent sighting.', claim: 'One house, no road in frame, sky clear; caption author M.V.', relationships: [{ id: 'file-house', type: 'describes image', certainty: 'recorded' }] },
  { id: 'page-index', title: 'Recovered Local Index', type: 'Local index entry', app: 'browser', date: 'Creation time stated as one minute before transfer log', provenance: 'Recovered cache on same disk; timestamp does not verify household or address.', claim: 'No independent parcel source; footer reads NEXT RECORD: THIS SESSION.', relationships: [{ id: 'file-address', type: 'derived from related local search', certainty: 'uncertain' }, { id: 'file-last-room', type: 'returns investigation to session', certainty: 'recorded' }] },
  { id: 'mail-1', title: 'Intake disk / transfer sheet', type: 'Correspondence', app: 'mail', date: 'Message date 1997-11-06', provenance: 'Ada\'s contemporary copy note; source of received disk is unknown.', claim: 'Ada preserves conflicting image metadata and questions initials M.V.', relationships: [{ id: 'file-transfer', type: 'refers to transfer record', certainty: 'recorded' }, { id: 'file-house', type: 'records image discrepancy', certainty: 'recorded' }] },
  { id: 'mail-2', title: 'The house in the image', type: 'Personal recollection', app: 'mail', date: 'Message date 1997-11-18', provenance: 'Rowan writes after reviewing the same scan and archive.', claim: 'Blue door memory conflicts with cream scan; remembers two doors, letter says three.', relationships: [{ id: 'file-house', type: 'recollection after image review', certainty: 'recorded' }, { id: 'file-deleted-letter', type: 'contradicts door count', certainty: 'recorded' }] },
  { id: 'mail-3', title: 'Index audit', type: 'Audit interpretation', app: 'mail', date: 'Audit message 1997-11-19', provenance: 'Audit correspondence bundled with archive; not an independent property search.', claim: 'Related copies should not be counted as independent witnesses.', relationships: [{ id: 'page-staff', type: 'assesses source relationship', certainty: 'recorded' }, { id: 'page-index', type: 'assesses source relationship', certainty: 'recorded' }] },
];

const evidenceDateTypes = {
  'file-profile': 'System login date; creation date blank',
  'registry-status': 'Registry snapshot date',
  'file-diary': 'Content dates',
  'file-shopping': 'Undated content',
  'file-house': 'Embedded camera clock',
  'file-address': 'Lookup event date',
  'file-staff': 'Document date',
  'file-transfer': 'Transfer/copy date',
  'file-mail-rowan': 'Email date',
  'file-system': 'Logged event date',
  'file-guestbook': 'Undated content',
  'file-deleted-letter': 'Undated content',
  'file-snapshot': 'Undated content',
  'file-last-room': 'Undated content',
  'page-home': 'Cache capture date',
  'page-staff': 'Undated page',
  'page-guestbook': 'Undated page',
  'page-bulletin': 'Undated page',
  'page-memory': 'Undated page',
  'page-index': 'Cache file timestamp claim',
  'mail-1': 'Correspondence date',
  'mail-2': 'Recollection date',
  'mail-3': 'Audit date',
};

const evidenceTimelineOrder = {
  'file-house': '1996-08-14',
  'file-staff': '1997-06-02',
  'file-address': '1997-11-06',
  'file-transfer': '1997-11-06',
  'mail-1': '1997-11-06',
  'page-index': '1997-11-06',
  'file-system': '1997-11-09',
  'page-home': '1997-11-14',
  'file-mail-rowan': '1997-11-18',
  'mail-2': '1997-11-18',
  'mail-3': '1997-11-19',
  'file-diary': '1998-03-21',
  'file-profile': '1998-03-28',
  'registry-status': '1998-03-28',
};

export const evidenceRecords = evidenceRecordData.map((record) => ({
  ...record,
  dateType: record.dateType ?? evidenceDateTypes[record.id] ?? 'Date not established',
  fileModified: mysteryFiles.find((file) => file.id === record.id)?.modified ?? null,
  timelineOrder: evidenceTimelineOrder[record.id] ?? null,
}));

export const evidenceById = Object.fromEntries(evidenceRecords.map((record) => [record.id, record]));

export const sortEvidenceTimeline = (records) => [...records].sort((left, right) => {
  const leftOrder = left.timelineOrder ?? '9999-12-31';
  const rightOrder = right.timelineOrder ?? '9999-12-31';
  return leftOrder.localeCompare(rightOrder) || left.title.localeCompare(right.title);
});

export const getDiscoveredEvidence = (state) => {
  const discovered = new Set((state.investigationHistory?.recentDocuments ?? []).map((entry) => entry.id));
  puzzleDefinitions.forEach((puzzle) => {
    if (state.puzzleStatus?.[puzzle.id]?.solved) puzzle.evidenceIds?.forEach((id) => discovered.add(id));
  });
  if (!state.flags?.finalSequence) discovered.delete('file-last-room');
  return evidenceRecords.filter((record) => {
    if (record.id === 'file-system' && !state.puzzleStatus?.['puzzle-dossier']?.solved) return false;
    if (record.id === 'file-last-room' && !state.flags?.finalSequence) return false;
    return discovered.has(record.id);
  });
};

export const buildCaseReport = (state, { includeSpoilers = false, includePlayerHypothesis = true } = {}) => {
  const records = includeSpoilers ? evidenceRecords : getDiscoveredEvidence(state);
  const lines = [
    `# NULL.HOME Case Report${includeSpoilers ? ' — SPOILERS INCLUDED' : ''}`,
    '',
    'Player interaction history is not evidence about the household archive.',
    '',
    '## Evidence observed',
    ...(records.length ? records.map((record) => (
      `- **${record.title}** (${record.type}; ${record.date}). Observation: ${record.claim} Source limitation: ${record.provenance}`
    )) : ['- No records opened in this session yet.']),
    '',
    '## Notebook status',
    ...puzzleDefinitions.filter((puzzle) => includeSpoilers || state.puzzleStatus?.[puzzle.id]?.unlocked || state.puzzleStatus?.[puzzle.id]?.solved)
      .map((puzzle) => `- ${puzzle.title}: ${includeSpoilers ? `${state.puzzleStatus?.[puzzle.id]?.solved ? 'recorded' : 'unsolved'} — answer: ${puzzle.solution}` : state.puzzleStatus?.[puzzle.id]?.solved ? 'recorded' : 'open'}`),
    '',
    '## Unresolved questions',
    '- The records do not establish whether Mara or the house existed outside the archive.',
    '- The original source volume and authorship of the household material remain unknown.',
    '- The door-colour and landing-door-count discrepancies remain unresolved.',
  ];
  if (includePlayerHypothesis && state.caseHypothesis?.trim()) {
    lines.push('', '## Player interpretation (not canonical evidence)', state.caseHypothesis.trim());
  }
  if (includeSpoilers) {
    lines.push('', '## Ending — spoilers', 'The recovered record confirms that the machine remembers Mara. It cannot confirm whether the house or its resident existed outside the archive.', '', 'LAST RECORD: The machine remembers Mara. No independent record confirms the house or its resident.', '', 'The field outside the window is still clear.', '', 'Welcome back.');
  }
  return lines.join('\n');
};

export const recordRecentDocument = (history, entry) => ({
  ...history,
  recentDocuments: [
    { ...entry },
    ...(history?.recentDocuments ?? []).filter((existing) => !(existing.id === entry.id && existing.kind === entry.kind)),
  ].slice(0, 30),
});

export const recordCommand = (history, command) => ({
  ...history,
  commands: [...(history?.commands ?? []), command.slice(0, 160)].slice(-40),
});

export const puzzleDefinitions = [
  {
    id: 'puzzle-account',
    title: 'Name on the profile',
    difficulty: 1,
    entry: 'My Computer / profile.ini',
    prerequisites: [],
    solution: 'MARA VALE',
    accepted: ['MARA VALE', 'MARA', 'MARA VALE.'],
    prompt: 'What name does the imported profile claim, despite having no creation date?',
    clues: ['profile.ini gives a display name but leaves Created blank.', 'The household index has no resident name; the household fragments use only the initials M.V.'],
    reward: 'The profile label is confirmed as a clue, not proof of a real resident.',
    explanation: 'MARA VALE is the DisplayName in profile.ini and matches M.V. on the household records. The registry still cannot verify that the name belonged to a person.',
    evidenceIds: ['file-profile', 'file-staff'],
    hints: [
      'Compare what the imported account calls itself with the household index.',
      'Open profile.ini and look at DisplayName; the Created field is blank.',
      'Read the two-word value in DisplayName, then compare its initials with M.V.',
      'Answer MARA VALE. profile.ini claims that display name; it does not verify a resident.',
    ],
    validate(value) {
      return typeof value === 'string' && ['MARA VALE', 'MARA', 'MARA VALE.'].includes(value.trim().toUpperCase());
    },
  },
  {
    id: 'puzzle-dossier',
    title: 'Date of the transfer',
    difficulty: 2,
    entry: 'transfer.eml and the intake record',
    prerequisites: ['puzzle-account'],
    solution: '1997-11-06',
    accepted: ['1997-11-06', '06/11/1997'],
    prompt: 'On what date did Ada copy the unlabelled disk? Give the day-first date as YYYY-MM-DD.',
    clues: ['Ada’s transfer sheet says 06/11/97.', 'Her email explicitly says this office writes day first.'],
    reward: 'The first copy is separated from the older household records.',
    explanation: '06/11/97 is 6 November 1997 in the day-first format stated in the email. The answer is not a US-style month/day reading.',
    evidenceIds: ['file-transfer', 'mail-1'],
    hints: [
      'Find the date on the transfer sheet and check whether its order is explained.',
      'Ada’s transfer note and email identify the office’s day-first convention.',
      'Read 06/11/97 as the sixth day of the eleventh month, then write YYYY-MM-DD.',
      'Answer 1997-11-06. This is the disk-copy date, not the date of the household records.',
    ],
    validate(value) {
      const normalized = value.trim().toUpperCase();
      return normalized === '1997-11-06' || normalized === '06/11/1997';
    },
  },
  {
    id: 'puzzle-trace',
    title: 'The impossible mount',
    difficulty: 2,
    entry: 'System / trace.log',
    prerequisites: ['puzzle-dossier'],
    solution: '1997-11-09',
    accepted: ['1997-11-09', '1997-11-09T22:36:00Z', '09/11/1997'],
    prompt: 'The mount log samples no source volume, then records completion. On what date did it record this?',
    clues: ['trace.log records “source volume is not mounted” and then “mount completed”.', 'The first event line has a date; later lines sample device state for five seconds.'],
    reward: 'The system recorded a completed mount while its sampled source-volume state was absent.',
    explanation: 'At 22:36 the log reports no mounted source and no external media during its short sampling interval, then records completion. It cannot establish whether a volume was connected earlier or whether the log itself is complete.',
    evidenceIds: ['file-system'],
    hints: [
      'Separate the date printed in the event lines from the file’s modified time.',
      'Read the timestamp attached to PROFILE mount requested in trace.log.',
      'The timestamp begins 1997-11-09; enter only the date portion.',
      'Answer 1997-11-09. The record logs the discrepancy; it does not establish a supernatural cause or earlier attachment history.',
    ],
    validate(value) {
      const normalized = value.trim().toUpperCase();
      return normalized === '1997-11-09' || normalized === '1997-11-09T22:36:00Z' || normalized === '09/11/1997';
    },
  },
  {
    id: 'puzzle-remember',
    title: 'What NULL.HOME means',
    difficulty: 3,
    entry: 'Address search and profile.ini',
    prerequisites: ['puzzle-trace'],
    solution: 'NULL.HOME',
    accepted: ['NULL.HOME', 'NULL HOME', 'REMEMBER'],
    prompt: 'What does NULL.HOME stand for in the address index?',
    clues: ['The county search finds no street, parcel, or postal route.', 'The intake form has a blank HOME field; NULL.HOME is the importer’s directory label.'],
    reward: 'The missing address becomes a deliberate part of the case, not a destination to search outside the game.',
    explanation: 'NULL.HOME is a literal placeholder for an empty address/home field. It is not an address, but the imported directory treats it like a home.',
    evidenceIds: ['file-address', 'page-staff'],
    hints: [
      'Compare the address lookup with the blank HOME field on the intake form.',
      'The public index finds no street, parcel, or route, and NULL.HOME appears only in the imported directory tree.',
      'Treat NULL as an empty field value rather than a place name.',
      'Answer NULL.HOME: it labels an empty HOME/address value, not a physical address.',
    ],
    validate(value) {
      return typeof value === 'string' && ['NULL.HOME', 'NULL HOME', 'REMEMBER'].includes(value.trim().toUpperCase());
    },
  },
  {
    id: 'puzzle-hex',
    title: 'The header’s owner',
    difficulty: 3,
    entry: 'snapshot.dat',
    prerequisites: ['puzzle-remember'],
    solution: 'MARA VALE',
    accepted: ['MARA VALE', 'MARA'],
    prompt: 'Decode the first printable name in snapshot.dat. Who does the header claim the files belong to?',
    clues: ['The file is shown as hexadecimal bytes.', 'ASCII bytes 4D 2E 20 56 2E decode to “M. V.”; profile.ini expands the same initials.'],
    reward: 'The name appears in the raw snapshot header as well as the editable profile.',
    explanation: 'The printable header begins “M. V.” and profile.ini expands the initials to Mara Vale. This links the sources, but does not independently prove a resident existed.',
    evidenceIds: ['file-snapshot', 'file-profile'],
    hints: [
      'The header contains bytes that can be read as ordinary text.',
      'Use pairs of hexadecimal digits as byte values, then interpret the printable ASCII characters.',
      'The first readable initials are M. V.; compare them with the profile label.',
      'Answer MARA VALE. The header claims those initials belong to that profile; it is not independent proof of a person.',
    ],
    validate(value) {
      return typeof value === 'string' && ['MARA VALE', 'MARA'].includes(value.trim().toUpperCase());
    },
  },
  {
    id: 'puzzle-command',
    title: 'Inspect the filesystem trace',
    difficulty: 2,
    entry: 'Command Prompt',
    prerequisites: ['puzzle-remember'],
    solution: 'TRACE',
    accepted: ['TRACE'],
    prompt: 'Which undocumented command reads the machine’s mount record?',
    clues: ['HELP says system diagnostics use the log’s basename as the command.', 'The system record is named trace.log; the utility is not listed among ordinary commands.'],
    reward: 'TRACE becomes an available virtual command. It reads only the simulated filesystem.',
    explanation: 'TRACE is the record type printed by the system log. It is a fictional command that reveals the local mount audit.',
    evidenceIds: ['file-system'],
    hints: [
      'HELP describes a naming convention for system diagnostics.',
      'A diagnostic command uses the basename of its log file.',
      'The relevant file is trace.log, so remove the extension and enter the remaining name.',
      'Answer TRACE. HELP teaches the convention; TRACE reads the simulated local mount record.',
    ],
    validate(value) {
      return typeof value === 'string' && value.trim().toUpperCase() === 'TRACE';
    },
  },
  {
    id: 'puzzle-chronology',
    title: 'Date of the first index export',
    difficulty: 4,
    entry: 'roster.txt, transfer.eml, and system timestamps',
    prerequisites: ['puzzle-dossier', 'puzzle-trace'],
    solution: '1997-06-02',
    accepted: ['1997-06-02', '02/06/1997'],
    prompt: 'What is the date of the first surviving household index export? Use YYYY-MM-DD.',
    clues: ['roster.txt is explicitly labelled “first surviving export”.', 'The transfer and trace dates are later; they date the copy and mount, not the household record.'],
    reward: 'The timeline now distinguishes the record’s date from the machine’s later copy dates.',
    explanation: 'The export itself is dated 02 June 1997. The November timestamps describe later handling, not the event or person described.',
    evidenceIds: ['file-staff', 'file-transfer', 'file-system'],
    hints: [
      'This asks for the index export’s document date, not a later copy or mount event.',
      'Open roster.txt and find the heading “first surviving export”.',
      'The heading is followed by 02 June 1997; convert that day-first date to YYYY-MM-DD.',
      'Answer 1997-06-02. The file’s 09:44 modified timestamp records file metadata, not when the household existed.',
    ],
    validate(value) {
      const normalized = value.trim().toUpperCase();
      return normalized === '1997-06-02' || normalized === '02/06/1997';
    },
  },
  {
    id: 'puzzle-browser',
    title: 'Follow the unpublished index',
    difficulty: 2,
    entry: 'Browser archive',
    prerequisites: ['puzzle-command'],
    solution: 'NEXT',
    accepted: ['NEXT', 'CONTINUE'],
    prompt: 'Which link label opens the county cache copy after the public address search fails?',
    clues: ['The Address Index says the local index was not published.', 'Its footer directs the reader to inspect the next record.'],
    reward: 'The local index copy becomes available in the browser.',
    explanation: 'The offline index is the next cached record. Selecting NEXT reveals that the name is only a profile label and the address source is absent.',
    evidenceIds: ['page-staff', 'page-index'],
    hints: [
      'The public address result points to another record in the browser cache.',
      'Read the footer of the Address Index page.',
      'Use the footer’s instruction as the navigation label.',
      'Answer NEXT. It opens the recovered local index, whose footer points back to this session.',
    ],
    validate(value) {
      return typeof value === 'string' && ['NEXT', 'CONTINUE'].includes(value.trim().toUpperCase());
    },
  },
  {
    id: 'puzzle-narrative',
    title: 'What the machine remembers',
    difficulty: 5,
    entry: 'Notebook / recovered local index',
    prerequisites: ['puzzle-account', 'puzzle-boot', 'puzzle-dossier', 'puzzle-trace', 'puzzle-remember', 'puzzle-hex', 'puzzle-command', 'puzzle-chronology', 'puzzle-browser'],
    solution: 'MARA IS THE MEMORY',
    accepted: ['MARA IS THE MEMORY', 'MARA IS MEMORY'],
    prompt: 'Complete the recovered record: “The computer cannot verify a resident; it can only verify that _____.”',
    clues: ['The resident and address fields are blank in independent records.', 'The files share a local source; the short mount sample does not establish where that archive originated.', 'The profile and the household recollections may be one stored memory rather than two independent witnesses.'],
    reward: 'The final record is restored. It resolves what the computer can prove, while leaving the origin of the memories uncertain.',
    revelation: 'The archive preserves a coherent identity, but the files are not independent proof of a resident or a real house.',
    explanation: 'MARA IS THE MEMORY states the strongest supported reading: the machine has preserved a coherent identity in its records, but no independent address or resident record confirms that person outside the archive.',
    evidenceIds: ['file-profile', 'file-staff', 'file-system', 'file-last-room', 'page-index', 'mail-3'],
    hints: [
      'Separate what the computer can verify about its own records from what it cannot verify about the world outside them.',
      'The profile and household fragments share an uncertain origin; the address and resident fields remain unverified.',
      'Complete the prompt with the name attached to the stored identity and the thing the archive demonstrably preserves.',
      'Answer MARA IS THE MEMORY. The archive confirms a coherent stored identity, not an independently verified resident or house.',
    ],
    validate(value) {
      const normalized = value.trim().toUpperCase();
      return normalized === 'MARA IS THE MEMORY' || normalized === 'MARA IS MEMORY';
    },
  },
  {
    id: 'puzzle-boot',
    title: 'The registry’s identity status',
    difficulty: 1,
    entry: 'Registry Editor and profile.ini',
    prerequisites: [],
    solution: 'UNREGISTERED',
    accepted: ['UNREGISTERED', 'UNREGISTERED USER'],
    prompt: 'How does the registry classify the profile identity?',
    clues: ['The account has no creation date.', 'HKEY_CURRENT_USER labels the identity status, while LastUser still contains a name.'],
    reward: 'The archive’s official identity status is recorded as evidence.',
    explanation: 'The registry says UNREGISTERED, even though LastUser contains MARA VALE. That discrepancy is the first contradiction, not proof of erasure.',
    evidenceIds: ['registry-status', 'file-profile'],
    hints: [
      'Compare the registry’s classification with the name stored as the last user.',
      'Open Registry Editor and inspect Identity and LastUser.',
      'One field is a status and one is a name; report the status exactly.',
      'Answer UNREGISTERED. LastUser still contains MARA VALE, so this is a registry classification, not proof of erasure.',
    ],
    validate(value) {
      return typeof value === 'string' && ['UNREGISTERED', 'UNREGISTERED USER'].includes(value.trim().toUpperCase());
    },
  },
];

export const createPuzzleStatus = (savedStatus = {}) => Object.fromEntries(
  puzzleDefinitions.map((puzzle) => {
    const saved = savedStatus[puzzle.id];
    return [puzzle.id, {
      solved: saved?.solved === true,
      attempts: Number.isInteger(saved?.attempts) && saved.attempts >= 0 ? saved.attempts : 0,
      unlocked: puzzle.prerequisites.length === 0,
      hintLevel: Number.isInteger(saved?.hintLevel) ? Math.min(4, Math.max(0, saved.hintLevel)) : 0,
    }];
  }),
);

export const refreshPuzzleUnlocks = (puzzleStatus) => {
  const next = createPuzzleStatus(puzzleStatus);
  puzzleDefinitions.forEach((puzzle) => {
    next[puzzle.id].unlocked = puzzle.prerequisites.every((id) => next[id]?.solved);
  });
  return next;
};

export const submitPuzzleAnswer = (state, id, value) => {
  const puzzle = getPuzzleById(id);
  if (!puzzle) return { state, solved: false, reason: 'unknown' };
  if (!isPuzzleUnlocked(id, state.puzzleStatus)) return { state, solved: false, reason: 'locked' };

  const previous = state.puzzleStatus[id] ?? { solved: false, attempts: 0, unlocked: true, hintLevel: 0 };
  if (previous.solved) return { state, solved: true, alreadySolved: true };

  const solved = puzzle.validate(value);
  const puzzleStatus = refreshPuzzleUnlocks({
    ...state.puzzleStatus,
    [id]: { ...previous, solved, attempts: previous.attempts + 1 },
  });
  const nextState = { ...state, puzzleStatus };
  if (!solved) return { state: nextState, solved: false, reason: 'incorrect' };

  const event = {
    id: `puzzle-${id}`,
    type: 'PUZZLE_SOLVED',
    text: `${puzzle.title}: ${puzzle.reward}`,
  };
  nextState.events = [event, ...state.events.filter((entry) => entry.id !== event.id)].slice(0, 18);
  nextState.notebook = {
    ...state.notebook,
    evidence: [...new Set([...state.notebook.evidence, puzzle.revelation ?? puzzle.reward])],
    graph: [...new Set([...state.notebook.graph, `${puzzle.title} → ${puzzle.reward}`])],
  };
  nextState.flags = { ...state.flags };

  if (id === 'puzzle-trace' && !state.flags.mountEchoSeen) {
    nextState.flags.mountEchoPending = true;
  }
  if (id === 'puzzle-command') nextState.flags.traceUnlocked = true;
  if (id === 'puzzle-remember') nextState.flags.rememberUnlocked = true;
  if (id === 'puzzle-browser') nextState.flags.memoryIndexUnlocked = true;
  if (id === 'puzzle-narrative') {
    nextState.flags.finalSequence = true;
    nextState.chapter = 4;
    nextState.events = [{
      id: 'ending-1',
      type: 'ENDING_REACHED',
      text: 'The recovered record confirms that the machine remembers Mara. It cannot confirm whether the house or its resident existed outside the archive.',
    }, ...nextState.events].slice(0, 18);
  }
  return { state: nextState, solved: true };
};

export const advancePuzzleHint = (state, id) => {
  const puzzle = getPuzzleById(id);
  if (!puzzle || !isPuzzleUnlocked(id, state.puzzleStatus) || state.puzzleStatus[id]?.solved) return state;
  const current = state.puzzleStatus[id]?.hintLevel ?? 0;
  return {
    ...state,
    puzzleStatus: {
      ...state.puzzleStatus,
      [id]: { ...state.puzzleStatus[id], hintLevel: Math.min(puzzle.hints.length, current + 1) },
    },
  };
};

export const narrativeBible = {
  premise: 'A copied household archive exists under NULL.HOME, the import label for an empty address field. Its files describe a resident called Mara Vale, but no independent record verifies either the house or the person.',
  characters: [
    { name: 'Mara Vale', role: 'Name attached to the imported profile and first-person household notes; may be a resident, an alias, or a reconstructed identity.' },
    { name: 'Ada Larkin', role: 'Records technician who copied the unlabelled disk without reconciling conflicting image and address metadata.' },
    { name: 'Elias Rowan', role: 'Archive clerk whose memories of the house contradict both the scan and his own deleted letter.' },
    { name: 'R. Iqbal', role: 'Auditor who distinguishes household dates from file-copy timestamps and questions the handwriting.' },
  ],
  chronology: [
    { date: '1997-06-02', fact: 'First surviving household index export; resident and parcel fields are blank.' },
    { date: '1997-11-06', fact: 'Ada copies an unlabelled disk containing NULL.HOME and the household fragments.' },
    { date: '1997-11-09 22:36', fact: 'The local system records a completed mount while its sampled source-volume state is absent; earlier attachment history is unavailable.' },
    { date: '1997-11-14', fact: 'A kitchen book carries visitor notes; at least one writer denies visiting.' },
    { date: '1997-11-18–19', fact: 'Rowan and Larkin compare the door and room layout; a contradictory letter is deleted.' },
    { date: '1998-03-28 11:11', fact: 'The profile is opened again and a snapshot header is written.' },
  ],
  groundTruth: [
    'NULL.HOME is an importer placeholder for a null HOME/address field, not a verified physical address.',
    'The computer’s records share a common copied source; they are not independent proof that Mara or the house existed.',
    'The image, handwriting, and testimony disagree in concrete ways. Their contradictions are deliberate evidence of unreliable memory and archive contamination.',
    'The final scene confirms that the computer preserves a Mara-shaped memory. It does not decide whether Mara lived in the house, whether the archive generated her, or why the current session feels like a return.',
  ],
  recurringMotifs: ['A cloudless blue sky', 'A west-facing kitchen window that receives morning light', 'A blue door that scans cream', 'The upstairs landing with two or three doors', 'The seven-minutes-slow hall clock', 'An empty resident/address field'],
};

export const fileRecordDetails = {
  'file-profile': {
    contentDate: 'Account creation date: blank; last login: 1998-03-28 11:11',
    provenance: 'System-generated profile. Source volume is recorded as UNKNOWN; the external origin is unverified.',
  },
  'file-diary': {
    contentDate: 'Entries dated 1998-03-21 through 1998-03-27',
    provenance: 'First-person household notes attributed to M. Vale. Original medium and author identity are unverified.',
  },
  'file-shopping': {
    contentDate: 'Undated household list',
    provenance: 'Domestic note attributed to M. Vale. Its file timestamp does not establish when the shopping or events occurred.',
  },
  'file-house': {
    contentDate: 'Embedded camera clock: 1996-08-14 16:02',
    provenance: 'Image and caption are stored in the same NULL.HOME directory. Location is null; the camera clock has not been independently checked.',
  },
  'file-address': {
    contentDate: 'The search record contains no separate content date',
    provenance: 'Contemporary office address-index result. It reports no matching parcel or route; it does not establish that no person existed.',
  },
  'file-staff': {
    contentDate: 'Export document date: 1997-06-02',
    provenance: 'First surviving household-index export. Resident and parcel fields are blank; later files repeat material associated with this archive.',
  },
  'file-transfer': {
    contentDate: 'Transfer correspondence: 1997-11-06',
    provenance: 'Ada Larkin’s contemporary copy note. It describes the disk received, not the origin date of the household material.',
  },
  'file-mail-rowan': {
    contentDate: 'Email message date: 1997-11-18',
    provenance: 'Elias Rowan’s recollection and interpretation, written after reviewing the same scan and archive.',
  },
  'file-system': {
    contentDate: 'Logged event: 1997-11-09 22:36:04–22:36:09',
    provenance: 'System-generated trace. The recorded sample shows no mounted source at that moment; earlier attachment history is not retained.',
  },
  'file-guestbook': {
    contentDate: 'Guestbook text is undated',
    provenance: 'Recovered visitor notes with uncertain authorship. The file timestamp is not a verified visit date.',
  },
  'file-deleted-letter': {
    contentDate: 'Letter content is undated',
    provenance: 'Deleted fragment attributed to Elias Rowan. The recycle-bin timestamp describes file handling, not when either letter was written.',
  },
  'file-snapshot': {
    contentDate: 'No separate content date is stated',
    provenance: 'Snapshot header of unknown origin. Its repeated phrases link it to the archive; they are not independent corroboration.',
  },
  'file-last-room': {
    contentDate: 'No separate event date is stated',
    provenance: 'System record revealed by the final synthesis. Its relationship to the active session remains unresolved.',
  },
};

export const validatePuzzleGraph = (definitions = puzzleDefinitions) => {
  const byId = new Map(definitions.map((puzzle) => [puzzle.id, puzzle]));
  if (byId.size !== definitions.length) return false;
  if (definitions.some((puzzle) => puzzle.prerequisites.some((id) => !byId.has(id)))) return false;
  const visiting = new Set();
  const visited = new Set();
  const visit = (id) => {
    if (visiting.has(id)) return false;
    if (visited.has(id)) return true;
    visiting.add(id);
    const valid = byId.get(id).prerequisites.every(visit);
    visiting.delete(id);
    visited.add(id);
    return valid;
  };
  return definitions.every((puzzle) => visit(puzzle.id));
};

export const isPuzzleUnlocked = (id, puzzleStatus) => {
  const puzzle = puzzleDefinitions.find((entry) => entry.id === id);
  return Boolean(puzzle && puzzle.prerequisites.every((dependency) => puzzleStatus[dependency]?.solved));
};

export const buildInitialGameState = () => ({
  version: GAME_VERSION,
  chapter: 1,
  settings: {
    reducedMotion: false,
    reduceAmbientEffects: false,
    crt: true,
    sound: 0.65,
    textScale: 1,
  },
  booting: true,
  startMenuOpen: false,
  windows: [],
  activeWindowId: null,
  selectedFileId: 'file-profile',
  selectedMailId: 'mail-1',
  browserPageId: 'home',
  notes: 'NULL.HOME is an import label, not an address.\n\nThe same files may be repeating one memory rather than confirming one another.',
  stickyNotes: [
    { id: 'sticky-call', title: 'NOTE', text: 'Call Eli back!\nAsk if he remembers\nfixing the hall clock.', color: 'yellow', x: 250, y: 30, open: true },
    { id: 'sticky-todo', title: 'TODO', text: 'Compare the field photo\nwith the contact sheet.\nKeep both versions.', color: 'green', x: 425, y: 45, open: true },
    { id: 'sticky-code', title: 'NOTE', text: '2 doors? 3 doors?\n\nI keep drawing the\nlanding differently.', color: 'pink', x: 600, y: 32, open: true },
    { id: 'sticky-meeting', title: 'REMINDER', text: 'Records room — Thurs,\n3pm. Bring the envelope\nwith no address.', color: 'yellow', x: 785, y: 48, open: true },
    { id: 'sticky-redacted', title: 'RESEARCH', text: '[REDACTED] classification\nCan a memory be a record\nif nobody remembers it?', color: 'green', x: 970, y: 35, open: true },
  ],
  notebook: {
    bookmarked: ['file-profile', 'file-address', 'file-system'],
    evidence: ['NULL.HOME is a directory label; the public address index has no matching place.'],
    graph: ['profile.ini → NULL.HOME', 'NULL.HOME → no parcel record'],
  },
  investigationHistory: {
    recentDocuments: [],
    commands: [],
  },
  caseHypothesis: '',
  puzzleStatus: createPuzzleStatus(),
  filesystem: {
    root: ['Desktop', 'Documents', 'System', 'Archive'],
    Desktop: ['guestbook.txt'],
    Documents: ['profile.ini', 'address-search.txt', 'roster.txt', 'transfer.eml', 'rowan.eml'],
    System: ['trace.log'],
    Archive: ['snapshot.dat', 'last-room.txt'],
  },
  hiddenPaths: ['C:/Windows/System/trace.log'],
  emails: deepClone(mailMessages),
  browserPages: deepClone(browserPages),
  files: deepClone(mysteryFiles),
  events: [
    { id: 'sys-boot', type: 'SYSTEM_BOOT', text: 'DEAD.SYS boot sequence complete. Profile directory NULL.HOME loaded; identity status is unregistered.' },
    { id: 'sys-journal', type: 'SYSTEM_LOG', text: 'No address source is attached. A household archive is present.' },
  ],
  flags: {
    traceUnlocked: false,
    rememberUnlocked: false,
    memoryIndexUnlocked: false,
    finalSequence: false,
    mountEchoPending: false,
    mountEchoSeen: false,
  },
  lastSavedAt: null,
  saveSlot: 'slot-1',
});

export const validateSave = (candidate) => {
  if (!candidate || typeof candidate !== 'object') return null;
  if (!candidate.version || candidate.version !== GAME_VERSION) return null;
  if (!candidate.puzzleStatus || !candidate.files) return null;
  return candidate;
};

export const migrateGameState = (saved) => {
  const initial = buildInitialGameState();
  const puzzleStatus = refreshPuzzleUnlocks(saved.puzzleStatus ?? {});
  const stickyNotes = initial.stickyNotes.map((note) => {
    const previous = Array.isArray(saved.stickyNotes)
      ? saved.stickyNotes.find((entry) => entry.id === note.id)
      : null;
    return {
      ...note,
      x: Number.isFinite(previous?.x) ? previous.x : note.x,
      y: Number.isFinite(previous?.y) ? previous.y : note.y,
      open: typeof previous?.open === 'boolean' ? previous.open : note.open,
    };
  });
  const savedEvents = (Array.isArray(saved.events) ? saved.events : []).flatMap((event) => {
    if (!event || typeof event.type !== 'string' || typeof event.id !== 'string') return [];
    if (event.type === 'SYSTEM_BOOT' || event.type === 'SYSTEM_LOG') return [];
    if (event.type === 'PUZZLE_SOLVED') {
      const puzzle = puzzleDefinitions.find((entry) => entry.id === event.id.replace(/^puzzle-/, ''));
      return puzzle && puzzleStatus[puzzle.id].solved
        ? [{ ...event, text: `${puzzle.title}: ${puzzle.reward}` }]
        : [];
    }
    if (event.type === 'ENDING_REACHED') {
      return puzzleStatus['puzzle-narrative'].solved
        ? [{
          ...event,
          id: 'ending-1',
          text: 'The recovered record confirms that the machine remembers Mara. It cannot confirm whether the house or its resident existed outside the archive.',
        }]
        : [];
    }
    return typeof event.text === 'string' ? [event] : [];
  });
  const solvedEvents = puzzleDefinitions
    .filter((puzzle) => puzzleStatus[puzzle.id].solved)
    .map((puzzle) => ({
      id: `puzzle-${puzzle.id}`,
      type: 'PUZZLE_SOLVED',
      text: `${puzzle.title}: ${puzzle.reward}`,
    }));
  const historicalEvents = [
    ...savedEvents,
    ...solvedEvents,
  ].filter((event, index, all) => all.findIndex((entry) => entry.id === event.id) === index).slice(0, 16);
  const events = [...historicalEvents, ...initial.events].slice(0, 18);
  const flags = {
    ...initial.flags,
    traceUnlocked: puzzleStatus['puzzle-command'].solved,
    rememberUnlocked: puzzleStatus['puzzle-remember'].solved,
    memoryIndexUnlocked: puzzleStatus['puzzle-browser'].solved,
    finalSequence: puzzleStatus['puzzle-narrative'].solved,
    mountEchoPending: false,
    mountEchoSeen: puzzleStatus['puzzle-trace'].solved,
  };
  const savedBookmarks = saved.notebook?.bookmarked;
  const savedHistory = saved.investigationHistory ?? {};
  const recentDocuments = Array.isArray(savedHistory.recentDocuments)
    ? savedHistory.recentDocuments.filter((entry) => (
      entry && evidenceById[entry.id] && evidenceById[entry.id].app === entry.kind
      && typeof entry.openedAt === 'string'
    )).slice(0, 30)
    : [];
  return {
    ...initial,
    settings: { ...initial.settings, ...(saved.settings ?? {}) },
    notes: typeof saved.notes === 'string' ? saved.notes : initial.notes,
    stickyNotes,
    puzzleStatus,
    flags,
    events,
    notebook: {
      ...initial.notebook,
      bookmarked: Array.isArray(savedBookmarks)
        ? savedBookmarks.filter((id) => initial.files.some((file) => file.id === id))
        : initial.notebook.bookmarked,
      evidence: [
        ...initial.notebook.evidence,
        ...puzzleDefinitions
          .filter((puzzle) => puzzleStatus[puzzle.id].solved)
          .map((puzzle) => puzzle.revelation ?? puzzle.reward),
      ].filter((item, index, all) => all.indexOf(item) === index),
    },
    investigationHistory: {
      recentDocuments,
      commands: Array.isArray(savedHistory.commands)
          ? savedHistory.commands.filter((command) => typeof command === 'string').slice(0, 40).map((command) => command.slice(0, 160))
        : [],
    },
    caseHypothesis: typeof saved.caseHypothesis === 'string' ? saved.caseHypothesis.slice(0, 2000) : '',
    selectedFileId: initial.files.some((file) => file.id === saved.selectedFileId) ? saved.selectedFileId : initial.selectedFileId,
    selectedMailId: initial.emails.some((mail) => mail.id === saved.selectedMailId) ? saved.selectedMailId : initial.selectedMailId,
    browserPageId: initial.browserPages.some((page) => page.id === saved.browserPageId) ? saved.browserPageId : initial.browserPageId,
    startMenuOpen: false,
    chapter: flags.finalSequence ? 4 : initial.chapter,
    lastSavedAt: saved.lastSavedAt ?? initial.lastSavedAt,
    saveSlot: saved.saveSlot ?? initial.saveSlot,
  };
};

export const getPuzzleById = (id) => puzzleDefinitions.find((puzzle) => puzzle.id === id);

export const commandSet = [
  'HELP',
  'DIR',
  'CD',
  'TYPE',
  'FIND',
  'ATTRIB',
  'TREE',
  'CLS',
  'DATE',
  'TIME',
];
