"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Play,
  CheckCircle,
  XCircle,
  Send,
  Clock,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";
import type { Job, JobStatus } from "@/types/database";

interface JobStatusActionsProps {
  job: Job;
}

const statusFlow: Record<JobStatus, JobStatus[]> = {
  booked: ["pending_claim", "cancelled"],
  pending_claim: ["assigned", "cancelled"],
  assigned: ["in_progress", "cancelled"],
  in_progress: ["completed", "cancelled"],
  completed: [],
  cancelled: [],
};

type ActionConfig = {
  label: string;
  icon: React.ReactNode;
  variant?: "default" | "outline" | "destructive";
  targetStatus: JobStatus;
};

const statusActions: Record<JobStatus, ActionConfig[]> = {
  booked: [
    {
      label: "Send to Subs",
      icon: <Send className="h-4 w-4" />,
      targetStatus: "pending_claim",
    },
    {
      label: "Cancel Job",
      icon: <XCircle className="h-4 w-4" />,
      variant: "destructive",
      targetStatus: "cancelled",
    },
  ],
  pending_claim: [
    {
      label: "Cancel Job",
      icon: <XCircle className="h-4 w-4" />,
      variant: "destructive",
      targetStatus: "cancelled",
    },
  ],
  assigned: [
    {
      label: "Start Job",
      icon: <Play className="h-4 w-4" />,
      targetStatus: "in_progress",
    },
    {
      label: "Cancel Job",
      icon: <XCircle className="h-4 w-4" />,
      variant: "destructive",
      targetStatus: "cancelled",
    },
  ],
  in_progress: [
    {
      label: "Mark Complete",
      icon: <CheckCircle className="h-4 w-4" />,
      targetStatus: "completed",
    },
    {
      label: "Cancel Job",
      icon: <XCircle className="h-4 w-4" />,
      variant: "destructive",
      targetStatus: "cancelled",
    },
  ],
  completed: [],
  cancelled: [],
};

export function JobStatusActions({ job }: JobStatusActionsProps) {
  const router = useRouter();
  const [updating, setUpdating] = useState<string | null>(null);

  const handleStatusChange = async (newStatus: JobStatus) => {
    setUpdating(newStatus);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    // In production, this would update the job status in the database
    setUpdating(null);
    router.refresh();
  };

  const actions = statusActions[job.status];

  if (job.status === "completed") {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="py-6">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div>
              <h3 className="font-semibold text-green-800">Job Completed!</h3>
              <p className="text-sm text-green-700">
                {job.completed_at
                  ? `Completed on ${new Date(job.completed_at).toLocaleDateString()}`
                  : "This job has been marked as complete"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (job.status === "cancelled") {
    return (
      <Card className="border-gray-200 bg-gray-50">
        <CardContent className="py-6">
          <div className="flex items-center gap-3">
            <XCircle className="h-8 w-8 text-gray-500" />
            <div>
              <h3 className="font-semibold text-gray-700">Job Cancelled</h3>
              <p className="text-sm text-gray-600">
                {job.cancellation_reason || "This job has been cancelled"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show warning if job is pending_claim but no sub assigned
  const needsSubAssignment =
    job.status === "pending_claim" && !job.assigned_sub_id;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowRight className="h-5 w-5" />
          Job Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Warning for pending claim */}
          {needsSubAssignment && (
            <div className="flex items-center gap-2 p-3 bg-yellow-50 text-yellow-800 rounded-lg">
              <AlertTriangle className="h-5 w-5" />
              <span className="text-sm">
                Waiting for a sub to claim this job. Assign a sub below to continue.
              </span>
            </div>
          )}

          {/* Status Info */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Current Status:</span>
            <span className="font-medium capitalize">
              {job.status.replace("_", " ")}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            {actions.map((action) => {
              const isUpdating = updating === action.targetStatus;

              // Don't show "Send to Subs" if already assigned
              if (
                action.targetStatus === "pending_claim" &&
                job.assigned_sub_id
              ) {
                return null;
              }

              return (
                <Button
                  key={action.label}
                  variant={action.variant || "default"}
                  onClick={() => handleStatusChange(action.targetStatus)}
                  disabled={isUpdating || updating !== null}
                >
                  {isUpdating ? (
                    "Updating..."
                  ) : (
                    <>
                      {action.icon}
                      <span className="ml-2">{action.label}</span>
                    </>
                  )}
                </Button>
              );
            })}
          </div>

          {/* Status Flow Indicator */}
          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground mb-2">Job Progress</p>
            <div className="flex items-center gap-1 flex-wrap">
              {(
                [
                  "booked",
                  "pending_claim",
                  "assigned",
                  "in_progress",
                  "completed",
                ] as const
              ).map((status, index) => {
                const isActive = status === job.status;
                const statusIndex = [
                  "booked",
                  "pending_claim",
                  "assigned",
                  "in_progress",
                  "completed",
                ].indexOf(job.status);
                const isPast = index < statusIndex;

                return (
                  <div key={status} className="flex items-center">
                    <div
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        isActive
                          ? "bg-blue-100 text-blue-800"
                          : isPast
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {status.replace("_", " ")}
                    </div>
                    {index < 4 && (
                      <ArrowRight className="h-3 w-3 mx-1 text-gray-300" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
