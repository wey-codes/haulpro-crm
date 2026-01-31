import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LeadForm } from "@/components/leads/lead-form";
import { getLeadById } from "@/lib/mock-data";

interface EditLeadPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditLeadPage({ params }: EditLeadPageProps) {
  const { id } = await params;
  const lead = getLeadById(id);

  if (!lead) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={`/leads/${id}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Edit Lead</h1>
          <p className="text-muted-foreground">{lead.customer_name}</p>
        </div>
      </div>

      <LeadForm lead={lead} />
    </div>
  );
}
