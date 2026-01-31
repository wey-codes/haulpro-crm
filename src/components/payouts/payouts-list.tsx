"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, Clock } from "lucide-react";
import type { Payout } from "@/types/database";
import { getSubById, getJobById } from "@/lib/mock-data";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  paid: "bg-green-100 text-green-800",
};

interface PayoutsListProps {
  payouts: Payout[];
}

export function PayoutsList({ payouts }: PayoutsListProps) {
  const router = useRouter();
  const [filter, setFilter] = useState<string>("all");
  const [markingPaid, setMarkingPaid] = useState<string | null>(null);

  const filteredPayouts =
    filter === "all" ? payouts : payouts.filter((p) => p.status === filter);

  const handleMarkPaid = async (payoutId: string) => {
    setMarkingPaid(payoutId);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    // In production, this would update the payout status in the database
    setMarkingPaid(null);
    router.refresh();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>All Payouts</CardTitle>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Payouts</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-3 font-medium">Sub</th>
                <th className="pb-3 font-medium">Job</th>
                <th className="pb-3 font-medium">Base</th>
                <th className="pb-3 font-medium">Bonus</th>
                <th className="pb-3 font-medium">Total</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayouts.map((payout) => {
                const sub = getSubById(payout.sub_id);
                const job = getJobById(payout.job_id);
                const isMarking = markingPaid === payout.id;

                return (
                  <tr
                    key={payout.id}
                    className="border-b last:border-0 hover:bg-muted/50"
                  >
                    <td className="py-3">
                      {sub ? (
                        <Link
                          href={`/subs/${sub.id}`}
                          className="font-medium hover:underline"
                        >
                          {sub.name}
                        </Link>
                      ) : (
                        <span className="text-muted-foreground">Unknown</span>
                      )}
                    </td>
                    <td className="py-3">
                      {job ? (
                        <Link
                          href={`/jobs/${job.id}`}
                          className="hover:underline"
                        >
                          {job.customer_name}
                        </Link>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="py-3">${payout.base_amount}</td>
                    <td className="py-3">
                      {payout.bonus_amount > 0 ? (
                        <span className="text-green-600">
                          +${payout.bonus_amount}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="py-3 font-medium">
                      ${payout.total_amount}
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          statusColors[payout.status] || "bg-gray-100"
                        }`}
                      >
                        {payout.status === "pending" ? (
                          <Clock className="h-3 w-3" />
                        ) : (
                          <Check className="h-3 w-3" />
                        )}
                        {payout.status}
                      </span>
                    </td>
                    <td className="py-3 text-muted-foreground">
                      {payout.paid_at
                        ? new Date(payout.paid_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })
                        : new Date(payout.created_at).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                            }
                          )}
                    </td>
                    <td className="py-3">
                      {payout.status === "pending" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleMarkPaid(payout.id)}
                          disabled={isMarking}
                        >
                          {isMarking ? "Marking..." : "Mark Paid"}
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filteredPayouts.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="py-8 text-center text-muted-foreground"
                  >
                    No payouts found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
