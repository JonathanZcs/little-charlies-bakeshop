export default function Divider({ symbol = "✦" }: { symbol?: string }) {
  return (
    <div className="flex items-center justify-center gap-4 my-2">
      <div className="h-px w-16 bg-parchment" />
      <span className="text-parchment text-base">{symbol}</span>
      <div className="h-px w-16 bg-parchment" />
    </div>
  );
}
