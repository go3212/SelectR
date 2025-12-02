/**
 * XPath Autocomplete Module - Suggestion Engine
 * Generates and filters suggestions based on context
 */

import type { Suggestion, SuggestionContext, DOMInfo, AutocompleteResult } from './types'
import { XPATH_AXES, XPATH_FUNCTIONS, COMMON_TAGS, COMMON_ATTRIBUTES } from './data'

const MAX_SUGGESTIONS = 10

/**
 * Generate autocompletion suggestions based on context and DOM info
 */
export function generateSuggestions(
  context: SuggestionContext,
  domInfo?: DOMInfo
): AutocompleteResult {
  // No suggestions for 'none' context
  if (context.type === 'none') {
    return {
      show: false,
      context,
      suggestions: [],
    }
  }
  
  let candidates: Suggestion[] = []
  
  switch (context.type) {
    case 'path':
      // After / or // - suggest axes and tag names
      candidates = [
        ...XPATH_AXES,
        ...getTagSuggestions(domInfo),
      ]
      break
      
    case 'axis':
      // After :: - suggest tag names only
      candidates = getTagSuggestions(domInfo)
      break
      
    case 'attribute':
      // After @ - suggest attribute names
      candidates = getAttributeSuggestions(domInfo)
      break
      
    case 'predicate':
      // Inside [ ] - suggest functions, axes, and special
      candidates = [
        ...XPATH_FUNCTIONS,
        ...XPATH_AXES.map(a => ({ ...a, priority: a.priority - 20 })), // Lower priority in predicates
        // Add @ shortcut for attributes
        {
          value: '@',
          label: '@attribute',
          type: 'attribute' as const,
          description: 'Select an attribute (start typing attribute name)',
          priority: 85,
        },
      ]
      break
      
    case 'function':
      // Inside function - suggest based on expected argument types
      candidates = [
        ...getTagSuggestions(domInfo).map(s => ({ ...s, priority: s.priority - 10 })),
        ...XPATH_FUNCTIONS.filter(f => 
          // Common functions that make sense as arguments
          ['text()', 'position()', 'last()', 'name(', 'string(', 'normalize-space('].some(fn => f.value.startsWith(fn.replace('(', '')))
        ),
      ]
      break
  }
  
  // Filter by prefix
  const filtered = filterByPrefix(candidates, context.prefix)
  
  // Sort by priority and limit
  const sorted = filtered
    .sort((a, b) => b.priority - a.priority)
    .slice(0, MAX_SUGGESTIONS)
  
  return {
    show: sorted.length > 0,
    context,
    suggestions: sorted,
  }
}

/**
 * Create tag name suggestions from DOM info or fallback to common tags
 */
function getTagSuggestions(domInfo?: DOMInfo): Suggestion[] {
  const tags = domInfo?.tagNames?.length ? domInfo.tagNames : COMMON_TAGS
  
  return tags.map((tag, index) => ({
    value: tag,
    label: tag,
    type: 'tag' as const,
    description: `<${tag}> element`,
    // DOM tags get higher priority, common tags get decreasing priority
    priority: domInfo?.tagNames?.length ? 70 : 50 - (index * 0.1),
  }))
}

/**
 * Create attribute name suggestions from DOM info or fallback
 */
function getAttributeSuggestions(domInfo?: DOMInfo): Suggestion[] {
  const attrs = domInfo?.attributeNames?.length ? domInfo.attributeNames : COMMON_ATTRIBUTES
  
  return attrs.map((attr, index) => ({
    value: attr,
    label: `@${attr}`,
    type: 'attribute' as const,
    description: `${attr} attribute`,
    // DOM attributes get higher priority
    priority: domInfo?.attributeNames?.length ? 70 : 50 - (index * 0.1),
  }))
}

/**
 * Filter suggestions by prefix (case-insensitive)
 */
function filterByPrefix(suggestions: Suggestion[], prefix: string): Suggestion[] {
  if (!prefix) return suggestions
  
  const lowerPrefix = prefix.toLowerCase()
  
  return suggestions.filter(s => {
    const lowerValue = s.value.toLowerCase()
    // Match from start or after common separators
    return lowerValue.startsWith(lowerPrefix) ||
           lowerValue.includes('-' + lowerPrefix) ||
           lowerValue.includes('::' + lowerPrefix)
  }).map(s => {
    // Boost priority for exact prefix matches
    const lowerValue = s.value.toLowerCase()
    if (lowerValue.startsWith(lowerPrefix)) {
      return { ...s, priority: s.priority + 10 }
    }
    return s
  })
}

/**
 * Apply a selected suggestion to the query
 */
export function applySuggestion(
  query: string,
  context: SuggestionContext,
  suggestion: Suggestion
): { newQuery: string; newCursorPos: number } {
  const before = query.slice(0, context.prefixStart)
  const after = query.slice(context.cursorPos)
  
  const newQuery = before + suggestion.value + after
  const newCursorPos = context.prefixStart + suggestion.value.length
  
  return { newQuery, newCursorPos }
}

