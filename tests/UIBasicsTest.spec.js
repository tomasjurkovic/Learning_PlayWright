const {test, expect} = require("@playwright/test");

test('RahulShetty login page title scenario', async ({browser}) => {
    
    // chrome - without plugins/cookie - everything is freshly open and possible to setup

    // new browser instance opens
    const context = await browser.newContext();

    // new page opens in browser
    const page = await context.newPage();

    // navigate to specific page
    await page.goto("https://www.rahulshettyacademy.com/loginpagePractise/");

    // check title
    const pageTitle = "LoginPage Practise | Rahul Shetty Academy";
    console.log(await page.title());

    // put assertion
    await expect(page).toHaveTitle(pageTitle);
    }
);

test('RahulShetty login page incorrect login scenario', async ({page}) => {
    
    // navigate to specific page
    await page.goto("https://www.rahulshettyacademy.com/loginpagePractise/");

    // fill all fields on Login Page:
    await page.locator("#username").type("rahulshetty");
    await page.locator("[type='password']").type("learning");
    await page.locator("#signInBtn").click();
    
    // check error message
    const errorMessageText = "Incorrect username/password.";
    await page.locator("[style*='block']").textContent();
    await expect(page.locator("[style*='block']")).toContainText(errorMessageText);
    }
);

test('RahulShetty login page correct login scenario', async ({page}) => {
    
    // navigate to specific page
    await page.goto("https://www.rahulshettyacademy.com/loginpagePractise/");

    // fill all fields on Login Page:
    await page.locator("#username").type("rahulshettyacademy");
    await page.locator("[type='password']").type("learning");
    await page.locator("#signInBtn").click();
    
    // check- page's title and url
    const pageTitle = "ProtoCommerce";
    const urlLink = "https://rahulshettyacademy.com/angularpractice/shop";
    await expect(page).toHaveTitle(pageTitle);
    await expect(page).toHaveURL(urlLink);
    }
);

test('Google page title PlayWright test', async ({page}) => {
    
    // navigate to specific page
    await page.goto("https://www.google.com");

    // check title
    const pageTitle = "Google";
    console.log(await page.title());

    // put assertion
    await expect(page).toHaveTitle(pageTitle);

    }
);