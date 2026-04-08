import { NextFunction, Request, Response } from "express";
import { getConfig } from "@/data/repositories/Config.Repository";

export const getConfigController = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const config = await getConfig();

        res.status(200).json({
            success: true,
            data: config,
        });
    } catch (error) {
        next(error);
    }
};
