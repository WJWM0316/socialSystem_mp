const automator = require('miniprogram-automator')

describe('index', () => {
  let miniProgram
  let page

  beforeAll(async () => {
    miniProgram = await automator.launch({
      projectPath: 'path/to/socialSystem_mp'
    })
    page = await miniProgram.reLaunch('page/common/pages/homepage/homepage')
    await page.waitFor(500)
  }, 30000)

  afterAll(async () => {
    await miniProgram.close()
  })

  it('wxml', async () => {
    const element = await page.$('page')
    expect(await element.wxml()).toMatchSnapshot()
    await page.setData({
      list: []
    })
    expect(await element.wxml()).toMatchSnapshot()
  })

})

