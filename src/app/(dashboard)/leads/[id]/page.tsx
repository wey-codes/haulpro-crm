import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Edit, Phone, Mail, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QuoteBuilder } from "@/components/leads/quote-builder";
import { LeadStatusActions } from "@/components/leads/lead-status-actions";
import { getLeadById, getPackageById, getPackages } from "@/lib/mock-data";

const statusColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-800",
  photo_requested: "bg-yellow-100 text-yellow-800",
  quoted: "bg-purple-100 text-purple-800",
  won: "bg-green-100 text-green-800",
  lost: "bg-gray-100 text-gray-800",
};

const sourceLabels: Record<string, string> = {
  gmb: "Google My Business",
  facebook: "Facebook",
  instagram: "Instagram",
  call: "Phone Call",
  text: "Text Message",
  walk_in: "Walk-in",
  bandit_sign: "Bandit Sign",
  website: "Website",
  referral: "Referral",
  other: "Other",
};

interface LeadDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function LeadDetailPage({ params }: LeadDetailPageProps) {
  const { id } = await params;
  const lead = getLeadById(id);

  if (!lead) {
    notFound();
  }

  const quotedPackage = lead.quoted_package_id
    ? getPackageById(lead.quoted_package_id)
    : null;

  const packages = getPackages();

  const fullAddress = [
    lead.address_line1,
    lead.address_line2,
    lead.city && lead.state ? `${lead.city}, ${lead.state}` : lead.city || lead.state,
    lead.zip,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/leads">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{lead.customer_name}</h1>
            <p className="text-muted-foreground">
              Lead from {sourceLabels[lead.source] || lead.source}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
              statusColors[lead.status] || "bg-gray-100"
            }`}
          >
            {lead.status.replace("_", " ")}
          </span>
          <Button asChild variant="outline">
            <Link href={`/leads/${lead.id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </Button>
        </div>
      </div>

      {/* Status Actions - Always visible at top */}
      <LeadStatusActions lead={lead} />

      <div className="grid gap-6 md:grid-cols-2">
        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <a
                  href={`tel:${lead.phone}`}
                  className="font-medium hover:underline"
                >
                  {lead.phone}
                </a>
              </div>
            </div>

            {lead.email && (
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <a
                    href={`mailto:${lead.email}`}
                    className="font-medium hover:underline"
                  >
                    {lead.email}
                  </a>
                </div>
              </div>
            )}

            {fullAddress && (
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-medium">{fullAddress}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="font-medium">
                  {new Date(lead.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quote Information - Show existing quote or quote builder */}
        {lead.quoted_package_id && lead.quoted_price ? (
          <Card>
            <CardHeader>
              <CardTitle>Quote Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Package</p>
                  <p className="font-medium text-lg">
                    {quotedPackage?.name || "Unknown Package"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Quoted Price</p>
                  <p className="font-bold text-2xl text-green-600">
                    ${lead.quoted_price.toLocaleString()}
                  </p>
                </div>
                {lead.quoted_at && (
                  <div>
                    <p className="text-sm text-muted-foreground">Quoted On</p>
                    <p className="font-medium">
                      {new Date(lead.quoted_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <QuoteBuilder lead={lead} packages={packages} />
        )}

        {/* Notes */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            {lead.notes ? (
              <p className="whitespace-pre-wrap">{lead.notes}</p>
            ) : (
              <p className="text-muted-foreground">No notes added</p>
            )}
          </CardContent>
        </Card>

        {/* Source Details */}
        {lead.source_detail && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Source Details</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{lead.source_detail}</p>
            </CardContent>
          </Card>
        )}

        {/* Photos */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Photos</CardTitle>
          </CardHeader>
          <CardContent>
            {lead.photos && lead.photos.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {lead.photos.map((photo, index) => (
                  <div
                    key={index}
                    className="aspect-square bg-muted rounded-lg overflow-hidden"
                  >
                    <img
                      src={photo}
                      alt={`Lead photo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No photos uploaded</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
