"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
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
import { LoadingSpinner } from "@/components/ui/loading";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function StylesPage() {
  const { user } = useUser();
  const [isAddingStyle, setIsAddingStyle] = useState(false);
  const [newStyleName, setNewStyleName] = useState("");
  const [newStyleDescription, setNewStyleDescription] = useState("");
  const [isAddingRate, setIsAddingRate] = useState<string | null>(null);
  const [newRate, setNewRate] = useState("");
  const [newEffectiveDate, setNewEffectiveDate] = useState("");

  const userData = useQuery(
    api.users.getUserByClerkId,
    user ? { clerkId: user.id } : "skip"
  );

  const styles = useQuery(
    api.styles.getAllStyles,
    userData?.organizationId
      ? { organizationId: userData.organizationId }
      : "skip"
  );

  const createStyle = useMutation(api.styles.createStyle);
  const deleteStyle = useMutation(api.styles.deleteStyle);
  const createStyleRate = useMutation(api.styles.createStyleRate);

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  const handleAddStyle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStyleName.trim() || !userData?.organizationId) return;

    try {
      await createStyle({
        name: newStyleName.trim(),
        description: newStyleDescription.trim() || undefined,
        organizationId: userData.organizationId,
      });
      setNewStyleName("");
      setNewStyleDescription("");
      setIsAddingStyle(false);
    } catch (error) {
      console.error("Failed to create style:", error);
    }
  };

  const handleAddRate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !isAddingRate ||
      !newRate ||
      !newEffectiveDate ||
      !userData?.organizationId
    )
      return;

    try {
      await createStyleRate({
        styleId: isAddingRate as any,
        organizationId: userData.organizationId,
        rate: parseFloat(newRate),
        effectiveDate: newEffectiveDate,
      });
      setNewRate("");
      setNewEffectiveDate("");
      setIsAddingRate(null);
    } catch (error) {
      console.error("Failed to create style rate:", error);
    }
  };

  const handleDeleteStyle = async (styleId: string) => {
    if (
      confirm(
        "Are you sure you want to delete this style? This will affect all related production logs."
      )
    ) {
      try {
        await deleteStyle({ styleId: styleId as any });
      } catch (error) {
        console.error("Failed to delete style:", error);
      }
    }
  };

  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center animate-fadeInUp">
          <LoadingSpinner size="lg" className="mb-4 mx-auto" />
          <h2 className="text-lg font-sans font-medium text-foreground mb-2">Loading Styles</h2>
          <p className="text-sm text-muted-foreground">Fetching style data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-sans font-bold">Styles & Rates</h1>
          <p className="text-base lg:text-lg text-muted-foreground mt-2">
            Manage product styles and their time-sensitive rates
          </p>
        </div>
        <Button
          onClick={() => setIsAddingStyle(true)}
          className="w-full sm:w-auto"
        >
          Add Style
        </Button>
      </div>

      {isAddingStyle && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Style</CardTitle>
            <CardDescription>Create a new product style</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddStyle} className="space-y-4">
              <div>
                <Label htmlFor="styleName">Style Name</Label>
                <Input
                  id="styleName"
                  value={newStyleName}
                  onChange={(e) => setNewStyleName(e.target.value)}
                  placeholder="e.g., Style #A113, SKU-B404"
                  required
                />
              </div>
              <div>
                <Label htmlFor="styleDescription">Description (Optional)</Label>
                <Input
                  id="styleDescription"
                  value={newStyleDescription}
                  onChange={(e) => setNewStyleDescription(e.target.value)}
                  placeholder="Brief description of the product"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button type="submit" className="w-full sm:w-auto">
                  Add Style
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() => {
                    setIsAddingStyle(false);
                    setNewStyleName("");
                    setNewStyleDescription("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {isAddingRate && (
        <Card>
          <CardHeader>
            <CardTitle>Add Rate</CardTitle>
            <CardDescription>
              Set a new rate for the selected style
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddRate} className="space-y-4">
              <div>
                <Label htmlFor="rate">Rate per Unit ($)</Label>
                <Input
                  id="rate"
                  type="number"
                  step="0.01"
                  min="0"
                  value={newRate}
                  onChange={(e) => setNewRate(e.target.value)}
                  placeholder="0.75"
                  required
                />
              </div>
              <div>
                <Label htmlFor="effectiveDate">Effective Date</Label>
                <Input
                  id="effectiveDate"
                  type="date"
                  value={newEffectiveDate}
                  onChange={(e) => setNewEffectiveDate(e.target.value)}
                  max={today}
                  required
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button type="submit" className="w-full sm:w-auto">
                  Add Rate
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() => {
                    setIsAddingRate(null);
                    setNewRate("");
                    setNewEffectiveDate("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Styles</CardTitle>
          <CardDescription>
            {styles?.length || 0} styles in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!styles || styles.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No styles found. Add your first style to get started.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Style Name</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Description
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {styles.map((style) => (
                    <TableRow key={style._id}>
                      <TableCell className="font-medium">
                        <div>
                          <div>{style.name}</div>
                          <div className="text-sm text-muted-foreground md:hidden">
                            {style.description || "No description"}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {style.description || "No description"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex flex-col sm:flex-row gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsAddingRate(style._id)}
                          >
                            Add Rate
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteStyle(style._id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
