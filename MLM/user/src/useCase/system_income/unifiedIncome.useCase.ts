import prisma from "@/prisma-client";

/**
 * Unified income history for a user.
 * Returns combined binary (SystemIncome) and royalty (RoyalClubIncome)
 * in a single merged, sorted list with contributor breakdown.
 */
export const getUnifiedIncomeHistory = async (userId: number) => {
  // ── Binary Matching Income ────────────────────────────────────────────
  const binaryIncomes = await prisma.systemIncome.findMany({
    where: { user_id: userId, status: "ACTIVE" },
    include: {
      generateIncome: {
        include: {
          IncomeHistory: {
            where: { userId }
          }
        }
      }
    },
    orderBy: { createdAt: "desc" },
  });

  // ── Royalty Income ────────────────────────────────────────────────────
  const royaltyIncomes = await prisma.royalClubIncome.findMany({
    where: { user_id: userId, status: "ACTIVE" },
    include: {
      generateIncome: {
        include: {
          IncomeHistory: {
            where: { userId }
          }
        }
      }
    },
    orderBy: { createdAt: "desc" },
  });

  // ── Format binary entries ─────────────────────────────────────────────
  const binaryFormatted = binaryIncomes.map((si) => {
    const history = si.generateIncome?.IncomeHistory?.[0];
    return {
      id: si.id,
      type: "BINARY" as const,
      date: si.createdAt,
      grossIncome: Number(history?.totalIncome || si.income),
      netIncome: Number(si.income),
      tds: Number(history?.tds || 0),
      adminCharges: Number(history?.adminCharges || 0),
      matchedBV: si.matched_bv,
      message: si.message_data || "",
      // Contributors parsed from message_data or fetched separately
      contributors: parseContributorsFromMessage(si.message_data || ""),
    };
  });

  // ── Format royalty entries ────────────────────────────────────────────
  const royaltyFormatted = royaltyIncomes.map((ri) => {
    const history = ri.generateIncome?.IncomeHistory?.[0];
    return {
      id: ri.id,
      type: "ROYALTY" as const,
      date: ri.createdAt,
      grossIncome: Number(history?.totalIncome || ri.income),
      netIncome: Number(ri.income),
      tds: Number(history?.tds || 0),
      adminCharges: Number(history?.adminCharges || 0),
      matchedBV: null,
      message: ri.message_data || "",
      contributors: parseContributorsFromMessage(ri.message_data || ""),
    };
  });

  // ── Merge and sort by date desc ───────────────────────────────────────
  const merged = [...binaryFormatted, ...royaltyFormatted].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // ── Summary totals ────────────────────────────────────────────────────
  const wallet = await prisma.wallet.findUnique({ where: { user_id: userId } });

  return {
    summary: {
      totalBinaryIncome: binaryFormatted.reduce((s, i) => s + i.netIncome, 0),
      totalRoyaltyIncome: royaltyFormatted.reduce((s, i) => s + i.netIncome, 0),
      totalIncome: Number(wallet?.total_income || 0),
      matchedBV: Number(wallet?.matched_bv || 0),
      leftBV: Number(wallet?.total_left_bv || 0),
      rightBV: Number(wallet?.total_right_bv || 0),
      carryLeftBV: Number(wallet?.left_carryforward_bv || 0),
      carryRightBV: Number(wallet?.right_carryforward_bv || 0),
    },
    history: merged,
  };
};

/**
 * Parse contributor names from the stored message_data string.
 * Format: "Binary Match — Left: Name (ID) [BV BV] | Right: Name (ID) [BV BV] | ..."
 */
function parseContributorsFromMessage(msg: string): { name: string; memberId: string; bv: string; leg: string }[] {
  if (!msg) return [];
  const contributors: { name: string; memberId: string; bv: string; leg: string }[] = [];

  const legPattern = /(Left|Right):\s*([^|]+)/gi;
  let match;
  while ((match = legPattern.exec(msg)) !== null) {
    const leg = match[1];
    const entries = match[2].trim();
    if (entries === "carry-forward") continue;

    // Each entry: "First Last (MemberID) [BV BV]"
    const entryPattern = /([^,\(]+)\(([^)]+)\)\s*\[([^\]]+)\]/g;
    let em;
    while ((em = entryPattern.exec(entries)) !== null) {
      contributors.push({
        name: em[1].trim(),
        memberId: em[2].trim(),
        bv: em[3].replace("BV", "").trim(),
        leg,
      });
    }
  }
  return contributors;
}
