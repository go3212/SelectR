import type { ElementInfo, QueryMode } from '../../types/messages'

interface ResultsListProps {
  elements: ElementInfo[]
  count: number
  error?: string
  mode: QueryMode
  onElementClick: (index: number) => void
  onElementHover: (index: number) => void
  onElementLeave: () => void
}

export function ResultsList({
  elements,
  count,
  error,
  mode,
  onElementClick,
  onElementHover,
  onElementLeave,
}: ResultsListProps) {
  const accentColor = mode === 'xpath' ? 'emerald' : 'violet'

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-red-500/10 mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5 text-red-400"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      </div>
    )
  }

  if (count === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center text-zinc-500">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-zinc-800 mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path
                fillRule="evenodd"
                d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <p className="text-sm">No elements found</p>
          <p className="text-xs text-zinc-600 mt-1">Try a different query</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex items-center justify-between px-1 py-2">
        <span className="text-xs text-zinc-500">Results</span>
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-${accentColor}-500/20 text-${accentColor}-400`}
          style={{
            backgroundColor: mode === 'xpath' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(139, 92, 246, 0.2)',
            color: mode === 'xpath' ? '#34d399' : '#a78bfa',
          }}
        >
          {count} {count === 1 ? 'match' : 'matches'}
        </span>
      </div>
      <div className="flex-1 overflow-y-auto space-y-1 pr-1">
        {elements.map((el) => (
          <button
            key={el.index}
            onClick={() => onElementClick(el.index)}
            onMouseEnter={() => onElementHover(el.index)}
            onMouseLeave={onElementLeave}
            className="w-full text-left p-2.5 bg-zinc-800/40 hover:bg-zinc-800/70 rounded-lg transition-all duration-150 group border border-transparent hover:border-zinc-700/50"
          >
            <div className="flex items-center gap-2 mb-1">
              <span
                className="text-xs font-mono font-semibold px-1.5 py-0.5 rounded"
                style={{
                  backgroundColor: mode === 'xpath' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(139, 92, 246, 0.15)',
                  color: mode === 'xpath' ? '#6ee7b7' : '#c4b5fd',
                }}
              >
                {el.tagName}
              </span>
              {el.id && (
                <span className="text-xs font-mono text-amber-400/80 truncate">
                  #{el.id}
                </span>
              )}
              <span className="text-xs text-zinc-600 ml-auto">
                [{el.index + 1}]
              </span>
            </div>
            {el.className && (
              <div className="text-xs font-mono text-zinc-500 truncate mb-1">
                .{el.className.split(' ').join(' .')}
              </div>
            )}
            {el.textPreview && (
              <div className="text-xs text-zinc-400 truncate leading-relaxed">
                "{el.textPreview}"
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

