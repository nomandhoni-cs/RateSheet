import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create a new section
export const createSection = mutation({
  args: {
    name: v.string(),
    managerId: v.id("users"),
    organizationId: v.id("organizations"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("sections", args);
  },
});

// Get all sections in organization
export const getAllSections = query({
  args: { organizationId: v.id("organizations") },
  handler: async (ctx, args) => {
    const sections = await ctx.db
      .query("sections")
      .withIndex("by_organization", (q) =>
        q.eq("organizationId", args.organizationId)
      )
      .collect();

    // Get manager details for each section
    const sectionsWithManagers = await Promise.all(
      sections.map(async (section) => {
        const manager = await ctx.db.get(section.managerId);
        return {
          ...section,
          manager,
        };
      })
    );

    return sectionsWithManagers;
  },
});

// Get sections by manager
export const getSectionsByManager = query({
  args: { managerId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("sections")
      .withIndex("by_manager", (q) => q.eq("managerId", args.managerId))
      .collect();
  },
});

// Update section
export const updateSection = mutation({
  args: {
    sectionId: v.id("sections"),
    name: v.string(),
    managerId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const { sectionId, ...updates } = args;
    await ctx.db.patch(sectionId, updates);
  },
});

// Delete section
export const deleteSection = mutation({
  args: { sectionId: v.id("sections") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.sectionId);
  },
});
