# Creating a Key Pair and a Wallet

Every account (or wallet that stores the coin balance) in the blockchain is defined by its private key. The private key is accessible only to the account holder. In this example, we'll take a look at how to create a key pair and a new wallet in the TON blockchain.

## Key Pair

To create a new account, we need to generate a new public/private key pair. There are two possible ways to achieve that:

1. We can use [tonweb-mnemonic](https://www.npmjs.com/package/tonweb-mnemonic) to generate 24 random words that define the secret key. These words will be compatible with TON wallet applications, i.e., by using them, we can import an account into third-party applications.
```js
const words = await tonMnemonic.generateMnemonic();
const seed = await tonMnemonic.mnemonicToSeed(words);
const keyPair = TonWeb.utils.nacl.sign.keyPair.fromSeed(seed);

console.log(TonWeb.utils.bytesToHex(keyPair.publicKey));
console.log(TonWeb.utils.bytesToHex(keyPair.secretKey));
```

2. Alternatively, we can generate a new random key pair directly via [TweetNaCl library](https://www.npmjs.com/package/tweetnacl).
```js
const keyPair = TonWeb.utils.nacl.sign.keyPair();

console.log(TonWeb.utils.bytesToHex(keyPair2.publicKey));
console.log(TonWeb.utils.bytesToHex(keyPair2.secretKey));
```

Note that we can get the key pair from mnemonic words, but we _cannot_ get mnemonic words from a key pair.

## Wallet

In the TON blockchain, all entities are [smart contracts](https://docs.ton.org/learn/overviews/addresses#everything-is-a-smart-contract). As such, a user account/wallet is also a custom smart contract. Note that a key pair is necessary to create a wallet.

There are several standard wallet smart contracts that everyone uses. At the moment, wallet v3R2 is a default one.
```js
const WalletClass = tonweb.wallet.all.v3R2;
const wallet = new WalletClass(tonweb.provider, {
    publicKey: keyPair.publicKey,
});
```

The wallet address is defined by a key pair and a smart contract code. So, for different versions of the smart contract, we would get a different address, although the key pair can be the same. Let's get the wallet address (offline operation):
```js
const address = await wallet.getAddress();
```

The address can be displayed in [different formats](https://ton.org/docs/#/howto/step-by-step?id=_1-smart-contract-addresses). Here is how to print the address in the default format that is most commonly used in UI applications:
```js
console.log(address.toString(true, true, true));
```

## Wallet Deployment

The above steps are done offline, meaning the created wallet smart contract hasn't been deployed to the network yet. The deployment of the wallet smart contract happens automatically with the first outgoing transfer. However, to make this outgoing transfer, the Toncoins must first be deposited to the newly generated wallet address.



##
See the complete code example [here](./index.js).
