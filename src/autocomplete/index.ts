/**
 * XPath Autocomplete Module
 * 
 * A standalone module providing XPath autocompletion suggestions
 * including axes, functions, and DOM-based tag/attribute names.
 */

// Export types
export type {
  SuggestionType,
  Suggestion,
  ContextType,
  SuggestionContext,
  DOMInfo,
  AutocompleteResult,
} from './types'

// Export parser
export { getSuggestionContext } from './parser'

// Export suggestion engine
export { generateSuggestions, applySuggestion } from './suggestions'

// Export static data for reference
export { XPATH_AXES, XPATH_FUNCTIONS, COMMON_TAGS, COMMON_ATTRIBUTES } from './data'

