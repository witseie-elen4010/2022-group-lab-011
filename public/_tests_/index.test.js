/* eslint-env jest*/
const puppeteer = require('puppeteer');
const timeout = 60000;
jest.setTimeout(timeout);

describe('Test index page:', () => {
    it('Index Page is opened:', async () => {

        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        await page.goto('https://wordleworldparty.azurewebsites.net/')

        await expect(page.title()).resolves.toMatch('Document');
        await browser.close();
    })
    it("Login button reverts to Login Page:", async () => {
        
        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        await page.goto('https://wordleworldparty.azurewebsites.net/')

        await page.click('[name="landing"]');

        await expect(page.title()).resolves.toMatch('Login Page');
        await browser.close();
     })
})