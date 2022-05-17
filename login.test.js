const puppeteer = require('puppeteer')
const { toHome } = require('./login');

let newTimeout = 100000
jest.setTimeout(newTimeout)

test('should validate inputted username and password', () => {
    const text = toHome ('admin', 'admin');
    expect(text).toBe('Go to Home');
});

test('should not validate inputted username and password', () => {
    const text = toHome ('admin', 123);
    expect(text).toBe('Do not go to Home');
});

test('should click on screen', async () => {
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 80,
        args: ['--window-size=1920, 1080']
    });
    const page = await browser.newPage();
    await page.goto(
        'file:///C:/Users/Robin/Documents/University%202022/soft%20dev%20(4010)/Group%20Project/Git/2022-group-lab-011/login.html'
    );
    await page.click('input#username');
    await page.type('input#username', 'admin');
    await page.click('input#password');
    await page.type('input#password', 'admin');
    await page.click('button');
});
