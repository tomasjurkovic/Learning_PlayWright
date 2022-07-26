const {test, expect} = require("@playwright/test");

test.only('RahulShetty eshop order product end to end test', async ({page}) => {

    const firstNameLocator = page.locator("#firstName");
    const lastNameLocator = page.locator("#lastName");
    const userMobileLocator = page.locator("#userMobile");
    const userEmailLocator = page.locator("#userEmail");
    const passwordLocator = page.locator("#userPassword");
    const confirmPasswordLocator = page.locator("#confirmPassword");
    const header = "Register";
    const firstName = "Tomas";
    const lastName = "Jurkovic";
    const phone = "9909909909"
    let random = (Math.random() + 1).toString(36).substring(7);
    const mail = random + "tomas.jurkovic@rsa.com";
    const password = "5tr0NgP@$$w()R|)";
    const registerLocator = page.locator(".text-reset");
    const registerSecondLocator = page.locator("#login");
    const mainPage = "https://www.rahulshettyacademy.com/client/";
    const registerEndpoint = "auth/register";
    const loginEndpoint = "auth/login";
    const dashEndpoint = "dashboard/dash";
    const cartEndpoint = "dashboard/cart";
    const title = "Let's Shop";
    
    // navigate to specific page
    await page.goto(mainPage);

    await registerLocator.click();

    // check page's url link
    await expect(page).toHaveURL(mainPage + registerEndpoint);

    // chech if user is redirected to correct website
    await expect(page.locator(".login-title")).toContainText(header);

    await firstNameLocator.type(firstName);
    await lastNameLocator.type(lastName);
    await userEmailLocator.type(mail);
    await userMobileLocator.type(phone);
    await passwordLocator.type(password);
    await confirmPasswordLocator.type(password);

    // mark more than 18 years old checkbox:
    await page.locator("input[type='checkbox']").check()

    await registerSecondLocator.click();

    // check if success message appears successfully:
    await expect(page.locator(".headcolor")).toContainText("Account Created Successfully");

    await page.locator(".btn-primary").click()

    await userEmailLocator.type(mail);
    await passwordLocator.type(password);

    await expect(page).toHaveURL(mainPage + loginEndpoint);

    // click on login button
    await page.locator("#login").click()

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

        const orderId = await page.locator(".em-spacer-1 .ng-star-inserted").textContent();
        const orderIdSliced = orderId.slice(3, -3);

        await page.pause();
    }
);