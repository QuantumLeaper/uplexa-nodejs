# uplexa-nodejs

A Node.js wallet manager for interacting with `uplexa-wallet-rpc`.

For more information about uPlexa, visit: https://uplexa.com

## Install the package

### via NPM

```
npm install uplexa-nodejs
```

### Or clone the Github repository

```
git clone https://github.com/uplexa/uplexa-nodejs.git
```

## Initializing a wallet

Require the module:

```
var uplexaWallet = require('uplexa-nodejs');
```

Create a new instance of the wallet:

```
var Wallet = new uplexaWallet();
```

This creates a wallet using the following simplewallet default RPC settings:

* `hostname` - '127.0.0.1'
* `port` - 21065

To connect to a wallet with different settings, pass in the values:

```
var Wallet = new uplexaWallet($HOSTNAME, $PORT);
```

**Note: versions of uplexa-nodejs prior to 3.0 require `hostname` with the 'http://' prefix, 3.0 and greater only require the IP address.**

## Testing

Some basic tests can now be run locally to verify the library and your simplewallet instance are communicating. The tests assume simplewallet will be listening at the default config settings. Tests are run via mocha.
To run the tests, clone the repository and then:

npm install
npm test

## Example Usage

    Wallet.balance().then(function(balance) {
        console.log(balance);
    });

## Wallet Methods

### create_wallet

Usage:

```
Wallet.create_wallet('uplexa_wallet', '', 'English');
```

Creates a new wallet.

Parameters:

* `filename` - filename of wallet to create (_string_)
* `password` - wallet password (_string_)
* `language` - language to use for mnemonic phrase (_string_)

Example response:

```
{}
```

Returns an object with `error` field if unsuccessful.

### open_walllet

Usage:

```
Wallet.open_wallet('uplexa_wallet', '');
```

Opens a wallet.

Parameters:

* `filename` - filename of wallet to open (_string_)
* `password` -wallet password (_string_)

Example response:

```
{}
```

Returns an object with `error` field if unsuccessful.

### balance

Usage:

```
Wallet.balance();
```

Responds with the current balance and unlocked (spendable) balance of the wallet in atomic units. Divide by 1e12 to convert.

Example response:

```
{ balance: 3611980142579999, unlocked_balance: 3611980142579999 }
```

### address

Usage:

```
Wallet.address();
```

Responds with the uPlexa address of the wallet.

Example response:

```
{ address: 'UPX1ffK8ybGjhjQXReRxLDKPRBrsjXEzLcLGuHQZdmCBMd95K6PULopLLafQZf1MCCQoqf8mFEcnvhbP8n5SXtkN4F9Q3jN3Ru' }
```

### transfer

Usage:

```
Wallet.transfer(destinations, options);
```

Transfers uPlexa to a single recipient OR a group of recipients in a single transaction. Responds with the transaction hash of the payment.

Parameters:

* `destinations` - an object OR an array of objects in the following format: `{amount: (*number*), address: (*string*)}`
* `options` - an object with the following properties (_optional_)
  {
  mixin: (_number_), // amount of existing transaction outputs to mix yours with (default is 4)
  unlockTime: (_number_), // number of blocks before tx is spendable (default is 0)
  pid: (_string_) // optional payment ID (a 64 character hexadecimal string used for identifying the sender of a payment)
  payment*id: (\_string*) // optional payment ID (a 64 character hexadecimal string used for identifying the sender of a payment)
  do*not_relay: (\_boolean*) // optional boolean used to indicate whether a transaction should be relayed or not
  priority: (_integer_) // optional transaction priority
  get*tx_hex: (\_boolean*) // optional boolean used to indicate that the transaction should be returned as hex string after sending
  get*tx_key: (\_boolean*) // optional boolean used to indicate that the transaction key should be returned after sending
  }

Example response:

```
{ tx_hash: '<b9272a68b0f242769baa1ac2f723b826a7efdc5ba0c71a2feff4f292967936d8>', tx_key: '' }
```

### transferSplit

Usage:

```
Wallet.transferSplit(destinations, options);
```

Same as `transfer`, but can split into more than one transaction if necessary. Responds with a list of transaction hashes.

Additional property available for the `options` parameter:

* `new_algorithm` - `true` to use the new transaction construction algorithm. defaults to `false`. (_boolean_)

Example response:

```
{ tx_hash_list: [ '<f17fb226ebfdf784a0f5814e1c5bb78c19ea26930a0d706c9dc1085a250ceb37>' ] }
```

### sweep_dust

Usage:

```
Wallet.sweep_dust();
```

Sends all dust outputs back to the wallet, to make funds easier to spend and mix. Responds with a list of the corresponding transaction hashes.

Example response:

```
{ tx_hash_list: [ '<75c666fc96120a643321a5e76c0376b40761582ee40cc4917e8d1379a2c8ad9f>' ] }
```

### sweep_all

Usage:

```
Wallet.sweep_all('UPX1ffK8ybGjhjQXReRxLDKPRBrsjXEzLcLGuHQZdmCBMd95K6PULopLLafQZf1MCCQoqf8mFEcnvhbP8n5SXtkN4F9Q3jN3Ru');
```

Sends all spendable outputs to the specified address. Responds with a list of the corresponding transaction hashes.

Example response:

```
{ tx_hash_list: [ '<75c666fc96120a643321a5e76c0376b40761582ee40cc4917e8d1379a2c8ad9f>' ] }
```

### getPayments

Usage:

```
Wallet.getPayments(paymentID);
```

Returns a list of incoming payments using a given payment ID.

Parameters:

* `paymentID` - the payment ID to scan wallet for included transactions (_string_)

### getBulkPayments

Usage:

```
Wallet.getBulkPayments(paymentIDs, minHeight);
```

Returns a list of incoming payments using a single payment ID or a list of payment IDs from a given height.

Parameters:

* `paymentIDs` - the payment ID or list of IDs to scan wallet for (_array_)
* `minHeight` - the minimum block height to begin scanning from (example: 800000) (_number_)

### incomingTransfers

Usage:

```
Wallet.incomingTransfers(type);
```

Returns a list of incoming transfers to the wallet.

Parameters:

* `type` - accepts `"all"`: all the transfers, `"available"`: only transfers that are not yet spent, or `"unavailable"`: only transfers which have been spent (_string_)

### queryKey

Usage:

```
Wallet.queryKey(type);
```

Returns the wallet's spend key (mnemonic seed) or view private key.

Parameters:

* `type` - accepts `"mnemonic"`: the mnemonic seed for restoring the wallet, or `"view_key"`: the wallet's view key (_string_)

### integratedAddress

Usage:

```
Wallet.integratedAddress(paymentID);
```

OR:

```
Wallet.integratedAddress();
```

Make and return a new integrated address from your wallet address and a payment ID.

Parameters:

* `paymentID` - a 64 character hex string. if not provided, a random payment ID is generated. (_string_, optional)

Example response:

```
{ integrated_address: 'UmWcrokefjQHYwAbaD7jSMRVWdC2Ekk3b9wH6RcAd6enQqgSR5ak3mF47EZu6jZxCPdUBPc3y2y354MpramoqxBc1uZZFft8P' }
```

### splitIntegrated

Usage:

```
Wallet.splitIntegrated(address);
```

Returns the standard address and payment ID corresponding to a given integrated address.

Parameters:

* `address` - an integrated uPlexa address (_string_)

Example response:

```
{ payment_id: '<61eec5ffd3b9cb57>',
  standard_address: 'UPX1ffK8ybGjhjQXReRxLDKPRBrsjXEzLcLGuHQZdmCBMd95K6PULopLLafQZf1MCCQoqf8mFEcnvhbP8n5SXtkN4F9Q3jN3Ru' }
```

### height

Usage:

```
Wallet.height();
```

Returns the current block height of the daemon.

Parameters:

* `callback` - a callback function that responds with an error or the response data in the following order: (_error, data_)

Example response:

```
{ height: 50000 }
```

### stopWallet

Usage:

```
Wallet.stopWallet();
```

Cleanly shuts down the current simplewallet process.
