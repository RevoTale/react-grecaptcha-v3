import { key } from '../../src/global/globals'
interface GlobalStats {
    actions: string[]
    tokens: string[]
}
declare global {
    interface Window {
        grecaptcha_stats: GlobalStats
    }
}

const globalStatsKey = 'grecaptcha_stats' as const

const recaptchaExecuteFixture = async (
    siteKey: string,
    { action }: { action: string }
) => {
    window[globalStatsKey].actions.push(action)
    return await new Promise<string>(resolve => {
        const resolveResult = () => {
            const token = `fixture_token_228_${action}__${siteKey}`
            window[globalStatsKey].tokens.push(token)
            resolve(token)
        }
        resolveResult()
    })
}
export const getSimulationStats = (): GlobalStats => {
    let globalStats = window[globalStatsKey]
    if (!globalStats) {
        window[globalStatsKey] = globalStats = {
            actions: [],
            tokens: [],
        }
    }
    return globalStats
}
export const getStatSnapshot = (): GlobalStats => {
    const { tokens, actions } = getSimulationStats()
    return {
        tokens: [...tokens],
        actions: [...actions],
    }
}
const simulateTokensOnLoad = (
    promises: () => Array<Promise<string>>
): { promise: Promise<string[]>; stats: GlobalStats } => {
    const loadScript = () => {
        window.grecaptcha = {
            execute: recaptchaExecuteFixture,
            ready: callback => {
                callback()
            },
        }
        const onLoadCallback = window[key]
        if (!onLoadCallback) {
            throw new Error('No onload')
        }
        onLoadCallback()
    }

    const promise = Promise.all(promises())
    loadScript()
    return {
        promise,
        stats: getStatSnapshot(),
    }
}
export default simulateTokensOnLoad
