import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  CreditCard,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { JobStatusActions } from "@/components/jobs/job-status-actions";
import { SubAssignment } from "@/components/jobs/sub-assignment";
import {
  getJobById,
  getPackageById,
  getSubById,
  getSubcontractors,
} from "@/lib/mock-data";

const statusColors: Record<string, string> = {
  booked: "bg-blue-100 text-blue-800",
  pending_claim: "bg-yellow-100 text-yellow-800",
  assigned: "bg-purple-100 text-purple-800",
  in_progress: "bg-orange-100 text-orange-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-gray-100 text-gray-800",
};

const paymentStatusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  charged: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
  refunded: "bg-gray-100 text-gray-800",
  prepaid: "bg-blue-100 text-blue-800",
};

const timeWindowLabels: Record<string, string> = {
  morning: "Morning (8am - 12pm)",
  afternoon: "Afternoon (12pm - 5pm)",
  evening: "Evening (5pm - 8pm)",
  flexible: "Flexible",
};

interface JobDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { id } = await params;
  const job = getJobById(id);

  if (!job) {
    notFound();
  }

  const pkg = getPackageById(job.package_id);
  const assignedSub = job.assigned_sub_id
    ? getSubById(job.assigned_sub_id) ?? null
    : null;
  const activeSubs = getSubcontractors("active");

  const fullAddress = [
    job.address_line1,
    job.address_line2,
    job.city && job.state ? `${job.city}, ${job.state}` : job.city || job.state,
    job.zip,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/jobs">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{job.customer_name}</h1>
            <p className="text-muted-foreground">
              {pkg?.name || "Unknown Package"} - $
              {job.price.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
              statusColors[job.status] || "bg-gray-100"
            }`}
          >
            {job.status.replace("_", " ")}
          </span>
        </div>
      </div>

      {/* Status Actions */}
      <JobStatusActions job={job} />

      <div className="grid gap-6 md:grid-cols-2">
        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{job.customer_name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <a
                  href={`tel:${job.customer_phone}`}
                  className="font-medium hover:underline"
                >
                  {job.customer_phone}
                </a>
              </div>
            </div>

            {job.customer_email && (
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <a
                    href={`mailto:${job.customer_email}`}
                    className="font-medium hover:underline"
                  >
                    {job.customer_email}
                  </a>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="font-medium">{fullAddress}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Schedule */}
        <Card>
          <CardHeader>
            <CardTitle>Schedule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="font-medium text-lg">
                  {new Date(job.scheduled_date).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Time Window</p>
                <p className="font-medium">
                  {job.time_window
                    ? timeWindowLabels[job.time_window] || job.time_window
                    : "Not specified"}
                </p>
              </div>
            </div>

            {pkg && pkg.limit_type === "time" && pkg.limit_value && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium">Time Block</p>
                <p className="text-2xl font-bold">
                  {pkg.limit_value} hour{pkg.limit_value > 1 ? "s" : ""} max
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Package & Payment */}
        <Card>
          <CardHeader>
            <CardTitle>Package & Payment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <DollarSign className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Package</p>
                <p className="font-medium">{pkg?.name || "Unknown"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <DollarSign className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Price</p>
                <p className="font-bold text-2xl text-green-600">
                  ${job.price.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Payment Status</p>
                <span
                  className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                    paymentStatusColors[job.payment_status] || "bg-gray-100"
                  }`}
                >
                  {job.payment_status}
                </span>
              </div>
            </div>

            {job.card_last_four && (
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Card on File</p>
                  <p className="font-medium">**** **** **** {job.card_last_four}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sub Assignment */}
        <SubAssignment
          job={job}
          assignedSub={assignedSub}
          availableSubs={activeSubs}
        />

        {/* Notes */}
        {job.notes && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{job.notes}</p>
            </CardContent>
          </Card>
        )}

        {/* Agreement Status */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>On-Site Checklist</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-center gap-3 p-3 rounded-lg border">
                <div
                  className={`w-3 h-3 rounded-full ${
                    job.agreement_signed ? "bg-green-500" : "bg-gray-300"
                  }`}
                />
                <div>
                  <p className="font-medium">Agreement</p>
                  <p className="text-sm text-muted-foreground">
                    {job.agreement_signed ? "Signed" : "Pending"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg border">
                <div
                  className={`w-3 h-3 rounded-full ${
                    job.dump_receipt_url ? "bg-green-500" : "bg-gray-300"
                  }`}
                />
                <div>
                  <p className="font-medium">Dump Receipt</p>
                  <p className="text-sm text-muted-foreground">
                    {job.dump_receipt_url ? "Uploaded" : "Pending"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg border">
                <div
                  className={`w-3 h-3 rounded-full ${
                    job.completion_video_url ? "bg-green-500" : "bg-gray-300"
                  }`}
                />
                <div>
                  <p className="font-medium">Completion Video</p>
                  <p className="text-sm text-muted-foreground">
                    {job.completion_video_url ? "Uploaded" : "Pending"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
