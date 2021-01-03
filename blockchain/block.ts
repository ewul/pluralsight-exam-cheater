import SHA256 from 'crypto-js/sha256'
import Secure from '../secure'

export default class Block {
    timestamp: number;
    lastHash: string;
    hash: string;
    data: string;
    proposer: string;
    signature: string;
    sequenceNo: number;

    constructor(
        timestamp: number,
        lastHash: string,
        hash: string,
        data: string,
        proposer: string,
        signature: string,
        sequenceNo: number
    ) {
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
        this.proposer = proposer;
        this.signature = signature;
        this.sequenceNo = sequenceNo;

    }

    /**
     * toString
     */
    toString() {
        return `Block - 
        Timestamp   : ${this.timestamp}
        Last Hash   : ${this.lastHash}
        Hash        : ${this.hash}
        Data        : ${this.data}
        proposer    : ${this.proposer}
        Signature   : ${this.signature}
        Sequence No : ${this.sequenceNo}`;
    }

    static genesis(secure: Secure) {
        const timestamp = Date.now();
        const blockHash = Block.hash(timestamp, "", "");
        return new this(
            timestamp,
            "",
            blockHash,
            "",
            secure.publicKey,
            Block.signBlockHash(blockHash, secure),
            0
        );
    }

    static createBlock(lastBlock: Block, data: string, secure: Secure) {

        const timestamp = Date.now();
        const lastHash = lastBlock.hash;
        let hash = Block.hash(timestamp, lastHash, data);
        return new this(
            Date.now(),
            lastBlock.hash,
            hash,
            data,
            secure.publicKey,
            Block.signBlockHash(hash, secure),
            1 + lastBlock.sequenceNo
        );

    }

    static hash(timestamp: number, lastHash: string, data: string) {
        // console.debug(`
        // Block.hash - 
        // Timestamp   : ${timestamp}
        // Last Hash   : ${lastHash}
        // Data        : ${data}
        // `);
        return SHA256(`${timestamp}:${lastHash}:${data}`).toString();
    }

    static blockHash(block: Block) {
        const { timestamp, lastHash, data } = block;
        return Block.hash(timestamp, lastHash, data);
    }

    static signBlockHash(hash: string, secure: Secure) {
        return secure.sign(hash).toString();
    }

    static verifyBlock(block: Block) {
        return Secure.verifySignature(
            block.proposer,
            block.signature,
            Block.blockHash(block)
        );
    }

    static verifyProposer(block: Block, proposer: string) {
        return block.proposer == proposer ? true : false;
    }
}