/* eslint-env jest*/
const puppeteer = require('puppeteer');
const timeout = 90000;
jest.setTimeout(timeout);

describe('Test Create Account Page:', () => {
    it('Ensure website is opened successfully:', async () => {

        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        await page.goto('http://test-wordle-world-party.azurewebsites.net/')

        await expect(page.title()).resolves.toMatch('Welcome!');
        await browser.close();
    })
    it("Register button redirects to Create Account Page:", async () => {

        const browser = await puppeteer.launch()

        const page = await browser.newPage()
        await page.setViewport({width: 1920, height: 1080});
        await page.goto('http://test-wordle-world-party.azurewebsites.net/')
        // click Let's Get Started
        await page.click('[name="landing"]');
        //await page.waitForTimeout(10);
        await page.click('[name="registerbutton"]');
        await expect(page.title()).resolves.toMatch('Create account');
        await page.waitForTimeout(1000);
        await browser.close();
     })
    //  it("Test account can't be created because passwords don't match", async () => {
    //     // Open browser
    //     const browser = await puppeteer.launch()
    //     const page = await browser.newPage()
    //     await page.setViewport({width: 1920, height: 1080});
    //     await page.goto('http://test-wordle-world-party.azurewebsites.net/')
    //     // click Let's Get Started
    //     await page.click('[name="landing"]');
    //     await page.click('[name="registerbutton"]');
    //     // enter username
    //     await page.waitForSelector('input[name="username"]');
    //     await page.$eval('input[name="username"]', el => el.value = 'PuppeteerTester');
    //     // enter email
    //     await page.waitForSelector('input[name="email"]');
    //     await page.$eval('input[name="email"]', el => el.value = 'PuppeteerTester@gmail.com');
    //     // enter password
    //     await page.waitForSelector('input[name="password"]');
    //     await page.$eval('input[name="password"]', el => el.value = 'Tests');
    //     // confirm password
    //     await page.waitForSelector('input[name="confirm_password"]');
    //     await page.$eval('input[name="confirm_password"]', el => el.value = 'Test');

    //     // Now click Register, should stay on same page
    //     //await page.waitForTimeout(10);
    //     await page.click('[name="createbutton"]');
    //     await expect(page.title()).resolves.toMatch('Create account');

    //     await page.waitForTimeout(1000);
    //     await browser.close();
    // })
    // it("Test existing account can't be created: Error thrown", async () => {
    //     // Open browser
    //     const browser = await puppeteer.launch()
    //     const page = await browser.newPage()
    //     await page.setViewport({width: 1920, height: 1080});
    //     await page.goto('http://test-wordle-world-party.azurewebsites.net/')
    //     // click Let's Get Started
    //     await page.click('[name="landing"]');
    //     await page.click('[name="registerbutton"]');
    //     // enter username
    //     await page.waitForSelector('input[name="username"]');
    //     await page.$eval('input[name="username"]', el => el.value = 'PuppeteerTester');
    //     // enter email
    //     await page.waitForSelector('input[name="email"]');
    //     await page.$eval('input[name="email"]', el => el.value = 'PuppeteerTester@gmail.com');
    //     // enter password
    //     await page.waitForSelector('input[name="password"]');
    //     await page.$eval('input[name="password"]', el => el.value = 'Tests');
    //     // confirm password
    //     await page.waitForSelector('input[name="confirm_password"]');
    //     await page.$eval('input[name="confirm_password"]', el => el.value = 'Tests');
        
    //     // Now click Register, should stay on same page
    //     //await page.waitForTimeout(10);
    //     await page.click('[name="createbutton"]');
    //     await expect(page.title()).resolves.toMatch(""); //Create account');

    //     await page.waitForTimeout(1000);
    //     await browser.close();
    // })
})