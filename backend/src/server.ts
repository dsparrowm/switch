import express from 'express';
import router from './router';
import morgan from 'morgan';
import cors from 'cors';
import { protect } from './modules/auth';
import { createNewUser, signin } from './handlers/user';
import { sendOtp } from './handlers/invitelink';
import { sendorgInviteLink } from './handlers/invitelink';
import { verifyotp } from './handlers/verify_otp';

const app = express();

app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.get('/', (req, res) => {
    console.log('Hello from server');
    res.status(200);
    res.json({ message: "Hello world"});
})

app.use('/api', protect, router);

app.post('/register', createNewUser, async (req, res) => {
    await sendOtp(req.body.email, req.body.id)
})
app.post('/login', signin);
app.post('/verifyotp', async (req, res) => {
    const {user_id, otp} = req.body;
    try {
        const validOtp = await verifyotp(user_id, otp)
        if (!validOtp) {
            res.json({message: "Invalid Otp"})
            return
        }
        res.status(200)
        res.json({message: "Valid Otp"})
    } catch (error) {
        console.log(error)
    }
})

export default app;