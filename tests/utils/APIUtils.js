class APIUtils 
{

    constructor(apiContext, userPayload) 
    {
        this.apiContext = apiContext;
        this.userPayload = userPayload;
        this.orderPayload = orderPayload;

    }

    async getToken() 
    {
        // call login POST with correct endpoint and payload
        const loginResponse = await this.apiContext.post(loginUrl, {
            data:this.userPayload
            }
        )

        // grab token from response
        const loginResponseJson = await loginResponse.json();
        token = await loginResponseJson.token;
        return token;
    }

    async createOrder(orderPayload) 
    {
        const orderResponse = await this.apiContext.post(orderUrl, {
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

        return orderID;

    }
}

// this makes visible these methods to all files:
module.exports = {APIUtils};