// helpers
type Bit = 0 | 1;
type Sym = Bit | '?';

function toBits(str: string): Bit[] {
  return [...str].map((c) => (c === '1' ? 1 : 0));
}

function fromBits(arr: Bit[]): string {
  return arr.join('');
}

// ------------------------------------------------------------

// hamming encoder
function encodeBlock(d: Bit[]): Bit[] {
  const [d1, d2, d3, d4] = d;
  const p1 = (d1 ^ d2 ^ d4) as Bit;
  const p2 = (d1 ^ d3 ^ d4) as Bit;
  const p4 = (d2 ^ d3 ^ d4) as Bit;
  return [p1, p2, d1, p4, d2, d3, d4];
}

// encode an arbitrary-length binary string (pads last block with 0)
export function encode(msg: string): string {
  const bits = toBits(msg);
  const coded: Bit[] = [];

  for (let i = 0; i < bits.length; i += 4) {
    const group = bits.slice(i, i + 4);
    while (group.length < 4) group.push(0); // zero-padding
    coded.push(...encodeBlock(group));
  }
  return fromBits(coded);
}

// ------------------------------------------------------------

// hamming decoder
function parityCheck(b: Sym[]): (Bit | null)[] {
  const s1 = [0, 2, 4, 6].every((i) => b[i] !== '?')
    ? [0, 2, 4, 6].map((i) => b[i] as Bit).reduce((a, c) => (a ^ c) as Bit)
    : null;
  const s2 = [1, 2, 5, 6].every((i) => b[i] !== '?')
    ? [1, 2, 5, 6].map((i) => b[i] as Bit).reduce((a, c) => (a ^ c) as Bit)
    : null;
  const s4 = [3, 4, 5, 6].every((i) => b[i] !== '?')
    ? [3, 4, 5, 6].map((i) => b[i] as Bit).reduce((a, c) => (a ^ c) as Bit)
    : null;
  return [s1, s2, s4];
}

// solve erasures
function solveErasures(b: Sym[]): Sym[] {
  const erasures = b.map((v, i) => (v === '?' ? i : -1)).filter((i) => i >= 0);
  if (erasures.length === 0) return b;

  const trials = 1 << erasures.length; // 2^n possibilities
  let found: Bit[] | null = null;

  for (let mask = 0; mask < trials; mask++) {
    const candidate = [...b];
    erasures.forEach((pos, j) => {
      candidate[pos] = ((mask >> j) & 1) as Bit;
    });
    const [s1, s2, s4] = parityCheck(candidate);
    if (s1 === 0 && s2 === 0 && s4 === 0) {
      if (found) return b; // ambiguous → give up
      found = candidate as Bit[];
    }
  }
  return found ?? b; // return corrected or original
}

// decode one 7-bit block (may output '?' if unresolved)
function decodeBlock(str: string): string {
  const fixed = solveErasures([...str] as Sym[]);
  return [fixed[2], fixed[4], fixed[5], fixed[6]]
    .map((v) => (v === '?' ? '?' : v))
    .join('');
}

// decode full codeword string
export function decode(codeword: string): string {
  let result = '';
  for (let i = 0; i < codeword.length; i += 7)
    result += decodeBlock(codeword.slice(i, i + 7));
  return result;
}

