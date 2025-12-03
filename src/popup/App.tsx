import { useState, useEffect, useCallback, useRef } from 'react'
import { ModeToggle } from './components/ModeToggle'
import { QueryInput } from './components/QueryInput'
import { ResultsList } from './components/ResultsList'
import type { QueryMode, ElementInfo, EvaluateResponse, ContentMessage } from '../types/messages'

const DEBOUNCE_MS = 300
const STORAGE_KEY = 'xpath-tester-state'

interface StoredState {
  query: string
  mode: QueryMode
}

function App() {
  const [mode, setMode] = useState<QueryMode>('xpath')
  const [query, setQuery] = useState('')
  const [count, setCount] = useState(0)
  const [elements, setElements] = useState<ElementInfo[]>([])
  const [error, setError] = useState<string | undefined>()
  const debounceRef = useRef<number | null>(null)

  // Load saved state on mount
  useEffect(() => {
    chrome.storage.local.get(STORAGE_KEY, (result) => {
      const saved = result[STORAGE_KEY] as StoredState | undefined
      if (saved) {
        setMode(saved.mode)
        setQuery(saved.query)
      }
    })
  }, [])

  // Save state when it changes
  useEffect(() => {
    const state: StoredState = { query, mode }
    chrome.storage.local.set({ [STORAGE_KEY]: state })
  }, [query, mode])

  const injectContentScript = useCallback(async (tabId: number) => {
    try {
      await chrome.scripting.executeScript({
        target: { tabId },
        files: ['content.js']
      })
      return true
    } catch (e) {
      console.error('Failed to inject content script:', e)
      return false
    }
  }, [])

  const sendMessage = useCallback(async (message: ContentMessage) => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
      if (!tab?.id) return null
      
      try {
        return await chrome.tabs.sendMessage(tab.id, message)
      } catch {
        // Content script not loaded, try to inject it
        const injected = await injectContentScript(tab.id)
        if (injected) {
          // Wait a bit for script to initialize
          await new Promise(resolve => setTimeout(resolve, 100))
          return await chrome.tabs.sendMessage(tab.id, message)
        }
        return null
      }
    } catch (e) {
      console.error('Failed to send message:', e)
      return null
    }
  }, [injectContentScript])

  const evaluateQuery = useCallback(async (q: string, m: QueryMode) => {
    if (!q.trim()) {
      setCount(0)
      setElements([])
      setError(undefined)
      await sendMessage({ type: 'CLEAR' })
      return
    }

    const response = await sendMessage({ type: 'EVALUATE', query: q, mode: m }) as EvaluateResponse | null
    
    if (response) {
      setCount(response.count)
      setElements(response.elements)
      setError(response.error)
    }
  }, [sendMessage])

  // Debounced evaluation on query/mode change
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }
    
    debounceRef.current = window.setTimeout(() => {
      evaluateQuery(query, mode)
    }, DEBOUNCE_MS)

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [query, mode, evaluateQuery])

  const handleClear = useCallback(async () => {
    setQuery('')
    setCount(0)
    setElements([])
    setError(undefined)
    await sendMessage({ type: 'CLEAR' })
  }, [sendMessage])

  const handleModeChange = useCallback((newMode: QueryMode) => {
    setMode(newMode)
  }, [])

  const handleElementClick = useCallback(async (index: number) => {
    await sendMessage({ type: 'SCROLL_TO', index })
  }, [sendMessage])

  const handleElementHover = useCallback(async (index: number) => {
    await sendMessage({ type: 'HIGHLIGHT', index })
  }, [sendMessage])

  const handleElementLeave = useCallback(async () => {
    await sendMessage({ type: 'UNHIGHLIGHT' })
  }, [sendMessage])

  return (
    <div className="flex flex-col h-screen p-4 gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div 
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{
              background: mode === 'xpath' 
                ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
                : 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4 text-white"
            >
              <path
                fillRule="evenodd"
                d="M6.28 5.22a.75.75 0 010 1.06L2.56 10l3.72 3.72a.75.75 0 01-1.06 1.06L.97 10.53a.75.75 0 010-1.06l4.25-4.25a.75.75 0 011.06 0zm7.44 0a.75.75 0 011.06 0l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06-1.06L17.44 10l-3.72-3.72a.75.75 0 010-1.06zM11.377 2.011a.75.75 0 01.612.867l-2.5 14.5a.75.75 0 01-1.478-.255l2.5-14.5a.75.75 0 01.866-.612z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h1 className="font-semibold text-zinc-100">SelectR</h1>
        </div>
        <ModeToggle mode={mode} onChange={handleModeChange} />
      </div>

      {/* Query Input */}
      <QueryInput
        query={query}
        mode={mode}
        onChange={setQuery}
        onClear={handleClear}
      />

      {/* Results */}
      <ResultsList
        elements={elements}
        count={count}
        error={error}
        mode={mode}
        onElementClick={handleElementClick}
        onElementHover={handleElementHover}
        onElementLeave={handleElementLeave}
      />
    </div>
  )
}

export default App

