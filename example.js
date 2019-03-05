var uplexaWallet = require('./lib/wallet');
var Wallet = new uplexaWallet();

// examples

Wallet.create_wallet('uplexa_wallet').then(function(result){
    console.log(result);
});

Wallet.open_wallet('uplexa_wallet').then((result) => {
    console.log(result);
});

Wallet.address().then((result) => {
    console.log(result);
});

Wallet.balance().then((result) => {
    console.log(result);
});
