'use strict'

const { Builder, By, Key, util } = require('selenium-webdriver')
var should = require("chai").should()

describe("Test Create Account Page", function () {
    it("Test existing account can't be created", async function () {
      const driver = await new Builder().forBrowser('firefox').build()
        
      //navigate to create account page  
      await driver.get("https://wordleworldparty.azurewebsites.net/")
      await driver.findElement(By.xpath("//a")).click();
      await driver.findElement(By.xpath("//a")).click();
      
      driver.findElement(By.id("username")).sendKeys("SeleniumTester");
      driver.findElement(By.id("email")).sendKeys("SeleniumTester@gmail.com");
      driver.findElement(By.id("password")).sendKeys("Tests");
      driver.findElement(By.id("confirm_password")).sendKeys("Test");

      await driver.findElement(By.id("myButton")).click(); 

      let newLocation = await driver.findElement(By.xpath("//h1")).getText().then(function(value){
        return value;
      });

      newLocation.should.equal("Create account");

      await driver.quit();
      });
  });
  // Must enlarge page to click register, will fix size selenium opens as later.