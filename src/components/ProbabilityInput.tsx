interface ProbabilityInputProps {
  label: string;
  values: number[];
  onChange: (values: number[]) => void;
}

export default function ProbabilityInput({
  label,
  values,
  onChange,
}: ProbabilityInputProps) {
  return (
    <div className="rounded-xl bg-white p-4 shadow">
      <h3 className="mb-2 text-lg font-semibold">{label}</h3>
      {values.map((v, i) => (
        <input
          key={i}
          type="number"
          step="0.01"
          min="0"
          max="1"
          className="m-1 w-16 rounded border text-center"
          value={v}
          onChange={(e) => {
            const newVals = [...values];
            newVals[i] = parseFloat(e.target.value);
            onChange(newVals);
          }}
        />
      ))}
    </div>
  );
}
