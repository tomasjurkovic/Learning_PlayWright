const {test, expect, request} = require("@playwright/test");

const loginUrl = "https://www.rahulshettyacademy.com/api/ecom/auth/login";
const userPayload = {userEmail:"tomastest@test.org",userPassword:"Test1234"};
let token;

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
    token = await loginResponseJson.token;
    const statusCode = await loginResponse.status();

    // expect if status is 200
    expect(statusCode).toEqual(200);
    }
);

test.only('Client app login test', async ({page}) => {

    // here can be inserted javascript:
    page.addInitScript(value => {
        window.localStorage.setItem('token', value);
    }, token );

    const mainPage = "https://www.rahulshettyacademy.com/client/";
    const dashEndpoint = "dashboard/dash";
    const title = "Let's Shop";
    
    // navigate to specific page
    await page.goto(mainPage);

    // verify if main page with dashboard appears (no login page because of added token):
    await expect(page).toHaveURL(mainPage + dashEndpoint);

    // check it's title:
    await expect(page).toHaveTitle(title);
    }
);