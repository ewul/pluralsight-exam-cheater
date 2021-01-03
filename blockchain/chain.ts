import Block from './block'
import Secure from '../secure'

export default class Chain {
    chain: Array<Block>;
    constructor() {
        this.chain = [];
    }

    addBlock(block: Block) {
        if (block) {
            this.chain.push(block);
            console.log("New block added:" + block.toString());
        }
        return this.chain;
    }

    isValidBlockToJoin(block: Block) {
        const lastBlock = this.chain[this.chain.length - 1];
        if (lastBlock.sequenceNo + 1 === block.sequenceNo &&
            lastBlock.hash === block.lastHash &&
            block.hash === Block.blockHash(block) &&
            Block.verifyBlock(block)
            // TODO verify proposer
        ) {
            console.log(`Block ${block.hash} valid.`);
            return true;
        } else {
            console.log('Block invalid. ' + block.toString());
            return false;
        }
    }
}