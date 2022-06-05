/* eslint-env jest*/

const puppeteer = require('puppeteer');
const timeout = 60000;
jest.setTimeout(timeout);

describe('Test home page:', () => {
    it('Home Page is opened:', async () => {
        // Open browser
        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        await page.setViewport({width: 1920, height: 1080});
        await page.goto('https://wordleworldparty.azurewebsites.net/')
        // click login
        await page.click('[name="landing"]');
        // input username
        await page.waitForSelector('input[name="username"]');
        await page.$eval('input[name="username"]', el => el.value = '123');
        //input password
        await page.waitForSelector('input[name="password"]');
        await page.$eval('input[name="password"]', el => el.value = '123');
        // click login
        await page.click('[name="loginbutton"]');
        // New page should be hompage
        await page.waitForTimeout(10);
        await expect(page.title()).resolves.toMatch('Homepage');
        await browser.close();
    })
    it('Dropdown button is clickable', async () => {
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
        // Now on Homepage: click Select game mode
        await page.click('[name=dropdownbutton]');

        await browser.close();
    })
    it('Click Solo Word Game which redirects to Solo page:', async () => {
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
        // Now on Homepage: click Select game mode
        await page.click('[name=dropdownbutton]');
        // Click solo word game:
        await page.click('[name="sologame"]')
        
        await page.waitForTimeout(10);
        await expect(page.title()).resolves.toMatch('Wordle');

        await browser.close();
    })
    it('Click Multiplayer Lobby which redirects to Multi page:', async () => {
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
        // Now on Homepage: click Select game mode
        await page.click('[name=dropdownbutton]');
        // Click solo word game:
        await page.click('[name="lobby"]')
        
        await page.waitForTimeout(10);
        await expect(page.title()).resolves.toMatch('Lobby');

        await browser.close();
    })
})