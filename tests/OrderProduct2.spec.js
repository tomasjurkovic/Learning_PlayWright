const {test, expect} = require("@playwright/test");

test.only('RahulShetty eshop order product end to end test', async ({page}) => {

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

    // check text titles:
    const productName = 'zara coat 3';
    const products = await page.locator(".card-body");
    const titles = await page.locator(".card-body b").allTextContents();
    const cartButton = page.locator("[routerlink*='cart']");
    const numberOfItems = cartButton.locator('label');
    const checkoutButton = page.locator("text=Checkout");
    const countrySelector = page.locator("[placeholder*='Country']");

    // dynamically select specified product
    const count = await products.count();
    for(let i = 0; i < count; ++i) {
        if (await products.nth(i).locator("b").textContent() === productName) {
            // add product to cart (click on add to cart button)
            products.nth(i).locator("text= Add To Cart").click();
            break;
            }
        }
        
    // check if no product is in Cart yet
    await expect(numberOfItems).toHaveText('1');

    // go to cart page:
    await cartButton.click();

    // wait for it loads (first list item):
    await page.locator("div li").first().waitFor();

    // check if currently selected product is located in cart:

    // this will find only for elements which has h3 tag:
    const addedProduct = await page.locator("h3:has-text('"+productName+"')").isVisible();
    expect(addedProduct).toBeTruthy();    

    // click on checkout button to move to payment method
    checkoutButton.click();

    // select correct country (f.e. India):
    // use slow typing to open dropdown:
    await countrySelector.type("India", {delay:100});
    const countryDropdownIndia = page.locator(".ta-results button:last-child");

    // wait for suggestions show up:
    const dropdown = page.locator('.ta-results');
    await dropdown.waitFor();

    // Select India from these suggestions:      
    await countryDropdownIndia.click();
     
    // check if mail is correctly inserted:
    await expect(page.locator(".user__name label")).toHaveText(mail);
    // click on submit button
    await page.locator(".action__submit").click();

    const thankYouMessage = page.locator(".hero-primary");
    await expect(thankYouMessage).toHaveText(" Thankyou for the order. ");

    // extract orderId to use it for find order in order history page
    const orderId = await page.locator(".em-spacer-1 .ng-star-inserted").textContent();
    const orderIdSliced = orderId.slice(3, -3);
    const historyEndpoint = "dashboard/myorders";

    // click on order history page
    await page.locator('text=Orders History Page').click();

    // check url
    await expect(page).toHaveURL(mainPage + historyEndpoint);

    // usually it fails while table is fully loaded and wait for elements did not do its job
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
    await delay(1000);

    const tbRows = await page.locator("tbody tr");
    
    // click on correct order (actual one)
    for (let i = 1; i <= await tbRows.count(); i++) {
        if (await page.locator("tbody tr:nth-child("+i+") th").textContent() === orderIdSliced) 
        {
            await page.locator("tbody tr:nth-child("+i+") td .btn-primary").click();
            break;
        }
    }

    // check if correct URL is displayed (for correct orderId)
    const orderDetailEndpoint = "dashboard/order-details/" + orderIdSliced;
    await expect(page).toHaveURL(mainPage + orderDetailEndpoint);


    }
);