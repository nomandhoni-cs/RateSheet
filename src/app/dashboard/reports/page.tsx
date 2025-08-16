"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ReportsPage() {
  const { user } = useUser();
  const [selectedSectionId, setSelectedSectionId] = useState<string>("");
  const [selectedStyleId, setSelectedStyleId] = useState<string>("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const userData = useQuery(
    api.users.getUserByClerkId,
    user ? { clerkId: user.id } : "skip"
  );

  const sections = useQuery(
    api.sections.getAllSections,
    userData?.organizationId
      ? { organizationId: userData.organizationId }
      : "skip"
  );

  const styles = useQuery(
    api.styles.getAllStyles,
    userData?.organizationId
      ? { organizationId: userData.organizationId }
      : "skip"
  );

  const sectionSummary = useQuery(
    api.sections.getSectionSummary,
    selectedSectionId && startDate && endDate
      ? {
          sectionId: selectedSectionId as any,
          startDate,
          endDate,
        }
      : "skip"
  );

  const styleSummary = useQuery(
    api.styles.getStyleSummaryForSection,
    selectedSectionId && selectedStyleId && startDate && endDate
      ? {
          sectionId: selectedSectionId as any,
          styleId: selectedStyleId as any,
          startDate,
          endDate,
        }
      : "skip"
  );

  const today = new Date().toISOString().split("T")[0];

  if (!userData || !sections || !styles) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-muted-foreground">Loading reports...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-sans font-bold">Reports</h1>
          <p className="text-base lg:text-lg text-muted-foreground mt-2">
            Section and style summaries for a specific time period
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Select a section, optional style, and date range</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="section">Section</Label>
              <Select value={selectedSectionId} onValueChange={setSelectedSectionId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a section" />
                </SelectTrigger>
                <SelectContent>
                  {sections.map((section) => (
                    <SelectItem key={section._id} value={section._id}>
                      {section.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="style">Style (Optional)</Label>
              <Select
                value={selectedStyleId}
                onValueChange={setSelectedStyleId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All styles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All styles</SelectItem>
                  {styles.map((style) => (
                    <SelectItem key={style._id} value={style._id}>
                      {style.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                max={today}
              />
            </div>
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                max={today}
                min={startDate}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Section Summary</CardTitle>
          <CardDescription>
            Totals for the selected section and date range. Per-style breakdown shown below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!selectedSectionId || !startDate || !endDate ? (
            <p className="text-muted-foreground">Select a section and date range to view the summary.</p>
          ) : !sectionSummary ? (
            <div className="py-8 text-center text-sm text-muted-foreground">Loading section summary...</div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-md border">
                  <div className="text-sm text-muted-foreground">Total Quantity</div>
                  <div className="text-2xl font-bold">{sectionSummary.totalQuantity}</div>
                </div>
                <div className="p-4 rounded-md border">
                  <div className="text-sm text-muted-foreground">Total Pay</div>
                  <div className="text-2xl font-bold">৳{sectionSummary.totalPay.toFixed(2)}</div>
                </div>
              </div>

              <div>
                <div className="font-semibold mb-2">Per-Style Breakdown</div>
                {sectionSummary.styleSummaries.length === 0 ? (
                  <p className="text-muted-foreground">No production in this period.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Style</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead className="text-right">Pay</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sectionSummary.styleSummaries.map((item, idx) => (
                          <TableRow key={idx}>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell className="text-right">৳{item.pay.toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Style Summary (within Section)</CardTitle>
          <CardDescription>Totals for a specific style in the selected section and date range.</CardDescription>
        </CardHeader>
        <CardContent>
          {!selectedSectionId || selectedStyleId === "all" || !startDate || !endDate ? (
            <p className="text-muted-foreground">Select a section, style, and date range to view the style summary.</p>
          ) : !styleSummary ? (
            <div className="py-8 text-center text-sm text-muted-foreground">Loading style summary...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-md border">
                <div className="text-sm text-muted-foreground">Total Quantity</div>
                <div className="text-2xl font-bold">{styleSummary.totalQuantity}</div>
              </div>
              <div className="p-4 rounded-md border">
                <div className="text-sm text-muted-foreground">Total Pay</div>
                <div className="text-2xl font-bold">৳{styleSummary.totalPay.toFixed(2)}</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
