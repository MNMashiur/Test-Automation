import { expect } from "chai";
import { Builder, By, until } from "selenium-webdriver";

let driver;

function buildDriver() {
    return new Builder()
        .forBrowser("chrome")
        .build();
}

async function runner() {
    driver = buildDriver();

    try {
        await driver.get("https://www.saucedemo.com/");

        await driver.manage().window().maximize();

        await driver.sleep(2000);

        await driver.findElement(By.id("user-name"))
            .sendKeys("locked_out_user");

        await driver.findElement(By.id("password"))
            .sendKeys("secret_sauce");

        await driver.sleep(1000);

        await driver.findElement(By.id("login-button")).click();

        const errorElement = await driver.wait(
            until.elementLocated(By.css('[data-test="error"]')),
            2000
        );

        const actualText = await errorElement.getText();

        const expectedText =
            "Epic sadface: Sorry, this user has been locked out.";

        console.log("Expected Error:", expectedText);
        console.log("Actual Error:", actualText);

        expect(actualText).to.equal(expectedText);

        console.log("Q1 TEST PASSED!");

        await driver.sleep(2000);

    } catch (error) {
        console.error("Q1 TEST FAILED:", error.message);
        throw error;
    } finally {
        if (driver) {
            await driver.quit();
        }
    }
}

describe("SauceDemo UI Automation", function () {
    this.timeout(30000);

    it("Q1 - Verify locked-out user error message", async function () {
        await runner();
    });
});