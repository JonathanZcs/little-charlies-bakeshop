import type { ReactNode } from "react";

/**
 * Consistent page header for every admin screen: a serif title, an optional
 * supporting line, and an optional right-aligned action slot (e.g. a primary
 * "+ Add" button). Keeps Orders / Menu / Shop / Recipes / Finances visually
 * aligned instead of each rolling its own heading.
 */
export default function AdminPageHeader({
  title,
  subtitle,
  meta,
  action,
}: {
  title: string;
  subtitle?: string;
  meta?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-serif text-3xl text-mocha">{title}</h1>
          {subtitle && <p className="text-sm text-brown/50 mt-1">{subtitle}</p>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      {meta && (
        <div className="mt-3 flex items-center gap-2 text-xs text-brown/40 tracking-wide">
          {meta}
        </div>
      )}
    </div>
  );
}

/** Small green-dot "live" indicator used in page-header meta rows. */
export function LiveDot() {
  return <span className="w-1.5 h-1.5 rounded-full bg-rose inline-block" />;
}
