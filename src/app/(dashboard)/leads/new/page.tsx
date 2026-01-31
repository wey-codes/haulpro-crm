import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LeadForm } from "@/components/leads/lead-form";

export default function NewLeadPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/leads">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">New Lead</h1>
          <p className="text-muted-foreground">
            Add a new customer to your pipeline
          </p>
        </div>
      </div>

      <LeadForm />
    </div>
  );
}
