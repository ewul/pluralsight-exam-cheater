
/**
 * 负责链同步，接收消息，验证消息，发送回馈给client
 */
import Secure from '../secure'
import dgram from 'dgram'
import net from 'net'

export default class Server {
    serverId: string;
    status: "LOOKING" | "FOLLOWING" | "LEADING" = "LOOKING";
    serverPool: ServerPool = new ServerPool();

    constructor(secure: Secure) {
        this.serverId = secure.publicKey;
    }

    start(port: string = '5000') {

        // 1. UDP组播，要求选举，发送本地链
        // 2. 
    }

}

class ServerPool {
    list: Array<Server> = [];
}

// let server = dgram.createSocket('udp4');
// 服务端监听一个端口 数据到来时 可以读出信息
// server.on('close', () => {
//     console.log('server已关闭');
// });
// server.on('error', (err) => {
//     console.log(err);
// });
// server.on('listening', () => {
    // console.log('server正在监听中...');
    // server.addMembership('255.255.255.255'); // 不写也行
    // server.setBroadcast(true);
    // server.setMulticastTTL(128);
    // setInterval(() => {
    //     server.send('大家好啊，我是服务端组播消息', 2426, '255.255.255.255');
    // }, 1500);
// });

// server.bind(2425);

let server = net.createServer();
server.on('connection', (socket) => {
    console.log(socket.localAddress);
    socket.on("data", (data) => {
        console.log(data.toString());
        socket.write('keep');
    })
})

server.listen(2425);