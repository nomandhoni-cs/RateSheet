import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create a production log entry
export const createProductionLog = mutation({
  args: {
    workerId: v.id("workers"),
    styleId: v.id("styles"),
    organizationId: v.id("organizations"),
    quantity: v.number(),
    productionDate: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("productionLogs", args);
  },
});

// Get production logs by worker and date range
export const getProductionLogsByWorker = query({
  args: {
    workerId: v.id("workers"),
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("productionLogs")
      .withIndex("by_worker", (q) => q.eq("workerId", args.workerId));

    if (args.startDate && args.endDate) {
      query = query.filter((q) =>
        q.and(
          q.gte(q.field("productionDate"), args.startDate!),
          q.lte(q.field("productionDate"), args.endDate!)
        )
      );
    }

    const logs = await query.collect();

    // Get style and worker details for each log
    const logsWithDetails = await Promise.all(
      logs.map(async (log) => {
        const [style, worker] = await Promise.all([
          ctx.db.get(log.styleId),
          ctx.db.get(log.workerId),
        ]);
        return {
          ...log,
          style,
          worker,
        };
      })
    );

    return logsWithDetails;
  },
});

// Get production logs by date for organization
export const getProductionLogsByDate = query({
  args: {
    date: v.string(),
    organizationId: v.id("organizations"),
  },
  handler: async (ctx, args) => {
    const logs = await ctx.db
      .query("productionLogs")
      .withIndex("by_organization", (q) =>
        q.eq("organizationId", args.organizationId)
      )
      .filter((q) => q.eq(q.field("productionDate"), args.date))
      .collect();

    // Get style and worker details for each log
    const logsWithDetails = await Promise.all(
      logs.map(async (log) => {
        const [style, worker] = await Promise.all([
          ctx.db.get(log.styleId),
          ctx.db.get(log.workerId),
        ]);

        // Get section for worker
        const section = worker ? await ctx.db.get(worker.sectionId) : null;

        return {
          ...log,
          style,
          worker: worker ? { ...worker, section } : null,
        };
      })
    );

    return logsWithDetails;
  },
});

// Calculate payroll for a worker in a date range
export const calculateWorkerPayroll = query({
  args: {
    workerId: v.id("workers"),
    startDate: v.string(),
    endDate: v.string(),
  },
  handler: async (ctx, args) => {
    const logs = await ctx.db
      .query("productionLogs")
      .withIndex("by_worker", (q) => q.eq("workerId", args.workerId))
      .filter((q) =>
        q.and(
          q.gte(q.field("productionDate"), args.startDate),
          q.lte(q.field("productionDate"), args.endDate)
        )
      )
      .collect();

    let totalPay = 0;
    const payrollDetails = [];

    for (const log of logs) {
      // Get the rate for this style on the production date
      const rates = await ctx.db
        .query("styleRates")
        .withIndex("by_style", (q) => q.eq("styleId", log.styleId))
        .filter((q) => q.lte(q.field("effectiveDate"), log.productionDate))
        .collect();

      const currentRate = rates.sort((a, b) =>
        b.effectiveDate.localeCompare(a.effectiveDate)
      )[0];

      if (currentRate) {
        const logPay = log.quantity * currentRate.rate;
        totalPay += logPay;

        const style = await ctx.db.get(log.styleId);
        payrollDetails.push({
          ...log,
          style,
          rate: currentRate.rate,
          pay: logPay,
        });
      }
    }

    return {
      totalPay,
      details: payrollDetails,
    };
  },
});

// Update production log
export const updateProductionLog = mutation({
  args: {
    logId: v.id("productionLogs"),
    workerId: v.id("workers"),
    styleId: v.id("styles"),
    quantity: v.number(),
    productionDate: v.string(),
  },
  handler: async (ctx, args) => {
    const { logId, ...updates } = args;
    await ctx.db.patch(logId, updates);
  },
});

// Delete production log
export const deleteProductionLog = mutation({
  args: { logId: v.id("productionLogs") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.logId);
  },
});
