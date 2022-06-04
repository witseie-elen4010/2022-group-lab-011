/* eslint-env jest*/
const puppeteer = require('puppeteer');

jest.setTimeout(60000);
// Test that button click on landing page directs to Login Page
describe('Test index page:', () => {
    it('Button says login', async () => {
        
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto('https://wordleworldparty.azurewebsites.net/')

        
        const searchBtn =  await page.$x("//*[@id='button-1']");
        await page.click('[name="landing"]')
        await expect(page.title()).resolves.toMatch('Login Page')
        await browser.close();
    })

})