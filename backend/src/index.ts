import * as dotenv from 'dotenv'
dotenv.config()
import app from './server'
import http from 'http';
import { Server} from 'socket.io';

const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
    console.log('a user connected');
})


server.listen(3001, () => {
    console.log('server running on http://localhost:3001');
})