import { eddsa as EdDSA } from 'elliptic'

const eddsa = new EdDSA("ed25519");

export default class Secure {

    publicKey: string;
    keyPair: EdDSA.KeyPair;

    constructor(secret: string) {
        this.keyPair = Secure.genKeyPair(secret);
        this.publicKey = this.keyPair.getPublic("hex");
    }

    sign(dataHash: string) {
        return this.keyPair.sign(dataHash).toHex();
    }

    static genKeyPair(secret: string) {
        return eddsa.keyFromSecret(secret);
    }
    
    static verifySignature(publicKey: any, signature: string, dataHash: string) {
        return eddsa.keyFromPublic(publicKey).verify(dataHash, signature);
    }
}
