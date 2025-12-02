import type { QueryMode } from '../../types/messages'

interface ModeToggleProps {
  mode: QueryMode
  onChange: (mode: QueryMode) => void
}

export function ModeToggle({ mode, onChange }: ModeToggleProps) {
  return (
    <div className="flex bg-zinc-900/80 rounded-lg p-1 gap-1">
      <button
        onClick={() => onChange('xpath')}
        className={`flex-1 px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
          mode === 'xpath'
            ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/50'
            : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
        }`}
      >
        XPath
      </button>
      <button
        onClick={() => onChange('css')}
        className={`flex-1 px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
          mode === 'css'
            ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/50'
            : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
        }`}
      >
        CSS
      </button>
    </div>
  )
}

