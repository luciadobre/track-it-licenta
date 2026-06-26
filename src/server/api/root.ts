import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { itemRouter } from "./routers/item";
import { companyRouter } from "./routers/company";
import { transactionRouter } from "./routers/transaction";
import { locationRouter } from "./routers/location";
import { stockChangesRouter } from "./routers/stock-changes";

export const appRouter = createTRPCRouter({
  item: itemRouter,
  company: companyRouter,
  transaction: transactionRouter,
  location: locationRouter,
  stockChanges: stockChangesRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
