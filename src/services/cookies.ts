
export interface CookiesResponse {
  total: number;
  firstParty: number;
  thirdParty: number;
  sessionCookies: number;
  persistentCookies: number;
}

export async function countCookies(domain: string): Promise<CookiesResponse> {
  return new Promise(resolve => {
    chrome.cookies.getAll({}, function (cookies) {
      const cookieDetails = {
        total: cookies.length,
        firstParty: 0,
        thirdParty: 0,
        sessionCookies: 0,
        persistentCookies: 0
      };

      cookies.forEach(cookie => {
        if (cookie.domain === domain) {
          cookieDetails.firstParty++;
        } else {
          cookieDetails.thirdParty++;
        }

        if ("session" in cookie && cookie.session) {
          cookieDetails.sessionCookies++;
        } else {
          cookieDetails.persistentCookies++;
        }
      });

      resolve(cookieDetails);
    });
  });
}