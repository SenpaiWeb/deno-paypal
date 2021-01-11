# Paypal Client for Deno
As I've seen so far, I've found no paypal client for Deno and attempted to create my own module. I've been dying from the insides while trying to work with their API documentation for a project, so here is my  attempt to help you to keep your sanity.

# Usage
First, import and instantiate the client with your personal paypal account, if you don't know where to find your client id and client secret, go to https://developer.paypal.com/developer/applications/ and create an application

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
