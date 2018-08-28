# Commute Easy

A scalable, adaptable and cashless platform to find and book multimodal transit.

### Architecture

The app is a `sails` project which serves server side rendered views. It consists of the following modules

1. **Controllers**: Business logic of the app which performs all the requested actions.
2. **Services**: Helper functions to interact with external services. External service responses are mocked.
3. **Policies**: Verify user access and authorization for various actions.
4. **Models**: ORM for persistent storage of data. Currently, stores data on the `disk` but can easily be swapped with any database by using appropriate `waterline` adapters.
5. It uses `sails.io.js` to maintain a persistent websocket connection to allow realtime interaction.

### Installation

To setup locally, you need `node >= v6.11.3` and `npm >= v3.0.0`. Clone the repository and `cd` into the folder. Run the following steps

```
npm install

node app.js
```

This start a server on port `1337`. Open `localhost:1337` in your browser to access the app.

**Note**: The payment flow will not work until you provide a Razorpay `key` and `secret`. Create an account on Razorpay, activate a test plan and paste the keys in `config/local.js`. Your `local.js` should like this


```javascript
module.exports = {

  //...

  razorpay: {
    pk: '<key here>',
    secret: '<secret here>'
  }

};
```


