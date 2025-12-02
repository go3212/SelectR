import type { ContentMessage, EvaluateResponse, ElementInfo, DOMInfoResponse } from '../types/messages'

const HIGHLIGHT_CLASS = 'xpath-tester-highlight'
const FOCUSED_CLASS = 'xpath-tester-focused'
const STYLE_ID = 'xpath-tester-styles'

let matchedElements: Element[] = []

// Cache for DOM info to avoid re-scanning on every keystroke
let domInfoCache: DOMInfoResponse | null = null
let domInfoCacheTime = 0
const DOM_INFO_CACHE_TTL = 5000 // 5 seconds

function injectStyles(): void {
  if (document.getElementById(STYLE_ID)) return

  const style = document.createElement('style')
  style.id = STYLE_ID
  style.textContent = `
    .${HIGHLIGHT_CLASS} {
      outline: 2px solid #10b981 !important;
      outline-offset: 1px !important;
      background-color: rgba(16, 185, 129, 0.15) !important;
      transition: all 0.15s ease !important;
    }
    .${FOCUSED_CLASS} {
      outline: 3px solid #f59e0b !important;
      outline-offset: 2px !important;
      background-color: rgba(245, 158, 11, 0.25) !important;
      animation: xpath-tester-pulse 0.6s ease-in-out 2 !important;
    }
    @keyframes xpath-tester-pulse {
      0%, 100% { outline-width: 3px; }
      50% { outline-width: 5px; }
    }
  `
  document.head.appendChild(style)
}

function clearHighlights(): void {
  matchedElements.forEach((el) => {
    el.classList.remove(HIGHLIGHT_CLASS, FOCUSED_CLASS)
  })
  matchedElements = []
}

function getElementInfo(el: Element, index: number): ElementInfo {
  const text = el.textContent?.trim() || ''
  return {
    index,
    tagName: el.tagName.toLowerCase(),
    id: el.id || '',
    className: typeof el.className === 'string' ? el.className : '',
    textPreview: text.length > 60 ? text.slice(0, 60) + '...' : text,
  }
}

function evaluateXPath(query: string): Element[] {
  const results: Element[] = []
  try {
    const xpathResult = document.evaluate(
      query,
      document,
      null,
      XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
      null
    )
    for (let i = 0; i < xpathResult.snapshotLength; i++) {
      const node = xpathResult.snapshotItem(i)
      if (node instanceof Element) {
        results.push(node)
      }
    }
  } catch (e) {
    throw new Error(`Invalid XPath: ${(e as Error).message}`)
  }
  return results
}

function evaluateCSS(query: string): Element[] {
  try {
    return Array.from(document.querySelectorAll(query))
  } catch (e) {
    throw new Error(`Invalid CSS selector: ${(e as Error).message}`)
  }
}

function handleEvaluate(query: string, mode: 'xpath' | 'css'): EvaluateResponse {
  injectStyles()
  clearHighlights()

  if (!query.trim()) {
    return { success: true, count: 0, elements: [] }
  }

  try {
    matchedElements = mode === 'xpath' ? evaluateXPath(query) : evaluateCSS(query)

    matchedElements.forEach((el) => {
      el.classList.add(HIGHLIGHT_CLASS)
    })

    const elements = matchedElements.map((el, i) => getElementInfo(el, i))

    return {
      success: true,
      count: matchedElements.length,
      elements,
    }
  } catch (e) {
    return {
      success: false,
      count: 0,
      elements: [],
      error: (e as Error).message,
    }
  }
}

function handleScrollTo(index: number): void {
  const el = matchedElements[index]
  if (el) {
    matchedElements.forEach((e) => e.classList.remove(FOCUSED_CLASS))
    el.classList.add(FOCUSED_CLASS)
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}

function handleHighlight(index: number): void {
  const el = matchedElements[index]
  if (el) {
    el.classList.add(FOCUSED_CLASS)
  }
}

function handleUnhighlight(): void {
  matchedElements.forEach((el) => {
    el.classList.remove(FOCUSED_CLASS)
  })
}

function getDOMInfo(): DOMInfoResponse {
  const now = Date.now()
  
  // Return cached data if still valid
  if (domInfoCache && (now - domInfoCacheTime) < DOM_INFO_CACHE_TTL) {
    return domInfoCache
  }
  
  const tagSet = new Set<string>()
  const attrSet = new Set<string>()
  
  // Walk through all elements in the document
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_ELEMENT,
    null
  )
  
  let node = walker.currentNode as Element
  const maxElements = 5000 // Limit to avoid performance issues on large pages
  let count = 0
  
  while (node && count < maxElements) {
    // Collect tag name (lowercase)
    tagSet.add(node.tagName.toLowerCase())
    
    // Collect attribute names
    for (const attr of node.attributes) {
      // Skip internal/extension attributes
      if (!attr.name.startsWith('xpath-tester-')) {
        attrSet.add(attr.name)
      }
    }
    
    node = walker.nextNode() as Element
    count++
  }
  
  // Sort alphabetically for consistent ordering
  const result: DOMInfoResponse = {
    tagNames: Array.from(tagSet).sort(),
    attributeNames: Array.from(attrSet).sort(),
  }
  
  // Update cache
  domInfoCache = result
  domInfoCacheTime = now
  
  return result
}

chrome.runtime.onMessage.addListener(
  (message: ContentMessage, _sender, sendResponse) => {
    switch (message.type) {
      case 'EVALUATE':
        sendResponse(handleEvaluate(message.query, message.mode))
        break
      case 'CLEAR':
        clearHighlights()
        sendResponse({ success: true })
        break
      case 'SCROLL_TO':
        handleScrollTo(message.index)
        sendResponse({ success: true })
        break
      case 'HIGHLIGHT':
        handleHighlight(message.index)
        sendResponse({ success: true })
        break
      case 'UNHIGHLIGHT':
        handleUnhighlight()
        sendResponse({ success: true })
        break
      case 'GET_DOM_INFO':
        sendResponse(getDOMInfo())
        break
    }
    return true
  }
)

