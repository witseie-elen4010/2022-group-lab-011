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
        await page.waitForTimeout(1000);
        await browser.close();
     })
     it("Register button redirects to Create Account Page:", async () => {

        const browser = await puppeteer.launch()
        
        const page = await browser.newPage()
        await page.setViewport({width: 1920, height: 1080});
        await page.goto('https://wordleworldparty.azurewebsites.net/')

        await page.click('[name="landing"]');
        await page.click('[name="registerbutton"]');
        await expect(page.title()).resolves.toMatch('Create account');
        await page.waitForTimeout(1000);
        await browser.close();
     })
     it('Login directs to HomePage:', async () => {

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
        await page.waitForTimeout(1000);
        await browser.close();
    })
    it('Login page reloads when password is incorrect:', async () => {

        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        await page.setViewport({width: 1920, height: 1080});
        await page.goto('https://wordleworldparty.azurewebsites.net/')
        
        await page.click('[name="landing"]');

        await page.waitForSelector('input[name="username"]');
        await page.$eval('input[name="username"]', el => el.value = '123');

        await page.waitForSelector('input[name="password"]');
        await page.$eval('input[name="password"]', el => el.value = '1234');

        await page.click('[name="loginbutton"]');

        await expect(page.title()).resolves.toMatch('Login Page');
        await page.waitForTimeout(1000);
        await browser.close();
    })
     it('Login button says login', async () => {

        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        await page.setViewport({width: 1920, height: 1080});
        await page.goto('https://wordleworldparty.azurewebsites.net/')

        await page.click('[name="landing"]');
        const text = await page.$eval('button', element => element.textContent)

        await expect(text).toMatch('Login');
        await page.waitForTimeout(1000);
        await browser.close();
    })  
})

