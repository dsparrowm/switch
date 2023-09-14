import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const createJWT = (user) => {
    const token = jwt.sign({id: user.id, role: user.role}, process.env.JWT_SECRET);
    return token;
}

export const protect = (req, res, next) => {
    const bearer = req.headers.authorization;

    if (!bearer) {
        res.status(401);
        res.json({message: "Not Authorized", isSuccess: false});
        return;
    }

    const [, token] = bearer.split(' ');
    if (!token) {
        res.status(401);
        res.json({message: "Not a valid token", isSuccess: false});
        return;
    }
    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        req.user = user;
        next();
        return;

    } catch (error) {
        console.log(error);
        res.status(401);
        res.json({message: "Not Authorized", isSuccess: false});
        return;
    }
}

export const comparePassword = (password, hash) => {
    return bcrypt.compare(password, hash);
}

export const hashPassword = (password) => {
    return bcrypt.hash(password, 5);
}