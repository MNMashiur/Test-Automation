# API Automation Project

API automation testing for the ReqRes API using **Postman**, **JavaScript**, **Newman**, and **Newman HTML Extra**. The Postman collection contains API requests and response assertions; Newman runs the exported collection from the command line and generates an HTML test report.

## Project Structure

```text
API Automation/
├── API_Automation_Project.postman_collection.json
├── README.md
├── package.json                 # Created if dependencies are installed locally
├── package-lock.json            # Created by npm when applicable
├── node_modules/                # Local npm packages, if installed
└── newman/
    └── API_Automation_Project-report.html
```

Your actual collection filename may be different. Use the exact filename you exported from Postman in the commands below.

## Prerequisites

Install **Node.js and npm** from https://nodejs.org/ and **Postman** from https://www.postman.com/downloads/. You may also need an active ReqRes API key configured in your collection.

Verify Node.js and npm:

```bash
node --version
npm --version
```

## 1. Export the Postman Collection

1. Open Postman.
2. Find the `API Automation Project` collection.
3. Open the collection menu (`...`) and choose **Export**.
4. Choose **Collection v2.1** if prompted.
5. Save the exported JSON file inside this API Automation folder.

Example filename:

```text
API_Automation_Project.postman_collection.json
```

**Important:** After editing requests or scripts in Postman, export the collection again before running Newman. Newman executes the exported JSON file, not unsaved changes in the Postman editor.

## 2. Install Newman Globally

Install Newman globally so that the `newman` command is available from your terminal:

```bash
npm i newman -g
```

Verify the installation:

```bash
newman --version
```

If the terminal cannot find `newman`, reopen the terminal and check that npm's global executable directory is on your PATH.

## 3. Install the HTML Extra Reporter

From the API Automation project folder, run:

```bash
npm i newman-reporter-htmlextra
```

The HTML Extra reporter creates a detailed HTML report containing the run summary and request/test results.

If Newman cannot find the reporter, try installing it globally as well:

```bash
npm i newman-reporter-htmlextra -g
```

## 4. Run the Collection and Generate the HTML Report

Open a terminal in the folder containing the exported collection JSON, then run:

```bash
newman run API_Automation_Project.postman_collection.json -r htmlextra
```

Replace `API_Automation_Project.postman_collection.json` with the exact filename you exported if it differs.

Newman executes the requests and prints the run summary in the terminal. The HTML Extra reporter typically creates a report in a `newman` folder in the current working directory. The exact report filename depends on the collection name and run time.

Example structure after running:

```text
API Automation/
├── API_Automation_Project.postman_collection.json
├── README.md
└── newman/
    └── API_Automation_Project-<date>-<time>-<run>.html
```

### Optional: Choose a specific report filename

```bash
newman run API_Automation_Project.postman_collection.json -r htmlextra --reporter-htmlextra-export newman/API_Automation_Project-report.html
```

Create the `newman` directory first if it does not already exist.

## 5. View the HTML Report

1. Wait for Newman to finish.
2. Open the generated `.html` file from the `newman` folder in Chrome or another modern browser.
3. Review the summary, total requests, passed and failed tests, and individual request results.

The HTML report is a static file that can be opened locally. The terminal output is also useful for identifying failed requests and assertions.

## 6. Run the Collection Again

Whenever you update requests or scripts:

1. Save your changes in Postman.
2. Export the collection JSON again.
3. Open the terminal in the project folder.
4. Run:

```bash
newman run API_Automation_Project.postman_collection.json -r htmlextra
```

Open the newly generated report to review the latest results.

## Troubleshooting

### `newman` is not recognized

```bash
npm i newman -g
newman --version
```

Reopen the terminal and check that npm's global executable directory is on your PATH.

### `htmlextra` reporter cannot be found

```bash
npm i newman-reporter-htmlextra
```

If needed, try:

```bash
npm i newman-reporter-htmlextra -g
```

### `getaddrinfo ENOTFOUND {{baseurl}}`

A URL variable was not resolved. Check that the variable name in the request matches the collection variable exactly—for example, `{{base_url}}` versus `{{baseurl}}`. Confirm the base URL variable contains:

```text
https://reqres.in/api
```

Export the collection again after fixing it.

### `request url is empty`

Open the affected request in Postman and confirm that its method and URL are set. Save the request, export the collection again, and rerun Newman.

### `JSONError: "undefined" is not valid JSON`

A script may be trying to parse a JSON response after the request failed or returned no valid response. Fix the underlying URL, variable, or authentication error first.

### API key or authentication errors

Check that requests to ReqRes endpoints requiring it include the correct `x-api-key` header. Use an active key and do not publish privileged keys in a public repository. Ensure any variables used by the collection are defined or supplied when running Newman.

## Security Notes

- Do not commit privileged ReqRes API keys, personal credentials, or live authentication tokens to GitHub.
- Review the exported collection JSON before pushing it to a public repository; exported values may contain credentials or tokens.
- Prefer safe placeholders for secrets and provide real values locally.
- Whether `authToken` authorizes later requests depends on the target endpoint and ReqRes authentication rules.

## Useful Documentation

- [ReqRes API documentation](https://app.reqres.in/documentation)
- [Postman documentation](https://learning.postman.com/docs/)
- [Newman](https://github.com/postmanlabs/newman)
- [Newman HTML Extra Reporter](https://github.com/DannyDainton/newman-reporter-htmlextra)
- [Node.js](https://nodejs.org/)
- [npm documentation](https://docs.npmjs.com/)

---

**Workflow summary:** Export the collection from Postman → install Newman → install `newman-reporter-htmlextra` → run the collection from the terminal → open the generated HTML report.
