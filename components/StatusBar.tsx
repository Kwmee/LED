type StatusBarProps = {
  left: string;
  center?: string;
  right?: string;
};

export function StatusBar({ left, center, right }: StatusBarProps) {
  return (
    <div className="grid h-8 grid-cols-1 border-t border-gray-300 bg-gray-50 text-sm text-gray-800 md:grid-cols-[1fr_1fr_1fr]">
      <div className="border-r border-gray-300 px-3 py-1.5">{left}</div>
      <div className="border-r border-gray-300 px-3 py-1.5">{center ?? ""}</div>
      <div className="px-3 py-1.5">{right ?? ""}</div>
    </div>
  );
}
