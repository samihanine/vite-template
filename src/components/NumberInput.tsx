interface NumberInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export default function NumberInput({
  label,
  value,
  onChange,
  min = 1,
  max = 20,
}: NumberInputProps) {
  return (
    <div className="rounded-xl bg-white p-4 shadow">
      <label className="font-semibold">{label}</label>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full rounded border px-2 py-1"
      />
    </div>
  );
}
