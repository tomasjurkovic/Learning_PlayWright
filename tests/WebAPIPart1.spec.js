const {test, expect} = require("@playwright/test");

test.only('RahulShetty eshop login with correct credentials test', async ({page}) => {

    const mail = "tomastest@test.org";
    const password = "Test1234";
    const userEmailLocator = page.locator("#userEmail");
    const passwordLocator = page.locator("#userPassword");
    const loginLocator = page.locator("#login");
    const mainPage = "https://www.rahulshettyacademy.com/client/";
    const loginEndpoint = "auth/login";
    const dashEndpoint = "dashboard/dash";
    const title = "Let's Shop";
    
    // navigate to specific page
    await page.goto(mainPage);

    await userEmailLocator.type(mail);
    await passwordLocator.type(password);

    await expect(page).toHaveURL(mainPage + loginEndpoint);

    // click on login button
    await loginLocator.click()

    // load until data are loaded (card titles from API):
    // "networkidle" - when all API calls are successfully completed:
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveTitle(title);

    await expect(page).toHaveURL(mainPage + dashEndpoint);

    }
);