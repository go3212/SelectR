import { useState, useEffect, useRef, useCallback } from 'react'
import type { QueryMode } from '../../types/messages'
import type { DOMInfo, Suggestion, AutocompleteResult } from '../../autocomplete'
import { getSuggestionContext, generateSuggestions, applySuggestion } from '../../autocomplete'
import { AutocompleteDropdown } from './AutocompleteDropdown'

interface QueryInputProps {
  query: string
  mode: QueryMode
  onChange: (query: string) => void
  onClear: () => void
}

// Cache DOM info at the component level to persist across re-renders
let cachedDOMInfo: DOMInfo | null = null
let domInfoFetchTime = 0
const DOM_INFO_REFETCH_INTERVAL = 10000 // Refetch every 10s

export function QueryInput({ query, mode, onChange, onClear }: QueryInputProps) {
  const [autocomplete, setAutocomplete] = useState<AutocompleteResult | null>(null)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  
  const placeholder = mode === 'xpath' 
    ? '//div[@class="example"]' 
    : 'div.example, #myId'

  // Fetch DOM info from content script
  const fetchDOMInfo = useCallback(async (): Promise<DOMInfo | null> => {
    const now = Date.now()
    
    // Return cached if still fresh
    if (cachedDOMInfo && (now - domInfoFetchTime) < DOM_INFO_REFETCH_INTERVAL) {
      return cachedDOMInfo
    }
    
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
      if (!tab?.id) return cachedDOMInfo
      
      const response = await chrome.tabs.sendMessage(tab.id, { type: 'GET_DOM_INFO' })
      if (response?.tagNames) {
        cachedDOMInfo = response as DOMInfo
        domInfoFetchTime = now
        return cachedDOMInfo
      }
    } catch {
      // Content script not available, use cached or null
    }
    
    return cachedDOMInfo
  }, [])

  // Update autocomplete suggestions when query or cursor changes
  const updateAutocomplete = useCallback(async (q: string, pos: number) => {
    // Only show autocomplete in XPath mode
    if (mode !== 'xpath' || !q.trim()) {
      setAutocomplete(null)
      return
    }
    
    const context = getSuggestionContext(q, pos)
    
    // Don't show suggestions if no specific context
    if (context.type === 'none') {
      setAutocomplete(null)
      return
    }
    
    const domInfo = await fetchDOMInfo()
    const result = generateSuggestions(context, domInfo || undefined)
    
    setAutocomplete(result)
    setSelectedIndex(0)
  }, [mode, fetchDOMInfo])

  // Handle input changes
  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newQuery = e.target.value
    const newCursorPos = e.target.selectionStart || 0
    
    onChange(newQuery)
    updateAutocomplete(newQuery, newCursorPos)
  }, [onChange, updateAutocomplete])

  // Handle cursor position changes (click, arrow keys without autocomplete)
  const handleSelect = useCallback((e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const newCursorPos = (e.target as HTMLTextAreaElement).selectionStart || 0
    updateAutocomplete(query, newCursorPos)
  }, [query, updateAutocomplete])

  // Apply selected suggestion
  const applySuggestionToQuery = useCallback((suggestion: Suggestion) => {
    if (!autocomplete) return
    
    const { newQuery, newCursorPos } = applySuggestion(
      query,
      autocomplete.context,
      suggestion
    )
    
    onChange(newQuery)
    setAutocomplete(null)
    
    // Focus and set cursor position
    requestAnimationFrame(() => {
      if (textareaRef.current) {
        textareaRef.current.focus()
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos)
      }
    })
  }, [autocomplete, query, onChange])

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!autocomplete?.show || !autocomplete.suggestions.length) {
      return
    }
    
    const suggestions = autocomplete.suggestions
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        )
        break
        
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        )
        break
        
      case 'Enter':
        e.preventDefault()
        if (suggestions[selectedIndex]) {
          applySuggestionToQuery(suggestions[selectedIndex])
        }
        break
        
      case 'Tab':
        e.preventDefault()
        if (suggestions[selectedIndex]) {
          applySuggestionToQuery(suggestions[selectedIndex])
        }
        break
        
      case 'Escape':
        e.preventDefault()
        setAutocomplete(null)
        break
    }
  }, [autocomplete, selectedIndex, applySuggestionToQuery])

  // Handle suggestion selection from dropdown
  const handleSuggestionSelect = useCallback((suggestion: Suggestion) => {
    applySuggestionToQuery(suggestion)
  }, [applySuggestionToQuery])

  // Handle hover over suggestion
  const handleSuggestionHover = useCallback((index: number) => {
    setSelectedIndex(index)
  }, [])

  // Clear autocomplete when mode changes to CSS
  useEffect(() => {
    if (mode === 'css') {
      setAutocomplete(null)
    }
  }, [mode])

  // Prefetch DOM info when component mounts
  useEffect(() => {
    if (mode === 'xpath') {
      fetchDOMInfo()
    }
  }, [mode, fetchDOMInfo])

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        value={query}
        onChange={handleChange}
        onSelect={handleSelect}
        onKeyDown={handleKeyDown}
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
      
      {/* Autocomplete dropdown - only for XPath mode */}
      {mode === 'xpath' && (
        <AutocompleteDropdown
          suggestions={autocomplete?.suggestions || []}
          selectedIndex={selectedIndex}
          onSelect={handleSuggestionSelect}
          onHover={handleSuggestionHover}
          visible={autocomplete?.show || false}
        />
      )}
    </div>
  )
}
