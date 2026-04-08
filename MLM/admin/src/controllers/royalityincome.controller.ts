// import AppError from "@/errors/AppError";
// import { roylityincomeUsecase } from "@/useCase/royalityIncome.usecase";
// import { Request, Response } from "express";
// export const royalityController = async (req: Request, res: Response) => {
//   try {
//     const royality = await roylityincomeUsecase();

//     res.status(201).json({
//       msg: "Income generated successfully",
//       royality,
//     });
//   } catch (error: any) {
//     throw AppError.internal(error);
//   }
// };
