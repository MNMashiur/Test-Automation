import { expect } from "chai";
import { Builder, By, until } from "selenium-webdriver";
import { Options } from "selenium-webdriver/chrome.js";

const options = new Options();

options.setUserPreferences({
    "profile.password_manager_leak_detection": false,
    "credentials_enable_service": false,
    "profile.password_manager_enabled": false
});

let driver;

async function runner() {
    try {
        driver = await new Builder()
            .forBrowser("chrome")
            .setChromeOptions(options)
            .build();

        await driver.get("https://www.saucedemo.com/");
        await driver.manage().window().maximize();
        await driver.sleep(1000);

        await driver.findElement(By.id("user-name"))
            .sendKeys("standard_user");

        await driver.findElement(By.id("password"))
            .sendKeys("secret_sauce");

        await driver.findElement(By.id("login-button")).click();
        await driver.sleep(1000);

        await driver.findElement(
            By.id("react-burger-menu-btn")
        ).click();

        await driver.sleep(1500);

        await driver.findElement(
            By.id("reset_sidebar_link")
        ).click();

        await driver.sleep(1000);

        await driver.findElement(
            By.id("react-burger-cross-btn")
        ).click();


        const allProducts = await driver.findElements(
            By.className("inventory_item")
        );

        const products = [];

        while (products.length < 3) {
            const i = Math.floor(Math.random() * allProducts.length);

            const name = await allProducts[i]
                .findElement(By.className("inventory_item_name"))
                .getText();

            if (!products.includes(name)) {
                products.push(name);
            }
        }

        const expectedNames = [];

        for (const product of products) {
            const item = await driver.findElement(
                By.xpath(
                    `//div[contains(@class,"inventory_item")][.//*[contains(@class,"inventory_item_name") and normalize-space()="${product}"]]`
                )
            );

            const name = await item.findElement(
                By.className("inventory_item_name")
            ).getText();

            await item.findElement(
                By.css("button.btn_inventory")
            ).click();

            expectedNames.push(name);
            await driver.sleep(500);
        }

        console.log("Randomly selected products:", expectedNames);


        await driver.findElement(
            By.className("shopping_cart_link")
        ).click();

        await driver.sleep(1000);

        const cartNames = await driver.findElements(
            By.className("inventory_item_name")
        );

        const actualCartNames = [];

        for (const element of cartNames) {
            actualCartNames.push(await element.getText());
        }

        expect(actualCartNames).to.have.lengthOf(3);
        expect(actualCartNames).to.have.members(expectedNames);

        await driver.findElement(By.id("checkout")).click();
        await driver.sleep(1000);

        await driver.findElement(By.id("first-name"))
            .sendKeys("Mashiur");

        await driver.findElement(By.id("last-name"))
            .sendKeys("Rahaman");

        await driver.findElement(By.id("postal-code"))
            .sendKeys("1212");

        await driver.findElement(By.id("continue")).click();
        await driver.sleep(1000);

        const checkoutElements = await driver.findElements(
            By.className("inventory_item_name")
        );

        const checkoutNames = [];

        for (const element of checkoutElements) {
            checkoutNames.push(await element.getText());
        }

        expect(checkoutNames).to.have.lengthOf(3);
        expect(checkoutNames).to.have.members(expectedNames);

        console.log("Expected products:", expectedNames);
        console.log("Actual checkout products:", checkoutNames);

        const itemPrices = await driver.findElements(
            By.className("inventory_item_price")
        );

        let subtotal = 0;

        for (const priceElement of itemPrices) {
            const priceText = await priceElement.getText();
            subtotal += Number(priceText.replace("$", ""));
        }

        const taxText = await driver.findElement(
            By.className("summary_tax_label")
        ).getText();

        const tax = Number(taxText.replace("Tax: $", ""));

        const totalText = await driver.findElement(
            By.className("summary_total_label")
        ).getText();

        const actualTotal = Number(
            totalText.replace("Total: $", "")
        );

        const expectedTotal = Number((subtotal + tax).toFixed(2));

        console.log("Subtotal:", subtotal.toFixed(2));
        console.log("Tax:", tax.toFixed(2));
        console.log("Expected total:", expectedTotal.toFixed(2));
        console.log("Actual total:", actualTotal.toFixed(2));

        expect(actualTotal).to.equal(expectedTotal);

        await driver.findElement(By.id("finish")).click();
        await driver.sleep(1000);

        const successMessage = await driver.findElement(
            By.className("complete-header")
        ).getText();

        console.log("Order message:", successMessage);

        expect(successMessage).to.equal("Thank you for your order!");

        console.log("Q2 TEST PASSED!");

        await driver.findElement(
            By.id("react-burger-menu-btn")
        ).click();

        await driver.sleep(1000);

        await driver.findElement(
            By.id("reset_sidebar_link")
        ).click();

        await driver.sleep(1000);

        await driver.findElement(
            By.id("logout_sidebar_link")
        ).click();

        await driver.sleep(1000);

    } catch (error) {
        console.error("Q2 TEST FAILED:", error.message);
        throw error;
    } finally {
        if (driver) {
            await driver.quit();
        }
    }
}

describe("SauceDemo UI Automation", function () {
    this.timeout(60000);

    it("Q2 - Complete purchase and verify product names and total", async function () {
        await runner();
    });
});