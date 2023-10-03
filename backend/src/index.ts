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
    console.log(`a user connected: ${socket.id}`);

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
            const messages = await prisma.message.findUnique({
                where: {id: savedMessage.id},
                include: {sender: true}
            })
            io.to(data.departmentId).emit('groupMessage', messages)

        } catch (err) {
            console.log(err);
        }
        
    })
    socket.on("private-message", async (data) => {
        try {
            // console.log(data);
            const savedMessage = await prisma.message.create({
                data: {
                    content: data.content,
                    senderId: data.senderId,
                    recipientId: data.recipientId
                }
            })
            const messages = await prisma.message.findUnique({
                where: {id: savedMessage.id},
                include: {sender: true}
            })
            console.log(messages);
            io.to(data.recipientId).emit('private-message', messages)
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