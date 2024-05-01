import jwt from 'jsonwebtoken';


const createJWT = (user) => {
    const token = jwt.sign({id: user.id, role: user.role}, process.env.JWT_SECRET);
    return token;
}

export default createJWT;