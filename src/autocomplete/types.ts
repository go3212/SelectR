/**
 * XPath Autocomplete Module - Type Definitions
 */

export type SuggestionType = 'axis' | 'function' | 'tag' | 'attribute'

export interface Suggestion {
  /** The text to insert */
  value: string
  /** Display label (may differ from value) */
  label: string
  /** Type of suggestion for styling/icons */
  type: SuggestionType
  /** Description shown in tooltip */
  description: string
  /** Priority for sorting (higher = more relevant) */
  priority: number
}

export type ContextType = 
  | 'path'        // After / or // - suggest tags and axes
  | 'axis'        // After :: - suggest tags
  | 'attribute'   // After @ - suggest attribute names
  | 'predicate'   // After [ - suggest functions, attributes, axes
  | 'function'    // Inside function parens
  | 'none'        // No specific context

export interface SuggestionContext {
  /** The type of context at cursor position */
  type: ContextType
  /** The prefix text being typed (for filtering) */
  prefix: string
  /** Start position of the prefix in the query */
  prefixStart: number
  /** Cursor position in the query */
  cursorPos: number
}

export interface DOMInfo {
  /** Unique tag names found in the page */
  tagNames: string[]
  /** Unique attribute names found in the page */
  attributeNames: string[]
}

export interface AutocompleteResult {
  /** Whether suggestions should be shown */
  show: boolean
  /** The context that was parsed */
  context: SuggestionContext
  /** Filtered and sorted suggestions */
  suggestions: Suggestion[]
}

