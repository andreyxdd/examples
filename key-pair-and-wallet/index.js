import TonWeb from "tonweb";
import tonMnemonic from "tonweb-mnemonic";

const createKeyPair = async () => {
    /** @type {string[]} */
    const words = await tonMnemonic.generateMnemonic();

    /** @type {Uint8Array} */
    const seed = await tonMnemonic.mnemonicToSeed(words);

    /** @type {nacl.SignKeyPair} */
    const keyPair = TonWeb.utils.nacl.sign.keyPair.fromSeed(seed);

    console.log(TonWeb.utils.bytesToHex(keyPair.publicKey));
    console.log(TonWeb.utils.bytesToHex(keyPair.secretKey));

    /** @type {nacl.SignKeyPair} */
    const keyPair2 = TonWeb.utils.nacl.sign.keyPair();

    console.log(TonWeb.utils.bytesToHex(keyPair2.publicKey));
    console.log(TonWeb.utils.bytesToHex(keyPair2.secretKey));
}

createKeyPair();

/**
 * @param keyPair {nacl.SignKeyPair}
 */
const createWallet = async (keyPair) => {
    const tonweb = new TonWeb();
    const WalletClass = tonweb.wallet.all.v3R2;
    const wallet = new WalletClass(tonweb.provider, {
        publicKey: keyPair.publicKey
    });

    /** @type {Address} */
    const address = await wallet.getAddress();
    console.log(address.toString(true, true, true));
}

createWallet(TonWeb.utils.nacl.sign.keyPair());
