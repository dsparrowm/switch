import { z } from "zod";
import prisma from "../../db";
import { Request, Response } from 'express';
import { deleteOrganisationSchema } from "../../utils/validationSchemas";

const deleteOrganisationById = async (req: Request, res: Response) => {
    try {
        const { orgId } = await deleteOrganisationSchema.parseAsync(req.body);
        const org = await prisma.organisation.findUnique({
            where: { id: orgId },
        });
        if (!org) {
            return res.status(404).json({ message: "Organisation not found", isSuccess: false });
        }
        await prisma.organisation.delete({
            where: { id: orgId },
        });
        return res.json({ message: "Organization deleted successfully", isSuccess: true });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: error.issues, isSuccess: false });
        }
        console.error("An error occurred while deleting the organization", error);
        return res.status(500).json({ message: "An error occurred while deleting the organization", isSuccess: false });
    }
}

export default deleteOrganisationById;