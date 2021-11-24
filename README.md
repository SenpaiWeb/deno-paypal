# Paypal Client
A paypal API wrapper written using TypeScript for [deno](https://deno.land/).

This library provides an higher-level request chaining yet is still in its alpha state for the moment.
Subscriptions support may be added for the next stage of production.


# Usage
First, import and instantiate the client with your personal paypal account, if you don't know where to find your client id and client secret, go to https://developer.paypal.com/developer/applications/ and create a sandbox application

As it is not recommended to paste them into your program in clear text, please properly store them in a .env file in the root folder of your Deno application to access it.

After what, here is a basic example to get authenticated

```typescript
import {
  PaypalClient
} from 'https://deno.land/x/gh:senpaiweb:deno-paypal';

const paypal = new PaypalClient({
  client: {
    id: '<YOUR_CLIENT_ID_HERE>',
    secret: '<YOUR_CLIENT_SECRET_HERE>'
  },
  sandbox: true
});

await paypal.authenticate();
```

Here is a basic example to create an order, assuming the above code is already present in our code

```typescript
const price_product = 5.25;

const { id, status } = await paypal.createOrder(price_product);

console.log(order.status);
// CREATED
```

And as well, an example to capture the above order and check if the payment has been completed. Once again, assuming the above code is present in your code
```typescript
const { status } = await paypal.capture(id);

console.log(status);
// COMPLETED

if(status == "COMPLETED") {
  // transaction has been accepted logic
}
else {
  // transaction hasn't been accepted yet
}
```
