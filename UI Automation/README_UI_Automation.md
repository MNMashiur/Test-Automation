# SauceDemo UI Automation

This project contains automated UI tests for the [SauceDemo](https://www.saucedemo.com/) web application. It uses JavaScript, Selenium WebDriver, Mocha, Chai, and Mochawesome to run browser tests, validate results, and generate HTML test reports.

## Project Structure

```text
UI Automation/
├── Task1.js                 # Q1: Validate locked-out user login error
├── Task2.js                 # Q2: Add three products and complete checkout
├── Task3.js                 # Q3: Sort products Z–A and complete checkout
├── package.json             # Project configuration, dependencies, npm scripts
├── package-lock.json        # Locked dependency versions (if included)
├── node_modules/            # Installed packages (created by npm install)
└── mochawesome-report/      # Generated HTML and JSON reports
```

## Requirements

Install these before running the tests:

1. **Node.js (LTS recommended)** — includes npm. Download: https://nodejs.org/
2. **Google Chrome** — the browser controlled by Selenium. Download: https://www.google.com/chrome/
3. **Git** (optional) — only needed if you want to clone the repository. Download: https://git-scm.com/

Verify Node.js and npm are installed:

```bash
node --version
npm --version
```

Both commands should display version numbers.

## Installation

### 1. Open the project folder

Open a terminal in the `UI Automation` directory—the directory containing `package.json`.

For example, in PowerShell:

```powershell
cd "E:\Ostad_SQA\Module 11_Project\UI Automation"
```

If you cloned the repository, change into the corresponding folder on your computer instead.

### 2. Install dependencies

If `package.json` and `package-lock.json` are present, run:

```bash
npm install
```

This installs the project's dependencies locally in `node_modules`.

The main packages used by this project are:

| Package | Purpose |
| --- | --- |
| `selenium-webdriver` | Automates Chrome and interacts with page elements |
| `mocha` | Runs the test suites |
| `chai` | Provides assertions for checking expected results |
| `mochawesome` | Generates HTML and JSON test reports |

If these packages have not yet been added to the project, install them with:

```bash
npm install selenium-webdriver mocha chai mochawesome
```

You do not need to install these packages globally.

### 3. Check `package.json`

The project uses ES module imports, so `package.json` must include:

```json
"type": "module"
```

The `scripts` section should provide commands for each test. If your existing `package.json` uses different script names, use the commands defined there.

Example scripts:

```json
"scripts": {
  "test:q1": "mocha Task1.js --reporter mochawesome",
  "test:q2": "mocha Task2.js --reporter mochawesome",
  "test:q3": "mocha Task3.js --reporter mochawesome",
  "test:all": "mocha Task1.js Task2.js Task3.js --reporter mochawesome"
}
```

Keep the rest of your `package.json` fields, such as `name`, `version`, and `dependencies`; this snippet only illustrates the required configuration.

## Test Scenarios

### Q1 — Locked-out user login (`Task1.js`)

Checks that SauceDemo rejects a locked-out user and displays the expected error message.

**Credentials**

- Username: `locked_out_user`
- Password: `secret_sauce`

**Validation**

The expected error is:

```text
Epic sadface: Sorry, this user has been locked out.
```

The test compares the actual error text with the expected text using Chai.

### Q2 — Standard user purchase flow (`Task2.js`)

Checks the shopping and checkout process for a standard user.

**Credentials**

- Username: `standard_user`
- Password: `secret_sauce`

**Test flow**

1. Log in to SauceDemo.
2. Reset the application state.
3. Add three distinct products to the cart using the selection logic in the test.
4. Verify the cart contains the expected products.
5. Continue to checkout and enter the required customer information.
6. Verify the checkout products and price calculations.
7. Finish the purchase and verify the confirmation message.
8. Reset the application state and log out if implemented in the test.

### Q3 — Sort Z to A and purchase (`Task3.js`)

Checks product sorting and checkout using the performance-glitch user.

**Credentials**

- Username: `performance_glitch_user`
- Password: `secret_sauce`

**Test flow**

1. Log in to SauceDemo.
2. Reset the application state.
3. Sort products by **Name (Z to A)**.
4. Add the first product in the sorted list to the cart.
5. Verify the product name in the cart and checkout.
6. Validate the subtotal, tax, and total against the test's expected calculations.
7. Finish the purchase and verify the confirmation message.
8. Reset the application state and log out if implemented in the test.

The expected purchase confirmation used by the tests is:

```text
Thank you for your order!
```

## Running the Tests

Run all commands from the project directory.

### Run Q1 only

```bash
npm run test:q1
```

### Run Q2 only

```bash
npm run test:q2
```

### Run Q3 only

```bash
npm run test:q3
```

### Run all tests

```bash
npm run test:all
```

The `test:all` command runs the three files in the order listed in the npm script. Each test should await its runner and close its own browser session when finished. Chrome may still bring a different window to the foreground, so a window appearing on top does not necessarily mean its test is executing first.

### Run with `npx` instead

You can also run Mocha directly:

```bash
npx mocha Task1.js --reporter mochawesome
npx mocha Task2.js --reporter mochawesome
npx mocha Task3.js --reporter mochawesome
```

Or run all three:

```bash
npx mocha Task1.js Task2.js Task3.js --reporter mochawesome
```

## Test Reports

Mochawesome creates a report after the test run. By default, the output directory is:

```text
mochawesome-report/
```

Typical output:

```text
mochawesome-report/
├── mochawesome.html
└── mochawesome.json
```

- **`mochawesome.html`** — open this file in a browser to review the test results.
- **`mochawesome.json`** — machine-readable report data.

The report includes test results and, for failures, relevant error details. A subsequent run may overwrite the existing report files.

## Troubleshooting

### `node` or `npm` is not recognized

Install Node.js from https://nodejs.org/, then reopen the terminal and check:

```bash
node --version
npm --version
```

### A package or module cannot be found

Make sure the terminal is in the folder containing `package.json`, then run:

```bash
npm install
```

### Chrome does not launch

- Confirm Google Chrome is installed.
- Check the terminal for the complete Selenium error.
- Update Chrome and the `selenium-webdriver` dependency if necessary.
- See the Selenium documentation for browser setup.

Modern Selenium versions include Selenium Manager, which can generally manage the browser driver automatically.

### `Select is not defined`

The JavaScript Selenium WebDriver API does not use the Java-style `Select` class. For SauceDemo's sort dropdown, interact with the element directly:

```javascript
const sortDropdown = await driver.findElement(
    By.className("product_sort_container")
);

await sortDropdown.sendKeys("za");
```

On SauceDemo, `za` represents **Name (Z to A)**.

### An element cannot be found or a test times out

- Run the failing test individually to isolate the issue.
- Check the first error and stack trace in the terminal.
- Verify that the locator still matches the current page.
- Wait for elements to be located or visible before interacting with them.
- Increase a timeout only if the application legitimately needs more time.

### Expected product, price, or total does not match

Check that sorting and product selection completed before reading the product details. Review the actual values printed in the terminal and confirm the subtotal, tax, and total calculations before changing an assertion.

### Chrome windows interfere when running all tests

Each file should create its browser session inside its test runner—not at the top level when the module is loaded—and close the session in a `finally` block. Each Mocha test should await its runner. If the issue persists, run each test individually to isolate it.

## Documentation

- [SauceDemo](https://www.saucedemo.com/)
- [Selenium documentation](https://www.selenium.dev/documentation/)
- [Selenium WebDriver JavaScript API](https://www.selenium.dev/selenium/docs/api/javascript/)
- [Mocha documentation](https://mochajs.org/)
- [Chai documentation](https://www.chaijs.com/)
- [Mochawesome](https://github.com/adamgruber/mochawesome)
- [Node.js](https://nodejs.org/)
- [npm documentation](https://docs.npmjs.com/)

## Notes

- Run npm commands from the directory containing `package.json`.
- `node_modules/` is created locally by `npm install` and generally should not be committed to GitHub.
- The SauceDemo usernames and password listed above are public demo credentials.
- The README documents the intended scenarios. The exact locators, waits, product-selection logic, and assertions are defined in the current versions of `Task1.js`, `Task2.js`, and `Task3.js`.
