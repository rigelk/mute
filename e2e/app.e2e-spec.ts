import { browser, promise, protractor, ProtractorBrowser } from 'protractor'

import { focusEditor, getEditorValue } from './doc.po'

function sleep (duration: number): promise.Promise<void> {
  return browser.driver.sleep(duration)
}

describe('mute App', () => {

  beforeEach(() => {})

  it('should have a title', async () => {
    await browser.get('/')
    const actualTitle = await browser.getTitle()
    expect(actualTitle).toEqual('Mute')
  })

  it('should store updates of the document', async () => {
    const expectedText = 'Hello world !'
    await browser.get('/test-e2e-recover')
    await focusEditor(browser)
    await browser.actions().sendKeys(expectedText).perform()
    await sleep(1000) // Leave some time to the app to store updates
    await browser.refresh()
    const actualText = await getEditorValue(browser)
    expect(actualText).toEqual(expectedText)
  })

  it('should broadcast updates to peers', async () => {
    const expectedText1 = 'Hellow'
    const expectedText2 = 'Hello world !'
    await browser.get('/test-e2e-broadcast')
    const peerBrowser: ProtractorBrowser =  await browser.forkNewDriverInstance(true).ready
    await sleep(1000) // Leave some time to the peers to connect

    await focusEditor(browser)
    await focusEditor(peerBrowser)

    await browser.actions().sendKeys(expectedText1).perform()
    await sleep(1000) // Leave some time to the app to broadcast updates
    const actualText1 = await getEditorValue(peerBrowser)
    expect(actualText1).toEqual(expectedText1)

    const sequence = `${protractor.Key.BACK_SPACE} world !`
    await peerBrowser.actions().sendKeys(sequence).perform()
    await sleep(1000)
    const actualText2 = await getEditorValue(browser)
    expect(actualText2).toEqual(expectedText2)
  })
})
