"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  Phone,
  Star,
  CheckCircle,
  UserMinus,
  UserPlus,
} from "lucide-react";
import type { Job, Subcontractor } from "@/types/database";

interface SubAssignmentProps {
  job: Job;
  assignedSub: Subcontractor | null;
  availableSubs: Subcontractor[];
}

export function SubAssignment({
  job,
  assignedSub,
  availableSubs,
}: SubAssignmentProps) {
  const router = useRouter();
  const [selectedSubId, setSelectedSubId] = useState<string>("");
  const [assigning, setAssigning] = useState(false);
  const [unassigning, setUnassigning] = useState(false);

  const handleAssign = async () => {
    if (!selectedSubId) return;

    setAssigning(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    // In production, this would:
    // 1. Update job.assigned_sub_id
    // 2. Update job.status to 'assigned'
    // 3. Send confirmation SMS to sub

    setAssigning(false);
    setSelectedSubId("");
    router.refresh();
  };

  const handleUnassign = async () => {
    setUnassigning(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    // In production, this would:
    // 1. Clear job.assigned_sub_id
    // 2. Update job.status back to 'pending_claim' or 'booked'
    // 3. Optionally notify the sub

    setUnassigning(false);
    router.refresh();
  };

  // Job is completed or cancelled - no assignment changes allowed
  if (job.status === "completed" || job.status === "cancelled") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Assigned Subcontractor
          </CardTitle>
        </CardHeader>
        <CardContent>
          {assignedSub ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{assignedSub.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {assignedSub.phone}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">No sub was assigned to this job</p>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          {assignedSub ? "Assigned Subcontractor" : "Assign Subcontractor"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {assignedSub ? (
          <div className="space-y-4">
            {/* Current Assignment */}
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <User className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-green-900">
                      {assignedSub.name}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-green-700">
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {assignedSub.phone}
                      </span>
                      {assignedSub.rating && (
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          {assignedSub.rating}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>

            {/* Sub Stats */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-muted-foreground">Jobs Completed</p>
                <p className="font-bold text-lg">{assignedSub.jobs_completed}</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-muted-foreground">Total Earnings</p>
                <p className="font-bold text-lg">
                  ${assignedSub.total_earnings.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Unassign Button */}
            <Button
              variant="outline"
              onClick={handleUnassign}
              disabled={unassigning}
              className="w-full"
            >
              {unassigning ? (
                "Unassigning..."
              ) : (
                <>
                  <UserMinus className="h-4 w-4 mr-2" />
                  Unassign Sub
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* No Assignment Yet */}
            <p className="text-muted-foreground text-sm">
              Select a subcontractor to assign to this job
            </p>

            {/* Sub Selector */}
            <Select value={selectedSubId} onValueChange={setSelectedSubId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a subcontractor..." />
              </SelectTrigger>
              <SelectContent>
                {availableSubs.map((sub) => (
                  <SelectItem key={sub.id} value={sub.id}>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{sub.name}</span>
                      {sub.rating && (
                        <span className="text-muted-foreground text-xs">
                          ({sub.rating} stars)
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Selected Sub Preview */}
            {selectedSubId && (
              <div className="p-3 bg-muted rounded-lg">
                {(() => {
                  const sub = availableSubs.find((s) => s.id === selectedSubId);
                  if (!sub) return null;
                  return (
                    <div className="space-y-2">
                      <p className="font-medium">{sub.name}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{sub.phone}</span>
                        <span>{sub.jobs_completed} jobs completed</span>
                        {sub.rating && (
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            {sub.rating}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Assign Button */}
            <Button
              onClick={handleAssign}
              disabled={!selectedSubId || assigning}
              className="w-full"
            >
              {assigning ? (
                "Assigning..."
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Assign Sub
                </>
              )}
            </Button>

            {/* Alternative: Send to All */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or
                </span>
              </div>
            </div>

            <Button variant="outline" className="w-full">
              Blast to All Active Subs
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
