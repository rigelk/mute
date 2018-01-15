import { browser } from 'protractor'

describe('mute App', () => {

  beforeEach(() => {})

  it('should have a title', async () => {
    await browser.get('/')
    const actualTitle = await browser.getTitle()
    expect(actualTitle).toEqual('Mute')
  })
})
