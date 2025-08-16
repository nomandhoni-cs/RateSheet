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

export default function ProductionPage() {
  const { user } = useUser();
  const [isAddingLog, setIsAddingLog] = useState(false);
  const [selectedWorkerId, setSelectedWorkerId] = useState<string>("");
  const [selectedStyleId, setSelectedStyleId] = useState<string>("");
  const [quantity, setQuantity] = useState("");
  const [productionDate, setProductionDate] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const userData = useQuery(
    api.users.getUserByClerkId,
    user ? { clerkId: user.id } : "skip"
  );

  const workers = useQuery(
    api.workers.getAllWorkers,
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

  const productionLogs = useQuery(
    api.productionLogs.getProductionLogsByDate,
    userData?.organizationId
      ? {
          date: selectedDate,
          organizationId: userData.organizationId,
        }
      : "skip"
  );

  const createProductionLog = useMutation(
    api.productionLogs.createProductionLog
  );
  const deleteProductionLog = useMutation(
    api.productionLogs.deleteProductionLog
  );

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  const handleAddLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !selectedWorkerId ||
      !selectedStyleId ||
      !quantity ||
      !productionDate ||
      !userData?.organizationId
    )
      return;

    try {
      await createProductionLog({
        workerId: selectedWorkerId as any,
        styleId: selectedStyleId as any,
        organizationId: userData.organizationId,
        quantity: parseInt(quantity),
        productionDate,
      });
      setSelectedWorkerId("");
      setSelectedStyleId("");
      setQuantity("");
      setProductionDate("");
      setIsAddingLog(false);
    } catch (error) {
      console.error("Failed to create production log:", error);
    }
  };

  const handleDeleteLog = async (logId: string) => {
    if (confirm("Are you sure you want to delete this production log?")) {
      try {
        await deleteProductionLog({ logId: logId as any });
      } catch (error) {
        console.error("Failed to delete production log:", error);
      }
    }
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-sans font-bold">Production Logs</h1>
          <p className="text-base lg:text-lg text-muted-foreground mt-2">
            Track daily worker production output
          </p>
        </div>
        <Button
          onClick={() => setIsAddingLog(true)}
          className="w-full sm:w-auto"
        >
          Add Production Log
        </Button>
      </div>

      {isAddingLog && (
        <Card>
          <CardHeader>
            <CardTitle>Add Production Log</CardTitle>
            <CardDescription>
              Record worker production for a specific style and date
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddLog} className="space-y-4">
              <div>
                <Label htmlFor="worker">Worker</Label>
                <Select
                  value={selectedWorkerId}
                  onValueChange={setSelectedWorkerId}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a worker" />
                  </SelectTrigger>
                  <SelectContent>
                    {workers?.map((worker) => (
                      <SelectItem key={worker._id} value={worker._id}>
                        {worker.name} ({worker.section?.name})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="style">Style</Label>
                <Select
                  value={selectedStyleId}
                  onValueChange={setSelectedStyleId}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a style" />
                  </SelectTrigger>
                  <SelectContent>
                    {styles?.map((style) => (
                      <SelectItem key={style._id} value={style._id}>
                        {style.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="quantity">Quantity Produced</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Enter quantity"
                  required
                />
              </div>
              <div>
                <Label htmlFor="productionDate">Production Date</Label>
                <Input
                  id="productionDate"
                  type="date"
                  value={productionDate}
                  onChange={(e) => setProductionDate(e.target.value)}
                  max={today}
                  required
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button type="submit" className="w-full sm:w-auto">
                  Add Log
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() => {
                    setIsAddingLog(false);
                    setSelectedWorkerId("");
                    setSelectedStyleId("");
                    setQuantity("");
                    setProductionDate("");
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
          <CardTitle>Production Logs</CardTitle>
          <CardDescription>
            View production logs for a specific date
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Label htmlFor="dateFilter">Filter by Date</Label>
            <Input
              id="dateFilter"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              max={today}
              className="w-full sm:w-auto"
            />
          </div>

          {!productionLogs || productionLogs.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No production logs found for {selectedDate}. Add production logs
              to get started.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Worker</TableHead>
                    <TableHead className="hidden sm:table-cell">
                      Section
                    </TableHead>
                    <TableHead>Style</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead className="hidden md:table-cell">Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productionLogs.map((log) => (
                    <TableRow key={log._id}>
                      <TableCell className="font-medium">
                        <div>
                          <div>{log.worker?.name}</div>
                          <div className="text-sm text-muted-foreground sm:hidden">
                            {log.worker?.section?.name}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {log.worker?.section?.name}
                      </TableCell>
                      <TableCell>{log.style?.name}</TableCell>
                      <TableCell className="font-medium">
                        {log.quantity}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {log.productionDate}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteLog(log._id)}
                        >
                          Delete
                        </Button>
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
