export type QueryMode = 'xpath' | 'css'

export interface ElementInfo {
  index: number
  tagName: string
  id: string
  className: string
  textPreview: string
}

export interface EvaluateRequest {
  type: 'EVALUATE'
  query: string
  mode: QueryMode
}

export interface ClearRequest {
  type: 'CLEAR'
}

export interface ScrollToRequest {
  type: 'SCROLL_TO'
  index: number
}

export interface HighlightRequest {
  type: 'HIGHLIGHT'
  index: number
}

export interface UnhighlightRequest {
  type: 'UNHIGHLIGHT'
}

export type ContentMessage = 
  | EvaluateRequest 
  | ClearRequest 
  | ScrollToRequest 
  | HighlightRequest
  | UnhighlightRequest

export interface EvaluateResponse {
  success: boolean
  count: number
  elements: ElementInfo[]
  error?: string
}

