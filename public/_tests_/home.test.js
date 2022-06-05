/* eslint-env jest*/

const puppeteer = require('puppeteer');
const timeout = 60000;
jest.setTimeout(timeout);

describe('Test home page:', () => {
    it('Home Page is opened:', async () => {

        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        await page.setViewport({width: 1920, height: 1080});
        await page.goto('https://wordleworldparty.azurewebsites.net/')
        
        await page.click('[name="landing"]');

        await page.waitForSelector('input[name="username"]');
        await page.$eval('input[name="username"]', el => el.value = '123');

        await page.waitForSelector('input[name="password"]');
        await page.$eval('input[name="password"]', el => el.value = '123');

        await page.click('[name="loginbutton"]');

        await expect(page.title()).resolves.toMatch('Homepage');
        await browser.close();
    })
})