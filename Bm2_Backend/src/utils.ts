// import { Request } from "express";
// import config from "./config";

// export function add(a: number, b: number) {
//   return a + b;
// }

// export function getErrorMessage(error: unknown): string {
//   if (error instanceof Error) {
//     return error.message;
//   }
//   if (error && typeof error === "object" && "message" in error) {
//     return String(error.message);
//   }
//   if (typeof error === "string") {
//     return error;
//   }
//   return "An error occurred";
// }

// export function getPaginationParameters(req: Request) {
//   const page = parseInt(req.query.page as string, 10);
//   const perPage = parseInt(req.query.perPage as string, 10);

//   const validPage = isNaN(page) || page < 1 ? 1 : page;
//   ``;
//   const validPerPage =
//     isNaN(perPage) || perPage < 1 ? config.defaultPageSize : perPage;

//   const limit = validPerPage;
//   const offset = (validPage - 1) * validPerPage;
//   return {
//     page: validPage,
//     perPage: validPerPage,
//     limit,
//     offset,
//   };
// }

// export function getLevenshteinDistance(s1: string, s2: string): number {
//   const t1 = s1.toLowerCase().trim();
//   const t2 = s2.toLowerCase().trim();

//   if (t1 === t2) return 0;
//   if (t1.length === 0) return t2.length;
//   if (t2.length === 0) return t1.length;

//   const matrix: number[][] = [];

//   for (let i = 0; i <= t2.length; i++) {
//     matrix[i] = [i];
//   }

//   for (let j = 0; j <= t1.length; j++) {
//     matrix[0][j] = j;
//   }

//   for (let i = 1; i <= t2.length; i++) {
//     for (let j = 1; j <= t1.length; j++) {
//       if (t2.charAt(i - 1) === t1.charAt(j - 1)) {
//         matrix[i][j] = matrix[i - 1][j - 1];
//       } else {
//         matrix[i][j] = Math.min(
//           matrix[i - 1][j - 1] + 1,
//           matrix[i][j - 1] + 1,
//           matrix[i - 1][j] + 1,
//         );
//       }
//     }
//   }

//   return matrix[t2.length][t1.length];
// }

// export function formatDecimal(obj: any): any {
//   if (obj === null || obj === undefined) return obj;

//   if (Array.isArray(obj)) {
//     return obj.map(formatDecimal);
//   }

//   if (typeof obj === "object") {
//     // If it's a Prisma Decimal, convert to string
//     if (obj.constructor.name === "Decimal" || (obj.d && obj.e && obj.s)) {
//       return obj.toString();
//     }

//     // Recursive for nested objects
//     const newObj: any = {};
//     for (const key in obj) {
//       newObj[key] = formatDecimal(obj[key]);
//     }
//     return newObj;
//   }

//   return obj;
// }
import { Request } from "express";
import config from "./config";

export function add(a: number, b: number): number {
  return a + b;
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (error && typeof error === "object" && "message" in error) {
    return String((error as any).message);
  }
  if (typeof error === "string") {
    return error;
  }
  return "An error occurred";
}

export function getPaginationParameters(req: Request) {
  const page = parseInt(req.query.page as string, 10);
  const perPage = parseInt(req.query.perPage as string, 10);

  const validPage = isNaN(page) || page < 1 ? 1 : page;
  const validPerPage =
    isNaN(perPage) || perPage < 1 ? config.defaultPageSize : perPage;

  const limit = validPerPage;
  const offset = (validPage - 1) * validPerPage;

  return {
    page: validPage,
    perPage: validPerPage,
    limit,
    offset,
  };
}

export function getLevenshteinDistance(s1: string, s2: string): number {
  const t1 = s1.toLowerCase().trim();
  const t2 = s2.toLowerCase().trim();

  if (t1 === t2) return 0;
  if (t1.length === 0) return t2.length;
  if (t2.length === 0) return t1.length;

  const matrix: number[][] = [];

  for (let i = 0; i <= t2.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= t1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= t2.length; i++) {
    for (let j = 1; j <= t1.length; j++) {
      if (t2.charAt(i - 1) === t1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1,
        );
      }
    }
  }

  return matrix[t2.length][t1.length];
}

export function formatDecimal(obj: any): any {
  if (obj === null || obj === undefined) return obj;

  if (Array.isArray(obj)) {
    return obj.map(formatDecimal);
  }

  if (typeof obj === "object") {
    // If it's a Prisma Decimal, convert to string
    if (
      obj.constructor.name === "Decimal" ||
      (obj.d !== undefined && obj.e !== undefined && obj.s !== undefined)
    ) {
      return obj.toString();
    }

    // Recursive for nested objects
    const newObj: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        newObj[key] = formatDecimal(obj[key]);
      }
    }
    return newObj;
  }

  return obj;
}
