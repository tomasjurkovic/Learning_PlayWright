const {test, expect, request} = require("@playwright/test");
const {APIUtils} = require('./utils/APIUtils');
const orderPayload = {orders:[{country:"Cuba",productOrderedId:"6262e9d9e26b7e1a10e89c04"}]};
const userPayload = {userEmail:"tomastest@test.org",userPassword:"Test1234"};

const loginUrl = "https://www.rahulshettyacademy.com/api/ecom/auth/login";
let token;
let orderID;
const mainPage = "https://www.rahulshettyacademy.com/client/";
const dashEndpoint = "dashboard/dash";
const title = "Let's Shop";
const orderUrl = "https://www.rahulshettyacademy.com/api/ecom/order/create-order";
const contentType = "application/json";


// Login automatically via API
test.beforeAll( async() => {

    // firstly start with new context using request
    const apiContext = await request.newContext();
    const apiUtils = new APIUtils(apiContext, userPayload);
    apiUtils.createOrder(orderPayload);
    
    }
);

test('Client app login test', async ({page}) => {

    const apiUtils = new APIUtils(apiContext. userPayload);

    // here can be inserted javascript:
    page.addInitScript(value => {
        window.localStorage.setItem('token', value);
    }, token );

    // navigate to specific page
    await page.goto(mainPage);

    // verify if main page with dashboard appears (no login page because of added token):
    await expect(page).toHaveURL(mainPage + dashEndpoint);

    // check it's title:
    await expect(page).toHaveTitle(title);
    }
);

test.only('Order via API test', async ({page}) => {

    // create order via API:
    // authorization is made in header for this API
    const apiUtils = new APIUtils(apiContext, userPayload);
    const orderId = createOrder(orderPayload);

    // verify if order is created in history page:
    // precondition - created order (through API) -> check order history page
    page.addInitScript(value => {
        window.localStorage.setItem('token', value);
    }, token );

    // use post method with token autorization s
    const orderResponse = await apiContext.post(orderUrl, {
        data: orderPayload,
        headers: 
            {
                'Authorization': token,
                'Content-Type': contentType,
            }
        }
    );

    // extract order id from response:
    const orderResponseJson = await orderResponse.json();
    orderID = await orderResponseJson.orders[0];

    // expect if status is 201
    const statusCode = await orderResponse.status();
    expect(statusCode).toEqual(201);

    await page.goto(mainPage);

    // verify if order is located in history page:
    await page.locator("button[routerlink*='myorders']").click();

    // usually it fails while table is fully loaded and wait for elements did not do its job
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
       await delay(1000);
   
    const tbRows = await page.locator("tbody tr");
       
    // click on correct order (actual one)
       for (let i = 1; i <= await tbRows.count(); i++) {
        if (await page.locator("tbody tr:nth-child("+i+") th").textContent() === orderID) 
        {
           await page.locator("tbody tr:nth-child("+i+") td .btn-primary").click();
               break;
       }
    }

    // check if correct URL is displayed (for correct orderId)
    const orderDetailEndpoint = "dashboard/order-details/" + orderID;
    await expect(page).toHaveURL(mainPage + orderDetailEndpoint);
   
    // check if details are correct:
    const orderIdDetails = await page.locator(".-main").textContent(); 
    const emailDetails = await page.locator("div:nth-child(1) > div:nth-child(1) > p:nth-child(2)").textContent(); 
    const productDetails = await page.locator(".title").textContent(); 
    const countryDetails = await page.locator("div:nth-child(1) > div:nth-child(1) > p:nth-child(3)").textContent(); 
    const priceDetails = await page.locator(".price").textContent(); 
   
    // let's check all values:
    expect(await orderIdDetails).toEqual(orderID);
    expect(await emailDetails).toEqual(' tomastest@test.org ');
    expect(await countryDetails).toEqual(" Country - Cuba ");
    expect(await productDetails).toEqual(' iphone 13 pro ');
    expect(await priceDetails).toEqual(" $ 231500 ");
    }
);