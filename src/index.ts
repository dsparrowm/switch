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

            const result = await prisma.$transaction(async (prisma) => {
                const savedMessage = await prisma.message.create({
                    data: {
                        content: data.content,
                        senderId: data.senderId,
                        departmentId: data.departmentId
                    }
                })

                // await redis.del(`department:${data.departmentId}:messages`);
                const response = await prisma.message.findUnique({
                where: {id: savedMessage.id},
                include: {sender: true}
                })

                const message = {
                    id: response.id,
                    senderId: response.senderId,
                    senderEmail: response.sender.email,
                    senderName: response.sender.name,
                    departmentId: data.departmentId,
                    createdAt: response.createdAt,
                    updatedAt: response.updatedAt,
                    content: response.content,
                    type: "Group"
                }
    
                io.to(data.departmentId).emit('groupMessage', message)
            })

        } catch (err) {
            console.log(err);
        }
        
    })

    socket.on("private-message", async (data) => {
        try {
            const result = await prisma.$transaction( async (prisma) => {
                const savedMessage = await prisma.message.create({
                    data: {
                        content: data.content,
                        senderId: data.senderId,
                        recipientId: data.recipientId
                    }
                })
                // await redis.del(`user:${data.senderId}:messages:${data.recipientId}`);
                const response = await prisma.message.findUnique({
                    where: {id: savedMessage.id},
                    include: {sender: true}
                })
    
                const recipient = await prisma.user.findUnique({
                    where: {id: response.recipientId}
                })
    
                const message = {
                    id: response.id,
                    senderId: response.senderId,
                    senderEmail: response.sender.email,
                    senderName: response.sender.name,
                    recipientId: response.recipientId,
                    recipientName: recipient.name,
                    recipientEmail: recipient.email,
                    createdAt: response.createdAt,
                    updatedAt: response.updatedAt,
                    content: response.content,
                    type: "Private"
                }
    
                const recipientSocketId = getSocketIdFromUserId(data.recipientId);
                socket.emit('private-message', message) 
                socket.broadcast.to(recipientSocketId).emit('private-message', message)
            })
            
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