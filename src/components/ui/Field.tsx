type FieldProps = {
  label: string;
  value?: string;
  placeholder?: string;
  type?: string;
};

export function Field({ label, value, placeholder, type = "text" }: FieldProps) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-mut">
        {label}
      </span>
      <input
        type={type}
        defaultValue={value}
        placeholder={placeholder}
        readOnly
        className="mt-2 block w-full rounded-xl border border-line bg-white px-[14px] py-3 font-display text-[15px] text-ink outline-none focus:border-teal"
      />
    </label>
  );
}
