import express from 'express';
import router from './router';
import morgan from 'morgan';
import cors from 'cors';
import { protect } from './modules/auth';
import { createNewUser, signin } from './handlers/user';
import { sendOtp } from './handlers/invitelink';
import { sendorgInviteLink } from './handlers/invitelink';
import { verifyotp } from './handlers/verify_otp';
import prisma from './db';


const app = express();

app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({extended: true}))


app.use('/api', protect, router);

app.post('/register', createNewUser, async (req, res) => {
    await sendOtp(req.body.email, req.body.id)
})
app.post('/login', signin)
app.post('/verifyotp', async (req, res) => {
    const {user_id, otp} = req.body;
    try {
        const validOtp = await verifyotp(user_id, otp)
        if (!validOtp) {
            res.json({message: "Invalid Otp", isSuccess: false})
            return
        }
        res.status(200)
        res.json({message: "Valid Otp", isSuccess: true})
    } catch (err) {
        res.json({message: `${err}`, isSuccess: false})
        return
    }
})
app.post('/invitationcode', async (req, res) => {
    const {code} = req.body;
    console.log(`Invitation code: ${code}`)
    try {
        const invitation = await prisma.invitation.findUnique({
            where: {
                code
            },
            include: {
                organisation: true,
                user: true
            }
        })
        delete invitation.user.password;
        res.status(200).json({invitation, isSuccess: true})
    } catch (err) {
        res.json({error: err.message})
        return   
    }
})

export default app;