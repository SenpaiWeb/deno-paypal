interface AccessToken {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface ClientParameters {
  id: string;
  secret: string;
}

interface ClientSettings {
  client: ClientParameters;
  sandbox?: boolean;
  currency?: string;
}

export class PaypalClient {
  client_id: string;
  client_secret: string;
  auth?: AccessToken;
  sandbox: boolean;
  currency?: string;

  /**
   * Paypal client constructor
   */
  constructor(settings: ClientSettings) {
    this.sandbox = settings.sandbox || false;
    this.client_id = settings.client.id
    this.client_secret = settings.client.secret
    this.auth = undefined
    
    this.currency = settings.currency ? settings.currency.toUpperCase() : 'USD';
  }

  async request(path: string, method: string, headers?: HeadersInit, body?: string): Promise<Response> {
    const BASE_URI = this.sandbox ? 'https://api.sandbox.paypal.com' : 'https://api.paypal.com';
    let params: RequestInit = {}
    params.method = method.toUpperCase() || "GET"
    params.headers = headers
    params.body = body
    return await fetch(BASE_URI + path, params);
  }

  async createOrder(price: number) {
    if(!this.auth) throw new Error('Please authenticate first, to authenticate just use PaypalClient#authenticate function.')
    const json = {
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: this.currency,
          value: price
        }
      }]
    }
    const order = await this.request('/v2/checkout/orders/', 'post', {
      Authorization: `${this.auth.token_type} ${this.auth.access_token}`,
      'Content-Type': 'application/json'
    }, JSON.stringify(json)).then(r => r.json())

    if(order.error) throw new Error(order.error)
    
    return order
  }

  async capture(orderId: string) {
    if(!this.auth) throw new Error('Please authenticate first, to authenticate just use PaypalClient#authenticate function.')
    const capture = await this.request(`/v2/checkout/orders/${orderId}/capture`, 'post', {
      Accept: 'application/json',
      Authorization: `${this.auth.token_type} ${this.auth.access_token}`,
      'Content-Type': 'application/json'
    }).then(res => res.json())

    if(capture.error) throw new Error(capture.error)

    return capture
  }

  async authenticate() {
    if(this.auth && this.auth.access_token) return this.auth.access_token
    if(!this.client_id || !this.client_secret) throw new Error('Client ID and/or Client Secret is not provided.')
    const basicAuth = btoa(`${this.client_id}:${this.client_secret}`)
    const auth = await this.request('/v1/oauth2/token/', 'post', {
      Accept: 'application/json',
      Authorization: `Basic ${basicAuth}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    }, 'grant_type=client_credentials').then(r => r.json()).catch(() => {
      throw new Error('Client ID and/or Client Secret provided is invalid.')
    })

    this.auth = auth
  }
}
