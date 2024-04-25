export {}

export const thirdPartyRequests = {}

chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    const parser = document.createElement("a")
    parser.href = details.url
    const domain = parser.hostname
    const tabId = details.tabId

    if (tabId < 0) return // Ignore requests from background processes

    chrome.tabs.get(tabId, (tab) => {
      if (chrome.runtime.lastError) {
        return
      }

      const tabDomain = new URL(tab.url).hostname

      if (domain !== tabDomain) {
        // Store third-party requests
        if (!thirdPartyRequests[tabId]) {
          console.log("ADICIONEI UM REGISTRO NOVO")
          thirdPartyRequests[tabId] = new Set()
        }
        thirdPartyRequests[tabId].add(domain)
      }
    })
  },
  { urls: ["<all_urls>"] },
  []
)

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getThirdPartyRequests") {
    sendResponse({ data: thirdPartyRequests[message.tabId] })
  }
})
