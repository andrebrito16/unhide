export function scoreGenerator(thirdPartyRequests, cookies, localStorageData) {
  let score = 10

  score -= thirdPartyRequests.length * 0.14

  if (cookies.thirdParty > 0) {
    score -= 1
  }

  if (localStorageData.localStorageCount > 10) {
    score -= 1
  }

  return Math.max(0, score)
}
