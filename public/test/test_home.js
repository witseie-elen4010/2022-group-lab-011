
const { Builder, By, Key, util } = require('selenium-webdriver')
const assert = require("assert")
var should = require("chai").should()

describe('Test Home page', function () {
  it('Test solo game button', async function () {
    const driver = await new Builder().forBrowser('firefox').build()

        await driver.get('https://wordleworldparty.azurewebsites.net/')
        // The above will only work while no login is required to get to homepage
        await driver.findElement(By.xpath("//a")).click();
        
        driver.findElement(By.id("username")).sendKeys("123");
        driver.findElement(By.id("password")).sendKeys("123");
  
        await driver.findElement(By.id("myButton")).click();
        await driver.findElement(By.xpath("//button")).click();
        

        let heading = await driver.findElement(By.id('sologame')).getText().then(function (value) {
            return value
        })

        heading.should.equal('Solo Wordle Game')

    await driver.quit()
    })
    

})