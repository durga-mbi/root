import { useState } from "react";
import { toast } from "sonner";
import { generateIncomeApi } from "../../api/income.api";

export const useGenerateIncome = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateIncome = async () => {
    setIsGenerating(true);
    try {
      const data = await generateIncomeApi();
      toast.success(data.msg || "Income generated successfully");
      return data;
    } catch (error: any) {
      const errorMsg = error.message || "Failed to generate income";
      toast.error(errorMsg);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  return { generateIncome, isGenerating };
};
