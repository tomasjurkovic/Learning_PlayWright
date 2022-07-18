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



test.only('RahulShetty login page correct register and login scenario', async ({page}) => {

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

    await singUpSecondLocator.click();

    // check if coprrect user is logged in:
    await expect(page.locator(".navbar-current-user")).toContainText(user);

    // check first card's title:
    await expect(page.locator("div[title='All-Access Membership']")).toContainText(cardTitle);

    // check page's url link
    await expect(page).toHaveURL(urlLink);

    }
);

test('Google page title PlayWright test', async ({page}) => {
    
    // navigate to specific page
    await page.goto("https://www.google.com");

    // check title
    const pageTitle = "Google";
    console.log(await page.title());

    // put assertion
    await expect(page).toHaveTitle(pageTitle);

    }
);