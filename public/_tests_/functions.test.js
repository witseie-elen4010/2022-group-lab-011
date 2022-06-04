const puppeteer = require('puppeteer');

describe('Test index page:', () => {
    it('Button says login', async () => {
        
        //beforeEach(async () => {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto('https://wordleworldparty.azurewebsites.net/')
        //})
        
        const btn = page.$('#btn');

        let btnText = await page.evaluate(el => el.textContent, btn);
        expect(+btnText).toEqual('Login');
    })
})