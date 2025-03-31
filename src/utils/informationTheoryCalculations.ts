// General utility functions
export const log2 = (x: number): number => Math.log2(x);

// Function to calculate entropy of a probability distribution
export const entropy = (probs: number[]): number => {
  return -probs.reduce((acc, p) => (p > 0 ? acc + p * log2(p) : acc), 0);
};

// Conditional entropy: H(Y|X)
export const conditionalEntropy = (conditionalProbs: number[][], marginalProbs: number[]): number => {
  return conditionalProbs.reduce((acc, probs, i) => acc + marginalProbs[i] * entropy(probs), 0);
};

// Mutual information: I(X;Y) = H(Y) - H(Y|X)
export const mutualInformation = (entropyY: number, entropyYGivenX: number): number => {
  return entropyY - entropyYGivenX;
};

// Joint entropy H(X,Y)
export const jointEntropy = (jointProbs: number[][]): number => {
  const flatProbs = jointProbs.flat();
  return entropy(flatProbs);
};

// Fano's inequality: calculate minimum error probability
export const fanoInequality = (conditionalEntropyXY: number, cardinalityX: number): number => {
  const result = (conditionalEntropyXY - 1) / log2(cardinalityX);
  return result < 0 ? 0 : result; // avoid negative probability
};

// MAIN: Complete recreation of assignment results
export const main = () => {
  // Initial constants definition (fake user input via constant)
  const X = [1, 2, 3, 4, 5, 6];
  const probX = Array(6).fill(1 / 6); // uniform, could be modified via slider eventually

  // Conditional variables Z, W, Y given in the problem statement (user modifiable via sliders/input numbers)
  const probZgivenX = [0.2, 0.2, 0.5, 0.5, 0.8, 0.8];
  const probWgivenX = [0.3, 0.3, 0.6, 0.6, 0.9, 0.9];
  const probYgivenX = [0.8, 0.8, 0.8, 0.3, 0.3, 0.3];

  // Calculation of marginals Z, W, Y
  const probZ = probX.reduce((acc, px, i) => acc + px * probZgivenX[i], 0);
  const probW = probX.reduce((acc, px, i) => acc + px * probWgivenX[i], 0);
  const probY = probX.reduce((acc, px, i) => acc + px * probYgivenX[i], 0);

  // Marginal entropies
  const HX = entropy(probX);
  const HZ = entropy([probZ, 1 - probZ]);
  const HW = entropy([probW, 1 - probW]);
  const HY = entropy([probY, 1 - probY]);

  // Display precise results
  console.log('H(X)=', HX.toFixed(3), 'bits');
  console.log('H(Z)=', HZ.toFixed(3), 'bits');
  console.log('H(W)=', HW.toFixed(3), 'bits');
  console.log('H(Y)=', HY.toFixed(3), 'bits');

  // Conditional entropies H(Z|X), H(W|X), H(Y|X)
  const HZgivenX = conditionalEntropy(
    probZgivenX.map((p) => [p, 1 - p]),
    probX,
  );

  const HWgivenX = conditionalEntropy(
    probWgivenX.map((p) => [p, 1 - p]),
    probX,
  );

  const HYgivenX = conditionalEntropy(
    probYgivenX.map((p) => [p, 1 - p]),
    probX,
  );

  console.log('H(Z|X)=', HZgivenX.toFixed(3), 'bits');
  console.log('H(W|X)=', HWgivenX.toFixed(3), 'bits');
  console.log('H(Y|X)=', HYgivenX.toFixed(3), 'bits');

  // Mutual information I(X;Z), I(X;W)
  const IXZ = mutualInformation(HZ, HZgivenX);
  const IXW = mutualInformation(HW, HWgivenX);

  console.log('I(X;Z)=', IXZ.toFixed(3), 'bits');
  console.log('I(X;W)=', IXW.toFixed(3), 'bits');

  // Calculate joint entropy H(X,Y)
  const probJointXY = X.map((_, i) => [probX[i] * probYgivenX[i], probX[i] * (1 - probYgivenX[i])]);
  const HXY = jointEntropy(probJointXY);

  console.log('H(X,Y)=', HXY.toFixed(3), 'bits');

  // Conditional entropy H(X|Y) from assignment data (joint probabilities already defined)
  const PY = [probY, 1 - probY];
  const probXgivenY = probJointXY[0].map((_, y) => probJointXY.map((pxy) => pxy[y] / PY[y]));

  const HXgivenY = conditionalEntropy(probXgivenY, PY);
  console.log('H(X|Y)=', HXgivenY.toFixed(3), 'bits');

  // Application of Fano's inequality (user can modify Y observation via input select)
  const cardinalityX = X.length; // 6
  const PeFano = fanoInequality(HXgivenY, cardinalityX);
  console.log('Minimum error probability (Fano):', PeFano.toFixed(3));
};