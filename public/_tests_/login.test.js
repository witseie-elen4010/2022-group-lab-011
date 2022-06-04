/* eslint-env jest*/
const puppeteer = require('puppeteer');
const timeout = 60000;
jest.setTimeout(timeout);

describe('Test Login page:', () => {
    beforeAll( async () => {

    });
    it('Button redirects to create account page', async () => {

        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        await page.goto('https://wordleworldparty.azurewebsites.net/')
        await page.click('[name="landing"]');
        await page.click('//a[class="btn btn-dark-outline" href="/create_account" role="button"]');
        //const searchBtn = await page.$x('//a[@class="btn btn-dark my-4"]');

        //await page.click('[role="button"]');

        await expect(page.title()).resolves.toMatch('Create Account');
        await browser.close();
    })
  
})

