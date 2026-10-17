import { expect } from "chai";
import { Builder, By, until, Select } from "selenium-webdriver";
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
            .sendKeys("performance_glitch_user");

        await driver.findElement(By.id("password"))
            .sendKeys("secret_sauce");

        await driver.findElement(By.id("login-button")).click();
        await driver.sleep(1000);

        await resetAppState();

        async function resetAppState() {
            await driver.wait(
                until.elementIsVisible(
                    driver.findElement(By.id("react-burger-menu-btn"))
                ),
                20000
            );

            await driver.findElement(
                By.id("react-burger-menu-btn")
            ).click();

            const resetButton = await driver.wait(
                until.elementIsVisible(
                    driver.findElement(By.id("reset_sidebar_link"))
                ),
                20000
            );

            await resetButton.click();

            await driver.sleep(1000);

            await driver.findElement(
                By.id("react-burger-cross-btn")
            ).click();

            await driver.sleep(1000);
        }

        const sortDropdown = await driver.findElement(
            By.className("product_sort_container")
        );

        await new Select(sortDropdown).selectByVisibleText("Name (Z to A)");
        await driver.sleep(1000);

        const firstProduct = await driver.findElement(
            By.className("inventory_item")
        );

        const expectedName = await firstProduct.findElement(
            By.className("inventory_item_name")
        ).getText();

        const priceText = await firstProduct.findElement(
            By.className("inventory_item_price")
        ).getText();

        const expectedPrice = Number(priceText.replace("$", ""));

        console.log("Selected product:", expectedName);
        console.log("Product price:", expectedPrice.toFixed(2));

        await firstProduct.findElement(
            By.css("button.btn_inventory")
        ).click();

        await driver.sleep(1000);

        await driver.findElement(
            By.className("shopping_cart_link")
        ).click();

        await driver.sleep(1000);

        const cartNames = await driver.findElements(
            By.css(".cart_item .inventory_item_name")
        );

        const actualCartNames = [];

        for (const element of cartNames) {
            actualCartNames.push(await element.getText());
        }

        expect(actualCartNames).to.have.lengthOf(1);
        expect(actualCartNames).to.deep.equal([expectedName]);

        console.log("Cart product:", actualCartNames);

        await driver.findElement(By.id("checkout")).click();
        await driver.sleep(1000);

        await driver.findElement(By.id("first-name"))
            .sendKeys("Mashiur");

        await driver.findElement(By.id("last-name"))
            .sendKeys("Rahaman");

        await driver.findElement(By.id("postal-code"))
            .sendKeys("1212");

        await driver.findElement(By.id("continue")).click();
        await driver.sleep(2000);

        const checkoutElements = await driver.findElements(
            By.css(".cart_item .inventory_item_name")
        );

        const checkoutNames = [];

        for (const element of checkoutElements) {
            checkoutNames.push(await element.getText());
        }

        expect(checkoutNames).to.have.lengthOf(1);
        expect(checkoutNames).to.include(expectedName);

        console.log("Checkout product:", checkoutNames);

        const itemPrices = await driver.findElements(
            By.className("inventory_item_price")
        );

        let subtotal = 0;

        for (const element of itemPrices) {
            const text = await element.getText();
            subtotal += Number(text.replace("$", ""));
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

        expect(subtotal).to.equal(expectedPrice);

        expect(actualTotal).to.equal(expectedTotal);

        await driver.findElement(By.id("finish")).click();
        await driver.sleep(1500);

        const successMessage = await driver.findElement(
            By.className("complete-header")
        ).getText();

        console.log("Order message:", successMessage);

        expect(successMessage).to.equal(
            "Thank you for your order!"
        );

        console.log("Q3 TEST PASSED!");

        await resetAppState();

        await driver.findElement(
            By.id("react-burger-menu-btn")
        ).click();

        await driver.sleep(1000);

        await driver.findElement(
            By.id("logout_sidebar_link")
        ).click();

        await driver.sleep(1000);

    } catch (error) {
        console.error("Q3 TEST FAILED:", error.message);
        console.error("Q3 TEST FAILED:", error.stack);
        throw error;
    } finally {
        if (driver) {
            await driver.quit();
        }
    }
}

describe("SauceDemo UI Automation", function () {
    this.timeout(90000);

    it("Q3 - Sort Z to A and complete purchase", async function () {
        await runner();
    });
});
