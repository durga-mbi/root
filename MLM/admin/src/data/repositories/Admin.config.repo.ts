import prisma from "@/prisma-client";
import { CreateConfigDto } from "@/dto";
import { ApproveStatus } from "@prisma/client";

export const createConfigRepo = async (data: CreateConfigDto) => {
  const { royalPlanIds, activePlanIds, ...rest } = data;

  const configId = 1;

  return prisma.$transaction(async (tx) => {
    // 1. Upsert the main config
    const config = await tx.config.upsert({
      where: { id: configId },
      update: {
        ...rest,
      },
      create: {
        id: configId,
        plan_config_key: "PLAN_APPROVAL_MODE",
        plan_config_value: ApproveStatus.AUTO,
        ...rest,
      },
    });

    // 2. Manage the plans relationship if royalPlanIds is provided
    if (royalPlanIds !== undefined) {
      // Clear existing
      await tx.configRoyalPlan.deleteMany({
        where: { id: configId },
      });

      // Insert new
      if (royalPlanIds.length > 0) {
        await tx.configRoyalPlan.createMany({
          data: royalPlanIds.map((planId) => ({
            id: configId,
            planid: planId,
          })),
        });
      }
    }

    // 3. Manage active/inactive status of plans if activePlanIds is provided
    if (activePlanIds !== undefined) {
      // Set all plans in activePlanIds to ACTIVE
      if (activePlanIds.length > 0) {
        await tx.plansMaster.updateMany({
          where: { id: { in: activePlanIds } },
          data: { status: "ACTIVE" },
        });

        // Set all other plans to INACTIVE
        await tx.plansMaster.updateMany({
          where: { id: { notIn: activePlanIds } },
          data: { status: "INACTIVE" },
        });
      } else {
        // If empty list, set ALL to INACTIVE
        await tx.plansMaster.updateMany({
          data: { status: "INACTIVE" },
        });
      }
    }

    return tx.config.findUnique({
      where: { id: configId },
      include: {
        royalQualifierPlans: true,
      },
    });
  });
};

export const getConfigRepo = async () => {
  return prisma.config.findUnique({
    where: { id: 1 },
    include: {
      royalQualifierPlans: {
        include: {
          plan: true,
        },
      },
    },
  });
};
