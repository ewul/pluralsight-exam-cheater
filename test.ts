import Secure from 'secure'
// import Util from 'util'
import { eddsa as EdDSA, utils } from 'elliptic'
import Block from './blockchain/block'
const eddsa = new EdDSA("ed25519");

// let abc = Secure.genKeyPair(Util.hash('abc'));
// console.log(abc.getPublic('hex'));
// console.log(abc.getSecret());
// console.log(abc.getSecret('hex'));
// console.log(eddsa.keyFromSecret('ddaf35a193617abacc417349ae20413112e6fa4e89a97ea20a9eeee64b55d39a2192992a274fc1a836ba3c23a3feebbd454d4423643ce80e2a9ac94fa54ca49f').getPublic('hex'));

// let s = new Secure(Util.hash('password'));
// let b = Block.genesis(s);

// console.log(Block.verifyBlock(b));
// console.log(Block.verifyProposer(b, s.publicKey));

import dgram from 'dgram'
// 创建socket
let client = dgram.createSocket('udp4');
client.on('close', () => {
    console.log('client已关闭');
});

client.on('error', (err) => {
    console.log(err);
});
client.on('listening', () => {
    console.log('client正在监听中...');
    // client.addMembership('255.255.255.255');
});
client.on('message', (msg, rinfo) => {
    console.log(`receive server message from ${rinfo.address}:${rinfo.port}：${msg}`);
});
client.bind(2426);

// import net from 'net'

// let client = net.createConnection({port: 2425});
// client.on('connect', () => {
//     client.write('hello');
// })

// client.on('data', (data) => {
//     console.log(data.toString());
//     client.end();
// })

