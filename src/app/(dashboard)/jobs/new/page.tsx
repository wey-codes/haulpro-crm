import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JobForm } from "@/components/jobs/job-form";
import { getLeadById, getPackages } from "@/lib/mock-data";

interface NewJobPageProps {
  searchParams: Promise<{ lead_id?: string }>;
}

export default async function NewJobPage({ searchParams }: NewJobPageProps) {
  const { lead_id } = await searchParams;
  const lead = lead_id ? getLeadById(lead_id) : null;
  const packages = getPackages(true); // Include hidden packages

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={lead ? `/leads/${lead.id}` : "/jobs"}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Create Job</h1>
          <p className="text-muted-foreground">
            {lead
              ? `Creating job for ${lead.customer_name}`
              : "Book a new job"}
          </p>
        </div>
      </div>

      {lead && (
        <div className="p-4 bg-blue-50 text-blue-800 rounded-lg">
          <p className="text-sm">
            Pre-filling from lead data. The lead will be marked as
            &ldquo;Won&rdquo; when this job is created.
          </p>
        </div>
      )}

      <JobForm lead={lead} packages={packages} />
    </div>
  );
}
