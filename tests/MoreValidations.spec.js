const {test, expect} = require("@playwright/test");

    // consts:
    const baseUrl = "https://www.rahulshettyacademy.com/AutomationPractice/";
    const secondUrl = "https://www.google.com";

test('Page navigation test', async ({page}) => {
    
    // navigate to main page:
    await page.goto(baseUrl);

    // check if displayed-text is visible
    await expect(page.locator("#displayed-text")).toBeVisible();
    
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

test.only('Popup validation test', async ({page}) => {

    // navigate to main page:
    await page.goto(baseUrl);

    // check if displayed-text is visible
    await expect(page.locator("#displayed-text")).toBeVisible();

    // click on hide button:
    await page.locator("#hide-textbox").click();

    // check if displayed-text is visible
    await expect(page.locator("#displayed-text")).toBeHidden();

    // click on hide button:
    await page.locator("#show-textbox").click();

    // check if displayed-text is visible
    await expect(page.locator("#displayed-text")).toBeVisible();
    }
);