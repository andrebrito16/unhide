export async function checkStorageForTab(tabId: number) {
  return new Promise((resolve, reject) => {
    chrome.tabs.executeScript(tabId, {
      code: `({
        localStorageCount: Object.keys(localStorage).length,
        sessionStorageCount: Object.keys(sessionStorage).length
      })`
    }, function (results) {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      } else {
        resolve(results[0]);
      }
    });
  });
}
