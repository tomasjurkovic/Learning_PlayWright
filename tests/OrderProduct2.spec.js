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
    const productName = 'Zara Coat 3';
    const products = await page.locator(".card-body b");
    const titles = await page.locator(".card-body b").allTextContents();

    // dynamically select specified product
    const count = products.count();
    for(let i = 0; i < count; ++i) {
        if (await products.nth(i).locator('b').textContent() === productName) {
            // add product to cart (click on add to cart button)
            products.nth(i).locator("text= Add To Cart").click();
            break;
        }
    }

    await page.pause();

    // const product = await page.locator(".card-body b").nth(1).textContent();
    // const price = await page.locator(".card-body").nth(1).locator('.text-muted').textContent();
    // const addToCard = await page.locator(".card-body").nth(1).locator(".btn.w-10");
    // const cardButton = await page.locator(".btn[routerlink='/dashboard/cart']");
    // const numberOfItems = await cardButton.locator('label');

    // // check if no product is in Cart yet
    // await expect(cardButton).toHaveText('Cart ');
    // await expect(numberOfItems).toHaveText('');

    // // add selected product to cart:
    // await addToCard.click()

    }
);
