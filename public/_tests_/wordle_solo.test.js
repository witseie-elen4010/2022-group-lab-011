/* eslint-env jest*/

const puppeteer = require('puppeteer');
const timeout = 120000;
jest.setTimeout(timeout);

describe('Test the solo game page:', () => {
    it('Ensure website is opened successfully:', async () => {

        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        await page.goto('http://test-wordle-world-party.azurewebsites.net/')

        await expect(page.title()).resolves.toMatch('Welcome!');
        await browser.close();
    })
    // it('Test the logout button', async() => {
    //     const browser = await puppeteer.launch()
    //     const page = await browser.newPage()
    //     await page.setViewport({width: 3840, height: 2160});
    //     await page.goto('http://test-wordle-world-party.azurewebsites.net/')
    //     // click Let's Get Started
    //     await page.click('[name="landing"]');

    //     await page.waitForSelector('input[name="username"]');
    //     await page.$eval('input[name="username"]', el => el.value = 'PuppeteerTester');

    //     await page.waitForSelector('input[name="password"]');
    //     await page.$eval('input[name="password"]', el => el.value = 'Tests');

    //     await page.click('[name="loginbutton"]');
    //     // Now on Homepage: click Select game mode
    //     await page.waitForTimeout(10)
    //     await page.click('[name=dropdownbutton]');
    //     // Click solo word game:
    //     await page.click('[name="sologame"]')
    //     // Click dropdown
    //     await page.click('[id="dropdownMenuButton1"]')
    //     await page.click('[name="logout"]')
        
    //     await expect(page.title()).resolves.toMatch('Login Page'); 
    //     await page.waitForTimeout(1000);
    //     await browser.close();  
    // })
})