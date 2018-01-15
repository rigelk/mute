import { browser, promise } from 'protractor'

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
})
