const {test, expect} = require("@playwright/test");

test('RahulShetty login page title scenario', async ({browser}) => {
    
    // chrome - without plugins/cookie - everything is freshly open and possible to setup

    // new browser instance opens
    const context = await browser.newContext();

    // new page opens in browser
    const page = await context.newPage();

    // navigate to specific page
    await page.goto("https://www.rahulshettyacademy.com/loginpagePractise/");

    // check title
    const pageTitle = "LoginPage Practise | Rahul Shetty Academy";
    console.log(await page.title());

    // put assertion
    await expect(page).toHaveTitle(pageTitle);
    }
);

test('RahulShetty login page in/correct login scenario', async ({page}) => {

    const userNameLocator = page.locator("#username");
    const passwordLocator = page.locator("#password");
    const signInLocator = page.locator("#signInBtn");
    
    // navigate to specific page
    await page.goto("https://www.rahulshettyacademy.com/loginpagePractise/");

    // fill all fields on Login Page:
    await userNameLocator.type("rahulshetty");
    await passwordLocator.type("learning");
    await signInLocator.click();
    
    // check error message
    const errorMessageText = "Incorrect username/password.";
    await page.locator("[style*='block']").textContent();
    await expect(page.locator("[style*='block']")).toContainText(errorMessageText);
    
    await userNameLocator.fill("");
    await passwordLocator.fill("");

    // fill all fields on Login Page:
    await userNameLocator.type("rahulshettyacademy");
    await passwordLocator.type("learning");
    await signInLocator.click();
    
    // check- page's title and url
    const pageTitle = "ProtoCommerce";
    const urlLink = "https://rahulshettyacademy.com/angularpractice/shop";
    await expect(page).toHaveTitle(pageTitle);
    await expect(page).toHaveURL(urlLink);

    const cardTitles = page.locator(".card-body a");
    const titlesArray = [ 'iphone X', 'Samsung Note 8', 'Nokia Edge', 'Blackberry' ];

    console.log(await cardTitles.first().textContent());
    const allTitles = await cardTitles.allTextContents(); 

    // check if card titles on page equals to those one in array
    await expect(allTitles).toEqual(titlesArray);

    }
);



test('RahulShetty login page correct register scenario - diff. page', async ({page}) => {

    const userNameLocator = page.locator("#user_name");
    const userEmailLocator = page.locator("#user_email");
    const passwordLocator = page.locator("#password");
    const singUpHeader = "Sign Up";
    const user = "Tomas Jurkovic";
    let random = (Math.random() + 1).toString(36).substring(7);
    const mail = random + "tomas.jurkovic@rsa.com";
    const password = "5tr0NgP@$$w()R|)";
    const signUpLocator = page.locator("div[class='login-btn'] a[class='theme-btn']");
    const singUpSecondLocator = page.locator("input[value='Sign up']");
    const urlLink = "https://courses.rahulshettyacademy.com/";
    const cardTitle = "All-Access Membership";
    
    // navigate to specific page
    await page.goto("https://rahulshettyacademy.com/practice-project");

    await signUpLocator.click();

    // chech if user is redirected to correct website
    await expect(page.locator(".heading3")).toContainText(singUpHeader);

    await userNameLocator.type(user);
    // mail must be uniqe...
    await userEmailLocator.type(mail);
    await passwordLocator.type(password);

    // navigation happens after the click, so this causes Playwright waits for it:
    await Promise.all(
        [
            page.waitForNavigation(),
            singUpSecondLocator.click(),        
        ]
    )

    // check if coprrect user is logged in:
    await expect(page.locator(".navbar-current-user")).toContainText(user);

    // check first card's title:
    await expect(page.locator("div[title='All-Access Membership']")).toContainText(cardTitle);

    // check page's url link
    await expect(page).toHaveURL(urlLink);

    }
);

test('RahulShetty login page correct register and login scenario', async ({page}) => {

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
    const title = "Let's Shop";
    const titlesArray = ["zara coat 3", "adidas original", "iphone 13 pro"];
    
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
    expect(cardTitles).toEqual(titlesArray);
    }
);

test('UI Controls test', async ({page}) => {
    
    const userNameLocator = page.locator("#username");
    const passwordLocator = page.locator("#password");
    const signInLocator = page.locator("#signInBtn");
    const dropdownSelector = page.locator("select.form-control");
    const okayBtn = page.locator("#okayBtn");
    const termsCheckbox = page.locator("#terms");
    const blinkTextLoc = page.locator("[href*='documents-request']");

    // navigate to specific page
    await page.goto("https://www.rahulshettyacademy.com/loginpagePractise/");

    // fill all fields on Login Page:
    await userNameLocator.type("rahulshettyacademy");
    await passwordLocator.type("learning");

    // select 'Consultant' option from dropdown:
    await dropdownSelector.selectOption("consult");

    // check if 'admin' option in radio button is selected by default:
    await expect(page.locator(".radiotextsty").nth(0)).toBeChecked();

    // check that other option 'user' is not checked:
    expect(await page.locator(".radiotextsty").nth(1).isChecked()).toEqual(false);

    // select 'User' from radio button:
    await page.locator(".radiotextsty").nth(1).click();

    // popup jumps out, so clicking on ok button
    await okayBtn.click();

    // check if user is selected in radio button:
    await expect(page.locator(".radiotextsty").nth(1)).toBeChecked();

    // check that admin is not checked anymore
    expect(await page.locator(".radiotextsty").nth(0).isChecked()).toEqual(false);

    // click agree with terms:
    await termsCheckbox.click();

    // assert if checkbox is checked:
    expect(termsCheckbox).toBeChecked();

    // uncheck it:
    await termsCheckbox.uncheck();

    // it will let the window open for check 
    // await page.pause();

    // check if checkbox is now not checked
    expect(await page.locator("#terms").isChecked()).toBeFalsy();

    await expect(blinkTextLoc).toHaveAttribute('class', 'blinkingText');
    await expect(page.locator('.blinkingText')).toHaveCSS('animation', '1s linear 0s infinite normal none running blink');

    await signInLocator.click();
    }
);

test.only('Child windows handle test', async ({browser}) => {

    // firstly we have to start from new browser and then open new page if we want to test child windows:
    // new browser instance opens
    const context = await browser.newContext();

    // new page opens in browser
    const page = await context.newPage();

    const blinkTextLoc = page.locator("[href*='documents-request']");
    const textOnNewPage = "Please email us at mentor@rahulshettyacademy.com with below template to receive response ";

    // navigate to specific page
    await page.goto("https://www.rahulshettyacademy.com/loginpagePractise/");

    // wait for event of opening new page:
    // new page will be open after clicking on that link, so we have to wait for it:
    // newPage must be in brackets
    // if multiple pages are going to be open during one test, use this:
    // const [newPage, newPage2] = await Promise.all([ ... and so on
    const [newPage] = await Promise.all([
        context.waitForEvent('page'),
        await blinkTextLoc.click(),
        ]
    )

    // example of assertion on new page that opens during test case:
    const textFromNewPage = await newPage.locator(".red").textContent();
    expect(textFromNewPage).toEqual(textOnNewPage);

    // extract username from the whole text:
    const arrayText = textFromNewPage.split('@');
    const domain = arrayText[1].split(" ")[0];
    console.log(domain);

    // use this email to login on previous page:
    const userNameLocator = page.locator("#username");
    const passwordLocator = page.locator("#password");
    const signInLocator = page.locator("#signInBtn");

    // fill all fields on Login Page:
    await userNameLocator.type(domain);
    await passwordLocator.type("learning");
    await signInLocator.click();

    // // check page's title and url
    const pageTitle = "LoginPage Practise | Rahul Shetty Academy";

    // the credentials are wrong so we stays on the same page, 
    // it is just a example of moving from one page to another (not correct login test)
    await expect(page).toHaveTitle(pageTitle);
    }
);