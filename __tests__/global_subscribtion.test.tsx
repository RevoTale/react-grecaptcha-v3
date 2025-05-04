import globalOnLoad from '../src/global/globalOnLoad'
import subscribeEvent from '../src/subscribeEvent'
const triggerCountMiddle = 3
const triggerCountLast = 5
it('Test global subscription functions behaviour', () => {
    const triggers: string[] = []
    subscribeEvent(() => {
        triggers.push('')
    })
    subscribeEvent(() => {
        triggers.push('2')
    })
    subscribeEvent(() => {
        triggers.push('3')
    })
    window.grecaptcha = {
        // eslint-disable-next-line promise/avoid-new -- for tests
        execute: async () =>
            await new Promise(resolve => {
                resolve('now')
            }),
        ready: callback => {
            callback()
        },
    }
    globalOnLoad()
    expect(triggers.length).toEqual(triggerCountMiddle)
    subscribeEvent(() => {
        triggers.push('2')
    })
    subscribeEvent(() => {
        triggers.push('3')
    })
    expect(triggers.length).toEqual(triggerCountLast)
})
