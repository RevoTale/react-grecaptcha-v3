import globalOnLoad from '../src/global/globalOnLoad'
import subscribeEvent from '../src/subscribeEvent'

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
        execute: async () => await new Promise(resolve => {
                resolve('now')
            }),
        ready: callback => {
            callback()
        },
    }
    globalOnLoad()
    expect(triggers.length).toEqual(3)
    subscribeEvent(() => {
        triggers.push('2')
    })
    subscribeEvent(() => {
        triggers.push('3')
    })
    expect(triggers.length).toEqual(5)
})
