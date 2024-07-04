import dotenv from 'dotenv';
dotenv.config()
import app from './server'
import http from 'http';
import { Server} from 'socket.io';
import prisma from './db';
import swaggerDocs from './config/Swagger/swagger';
import redis from './redis';

const server = http.createServer(app);
const io = new Server(server, {cors: {
    origin: '*',
}});
let users = {};
io.on('connection', (socket) => {
    console.log(`a user connected: ${socket.id}`);
        socket.on('userConnected', (userId) => {
            users[userId] = socket.id;
            console.log(users, 'shewhoiphwi');
        });
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
            // await redis.del(`department:${data.departmentId}:messages`);
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
            // await redis.del(`user:${data.senderId}:messages:${data.recipientId}`);
            const messages = await prisma.message.findUnique({
                where: {id: savedMessage.id},
                include: {sender: true}
            })
            const recipientSocketId = getSocketIdFromUserId(data.recipientId);
            socket.emit('private-message', messages) 
            socket.broadcast.to(recipientSocketId).emit('private-message', messages)
        } catch (err) {
            console.log(err);
        }
    })

    socket.on('disconnect', () => {
        for(let userId in users){
            if(users[userId] === socket.id){
                delete users[userId];
                break;
            }
        }
    });
        
    })

    function getSocketIdFromUserId(userId) {
        console.log(users, 'getSocketIdFromUserId');
        return users[userId];
    }

server.listen(process.env.PORT, () => {
    console.log('server running on http://localhost:3001');
    swaggerDocs(app, 3001);
})