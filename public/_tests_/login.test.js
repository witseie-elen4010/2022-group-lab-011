/* eslint-env jest*/
const puppeteer = require('puppeteer');
const timeout = 90000;
jest.setTimeout(timeout);

describe('Test index page:', () => {
    
    it("Login button reverts to Login Page:", async () => {
        
        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        await page.goto('https://wordleworldparty.azurewebsites.net/')

        await page.click('[name="landing"]');

        await expect(page.title()).resolves.toMatch('Login Page');
        await browser.close();
     })
     it("Register button reverts to Login Page:", async () => {

        const browser = await puppeteer.launch()
        
        const page = await browser.newPage()
        await page.setViewport({width: 1920, height: 1080});
        await page.goto('https://wordleworldparty.azurewebsites.net/')

        await page.click('[name="landing"]');
        await page.click('[name="registerbutton"]');
        await expect(page.title()).resolves.toMatch('Create account');
        await browser.close();
     })
    
})

