'use strict'

const {Builder, By, Key, util} = require("selenium-webdriver");
const assert = require("assert");
var should = require("chai").should();

// describe is used specifically by mocha, use npx mocha to run
describe("Testing Index.html", function(){
    it("Button says Login", async function(){

        let driver = await new Builder().forBrowser("firefox").build();
        await driver.get("https://wordleworldparty.azurewebsites.net/");

        let buttonName = await driver.findElement(By.xpath("//a")).getText().then(function(value){
             return value;
        });

        buttonName.should.equal("Login")

        await driver.quit();
    });
    it("Button redirects to login page", async function(){
        let driver = await new Builder().forBrowser("firefox").build();
        await driver.get("https://wordleworldparty.azurewebsites.net/");

        await driver.findElement(By.xpath("//a")).click()
        let newLocation = await driver.findElement(By.xpath("//h1")).getText().then(function(value){
            return value;
        })

        newLocation.should.equal("Login Page");

        await driver.quit();
    });
});