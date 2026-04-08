import prisma from "../../prisma-client";

export default class BaseRepository {
  protected defaultLimit = 10;
  protected defaultOffset = 0;
  protected client = prisma;

  getClient() {
    return this.client;
  }
}

export type Constructor<T = {}> = new (...args: any[]) => T;
