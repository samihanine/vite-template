// ========== 1. RECAP OF PREVIOUS VARIABLES ==========

interface SymbolXZ {
  x: number;
  z: number;
  probability: number;
}

export const symbolDistribution: SymbolXZ[] = [
  { x: 1, z: 0, probability: (1 / 6) * (1 - 0.2) },
  { x: 1, z: 1, probability: (1 / 6) * 0.2 },
  { x: 2, z: 0, probability: (1 / 6) * (1 - 0.2) },
  { x: 2, z: 1, probability: (1 / 6) * 0.2 },
  { x: 3, z: 0, probability: (1 / 6) * (1 - 0.5) },
  { x: 3, z: 1, probability: (1 / 6) * 0.5 },
  { x: 4, z: 0, probability: (1 / 6) * (1 - 0.5) },
  { x: 4, z: 1, probability: (1 / 6) * 0.5 },
  { x: 5, z: 0, probability: (1 / 6) * (1 - 0.8) },
  { x: 5, z: 1, probability: (1 / 6) * 0.8 },
  { x: 6, z: 0, probability: (1 / 6) * (1 - 0.8) },
  { x: 6, z: 1, probability: (1 / 6) * 0.8 },
];

// ========== 2. SHANNON–FANO CODING ==========

interface SymbolCode {
  x: number;
  z: number;
  probability: number;
  code: string;
}

function shannonFanoCoding(symbols: SymbolXZ[]): SymbolCode[] {
  const sorted = [...symbols].sort((a, b) => b.probability - a.probability);

  function assignCodes(list: SymbolXZ[], prefix: string): SymbolCode[] {
    if (list.length === 1) {
      const single = list[0];
      return [{ ...single, code: prefix }];
    }

    if (list.length === 0) return [];

    const total = list.reduce((acc, s) => acc + s.probability, 0);
    let partialSum = 0;
    let splitIndex = -1;

    for (let i = 0; i < list.length; i++) {
      if (partialSum + list[i].probability <= total / 2) {
        partialSum += list[i].probability;
      } else {
        splitIndex = i;
        break;
      }
    }

    if (splitIndex < 0) {
      splitIndex = list.length;
    }

    const groupA = list.slice(0, splitIndex);
    const groupB = list.slice(splitIndex);

    const codedA = assignCodes(groupA, prefix + '0');
    const codedB = assignCodes(groupB, prefix + '1');

    return [...codedA, ...codedB];
  }

  const codedSymbols = assignCodes(sorted, '');

  return codedSymbols;
}

const fanoCodes = shannonFanoCoding(symbolDistribution);

console.log('--- Shannon–Fano Codes ---');
console.log(fanoCodes)

function expectedLength(codes: SymbolCode[]): number {
  return codes.reduce((sum, s) => {
    return sum + s.probability * s.code.length;
  }, 0);
}

const fanoExpectedLength = expectedLength(fanoCodes);
console.log('Shannon–Fano Expected Length:', fanoExpectedLength.toFixed(4));

// ========== 3. HUFFMAN CODING ==========

interface HuffmanNode {
  symbol?: SymbolXZ;
  left?: HuffmanNode;
  right?: HuffmanNode;
  probability: number;
}

function huffmanCoding(symbols: SymbolXZ[]): SymbolCode[] {
  let forest: HuffmanNode[] = symbols.map((s) => ({
    symbol: s,
    probability: s.probability,
  }));

  while (forest.length > 1) {
    forest.sort((a, b) => a.probability - b.probability);

    const first = forest[0];
    const second = forest[1];
    forest = forest.slice(2);

    const newNode: HuffmanNode = {
      left: first,
      right: second,
      probability: first.probability + second.probability,
    };
    forest.push(newNode);
  }

  const root = forest[0];

  function traverse(node: HuffmanNode, prefix: string): SymbolCode[] {
    if (node.symbol && !node.left && !node.right) {
      return [
        {
          x: node.symbol.x,
          z: node.symbol.z,
          probability: node.symbol.probability,
          code: prefix,
        },
      ];
    }
    let result: SymbolCode[] = [];
    if (node.left) {
      result = result.concat(traverse(node.left, prefix + '0'));
    }
    if (node.right) {
      result = result.concat(traverse(node.right, prefix + '1'));
    }
    return result;
  }

  const codes = traverse(root, '');

  return codes;
}

const huffmanCodes = huffmanCoding(symbolDistribution);

const huffmanExpectedLength = expectedLength(huffmanCodes);

console.log('--- Huffman Codes ---');
console.log(huffmanCodes);
console.log('Huffman Expected Length:', huffmanExpectedLength.toFixed(4));

// ========== 4. COMPARISON WITH ENTROPY ==========

function computeEntropy(symbols: SymbolXZ[]): number {
  let entropy = 0;
  for (const s of symbols) {
    if (s.probability > 0) {
      entropy += s.probability * Math.log2(1 / s.probability);
    }
  }
  return entropy;
}

const Hxz = computeEntropy(symbolDistribution);
console.log('Entropy H(X,Z):', Hxz.toFixed(4));

console.log('Shannon–Fano Expected Length:', fanoExpectedLength.toFixed(4));
console.log('Huffman Expected Length:', huffmanExpectedLength.toFixed(4));

console.log('Difference Fano - Entropy:', (fanoExpectedLength - Hxz).toFixed(4));
console.log('Difference Huffman - Entropy:', (huffmanExpectedLength - Hxz).toFixed(4));
