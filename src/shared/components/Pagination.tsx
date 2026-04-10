/** Returns the page indices (0-based) and ellipsis markers to render. */
function getPageItems(current: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i)

  const visible = new Set(
    [0, current - 1, current, current + 1, total - 1].filter((n) => n >= 0 && n < total),
  )

  const items: (number | '…')[] = []
  let prev = -1
  for (const n of [...visible].sort((a, b) => a - b)) {
    if (prev !== -1 && n - prev > 1) items.push('…')
    items.push(n)
    prev = n
  }
  return items
}

interface PaginationProps {
  page: number
  totalPages: number
  onChange: (page: number) => void
  /** Optional count shown below the row, e.g. "9 registros en total" */
  totalLabel?: string
}

export function Pagination({ page, totalPages, onChange, totalLabel }: PaginationProps) {
  if (totalPages <= 1 && !totalLabel) return null

  const items = getPageItems(page, totalPages)

  return (
    <div className="pagination-root">
      {totalPages > 1 && (
        <div className="pagination-row" role="navigation" aria-label="Paginación">
          <button
            className="pagination-arrow"
            type="button"
            disabled={page === 0}
            onClick={() => onChange(page - 1)}
            aria-label="Página anterior"
          >
            ‹
          </button>

          {items.map((item, i) =>
            item === '…' ? (
              <span key={`ellipsis-${i}`} className="pagination-ellipsis" aria-hidden>
                ···
              </span>
            ) : (
              <button
                key={item}
                type="button"
                className={`pagination-page${item === page ? ' pagination-page--active' : ''}`}
                onClick={() => onChange(item)}
                aria-label={`Ir a página ${item + 1}`}
                aria-current={item === page ? 'page' : undefined}
              >
                {item + 1}
              </button>
            ),
          )}

          <button
            className="pagination-arrow"
            type="button"
            disabled={page === totalPages - 1}
            onClick={() => onChange(page + 1)}
            aria-label="Página siguiente"
          >
            ›
          </button>
        </div>
      )}

      {totalLabel && <p className="pagination-total">{totalLabel}</p>}
    </div>
  )
}
