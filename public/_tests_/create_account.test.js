/* eslint-env jest*/
const puppeteer = require('puppeteer');
const timeout = 90000;
jest.setTimeout(timeout);

describe('Test Create Account Page:', () => {
    it("Register button redirects to Create Account Page:", async () => {

        const browser = await puppeteer.launch()
        
        const page = await browser.newPage()
        await page.setViewport({width: 1920, height: 1080});
        await page.goto('https://wordleworldparty.azurewebsites.net/')
        // click Let's Get Started
        await page.click('[name="landing"]');
        await page.click('[name="registerbutton"]');
        await expect(page.title()).resolves.toMatch('Create account');
        await page.waitForTimeout(1000);
        await browser.close();
     })
     it("Test existing account can't be created", () => {
        // Open browser
        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        await page.setViewport({width: 1920, height: 1080});
        await page.goto('https://wordleworldparty.azurewebsites.net/')
        // click Let's Get Started
        await page.click('[name="landing"]');
        await page.click('[name="registerbutton"]');

        //Add code here to fill in form

        await page.waitForTimeout(1000);
        await browser.close();
    })
})