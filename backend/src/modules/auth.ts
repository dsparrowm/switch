import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Request, Response, NextFunction } from 'express';

export const createJWT = (user) => {
    const token = jwt.sign({id: user.id, role: user.role}, process.env.JWT_SECRET);
    return token;
}

export const protect = (req: Request, res: Response, next: NextFunction) => {
    const bearer = req.headers.authorization;

    if (!bearer) {
        return res.status(401).json({message: "Not Authorized", isSuccess: false});
    }

    const [, token] = bearer.split(' ');
    if (!token) {
        res.status(401).json({message: "Not a valid token", isSuccess: false});
        return;
    }
    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        req[user] = user;
        next();
        return;

    } catch (err) {
        console.log(err);
        res.status(401).json({message: "Not Authorized", isSuccess: false});
        return;
    }
}

export const comparePassword = (password, hash) => {
    return bcrypt.compare(password, hash);
}

export const hashPassword = (password) => {
    return bcrypt.hash(password, 5);
}