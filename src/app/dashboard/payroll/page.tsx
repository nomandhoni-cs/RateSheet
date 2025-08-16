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

export default function PayrollPage() {
  const { user } = useUser();
  const [selectedWorkerId, setSelectedWorkerId] = useState<string>("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showPayroll, setShowPayroll] = useState(false);

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

  const payrollData = useQuery(
    api.productionLogs.calculateWorkerPayroll,
    selectedWorkerId && startDate && endDate && showPayroll
      ? {
        workerId: selectedWorkerId as any,
        startDate,
        endDate,
      }
      : "skip"
  );

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  const handleCalculatePayroll = () => {
    if (selectedWorkerId && startDate && endDate) {
      setShowPayroll(true);
    }
  };

  const handleReset = () => {
    setSelectedWorkerId("");
    setStartDate("");
    setEndDate("");
    setShowPayroll(false);
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <div>
        <h1 className="text-3xl lg:text-4xl font-sans font-bold">Payroll Calculator</h1>
        <p className="text-base lg:text-lg text-muted-foreground mt-2">
          Calculate worker payroll based on production logs and style rates
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Calculate Payroll</CardTitle>
          <CardDescription>
            Select a worker and date range to calculate their payroll
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="worker">Worker</Label>
            <Select
              value={selectedWorkerId}
              onValueChange={setSelectedWorkerId}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              onClick={handleCalculatePayroll}
              disabled={!selectedWorkerId || !startDate || !endDate}
              className="w-full sm:w-auto"
            >
              Calculate Payroll
            </Button>
            <Button
              variant="outline"
              onClick={handleReset}
              className="w-full sm:w-auto"
            >
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {showPayroll && payrollData && (
        <Card>
          <CardHeader>
            <CardTitle>Payroll Results</CardTitle>
            <CardDescription>
              Payroll calculation for{" "}
              {workers?.find((w) => w._id === selectedWorkerId)?.name}
              from {startDate} to {endDate}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="text-3xl font-bold text-green-600">
                Total Pay: ৳{payrollData.totalPay.toFixed(2)}
              </div>
            </div>

            {payrollData.details.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No production logs found for the selected period.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Style</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Rate</TableHead>
                      <TableHead className="text-right">Pay</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payrollData.details.map((detail, index) => (
                      <TableRow key={index}>
                        <TableCell>{detail.productionDate}</TableCell>
                        <TableCell>{detail.style?.name}</TableCell>
                        <TableCell>{detail.quantity}</TableCell>
                        <TableCell>৳{detail.rate.toFixed(2)}</TableCell>
                        <TableCell className="text-right font-medium">
                          ${detail.pay.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
