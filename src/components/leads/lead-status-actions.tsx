"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Camera,
  Send,
  CheckCircle,
  XCircle,
  Briefcase,
  ArrowRight,
} from "lucide-react";
import type { Lead, LeadStatus } from "@/types/database";

interface LeadStatusActionsProps {
  lead: Lead;
}

const statusFlow: Record<LeadStatus, LeadStatus[]> = {
  new: ["photo_requested", "quoted"],
  photo_requested: ["quoted"],
  quoted: ["won", "lost"],
  won: [],
  lost: [],
};

const statusActions: Record<
  LeadStatus,
  { label: string; icon: React.ReactNode; variant?: "default" | "outline" | "destructive" }[]
> = {
  new: [
    { label: "Request Photos", icon: <Camera className="h-4 w-4" /> },
    { label: "Send Quote", icon: <Send className="h-4 w-4" /> },
  ],
  photo_requested: [
    { label: "Send Quote", icon: <Send className="h-4 w-4" /> },
  ],
  quoted: [
    { label: "Mark as Won", icon: <CheckCircle className="h-4 w-4" /> },
    { label: "Mark as Lost", icon: <XCircle className="h-4 w-4" />, variant: "outline" as const },
  ],
  won: [],
  lost: [],
};

export function LeadStatusActions({ lead }: LeadStatusActionsProps) {
  const router = useRouter();
  const [updating, setUpdating] = useState<string | null>(null);

  const handleStatusChange = async (newStatus: LeadStatus) => {
    setUpdating(newStatus);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    // In production, this would update the lead status in the database
    setUpdating(null);
    router.refresh();
  };

  const nextStatuses = statusFlow[lead.status];
  const actions = statusActions[lead.status];

  if (lead.status === "won") {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <h3 className="font-semibold text-green-800">Lead Won!</h3>
                <p className="text-sm text-green-700">
                  Ready to create a job for this customer
                </p>
              </div>
            </div>
            <Button asChild className="bg-green-600 hover:bg-green-700">
              <Link href={`/jobs/new?lead_id=${lead.id}`}>
                <Briefcase className="h-4 w-4 mr-2" />
                Create Job
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (lead.status === "lost") {
    return (
      <Card className="border-gray-200 bg-gray-50">
        <CardContent className="py-6">
          <div className="flex items-center gap-3">
            <XCircle className="h-8 w-8 text-gray-500" />
            <div>
              <h3 className="font-semibold text-gray-700">Lead Lost</h3>
              <p className="text-sm text-gray-600">
                This lead has been marked as lost
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowRight className="h-5 w-5" />
          Next Steps
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Status Progress */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Current Status:</span>
            <span className="font-medium capitalize">
              {lead.status.replace("_", " ")}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            {actions.map((action, index) => {
              const targetStatus = nextStatuses[index];
              const isUpdating = updating === targetStatus;

              return (
                <Button
                  key={action.label}
                  variant={action.variant || "default"}
                  onClick={() => handleStatusChange(targetStatus)}
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
            <p className="text-xs text-muted-foreground mb-2">Pipeline Progress</p>
            <div className="flex items-center gap-1">
              {(["new", "photo_requested", "quoted", "won"] as const).map((status, index) => {
                const isActive = status === lead.status;
                const isPast =
                  ["new", "photo_requested", "quoted", "won"].indexOf(lead.status) > index ||
                  (lead.status === "lost" && index < 3);

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
                    {index < 3 && (
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
