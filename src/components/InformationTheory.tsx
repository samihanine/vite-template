import { useState, useEffect } from 'react';
import NumberInput from './NumberInput';
import FormulaDisplay from './FormulaDisplay';
import FanoInequality from './FanoInequality';
import {
  entropy,
  conditionalEntropy,
  mutualInformation,
  jointEntropy,
} from '../utils/informationTheoryCalculations';
import VennDiagramComponent from './VennDiagram';
import HammingTester from './HammingTester';

interface TabsProps {
  tabs: string[];
  activeTab: number;
  setActiveTab: (index: number) => void;
}

function Tabs({ tabs, activeTab, setActiveTab }: TabsProps) {
  return (
    <div className="mb-4 border-b border-gray-200">
      <ul className="-mb-px flex flex-wrap text-center text-sm font-medium">
        {tabs.map((tab: string, index: number) => (
          <li key={index} className="mr-2">
            <button
              className={`inline-block rounded-t-lg p-4 ${
                activeTab === index
                  ? 'active border-b-2 border-blue-600 text-blue-600'
                  : 'hover:border-gray-300 hover:text-gray-600'
              }`}
              onClick={() => setActiveTab(index)}
            >
              {tab}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function InformationTheory() {
  const [chaptersCount, setChaptersCount] = useState(6);
  const [activeOldTab, setActiveOldTab] = useState(0);
  const [selectedHomework, setSelectedHomework] = useState<
    'homework10' | 'older' | null
  >(null);
  const oldTabTitles = ['Calculs', 'Venn diagrams', 'Fano inequality'];

  const probX = Array(chaptersCount).fill(1 / chaptersCount);

  const probZgivenX = probX.map((_, i) => (i < 2 ? 0.2 : i < 4 ? 0.5 : 0.8));
  const probWgivenX = probX.map((_, i) => (i < 2 ? 0.3 : i < 4 ? 0.6 : 0.9));
  const probYgivenX = probX.map((_, i) => (i < chaptersCount / 2 ? 0.8 : 0.3));

  const [results, setResults] = useState({
    HX: 0,
    HZ: 0,
    HW: 0,
    HY: 0,
    HZgivenX: 0,
    HWgivenX: 0,
    HYgivenX: 0,
    IXZ: 0,
    IXW: 0,
    HXgivenY: 2.4,
    HXY: 0,
  });

  useEffect(() => {
    const probZ = probX.reduce((a, p, i) => a + p * probZgivenX[i], 0);
    const probW = probX.reduce((a, p, i) => a + p * probWgivenX[i], 0);
    const probY = probX.reduce((a, p, i) => a + p * probYgivenX[i], 0);

    const HX = entropy(probX);
    const HZ = entropy([probZ, 1 - probZ]);
    const HW = entropy([probW, 1 - probW]);
    const HY = entropy([probY, 1 - probY]);

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

    const IXZ = mutualInformation(HZ, HZgivenX);
    const IXW = mutualInformation(HW, HWgivenX);

    const probJointXY = probX.map((px, i) => [
      px * probYgivenX[i],
      px * (1 - probYgivenX[i]),
    ]);
    const HXY = jointEntropy(probJointXY);

    setResults({
      HX,
      HZ,
      HW,
      HY,
      HZgivenX,
      HWgivenX,
      HYgivenX,
      IXZ,
      IXW,
      HXgivenY: 2.4,
      HXY,
    });
  }, [chaptersCount]);

  // Contenu des calculs
  const CalculsContent = () => (
    <section className="grid grid-cols-2 gap-4">
      <FormulaDisplay
        label="Entropy H(X)"
        formula="H(X) = -Σ p(x)log₂p(x)"
        value={results.HX}
        description="Uncertainty about chapters reviewed."
      />
      <FormulaDisplay
        label="Entropy H(Z)"
        formula="H(Z) = -Σ p(z)log₂p(z)"
        value={results.HZ}
        description="Uncertainty studying with friend or alone."
      />
      <FormulaDisplay
        label="Entropy H(W)"
        formula="H(W) = -Σ p(w)log₂p(w)"
        value={results.HW}
        description="Uncertainty about confidence."
      />
      <FormulaDisplay
        label="Entropy H(Y)"
        formula="H(Y) = -Σ p(y)log₂p(y)"
        value={results.HY}
        description="Uncertainty about taking a break."
      />

      <FormulaDisplay
        label="Conditional Entropy H(Z|X)"
        formula="H(Z|X) = Σp(x)H(Z|X=x)"
        value={results.HZgivenX}
        description="Remaining uncertainty of Z given X."
      />
      <FormulaDisplay
        label="Conditional Entropy H(W|X)"
        formula="H(W|X) = Σp(x)H(W|X=x)"
        value={results.HWgivenX}
        description="Remaining uncertainty of W given X."
      />
      <FormulaDisplay
        label="Conditional Entropy H(Y|X)"
        formula="H(Y|X) = Σp(x)H(Y|X=x)"
        value={results.HYgivenX}
        description="Remaining uncertainty of Y given X."
      />

      <FormulaDisplay
        label="Mutual Information I(X;Z)"
        formula="I(X;Z) = H(Z) - H(Z|X)"
        value={results.IXZ}
        description="Information gained about X by knowing Z."
      />
      <FormulaDisplay
        label="Mutual Information I(X;W)"
        formula="I(X;W) = H(W) - H(W|X)"
        value={results.IXW}
        description="Information gained about X by knowing W."
      />
      <FormulaDisplay
        label="Joint Entropy H(X,Y)"
        formula="H(X,Y) = -Σ p(x,y)log₂p(x,y)"
        value={results.HXY}
        description="Combined uncertainty of X and Y."
      />
      <FormulaDisplay
        label="Conditional Entropy H(X|Y)"
        formula="Given value from homework (2.4 bits)"
        value={results.HXgivenY}
        description="Remaining uncertainty about X knowing Y."
      />
    </section>
  );

  // Contenu des diagrammes de Venn
  const VennDiagramsContent = () => (
    <section className="grid grid-cols-2 gap-4">
      <VennDiagramComponent
        HX={results.HX}
        HY={results.HZ}
        IXY={results.IXZ}
        labelX="X"
        labelY="Z"
      />
      <VennDiagramComponent
        HX={results.HX}
        HY={results.HW}
        IXY={results.IXW}
        labelX="X"
        labelY="W"
      />
    </section>
  );

  // Contenu de l'inégalité de Fano
  const FanoInequalityContent = () => (
    <section>
      <FanoInequality
        HXgivenY={results.HXgivenY}
        cardinalityX={chaptersCount}
      />
    </section>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="mb-8 text-center text-3xl font-bold">
        Information Theory Homework
      </h1>

      {/* Selection Buttons */}
      {!selectedHomework && (
        <div className="mt-16 flex justify-center gap-8">
          <button
            onClick={() => setSelectedHomework('homework10')}
            className="transform rounded-xl bg-blue-600 px-12 py-8 font-bold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:bg-blue-700"
          >
            <div className="mb-2 text-2xl">📚</div>
            <div className="text-xl">Homework 10</div>
            <div className="mt-2 text-sm opacity-80">Hamming Codes</div>
          </button>

          <button
            onClick={() => setSelectedHomework('older')}
            className="transform rounded-xl bg-green-600 px-12 py-8 font-bold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:bg-green-700"
          >
            <div className="mb-2 text-2xl">📊</div>
            <div className="text-xl">Older Homeworks</div>
            <div className="mt-2 text-sm opacity-80">Information Theory</div>
          </button>
        </div>
      )}

      {/* Homework 10 Content */}
      {selectedHomework === 'homework10' && (
        <div className="rounded-xl bg-white p-6 shadow-lg">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-blue-600">
              Homework 10 - Hamming Codes
            </h2>
            <button
              onClick={() => setSelectedHomework(null)}
              className="rounded-lg bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
            >
              Back to Menu
            </button>
          </div>
          <HammingTester />
        </div>
      )}

      {/* Older Homeworks Content */}
      {selectedHomework === 'older' && (
        <div className="rounded-xl bg-white p-6 shadow-lg">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-green-600">
              Older Homeworks - Information Theory
            </h2>
            <button
              onClick={() => setSelectedHomework(null)}
              className="rounded-lg bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
            >
              Back to Menu
            </button>
          </div>

          {/* Variables Definition */}
          <div className="mb-6 rounded-lg bg-gray-50 p-4">
            <h3 className="mb-2 font-semibold">Variables Definition</h3>
            <ul className="list-disc pl-6 text-sm">
              <li>
                <strong>X</strong>: Chapters reviewed (1 to {chaptersCount}),
                uniformly distributed.
              </li>
              <li>
                <strong>Z</strong>: Study with a friend (1) or alone (0).
              </li>
              <li>
                <strong>W</strong>: Confidence after session (1 confident, 0 not
                confident).
              </li>
              <li>
                <strong>Y</strong>: Take a break (1) or not (0).
              </li>
            </ul>
          </div>

          <div className="mb-4">
            <NumberInput
              label="Number of Chapters (X outcomes)"
              value={chaptersCount}
              onChange={setChaptersCount}
            />
          </div>

          <Tabs
            tabs={oldTabTitles}
            activeTab={activeOldTab}
            setActiveTab={setActiveOldTab}
          />

          <div className="mt-4">
            {activeOldTab === 0 && <CalculsContent />}
            {activeOldTab === 1 && <VennDiagramsContent />}
            {activeOldTab === 2 && <FanoInequalityContent />}
          </div>
        </div>
      )}
    </div>
  );
}
