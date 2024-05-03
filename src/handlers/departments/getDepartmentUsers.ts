import { Request, Response } from 'express';
import { z } from "zod";
import prisma from "../../db";
import { getDepartmentUsersSchema } from '../../utils/validationSchemas';
import redis from '../../redis';

const getDepartmentUsers = async (req: Request, res: Response) => {
    try {
        const { departmentId } = await getDepartmentUsersSchema.parseAsync(req.query);
        // const cachedValue = await redis.get(`departmentUsers:${departmentId}`);
        // if (cachedValue) {
        //     res.status(200);
        //     return res.json({ departmentUsers: JSON.parse(cachedValue), isSuccess: true });
        // }
        const departmentUsers = await prisma.user.findMany({
            where: {
                id: departmentId
            }
        });
        // await redis.set(`departmentUsers:${departmentId}`, JSON.stringify(departmentUsers));
        res.status(200);
        res.json({ departmentUsers, isSuccess: true });
    } catch (err) {
        if (err instanceof z.ZodError) {
            res.status(400);
            return res.json({ message: err.issues, isSuccess: false });
        }
        res.status(500);
        res.json({ message: err.message, isSuccess: false });
    }
};


export default getDepartmentUsers;