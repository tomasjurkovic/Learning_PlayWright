class APIUtils 
{

    constructor(apiContext, loginPayload) 
    {
        this.apiContext = apiContext;
        this.loginPayload = loginPayload;
    }

    async getToken() 
    {
        // call login POST with correct endpoint and payload
        const loginResponse = await apiContext.post(loginUrl, {
            data:this.userPayload
            }
        )

        // check if successful status returned:
        expect(loginResponse.ok()).toBeTruthy();

        // grab token from response
        const loginResponseJson = await loginResponse.json();
        token = await loginResponseJson.token;
        const statusCode = await loginResponse.status();

        return token;
    }

    async createOrder(orderPayload) 
    {
        const orderResponse = await apiContext.post(orderUrl, {
            data: orderPayload,
            headers: 
                {
                    'Authorization': this.getToken(),
                    'Content-Type': contentType,
                }
            }
        );

        // extract order id from response:
        const orderResponseJson = await orderResponse.json();
        orderID = await orderResponseJson.orders[0];

        // expect if status is 201
        const statusCode = await orderResponse.status();

        return orderID;

    }
}