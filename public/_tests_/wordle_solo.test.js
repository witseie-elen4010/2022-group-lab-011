/* eslint-env jest*/

const puppeteer = require('puppeteer');
const timeout = 120000;
jest.setTimeout(timeout);

describe('Test the solo game page:', () => {
    it('Click Solo Word Game which redirects to Solo page:', async () => {
        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        await page.setViewport({width: 1920, height: 1080});
        await page.goto('https://wordleworldparty.azurewebsites.net/')
        // click Let's Get Started
        await page.click('[name="landing"]');

        await page.waitForSelector('input[name="username"]');
        await page.$eval('input[name="username"]', el => el.value = 'PuppeteerTester');

        await page.waitForSelector('input[name="password"]');
        await page.$eval('input[name="password"]', el => el.value = 'Tests');

        await page.click('[name="loginbutton"]');
        // Now on Homepage: click Select game mode
        await page.waitForTimeout(10)
        await page.click('[name=dropdownbutton]');
        // Click solo word game:
        await page.click('[name="sologame"]')
        
        await page.waitForTimeout(10);
        await expect(page.title()).resolves.toMatch('Wordle'); //Wordle Solo
        await page.waitForTimeout(1000);
        await browser.close();
    })
})