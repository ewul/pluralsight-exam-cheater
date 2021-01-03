import { v1 as uuidV1 } from 'uuid'
import SHA512 from 'crypto-js/sha512'

export default class Util {

    static id() {
        return uuidV1();
    }

    static hash(data: string) {
        return SHA512(data).toString();
    }

}
