'use strict'

const { Builder, By, Key, util } = require('selenium-webdriver')
var should = require("chai").should()

describe("Test Home page", function () {
	it("Test solo game button", async function () {
		const driver = await new Builder().forBrowser('firefox').build()

		await driver.get("https://wordleworldparty.azurewebsites.net/")
		await driver.findElement(By.xpath("//a")).click();

		driver.findElement(By.id("username")).sendKeys("123");
		driver.findElement(By.id("password")).sendKeys("123");

		await driver.findElement(By.id("myButton")).click();
		await driver.findElement(By.xpath("//button")).click();


		let heading = await driver.findElement(By.id("sologame")).getText().then(function (value) {
			return value
		});

		heading.should.equal("Solo Wordle Game");

		await driver.quit()
	});
	it("Test button redirects to solo game", async function () {
		const driver = await new Builder().forBrowser('firefox').build()

		await driver.get("https://wordleworldparty.azurewebsites.net/")
		await driver.findElement(By.xpath("//a")).click();

		driver.findElement(By.id("username")).sendKeys("123");
		driver.findElement(By.id("password")).sendKeys("123");

		await driver.findElement(By.id("myButton")).click();
		await driver.findElement(By.xpath("//button")).click();
		await driver.findElement(By.id("sologame")).click();

		let heading = await driver.findElement(By.xpath("//h1")).getText().then(function (value) {
			return value
		});

		heading.should.equal("Wordle World Party");

		await driver.quit()
	});
	it("Test logout button redirects to index page", async function () {
		const driver = await new Builder().forBrowser('firefox').build()

		await driver.get("https://wordleworldparty.azurewebsites.net/")
		await driver.findElement(By.xpath("//a")).click();

		driver.findElement(By.id("username")).sendKeys("123");
		driver.findElement(By.id("password")).sendKeys("123");

		await driver.findElement(By.id("myButton")).click();
		await driver.findElement(By.xpath("//button")).click();
		await driver.findElement(By.id("logout")).click();

		let heading = await driver.findElement(By.xpath("//h1")).getText().then(function (value) {
			return value
		});

		heading.should.equal("Login Page");

		await driver.quit()
	});
	it("Test leaderboard button redirects to leaderboard page", async function () {
		const driver = await new Builder().forBrowser('firefox').build()

		await driver.get("https://wordleworldparty.azurewebsites.net/")
		await driver.findElement(By.xpath("//a")).click();

		driver.findElement(By.id("username")).sendKeys("123");
		driver.findElement(By.id("password")).sendKeys("123");

		await driver.findElement(By.id("myButton")).click();
		await driver.findElement(By.xpath("//button")).click();
		await driver.findElement(By.id("leaderboard")).click();

		let heading = await driver.findElement(By.xpath("//h1")).getText().then(function (value) {
			return value
		});

		heading.should.equal("Leaderboard");

		await driver.quit()
	});
	it("Test game log button redirects to game log", async function () {
		const driver = await new Builder().forBrowser('firefox').build()

		await driver.get("https://wordleworldparty.azurewebsites.net/")
		await driver.findElement(By.xpath("//a")).click();

		driver.findElement(By.id("username")).sendKeys("123");
		driver.findElement(By.id("password")).sendKeys("123");

		await driver.findElement(By.id("myButton")).click();
		await driver.findElement(By.xpath("//button")).click();
		await driver.findElement(By.id("game_log")).click();

		let heading = await driver.findElement(By.xpath("//h1")).getText().then(function (value) {
			return value
		});

		heading.should.equal("Game Log");

		await driver.quit()
	});
	it("Test Multiplayer Lobby button redirects to Lobby", async function () {
		const driver = await new Builder().forBrowser('firefox').build()

		await driver.get("https://wordleworldparty.azurewebsites.net/")
		await driver.findElement(By.xpath("//a")).click();

		driver.findElement(By.id("username")).sendKeys("123");
		driver.findElement(By.id("password")).sendKeys("123");

		await driver.findElement(By.id("myButton")).click();
		await driver.findElement(By.xpath("//button")).click();
		await driver.findElement(By.id("lobby")).click();

		let heading = await driver.findElement(By.xpath("//h1")).getText().then(function (value) {
			return value
		});

		heading.should.equal("Lobby");

		await driver.quit()
	});
});