export const DIFFICULTIES = {
  easy: { size: 6, lamps: [2, 2], decoys: 0, lampSpacing: 3 },
  medium: { size: 10, lamps: [3, 4], decoys: 1, lampSpacing: 4 },
  hard: { size: 14, lamps: [5, 6], decoys: 2, lampSpacing: 5 },
  expert: { size: 20, lamps: [6, 8], decoys: 2, lampSpacing: 6 }
};

export const DIRS = [
  { key: "n", dr: -1, dc: 0, bit: 1, opposite: 4 },
  { key: "e", dr: 0, dc: 1, bit: 2, opposite: 8 },
  { key: "s", dr: 1, dc: 0, bit: 4, opposite: 1 },
  { key: "w", dr: 0, dc: -1, bit: 8, opposite: 2 }
];

const WIRE_SHAPES = {
  "wire-straight": 1 | 4,
  "wire-corner": 1 | 2,
  "wire-t": 1 | 2 | 4
};

const FLOW_COLORS = ["#ff6ac1", "#78dce8", "#a9dc76", "#ffd866", "#ab9df2", "#fc9867"];

function rotateMask(mask, steps) {
  let result = mask;
  for (let index = 0; index < steps; index += 1) {
    result =
      ((result & 1) ? 2 : 0) |
      ((result & 2) ? 4 : 0) |
      ((result & 4) ? 8 : 0) |
      ((result & 8) ? 1 : 0);
  }
  return result;
}

function maskToShape(mask) {
  const count = [1, 2, 4, 8].filter((bit) => mask & bit).length;
  if (count === 3) {
    for (let rotation = 0; rotation < 4; rotation += 1) {
      if (rotateMask(WIRE_SHAPES["wire-t"], rotation) === mask) return { type: "wire-t", rotation };
    }
  }
  if (count === 2) {
    for (let rotation = 0; rotation < 4; rotation += 1) {
      if (rotateMask(WIRE_SHAPES["wire-straight"], rotation) === mask) return { type: "wire-straight", rotation };
      if (rotateMask(WIRE_SHAPES["wire-corner"], rotation) === mask) return { type: "wire-corner", rotation };
    }
  }
  return { type: "wire-straight", rotation: mask & (2 | 8) ? 1 : 0 };
}

function randInt(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

function keyOf(row, col) {
  return `${row}:${col}`;
}

function pointFromKey(key) {
  const [row, col] = key.split(":").map(Number);
  return { row, col };
}

function inBounds(row, col, size) {
  return row >= 0 && col >= 0 && row < size && col < size;
}

function degree(mask) {
  return [1, 2, 4, 8].filter((bit) => mask & bit).length;
}

function shuffle(items) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = randInt(0, index);
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

function directionBetween(from, to) {
  return DIRS.find((dir) => from.row + dir.dr === to.row && from.col + dir.dc === to.col);
}

function distance(a, b) {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}

function hasNearbyLamp(lamps, point, minDistance) {
  return lamps.some((lamp) => distance(lamp, point) < minDistance);
}

function findFallbackLamp({ lamps, source, size, used, minDistance }) {
  for (let spacing = minDistance; spacing >= 2; spacing -= 1) {
    const candidates = [];
    for (let row = 0; row < size; row += 1) {
      for (let col = Math.floor(size * 0.58); col < size; col += 1) {
        const point = { row, col };
        const key = keyOf(row, col);
        if (used.has(key) || distance(point, source) < Math.floor(size * 0.55) || hasNearbyLamp(lamps, point, spacing)) continue;
        candidates.push(point);
      }
    }

    if (candidates.length) {
      candidates.sort((a, b) => {
        const aNearest = lamps.length ? Math.min(...lamps.map((lamp) => distance(lamp, a))) : size;
        const bNearest = lamps.length ? Math.min(...lamps.map((lamp) => distance(lamp, b))) : size;
        return bNearest - aNearest || distance(a, source) - distance(b, source);
      });
      return candidates[0];
    }
  }

  return null;
}

function canApplyStep(from, to, masks) {
  const dir = directionBetween(from, to);
  if (!dir) return false;

  const fromKey = keyOf(from.row, from.col);
  const toKey = keyOf(to.row, to.col);
  const nextFromMask = (masks.get(fromKey) ?? 0) | dir.bit;
  const nextToMask = (masks.get(toKey) ?? 0) | dir.opposite;
  return degree(nextFromMask) <= 3 && degree(nextToMask) <= 3;
}

function applyStep(from, to, masks) {
  const dir = directionBetween(from, to);
  if (!dir || !canApplyStep(from, to, masks)) return false;

  const fromKey = keyOf(from.row, from.col);
  const toKey = keyOf(to.row, to.col);
  masks.set(fromKey, (masks.get(fromKey) ?? 0) | dir.bit);
  masks.set(toKey, (masks.get(toKey) ?? 0) | dir.opposite);
  return true;
}

function getStepOptions(current, target, size, visited, masks) {
  const direct = DIRS.map((dir) => ({
    row: current.row + dir.dr,
    col: current.col + dir.dc,
    score: Math.abs(target.row - (current.row + dir.dr)) + Math.abs(target.col - (current.col + dir.dc))
  })).filter((point) =>
    inBounds(point.row, point.col, size) &&
    canApplyStep(current, point, masks)
  );

  const fresh = direct.filter((point) => !visited.has(keyOf(point.row, point.col)) || (point.row === target.row && point.col === target.col));
  const pool = fresh.length ? fresh : direct;
  pool.sort((a, b) => a.score - b.score);

  const mostlyForward = pool.slice(0, Math.min(2, pool.length));
  if (Math.random() < 0.08 && pool.length > mostlyForward.length) {
    mostlyForward.push(pool[randInt(mostlyForward.length, pool.length - 1)]);
  }

  return mostlyForward;
}

function carvePath(source, target, size, masks) {
  const current = { ...source };
  const visited = new Set([keyOf(current.row, current.col)]);
  const path = [{ ...current }];
  const guard = size * size * 3;

  for (let step = 0; step < guard && (current.row !== target.row || current.col !== target.col); step += 1) {
    const options = getStepOptions(current, target, size, visited, masks);
    if (!options.length) break;

    const next = options[randInt(0, Math.min(1, options.length - 1))];
    if (!applyStep(current, next, masks)) break;
    visited.add(keyOf(next.row, next.col));
    current.row = next.row;
    current.col = next.col;
    path.push({ ...current });
  }

  return {
    success: current.row === target.row && current.col === target.col,
    path
  };
}

export function getCellMask(cell) {
  if (!cell || cell.type === "empty") return 0;
  if (cell.type === "source" || cell.type === "lamp") return cell.mask;
  return rotateMask(WIRE_SHAPES[cell.type] ?? 0, cell.rotation);
}

export function getCellBaseMask(cell) {
  if (!cell || cell.type === "empty") return 0;
  if (cell.type === "source" || cell.type === "lamp") return cell.mask;
  return WIRE_SHAPES[cell.type] ?? 0;
}

export function createLevel(difficulty = "easy") {
  const config = DIFFICULTIES[difficulty] ?? DIFFICULTIES.easy;
  const size = config.size;
  const flowColor = FLOW_COLORS[randInt(0, FLOW_COLORS.length - 1)];
  const lampCount = randInt(config.lamps[0], config.lamps[1]);
  const source = {
    row: Math.floor(size / 2),
    col: randInt(0, Math.max(0, Math.floor(size * 0.18)))
  };
  const used = new Set();
  used.add(keyOf(source.row, source.col));

  const lamps = [];
  let attempts = 0;
  while (lamps.length < lampCount && attempts < size * size * 4) {
    attempts += 1;
    const lamp = {
      row: randInt(0, size - 1),
      col: randInt(Math.floor(size * 0.58), size - 1)
    };
    const key = keyOf(lamp.row, lamp.col);
    const sourceDistance = distance(lamp, source);
    if (used.has(key) || sourceDistance < Math.floor(size * 0.55) || hasNearbyLamp(lamps, lamp, config.lampSpacing)) continue;
    used.add(key);
    lamps.push(lamp);
  }

  while (lamps.length < lampCount) {
    const lamp = findFallbackLamp({ lamps, source, size, used, minDistance: config.lampSpacing });
    if (!lamp) break;
    used.add(keyOf(lamp.row, lamp.col));
    lamps.push(lamp);
  }

  let masks = new Map();
  const networkKeys = new Set([keyOf(source.row, source.col)]);
  const connectedLamps = [];

  lamps.forEach((lamp) => {
    const sortedAnchors = [...networkKeys]
      .map(pointFromKey)
      .filter((point) => degree(masks.get(keyOf(point.row, point.col)) ?? 0) < 3)
      .sort((a, b) => distance(a, lamp) - distance(b, lamp));

    let carved = null;
    const anchorPool = sortedAnchors.length ? sortedAnchors : [source];
    for (let attempt = 0; attempt < 90 && !carved; attempt += 1) {
      const anchor = anchorPool[Math.min(randInt(0, Math.min(3, anchorPool.length - 1)), anchorPool.length - 1)];
      const candidateMasks = new Map(masks);
      const result = carvePath(anchor, lamp, size, candidateMasks);
      if (result.success) {
        carved = { masks: candidateMasks, path: result.path };
      }
    }

    if (carved) {
      masks = carved.masks;
      connectedLamps.push(lamp);
      carved.path.forEach((point) => networkKeys.add(keyOf(point.row, point.col)));
    }
  });

  const lampKeys = new Set(connectedLamps.map((lamp) => keyOf(lamp.row, lamp.col)));
  const decoyMasks = new Map();
  const decoyCandidates = shuffle([...networkKeys]).flatMap((key) => {
    const point = pointFromKey(key);
    return shuffle(DIRS)
      .map((dir) => ({
        row: point.row + dir.dr,
        col: point.col + dir.dc,
        mask: dir.bit
      }))
      .filter((candidate) => {
        const candidateKey = keyOf(candidate.row, candidate.col);
        return (
          inBounds(candidate.row, candidate.col, size) &&
          !networkKeys.has(candidateKey) &&
          !lampKeys.has(candidateKey) &&
          candidateKey !== keyOf(source.row, source.col)
        );
      });
  });

  for (const candidate of decoyCandidates) {
    if (decoyMasks.size >= config.decoys) break;
    const candidateKey = keyOf(candidate.row, candidate.col);
    if (decoyMasks.has(candidateKey)) continue;
    decoyMasks.set(candidateKey, candidate.mask);
  }

  const grid = Array.from({ length: size }, (_, row) =>
    Array.from({ length: size }, (_, col) => {
      const key = keyOf(row, col);
      const mask = masks.get(key) ?? 0;
      const decoyMask = decoyMasks.get(key) ?? 0;
      const isSource = row === source.row && col === source.col;
      const isLamp = connectedLamps.some((lamp) => row === lamp.row && col === lamp.col);

      if (isSource) {
        return { id: key, type: "source", row, col, mask, rotation: 0, flowColor };
      }

      if (isLamp) {
        return { id: key, type: "lamp", row, col, mask, rotation: 0, lit: false, flowColor };
      }

      if (mask) {
        const shape = maskToShape(mask);
        const scrambleOptions = shape.type === "wire-straight" ? [1, 3] : [1, 2, 3];
        const scramble = scrambleOptions[randInt(0, scrambleOptions.length - 1)];
        return { id: key, row, col, type: shape.type, solutionRotation: shape.rotation, rotation: (shape.rotation + scramble) % 4 };
      }

      if (decoyMask) {
        const shape = maskToShape(decoyMask);
        return { id: key, row, col, type: shape.type, solutionRotation: shape.rotation, rotation: randInt(0, 3), filler: true };
      }

      return { id: key, type: "empty", row, col, rotation: 0 };
    })
  );

  return {
    id: crypto.randomUUID(),
    difficulty,
    size,
    flowColor,
    grid,
    source,
    lamps: connectedLamps.map((lamp) => ({ ...lamp, flowColor })),
    lampsTotal: connectedLamps.length
  };
}

export function computeFlow(level) {
  const active = new Set();
  const cellColors = new Map();
  const queue = [level.source];
  const visited = new Set();
  const litLamps = new Set();

  for (let cursor = 0; cursor < queue.length; cursor += 1) {
    const current = queue[cursor];
    const currentKey = keyOf(current.row, current.col);
    if (visited.has(currentKey)) continue;
    visited.add(currentKey);
    active.add(currentKey);
    cellColors.set(currentKey, [level.flowColor]);

    const cell = level.grid[current.row]?.[current.col];
    if (!cell) continue;
    if (cell.type === "lamp") litLamps.add(currentKey);

    const mask = getCellMask(cell);
    DIRS.forEach((dir) => {
      if (!(mask & dir.bit)) return;

      const nr = current.row + dir.dr;
      const nc = current.col + dir.dc;
      if (!inBounds(nr, nc, level.size)) return;

      const neighbor = level.grid[nr][nc];
      const neighborMask = getCellMask(neighbor);
      if (neighborMask & dir.opposite) queue.push({ row: nr, col: nc });
    });
  }

  return {
    active,
    cellColors,
    litLamps,
    lampsLit: litLamps.size,
    won: litLamps.size === level.lampsTotal
  };
}

export function rotateCell(level, row, col) {
  const cell = level.grid[row]?.[col];
  if (!cell || !cell.type.startsWith("wire")) return level;

  const grid = level.grid.map((gridRow) => gridRow.map((item) => ({ ...item })));
  grid[row][col].rotation = (grid[row][col].rotation + 1) % 4;
  return { ...level, grid };
}

export function calculateScore({ size, seconds, moves, lampsLit }) {
  const base = size * size * 10;
  const timePenalty = seconds * 2;
  const movePenalty = moves * 5;
  const lampBonus = lampsLit * 100;
  return Math.max(0, base + lampBonus - timePenalty - movePenalty);
}
