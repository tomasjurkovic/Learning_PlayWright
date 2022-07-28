const {test, expect} = require("@playwright/test");

    // consts:
    const baseUrl = "https://www.rahulshettyacademy.com/AutomationPractice/";
    const secondUrl = "https://www.google.com";
    const topEndpoint = "#top";

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

test('Visible/hidden validation test', async ({page}) => {

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

test('Popup validation test', async ({page}) => {

    // navigate to main page:
    await page.goto(baseUrl);

    // click on allert button:
    await page.locator("#alertbtn").click();

    // when dialog window appears click on 'OK' button:
    page.on('dialog', dialog => dialog.accept());
    await page.locator("#confirmbtn").click();

    // click on allert button:
    await page.locator("#alertbtn").click();

    // when dialog window appears click on 'Cancel' button:
    page.on('dialog', dialog => dialog.dismiss());
    }
);

test('Hover validation test', async ({page}) => {

    // navigate to main page:
    await page.goto(baseUrl);

    // check if there are two hidden elements (Top and Reload):
    await expect(page.locator("text=Top")).toBeHidden();
    await expect(page.locator("text=Reload")).toBeHidden();

    // hover over element
    await page.locator("#mousehover").hover();

    // check if there are two elements in dropdown (Top and Reload):
    await expect(page.locator("text=Top")).toBeVisible();
    await expect(page.locator("text=Reload")).toBeVisible();

    // click on 'top' option from dropdown shown after hover
    await page.locator('text=Top').click();

    // check if URL changed
    expect(page).toHaveURL(baseUrl + topEndpoint);
    }
);

test('Multiple frames validation test', async ({page}) => {
    // this is needed only when multiple frames are on page 

    // navigate to main page:
    await page.goto(baseUrl);

    // it needs to be scroll down:
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // firstly it needs to be framesPage created and stored to variable like this:
    const framesPage = page.frameLocator("#courses-iframe");

    // parse some text and check if it is correct:
    const textCheck = await framesPage.locator("div[class='container-fluid'] h2 span:nth-child(1)").textContent();
    const secondWord = textCheck.split(" ")[1];
    expect(secondWord).toEqual('Academy');

    // expect(await textCheck.split(" ")[3]).toEqual("Learn");

    // this will click on element which is located in the another frame on the website
    // I used :visible because of there are two elements, but only on is visible
    await framesPage.locator("li a[href*='lifetime-access']:visible").click();
    }
);