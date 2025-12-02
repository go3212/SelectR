import { useEffect, useRef, useCallback } from 'react'
import type { Suggestion, SuggestionType } from '../../autocomplete'

interface AutocompleteDropdownProps {
  suggestions: Suggestion[]
  selectedIndex: number
  onSelect: (suggestion: Suggestion) => void
  onHover: (index: number) => void
  visible: boolean
}

/** Icon component for each suggestion type */
function SuggestionIcon({ type }: { type: SuggestionType }) {
  switch (type) {
    case 'axis':
      return (
        <span className="text-amber-400 font-mono text-xs font-semibold">
          ::
        </span>
      )
    case 'function':
      return (
        <span className="text-sky-400 font-mono text-xs">
          ƒ
        </span>
      )
    case 'tag':
      return (
        <span className="text-emerald-400 font-mono text-xs">
          &lt;&gt;
        </span>
      )
    case 'attribute':
      return (
        <span className="text-violet-400 font-mono text-xs">
          @
        </span>
      )
  }
}

/** Badge showing the suggestion type */
function TypeBadge({ type }: { type: SuggestionType }) {
  const colors: Record<SuggestionType, string> = {
    axis: 'bg-amber-500/15 text-amber-400',
    function: 'bg-sky-500/15 text-sky-400',
    tag: 'bg-emerald-500/15 text-emerald-400',
    attribute: 'bg-violet-500/15 text-violet-400',
  }
  
  return (
    <span className={`px-1.5 py-0.5 text-[10px] rounded ${colors[type]}`}>
      {type}
    </span>
  )
}

export function AutocompleteDropdown({
  suggestions,
  selectedIndex,
  onSelect,
  onHover,
  visible,
}: AutocompleteDropdownProps) {
  const listRef = useRef<HTMLUListElement>(null)
  const selectedRef = useRef<HTMLLIElement>(null)
  
  // Scroll selected item into view
  useEffect(() => {
    if (selectedRef.current && listRef.current) {
      const list = listRef.current
      const item = selectedRef.current
      
      const listRect = list.getBoundingClientRect()
      const itemRect = item.getBoundingClientRect()
      
      if (itemRect.top < listRect.top) {
        item.scrollIntoView({ block: 'nearest' })
      } else if (itemRect.bottom > listRect.bottom) {
        item.scrollIntoView({ block: 'nearest' })
      }
    }
  }, [selectedIndex])
  
  const handleClick = useCallback((suggestion: Suggestion) => {
    onSelect(suggestion)
  }, [onSelect])
  
  if (!visible || suggestions.length === 0) {
    return null
  }
  
  return (
    <div className="absolute left-0 right-0 top-full mt-1 z-50">
      <ul
        ref={listRef}
        className="bg-zinc-900/95 backdrop-blur-sm border border-zinc-700/60 rounded-lg shadow-xl overflow-hidden max-h-64 overflow-y-auto"
        role="listbox"
      >
        {suggestions.map((suggestion, index) => {
          const isSelected = index === selectedIndex
          
          return (
            <li
              key={`${suggestion.type}-${suggestion.value}`}
              ref={isSelected ? selectedRef : null}
              role="option"
              aria-selected={isSelected}
              className={`
                flex items-center gap-2.5 px-3 py-2 cursor-pointer transition-colors
                ${isSelected 
                  ? 'bg-zinc-700/60' 
                  : 'hover:bg-zinc-800/60'
                }
              `}
              onClick={() => handleClick(suggestion)}
              onMouseEnter={() => onHover(index)}
            >
              {/* Icon */}
              <div className="w-5 h-5 flex items-center justify-center shrink-0">
                <SuggestionIcon type={suggestion.type} />
              </div>
              
              {/* Main content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm text-zinc-100 truncate">
                    {suggestion.label}
                  </span>
                  <TypeBadge type={suggestion.type} />
                </div>
                <p className="text-xs text-zinc-500 truncate mt-0.5">
                  {suggestion.description}
                </p>
              </div>
              
              {/* Keyboard hint for selected item */}
              {isSelected && (
                <div className="shrink-0 text-[10px] text-zinc-500 font-mono">
                  ↵
                </div>
              )}
            </li>
          )
        })}
      </ul>
      
      {/* Footer hint */}
      <div className="flex items-center justify-end gap-3 px-2 py-1.5 text-[10px] text-zinc-600">
        <span>
          <kbd className="px-1 py-0.5 bg-zinc-800 rounded text-zinc-500">↑↓</kbd> navigate
        </span>
        <span>
          <kbd className="px-1 py-0.5 bg-zinc-800 rounded text-zinc-500">↵</kbd> select
        </span>
        <span>
          <kbd className="px-1 py-0.5 bg-zinc-800 rounded text-zinc-500">esc</kbd> close
        </span>
      </div>
    </div>
  )
}

