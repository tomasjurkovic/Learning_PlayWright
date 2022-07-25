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
    const cardTitles = await page.locator(".card-body b").allTextContents();

    const product = await page.locator(".card-body b").nth(1).textContent();
    const price = await page.locator(".card-body").nth(1).locator('.text-muted').textContent();
    const addToCard = await page.locator(".card-body").nth(1).locator(".btn.w-10");
    const cardButton = await page.locator(".btn[routerlink='/dashboard/cart']");
    const numberOfItems = await cardButton.locator('label');

    // check if no product is in Cart yet
    await expect(cardButton).toHaveText('Cart ');
    await expect(numberOfItems).toHaveText('');

    // add selected product to cart:
    await addToCard.click()

    // check if no product is in Cart yet
    await expect(numberOfItems).toHaveText('1');

    // click on 'Cart' button
    await cardButton.click();

    // verify if user is redirected to correct URL:
    await expect(page).toHaveURL(mainPage + cartEndpoint);

    // get item number:
    const itemNumber = await page.locator("div[class='cartSection'] .itemNumber").textContent();

    const priceInCart = page.locator("div[class='prodTotal cartSection'] p");
    const productInCart = page.locator("div[class='cartSection'] h3");
    const subtotal = page.locator(".totalRow:first-child span[class$='value']");
    const total = page.locator(".totalRow:nth-child(2) span[class$='value']");
    const buyButton = page.locator("div[class='cartSection removeWrap'] button[class='btn btn-primary']");

    // check if prices and product name are correct
    expect(await priceInCart.textContent()).toEqual(price);
    expect(await productInCart.textContent()).toEqual(product);
    expect(await subtotal.textContent()).toEqual(price.split(" ").join(""));
    expect(await total.textContent()).toEqual(price.split(" ").join(""));

    // click on buy now button
    await buyButton.click();

    const priceOrderSelector = page.locator("div[class$='item__price']");
    const productOrderSelector = page.locator("div[class='item__description'] li");
    const emailSelector = page.locator(".details__user label");
    const countrySelector = page.locator(".details__user input:last-child");
    const country = "India";
    const cardNumberSelector = page.locator(".form__cc > .row:first-child input[type$='text']");
    const cardNumberInserted = "4542 9931 9292 2293";
    const quantitySelector = page.locator(".item__quantity");
    const quantityOne = " Quantity: 1 "
    const couponInput = page.locator("input[name='coupon']");
    const coupon = 'rahulshettyacademy';
    const applyCouponButton = page.locator("button[type$='submit']");
    const placeOrderButton = page.locator('text=Place Order');
    const appliedCouponInfo = page.locator("p[class$='mt-1 ng-star-inserted']");

    // check if quantity is 1, price and selected product is correct:
    await productOrderSelector.textContent();
    expect(await productOrderSelector.textContent()).toEqual(product.toLowerCase());
    expect(await priceOrderSelector.textContent()).toEqual(' ' + price + ' ');
    expect(await quantitySelector.textContent()).toEqual(quantityOne);
    expect(await cardNumberSelector).toHaveAttribute('value', cardNumberInserted);
    expect(await emailSelector.textContent()).toEqual(mail);

    // insert coupon (rahulshettyacademy):
    await couponInput.type(coupon);

    // Select country (India):
    await countrySelector.selectOption(country);

    // apply coupon:
    await applyCouponButton.dblclick();

    // check if message appears
    expect(await appliedCouponInfo.textContent()).toEqual("* Coupon Applied");

    // click on 'Place Order' button:
    await placeOrderButton.dblclick({ force: true }); 

    // locators on thank you page:
    const thankYouMessage = page.locator(".hero-primary").textContent();
    const orderId = page.locator("label[class='ng-star-inserted']").textContent();
    const priceTH = page.locator("td[class='line-item product-info-column m-3'] div[class='title']").textContent();
    const productTH = page.locator("td[class='line-item product-info-column'] div[class='title']").textContent();
    const quantityTH = page.locator("td[class='line-item product-info-column m-3'] div[class='sub']").textContent();
    const orderHistoryLink = page.locator("label[routerlink='/dashboard/myorders']");

    await console.log(thankYouMessage);
    await console.log(priceTH);
    await console.log(productTH);
    await console.log(quantityTH);
    await console.log(orderId);

    await page.pause();

    // check if correct message appears
    expect(await thankYouMessage).toEqual(" Thankyou for the order. ");

    // check if quantity is correct
    expect(await quantityTH).toEqual("Qty: 1");

    // check if price is correct
    expect(await priceTH).toEqual(price);

    // check if product name is correct
    expect(await productTH).toEqual(product);

    // check if order number is correct

    // click on 'Order History' link:
    await orderHistoryLink.click();

    }
);
