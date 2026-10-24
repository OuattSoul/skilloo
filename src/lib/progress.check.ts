// Self-check for the progress rules. Run: npx tsx src/lib/progress.check.ts
import assert from 'node:assert/strict';
import { BLOCKCHAIN_MODULES as modules } from '../data/modulesData';
import { INITIAL_MISSIONS as missions } from '../data/citizensData';
import { DISTRICTS } from '../data/districtsData';
import { computeStats, emptyProgress, moduleStatus, rankFor } from './progress';

const p = emptyProgress();
assert.equal(moduleStatus('mod_1', 0, p, 'learner'), 'available');
assert.equal(moduleStatus('mod_2', 1, p, 'learner'), 'locked');
assert.equal(moduleStatus('mod_2', 1, p, 'demo'), 'available');
assert.equal(moduleStatus('mod_1', 0, { ...p, viewed: ['mod_1'] }, 'learner'), 'viewed');
assert.equal(moduleStatus('mod_1', 0, { ...p, completed: ['mod_1'] }, 'learner'), 'completed');

const s0 = computeStats(p, modules, missions);
assert.deepEqual([s0.level, s0.xpTotal, s0.xpInLevel, s0.xpForNext], [1, 0, 0, 500]);

// Levels chain: 500 → 750 → 1125 …, several level-ups at once are counted.
const all = { ...p, completed: modules.map(m => m.id) };
const sAll = computeStats(all, modules, missions);
let xp = sAll.xpTotal, lvl = 1, need = 500;
while (xp >= need) { xp -= need; lvl++; need = Math.round(need * 1.5); }
assert.equal(sAll.level, lvl);
assert.equal(sAll.completedCount, 18);

assert.equal(rankFor(0).label, 'Débutant');
assert.equal(rankFor(3).label, 'Apprenti');
assert.equal(rankFor(18).label, 'Maître');
assert.equal(rankFor(18).next, undefined);

// Every module belongs to exactly one district.
const ids = DISTRICTS.flatMap(d => d.moduleIds);
assert.equal(ids.length, 18);
assert.deepEqual([...ids].sort(), modules.map(m => m.id).sort());

console.log(`progress checks OK (18 modules → niveau ${sAll.level}, ${sAll.xpTotal} XP)`);
