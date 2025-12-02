// Open side panel when extension icon is clicked
chrome.action.onClicked.addListener((tab) => {
  if (tab.id) {
    chrome.sidePanel.open({ tabId: tab.id })
  }
})

// Set side panel behavior to open on action click
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })

// Inject content script when needed
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'INJECT_CONTENT_SCRIPT') {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const tab = tabs[0]
      if (tab?.id) {
        try {
          await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['content.js']
          })
          sendResponse({ success: true })
        } catch (e) {
          console.error('Failed to inject content script:', e)
          sendResponse({ success: false, error: (e as Error).message })
        }
      }
    })
    return true // Keep channel open for async response
  }
})

