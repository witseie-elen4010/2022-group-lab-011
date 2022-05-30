'use strict'

const {Builder, By, Key, util} = require("selenium-webdriver");
const assert = require("assert");
var should = require("chai").should();

describe("Testing login.ejs", function(){
    it("Login page opened", async function(){

         let driver = await new Builder().forBrowser("firefox").build();
         await driver.get("https://wordleworldparty.azurewebsites.net/");

         await driver.findElement(By.xpath("//a")).click();
         let heading = await driver.findElement(By.xpath("//h1")).getText().then(function(value){
              return value;
         });

         heading.should.equal("Login Page")

         await driver.quit();
     });
     it("Button redirects to create account page", async function(){
          let driver = await new Builder().forBrowser("firefox").build();
          await driver.get("https://wordleworldparty.azurewebsites.net/");
  
          await driver.findElement(By.xpath("//a")).click();
          await driver.findElement(By.xpath("//a")).click();
          let newLocation = await driver.findElement(By.xpath("//h1")).getText().then(function(value){
              return value;
          })
  
          newLocation.should.equal("Create account");
  
          await driver.quit();
      });
});