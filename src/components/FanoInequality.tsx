interface FanoProps {
  HXgivenY: number;
  cardinalityX: number;
}

export default function FanoInequality({ HXgivenY, cardinalityX }: FanoProps) {
  const logCardX = Math.log2(cardinalityX);
  const PeFano = Math.max(0, (HXgivenY - 1) / logCardX);

  return (
    <div className="rounded-xl bg-white p-6 shadow">
      <h2 className="text-xl font-bold">📐 Fano's Inequality</h2>
      <div className="mt-2">
        <p>Formula used:</p>
        <pre className="rounded bg-gray-100 p-2">
          Pe ≥ (H(X|Y) - 1) / log₂|X|
        </pre>
        <div className="mt-2">
          <p>Calculation:</p>
          <p>
            ( {HXgivenY.toFixed(3)} - 1 ) / log₂({cardinalityX}) ={' '}
            <strong>{PeFano.toFixed(3)}</strong>
          </p>
        </div>
        <p className="mt-2">
          Interpretation: Minimum error probability ={' '}
          <strong>{(PeFano * 100).toFixed(1)}%</strong>
        </p>
      </div>
    </div>
  );
}
