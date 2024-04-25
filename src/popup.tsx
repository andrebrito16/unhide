import { useEffect, useState } from 'react'

import { countCookies, type CookiesResponse } from './services/cookies'
import { checkStorageForTab } from './services/local-storage'
import { scoreGenerator } from './services/score-generator'

import './globals.css'

function IndexPopup() {
    const [thirdPartyRequests, setThirdPartyRequests] = useState({} as any)
    const [tabName, setTabName] = useState('')
    const [cookies, setCookies] = useState<CookiesResponse>({} as any)
    const [localStorageData, setLocalStorageData] = useState({} as any)
    const [score, setScore] = useState(10)
    const [hijacked, setHijacked] = useState(false)
    const [hijackedPort, setHijackedPort] = useState(null)

    function getActiveTabId() {
        return new Promise((resolve, reject) => {
            chrome.tabs.query(
                { currentWindow: true, active: true },
                function (tabs) {
                    if (chrome.runtime.lastError) {
                        reject(new Error(chrome.runtime.lastError.message))
                    } else {
                        resolve(tabs[0].id)
                    }
                }
            )
        })
    }

    const getGradient = (score: number) => {
        if (score < 3) {
            return 'bg-gradient-to-r from-red-500 to-red-800'
        } else if (score < 5) {
            return 'bg-gradient-to-r from-orange-400 to-red-500'
        } else if (score < 7) {
            return 'bg-gradient-to-r from-yellow-400 to-orange-400'
        } else if (score < 9) {
            return 'bg-gradient-to-r from-green-400 to-blue-500'
        } else {
            return 'bg-gradient-to-r from-blue-400 to-purple-500'
        }
    }

    useEffect(() => {
        chrome.tabs.query(
            { active: true, currentWindow: true },
            function (tabs) {
                const currentTabName = tabs[0].title
                setTabName(currentTabName)

                const domain = new URL(tabs[0].url).hostname

                countCookies(domain).then(cookieDetails => {
                    setCookies(cookieDetails)
                })
            }
        )

        getActiveTabId().then((tabId: number) => {
            chrome.runtime.sendMessage(
                {
                    action: 'getThirdPartyRequests',
                    tabId
                },
                response => {
                    setThirdPartyRequests(response.data)
                }
            )

            // Cookies
            checkStorageForTab(tabId).then(storage => {
                setLocalStorageData(storage)
            })
        })
    }, [])

    useEffect(() => {
        const score = scoreGenerator(
            Array.from(thirdPartyRequests),
            cookies,
            localStorageData
        )
        setScore(score)
    }, [cookies, thirdPartyRequests, localStorageData])

    useEffect(() => {
        chrome.webRequest.onBeforeRequest.addListener(
            function (details) {
                const url = new URL(details.url)
                const port = url.port || (url.protocol === 'https:' ? 443 : 80)

                if (port === 80 || port === 443) {
                    return
                }

                setHijacked(true)
                setHijackedPort(port)
            },
            { urls: ['<all_urls>'] },
            ['blocking']
        )
    }, [])

    return (
        <div className="p-5 flex flex-col gap-4 items-center justify-center">
            <h1 className="font-semibold">
                Unhide By:{' '}
                <a target="_blank" href={'https://andreb.dev'}>
                    André Brito
                </a>
            </h1>
            <div className="flex flex-col justify-center items-center border-[1px] p-2 rounded-xl border-slate-200 w-full">
                <h2 className="font-bold max-w-[90%] text-center">
                    Tab Name: <span className="font-light">{tabName}</span>
                </h2>
                <div
                    className={`w-full h-32 ${getGradient(score)} rounded-lg shadow-xl flex items-center justify-center`}>
                    <div className="text-white text-4xl font-bold">
                        Score: {score.toFixed(1)}/10
                    </div>
                </div>
            </div>

            <div className="flex flex-col justify-center items-center border-[1px] p-2 rounded-xl border-slate-200 w-full">
                <h2 className="font-bold max-w-[90%] text-center">
                    Canvas Fingerprint Detection
                </h2>
                <div className="flex">
                    <p className="text-green-500">
                        No canvas fingerprint detected! Enjoy naviation!
                    </p>
                </div>
            </div>

            <div className="flex flex-col justify-center items-start w-full">
                <h2 className="font-bold">Hijack Detection</h2>
                <div className="flex">
                    {hijacked ? (
                        <p className="text-red-500">
                            Hijack identified on port {hijackedPort} 😱!!!
                        </p>
                    ) : (
                        <p className="text-green-500">
                            No hijacked identified, you are safe! ☺️
                        </p>
                    )}
                </div>
            </div>

            <div className="flex flex-col border-[1px] p-2 rounded-xl border-slate-200 w-full">
                <h2 className="font-bold">Cookies</h2>
                <div className="grid grid-cols-3 gap-4r">
                    <p>Total: {cookies.total}</p>
                    <p>First Party: {cookies.firstParty}</p>
                    <p>Third Party: {cookies.thirdParty}</p>
                    <p>Session Cookies: {cookies.sessionCookies}</p>
                    <p>Persistent Cookies: {cookies.persistentCookies}</p>
                </div>
            </div>

            <div className="flex flex-col border-[1px] p-2 rounded-xl border-slate-200 w-full">
                <h2 className="font-bold">Third Party Domain Connections</h2>
                {Array.from(thirdPartyRequests).map((domain: string, index) => (
                    <p key={index}>{domain}</p>
                ))}
            </div>

            <div className="flex flex-col border-[1px] p-2 rounded-xl border-slate-200 w-full">
                <h2 className="font-bold">Local Storage Info:</h2>
                <span>Local Storage: {localStorageData.localStorageCount}</span>

                <span>
                    Session Storage: {localStorageData.sessionStorageCount}
                </span>
            </div>
        </div>
    )
}

export default IndexPopup
