import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create a new style
export const createStyle = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    organizationId: v.id("organizations"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("styles", args);
  },
});

// Get all styles in organization
export const getAllStyles = query({
  args: { organizationId: v.id("organizations") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("styles")
      .withIndex("by_organization", (q) =>
        q.eq("organizationId", args.organizationId)
      )
      .collect();
  },
});

// Update style
export const updateStyle = mutation({
  args: {
    styleId: v.id("styles"),
    name: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { styleId, ...updates } = args;
    await ctx.db.patch(styleId, updates);
  },
});

// Delete style
export const deleteStyle = mutation({
  args: { styleId: v.id("styles") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.styleId);
  },
});

// Create or update style rate
export const createStyleRate = mutation({
  args: {
    styleId: v.id("styles"),
    organizationId: v.id("organizations"),
    rate: v.number(),
    effectiveDate: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("styleRates", args);
  },
});

// Get current rate for a style on a specific date
export const getStyleRate = query({
  args: {
    styleId: v.id("styles"),
    date: v.string(),
  },
  handler: async (ctx, args) => {
    // Get all rates for this style up to the specified date
    const rates = await ctx.db
      .query("styleRates")
      .withIndex("by_style", (q) => q.eq("styleId", args.styleId))
      .filter((q) => q.lte(q.field("effectiveDate"), args.date))
      .collect();

    // Return the most recent rate
    return rates.sort((a, b) =>
      b.effectiveDate.localeCompare(a.effectiveDate)
    )[0];
  },
});

// Get all rates for a style
export const getStyleRates = query({
  args: { styleId: v.id("styles") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("styleRates")
      .withIndex("by_style", (q) => q.eq("styleId", args.styleId))
      .collect();
  },
});
