interface EntropyDisplayProps {
  results: Record<string, number>;
}

export default function EntropyDisplay({ results }: EntropyDisplayProps) {
  return (
    <div className="mt-6 rounded-xl bg-white p-6 shadow">
      <h2 className="mb-4 text-xl font-bold">🧮 Résultats (en bits)</h2>
      <ul className="grid grid-cols-2 gap-2">
        {Object.entries(results).map(([key, val]) => (
          <li key={key} className="text-gray-800">
            <span className="font-medium">{key}</span>: {val.toFixed(3)}
          </li>
        ))}
      </ul>
    </div>
  );
}
