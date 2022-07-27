const {test, expect} = require("@playwright/test");

test.only('Popup validations test', async ({page}) => {

    // consts:
    const baseUrl = "https://www.rahulshettyacademy.com/AutomationPractice/";
    const secondUrl = "https://www.google.com";
    
    // navigate to main page:
    await page.goto(baseUrl);
    
    // go to second URL
    await page.goto(secondUrl);

    // check if correct URL is displayed:
    await expect(page).toHaveURL(secondUrl);

    // go back to previous URL
    await page.goBack();

    // check if correct URL is displayed:
    await expect(page).toHaveURL(baseUrl);

    // go back to second URL
    await page.goForward();

    // check if correct URL is displayed:
    await expect(page).toHaveURL(secondUrl);
    }
);