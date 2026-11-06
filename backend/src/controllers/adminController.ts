import { Request, Response } from 'express';
import { prisma } from '../lib/prisma'; // Adjust path to your Prisma client

export const toggleUserStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        // 1. Find the user to get their current status
        const user = await prisma.user.findUnique({
            where: { id },
            select: { isActive: true },
        });

        if (!user) {
            res.status(404).json({ error: 'Not Found', message: 'User not found' });
            return;
        }

        // 2. Toggle the boolean value
        const updatedUser = await prisma.user.update({
            where: { id },
            data: { isActive: !user.isActive },
            select: { id: true, email: true, name: true, role: true, isActive: true }, // Exclude passwordHash
        });

        res.status(200).json({
            message: `User account has been ${updatedUser.isActive ? 'activated' : 'deactivated'}`,
            user: updatedUser,
        });
    } catch (error) {
        console.error('Error toggling user status:', error);
        res.status(500).json({ error: 'Internal Server Error', message: 'Failed to update user status' });
    }
};