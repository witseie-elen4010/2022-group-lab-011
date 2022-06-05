/* eslint-env jest*/

const puppeteer = require('puppeteer');
const timeout = 120000;
jest.setTimeout(timeout);

describe('Test home page:', () => {
    it('Home Page is opened:', async () => {
        // Open browser
        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        await page.setViewport({width: 1920, height: 1080});
        await page.goto('https://wordleworldparty.azurewebsites.net/')
        // click Let's Get Started
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
        await page.waitForTimeout(1000);
        await browser.close();
    })
    it('Dropdown button is clickable', async () => {
        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        await page.setViewport({width: 1920, height: 1080});
        await page.goto('https://wordleworldparty.azurewebsites.net/')
        // click Let's Get Started
        await page.click('[name="landing"]');

        await page.waitForSelector('input[name="username"]');
        await page.$eval('input[name="username"]', el => el.value = '123');

        await page.waitForSelector('input[name="password"]');
        await page.$eval('input[name="password"]', el => el.value = '123');

        await page.click('[name="loginbutton"]');
        // Now on Homepage: click Select game mode
        await page.click('[name=dropdownbutton]');
        await page.waitForTimeout(1000);
        await browser.close();
    })
    it('Click Solo Word Game which redirects to Solo page:', async () => {
        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        await page.setViewport({width: 1920, height: 1080});
        await page.goto('https://wordleworldparty.azurewebsites.net/')
        // click Let's Get Started
        await page.click('[name="landing"]');

        await page.waitForSelector('input[name="username"]');
        await page.$eval('input[name="username"]', el => el.value = '123');

        await page.waitForSelector('input[name="password"]');
        await page.$eval('input[name="password"]', el => el.value = '123');

        await page.click('[name="loginbutton"]');
        // Now on Homepage: click Select game mode
        await page.waitForTimeout(10)
        await page.click('[name=dropdownbutton]');
        // Click solo word game:
        await page.click('[name="sologame"]')
        
        await page.waitForTimeout(10);
        await expect(page.title()).resolves.toMatch('Wordle Solo');
        await page.waitForTimeout(1000);
        await browser.close();
    })
    it('Click Multiplayer Lobby which redirects to Multi page:', async () => {
        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        await page.setViewport({width: 1920, height: 1080});
        await page.goto('https://wordleworldparty.azurewebsites.net/')
        // click Let's Get Started
        await page.click('[name="landing"]');

        await page.waitForSelector('input[name="username"]');
        await page.$eval('input[name="username"]', el => el.value = '123');

        await page.waitForSelector('input[name="password"]');
        await page.$eval('input[name="password"]', el => el.value = '123');

        await page.click('[name="loginbutton"]');
        // Now on Homepage: click Select game mode
        await page.waitForTimeout(10)
        await page.click('[name=dropdownbutton]');
        // Click lobby:
        await page.click('[name="lobby"]')
        
        await page.waitForTimeout(10);
        await expect(page.title()).resolves.toMatch('Lobby');
        await page.waitForTimeout(1000);
        await browser.close();
    })
    it('Click Actions log which redirects to actions page:', async () => {
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
        await page.waitForTimeout(10)
        await page.click('[name=dropdownbutton]');
        // Click actions log:
        await page.click('[name="actions_log"]')
        
        await page.waitForTimeout(10);
        await expect(page.title()).resolves.toMatch('Actions Log');
        await page.waitForTimeout(1000);
        await browser.close();
    })
    it('Click Leaderboard which redirects to leaderboard page:', async () => {
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
        await page.waitForTimeout(10)
        await page.click('[name=dropdownbutton]');
        // Click leaderboard:
        await page.click('[name="leaderboard"]')
        
        await page.waitForTimeout(10);
        await expect(page.title()).resolves.toMatch('Leaderboard');
        await page.waitForTimeout(1000);
        await browser.close();
    })
    it('Click Games Log which redirects to game log page:', async () => {
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
        await page.waitForTimeout(10)
        await page.click('[name=dropdownbutton]');
        // Click game log:
        await page.click('[name="game_log"]')
        
        await page.waitForTimeout(10);
        await expect(page.title()).resolves.toMatch('Game Log');
        await page.waitForTimeout(1000);
        await browser.close();
    })
    it('Click Logout which redirects to Login page:', async () => {
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
        await page.waitForTimeout(10)
        await page.click('[name=dropdownbutton]');
        // Click logout:
        await page.click('[name="logout"]')
        
        await page.waitForTimeout(10);
        await expect(page.title()).resolves.toMatch('Login Page');
        await page.waitForTimeout(1000);
        await browser.close();
    })
})