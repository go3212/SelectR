import type { QueryMode } from '../../types/messages'

interface QueryInputProps {
  query: string
  mode: QueryMode
  onChange: (query: string) => void
  onClear: () => void
}

export function QueryInput({ query, mode, onChange, onClear }: QueryInputProps) {
  const placeholder = mode === 'xpath' 
    ? '//div[@class="example"]' 
    : 'div.example, #myId'

  return (
    <div className="relative">
      <textarea
        value={query}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        spellCheck={false}
        className={`w-full h-20 px-3 py-2.5 bg-zinc-900/60 border rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 transition-all duration-200 placeholder:text-zinc-600 ${
          mode === 'xpath'
            ? 'border-zinc-700/50 focus:ring-emerald-500/50 focus:border-emerald-500/50'
            : 'border-zinc-700/50 focus:ring-violet-500/50 focus:border-violet-500/50'
        }`}
      />
      {query && (
        <button
          onClick={onClear}
          className="absolute top-2 right-2 p-1.5 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-700/50 rounded-md transition-colors"
          title="Clear"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-4 h-4"
          >
            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
          </svg>
        </button>
      )}
    </div>
  )
}

