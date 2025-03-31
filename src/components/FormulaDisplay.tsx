interface FormulaProps {
  label: string;
  formula: string;
  value: number;
  description: string;
}

export default function FormulaDisplay({
  label,
  formula,
  value,
  description,
}: FormulaProps) {
  return (
    <div className="rounded-xl bg-white p-4 shadow">
      <h3 className="text-lg font-semibold">{label}</h3>
      <pre className="my-2 rounded bg-gray-100 p-2">{formula}</pre>
      <p className="font-medium">Value: {value.toFixed(3)} bits</p>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}
