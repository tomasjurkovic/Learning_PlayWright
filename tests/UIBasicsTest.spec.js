const {test} = require("@playwright/test");

test('Browser context declaration PlayWright test', async ({browser}) => {
    
    // chrome - without plugins/cookie - everything is freshly open and possible to setup

    // new browser instance opens
    const context = await browser.newContext();

    // new page opens in browser
    const page = await context.newPage();

    // navigate to specific page
    await page.goto("https://www.rahulshettyacademy.com/loginpagePractise/");

    }
);

test('Page PlayWright test', async ({page}) => {
    
    // navigate to specific page
    await page.goto("https://www.rahulshettyacademy.com/loginpagePractise/");

    }
);