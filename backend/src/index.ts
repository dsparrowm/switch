import * as dotenv from 'dotenv'
dotenv.config()
import app from './server'
import http from 'http';
import { Server} from 'socket.io';
import prisma from './db';

const server = http.createServer(app);
const io = new Server(server, {cors: {
    origin: '*',
}});

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('join-department', (departmentId) => {
        socket.join(departmentId);  
    })

        socket.on('groupMessage', async (data) => {
            try {
                const savedMessage = await prisma.message.create({
                    data: {
                        content: data.content,
                        senderId: data.senderId,
                        departmentId: data.departmentId
                    }
                })

                io.to(data.departmentId).emit('groupMessage', savedMessage)

            } catch (err) {
                console.log(err);
            }
            
        })

    socket.on('disconnect', () => {
        console.log('user disconnected');
    })
})


server.listen(3001, () => {
    console.log('server running on http://localhost:3001');
})