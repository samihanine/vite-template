import React, { useEffect, useRef, useMemo } from 'react';
import {
  extractSets,
  generateCombinations,
  renderVennDiagram,
} from '@upsetjs/bundle';

interface VennDiagramComponentProps {
  HX: number;
  HY: number;
  IXY: number;
  labelX: string;
  labelY: string;
}

export default function VennDiagramComponent({
  HX,
  HY,
  IXY,
  labelX,
  labelY,
}: VennDiagramComponentProps) {
  const data = useMemo(
    () => [
      ...Array(Math.round((HX - IXY) * 1000)).fill({ sets: [labelX] }),
      ...Array(Math.round((HY - IXY) * 1000)).fill({ sets: [labelY] }),
      ...Array(Math.round(IXY * 1000)).fill({ sets: [labelX, labelY] }),
    ],
    [HX, HY, IXY, labelX, labelY],
  );

  const sets = useMemo(() => extractSets(data), [data]);
  const combinations = useMemo(() => generateCombinations(sets), [sets]);

  const [selection, setSelection] = React.useState(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const props = {
        sets,
        combinations,
        width: 400,
        height: 300,
        selection,
        onHover: (s: any) => setSelection(s),
      };

      renderVennDiagram(containerRef.current, props);
    }
  }, [sets, combinations, selection]);

  return (
    <div className="rounded-xl bg-white p-4 shadow">
      <h2 className="mb-2 text-center font-bold">
        Venn Diagram of {labelX} and {labelY}
      </h2>
      <div ref={containerRef}></div>
      <div className="mt-2 text-center text-sm text-gray-600">
        H({labelX}) ≈ {HX.toFixed(3)} bits, H({labelY}) ≈ {HY.toFixed(3)} bits,
        <br />
        I({labelX};{labelY}) ≈ {IXY.toFixed(3)} bits
      </div>
    </div>
  );
}
