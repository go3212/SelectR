/**
 * XPath Autocomplete Module - Context Parser
 * Analyzes cursor position to determine what suggestions to show
 */

import type { ContextType, SuggestionContext } from './types'

/**
 * Parses the XPath query at the cursor position to determine the context
 * for autocompletion suggestions.
 */
export function getSuggestionContext(query: string, cursorPos: number): SuggestionContext {
  // Get the text before the cursor
  const beforeCursor = query.slice(0, cursorPos)
  
  // Find the context based on what precedes the cursor
  const context = parseContext(beforeCursor)
  
  return {
    ...context,
    cursorPos,
  }
}

interface PartialContext {
  type: ContextType
  prefix: string
  prefixStart: number
}

function parseContext(beforeCursor: string): PartialContext {
  // Check from most specific to least specific context
  
  // After @ - attribute context
  const attrMatch = beforeCursor.match(/@([a-zA-Z_][\w-]*)?$/)
  if (attrMatch) {
    const prefix = attrMatch[1] || ''
    return {
      type: 'attribute',
      prefix,
      prefixStart: beforeCursor.length - prefix.length,
    }
  }
  
  // After :: - axis was completed, now need tag name
  const axisCompleteMatch = beforeCursor.match(/::([a-zA-Z_][\w-]*)?$/)
  if (axisCompleteMatch) {
    const prefix = axisCompleteMatch[1] || ''
    return {
      type: 'axis',
      prefix,
      prefixStart: beforeCursor.length - prefix.length,
    }
  }
  
  // Inside [ ] predicate - check what's being typed
  const predicateDepth = countUnmatchedBrackets(beforeCursor)
  if (predicateDepth > 0) {
    // Inside a predicate - could be function, attribute, or axis
    
    // Check if typing an attribute
    const predAttrMatch = beforeCursor.match(/@([a-zA-Z_][\w-]*)?$/)
    if (predAttrMatch) {
      const prefix = predAttrMatch[1] || ''
      return {
        type: 'attribute',
        prefix,
        prefixStart: beforeCursor.length - prefix.length,
      }
    }
    
    // Check if inside function parens
    const funcParenDepth = countUnmatchedParens(beforeCursor)
    if (funcParenDepth > 0) {
      // Inside function call - could suggest based on function
      const prefix = getLastToken(beforeCursor)
      return {
        type: 'function',
        prefix,
        prefixStart: beforeCursor.length - prefix.length,
      }
    }
    
    // Starting to type something in predicate
    const predTokenMatch = beforeCursor.match(/[\[\s,=<>!+\-*|]([a-zA-Z_][\w-]*)?$/)
    if (predTokenMatch) {
      const prefix = predTokenMatch[1] || ''
      return {
        type: 'predicate',
        prefix,
        prefixStart: beforeCursor.length - prefix.length,
      }
    }
    
    // Just opened bracket or after operator
    return {
      type: 'predicate',
      prefix: '',
      prefixStart: beforeCursor.length,
    }
  }
  
  // After / or // - path context
  const pathMatch = beforeCursor.match(/\/\/?([a-zA-Z_][\w-]*)?$/)
  if (pathMatch) {
    const prefix = pathMatch[1] || ''
    return {
      type: 'path',
      prefix,
      prefixStart: beforeCursor.length - prefix.length,
    }
  }
  
  // At the start of query or after space - could be starting a path
  if (beforeCursor.length === 0 || beforeCursor.match(/\s$/)) {
    return {
      type: 'none',
      prefix: '',
      prefixStart: beforeCursor.length,
    }
  }
  
  // Check if we're typing a tag name after another tag (implicit child)
  const implicitChildMatch = beforeCursor.match(/\]([a-zA-Z_][\w-]*)$/)
  if (implicitChildMatch) {
    const prefix = implicitChildMatch[1]
    return {
      type: 'path',
      prefix,
      prefixStart: beforeCursor.length - prefix.length,
    }
  }
  
  // Default - no specific context
  return {
    type: 'none',
    prefix: '',
    prefixStart: beforeCursor.length,
  }
}

/**
 * Count unmatched opening brackets [ in the string
 */
function countUnmatchedBrackets(str: string): number {
  let depth = 0
  let inString = false
  let stringChar = ''
  
  for (let i = 0; i < str.length; i++) {
    const char = str[i]
    
    if (inString) {
      if (char === stringChar && str[i - 1] !== '\\') {
        inString = false
      }
      continue
    }
    
    if (char === '"' || char === "'") {
      inString = true
      stringChar = char
      continue
    }
    
    if (char === '[') depth++
    else if (char === ']') depth--
  }
  
  return Math.max(0, depth)
}

/**
 * Count unmatched opening parentheses ( in the string
 */
function countUnmatchedParens(str: string): number {
  let depth = 0
  let inString = false
  let stringChar = ''
  
  for (let i = 0; i < str.length; i++) {
    const char = str[i]
    
    if (inString) {
      if (char === stringChar && str[i - 1] !== '\\') {
        inString = false
      }
      continue
    }
    
    if (char === '"' || char === "'") {
      inString = true
      stringChar = char
      continue
    }
    
    if (char === '(') depth++
    else if (char === ')') depth--
  }
  
  return Math.max(0, depth)
}

/**
 * Get the last alphanumeric token being typed
 */
function getLastToken(str: string): string {
  const match = str.match(/([a-zA-Z_][\w-]*)$/)
  return match ? match[1] : ''
}

