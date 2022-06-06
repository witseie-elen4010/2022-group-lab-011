'use strict'

const { Builder, By, Key, util } = require("selenium-webdriver");
var should = require("chai").should();
// chai is used for making code more readable.

describe("Testing login.ejs", function () {
	it("Login page opened", async function () {

		let driver = await new Builder().forBrowser("firefox").build();
		await driver.get("https://wordleworldparty.azurewebsites.net/");

		await driver.findElement(By.xpath("//a")).click();
		let heading = await driver.findElement(By.xpath("//h1")).getText().then(function (value) {
			return value;
		});

		heading.should.equal("Login Page")

		await driver.quit();
	});
	it("Button redirects to create account page", async function () {
		let driver = await new Builder().forBrowser("firefox").build();
		await driver.get("https://wordleworldparty.azurewebsites.net/");

		await driver.findElement(By.xpath("//a")).click();
		await driver.findElement(By.xpath("//a")).click();
		let newLocation = await driver.findElement(By.xpath("//h1")).getText().then(function (value) {
			return value;
		})

		newLocation.should.equal("Create account");

		await driver.quit();
	});
	it("Button name is login on Login page", async function () {
		let driver = await new Builder().forBrowser("firefox").build();
		await driver.get("https://wordleworldparty.azurewebsites.net/");

		await driver.findElement(By.xpath("//a")).click();


		let buttonName = await driver.findElement(By.xpath("//button")).getText().then(function (value) {
			return value;
		});

		buttonName.should.equal("Login");

		await driver.quit();
	});
	it("Button redirects to home page", async function () {
		let driver = await new Builder().forBrowser("firefox").build();
		await driver.get("https://wordleworldparty.azurewebsites.net/");

		await driver.findElement(By.xpath("//a")).click();

		// enter a saved account

		driver.findElement(By.id("username")).sendKeys("123");
		driver.findElement(By.id("password")).sendKeys("123");

		await driver.findElement(By.id("myButton")).click();

		let newLocation = await driver.findElement(By.xpath("//h1")).getText().then(function (value) {
			return value;
		});

		newLocation.should.equal("Homepage");

		await driver.quit();
	});
	it("Button click remains on Login page when password is wrong", async function () {
		let driver = await new Builder().forBrowser("firefox").build();
		await driver.get("https://wordleworldparty.azurewebsites.net/");

		await driver.findElement(By.xpath("//a")).click();

		// enter admin admin to login

		driver.findElement(By.id("username")).sendKeys("sjegghjsdgfherhfvbhjbabhjwVHJVFHVH");
		driver.findElement(By.id("password")).sendKeys("czkhjsbfbeabfhybzhfhjvfghsvbhesrvvfhgrvghzfsv");

		await driver.findElement(By.id("myButton")).click();

		let newLocation = await driver.findElement(By.xpath("//h1")).getText().then(function (value) {
			return value;
		});

		newLocation.should.equal("Login Page");

		await driver.quit();
	});
});