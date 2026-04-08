import { OrderReturnRepository } from "../../data/repositories/return/OrderReturnRepository";
import { WalletService } from "../../services/WalletService";

const repo = new OrderReturnRepository();
const walletService = new WalletService();

export const createReturnUseCase = async (data: any) => {
  const result = await repo.createReturn(data);

  // COIN LOGIC: Reversal on return
  try {
    if (data.orderId && data.comId) {
      await walletService.handleReturn(
        data.orderId,
        data.comId,
        data.refundAmount || 0,
      );
    }
  } catch (err) {
    console.error("Error reversing coins on return:", err);
  }

  return result;
};

export const getAllReturnsUseCase = async () => {
  return repo.getAllReturns();
};

export const updateReturnStatusUseCase = async (
  returnId: number,
  status: string,
) => {
  if (!["APPROVED", "REJECTED"].includes(status)) {
    throw new Error("Invalid status value");
  }
  return repo.updateReturnStatus(returnId, status);
};

export const getReturnByIdUseCase = async (returnId: number) => {
  return repo.getReturnById(returnId);
};

export const cancelReturnUseCase = async (returnId: number) => {
  return repo.cancelReturn(returnId);
};
