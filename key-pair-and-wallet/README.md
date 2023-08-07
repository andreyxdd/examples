# Creating a key pair and a wallet

Every account (or wallet that stores the coin balance) in the blockchain is defined by its private key. The private key is accessible only to the account holder. In this example, we'll look at how to create a key pair and a new wallet.

First, let's import the necessary dependencies:
```
import TonWeb from "tonweb";
import tonMnemonic from "tonweb-mnemonic";
```
 Under the hood, the TweetNaCl library is used.

To create a new account, let's generate a new public/private key pair.
```
const createKeyPair = async () => {
    // 1. Use tonweb-mnemonic to generate random 24 words that define the secret key.
    // These words will be compatible with TON wallet applications, i.e., by using them, you can import your account into third-party applications.
    const words = await tonMnemonic.generateMnemonic();
    const seed = await tonMnemonic.mnemonicToSeed(words);
    const keyPair = TonWeb.utils.nacl.sign.keyPair.fromSeed(seed);

    console.log(TonWeb.utils.bytesToHex(keyPair.publicKey));
    console.log(TonWeb.utils.bytesToHex(keyPair.secretKey));

    // As an alternative
    // 2. Generate a new random key pair directly via TweetNaCl library.
    // Note that you can get the key pair from mnemonic words but CANNOT get mnemonic words from a key pair.
    const keyPair2 = TonWeb.utils.nacl.sign.keyPair();

    console.log(TonWeb.utils.bytesToHex(keyPair2.publicKey));
    console.log(TonWeb.utils.bytesToHex(keyPair2.secretKey));
}
```

In the TON blockchain, all entities are [smart contracts](https://docs.ton.org/learn/overviews/addresses#everything-is-a-smart-contract). As such, a user account/wallet is also a custom smart contract. To create a wallet, we need a key pair:
```
const createWallet = async (keyPair) => {
    const tonweb = new TonWeb();
 
    // There are several standard wallet smart contracts that everyone uses
    // At the moment, wallet v3R2 is a default one.
    const WalletClass = tonweb.wallet.all.v3R2;
    const wallet = new WalletClass(tonweb.provider, {
        publicKey: keyPair.publicKey
    });


    // Wallet address depends on a key pair and a smart contract code.
    // So, for different versions of the smart contract, you get a different address, although the key pair can be the same.
    // Let's get the wallet address (offline operation):
    const address = await wallet.getAddress();

    // The address can be displayed in different formats
    // Read more: https://ton.org/docs/#/howto/step-by-step?id=_1-smart-contract-addresses

    console.log(address.toString(true, true, true)); // prints the address in the default format. In 99% of cases, this format is used in UI applications.
}
```

The above steps are done offline, meaning the created wallet smart contract hasn't been deployed to the network yet. The deployment of the wallet smart contract happens automatically with the first outgoing transfer. However, to make this outgoing transfer, the Toncoins must first be deposited to the newly generated wallet address.

See the complete code example [here](./index.js).
