const {test, expect, request} = require("@playwright/test");

const loginUrl = "https://www.rahulshettyacademy.com/api/ecom/auth/login";
const userPayload = {userEmail:"tomastest@test.org",userPassword:"Test1234"};

// Login automatically via API
test.beforeAll( async() => {

    // firstly start with new context using request
    const apiContext = await request.newContext();

    // call login POST with correct endpoint and payload
    const loginResponse = await apiContext.post(loginUrl, {
        data:userPayload
        }
    )

    // check if successful status returned:
    expect(loginResponse.ok()).toBeTruthy();

    // grab token from response
    const loginResponseJson = await loginResponse.json();
    const token = await loginResponseJson.token;
    const statusCode = await loginResponse.status();

    console.log(token);

    // expect if status is 200
    expect(statusCode).toEqual(200);
    }
);

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