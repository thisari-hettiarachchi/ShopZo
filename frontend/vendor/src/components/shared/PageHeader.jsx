export default function PageHeader({ eyebrow, title, description, meta, children }) {
  return (
    <div className="mb-8 rounded-3xl border border-[var(--border)] bg-[var(--bg-card)] p-5 shadow-[0_20px_50px_-34px_var(--shadow)] md:p-6">
      <div className={`${children ? "mb-5" : ""} flex flex-wrap items-end justify-between gap-3`}>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-secondary)]">
            {eyebrow}
          </p>
          <h1 className="mt-2 text-3xl font-extrabold text-[var(--color-primary)] md:text-3xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-1 text-sm text-[var(--text-secondary)]">{description}</p>
          ) : null}
        </div>
        {meta ? (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-main)] px-3 py-2 text-sm text-[var(--text-secondary)]">
            {meta}
          </div>
        ) : null}
      </div>
      {children}
    </div>
  );
}
