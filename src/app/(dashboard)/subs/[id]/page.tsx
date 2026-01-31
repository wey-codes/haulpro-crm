import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Phone,
  Mail,
  Star,
  DollarSign,
  Briefcase,
  FileCheck,
  Shield,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSubById } from "@/lib/mock-data";

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-gray-100 text-gray-800",
  removed: "bg-red-100 text-red-800",
};

interface SubDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function SubDetailPage({ params }: SubDetailPageProps) {
  const { id } = await params;
  const sub = getSubById(id);

  if (!sub) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/subs">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{sub.name}</h1>
            <p className="text-muted-foreground">Subcontractor</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
              statusColors[sub.status] || "bg-gray-100"
            }`}
          >
            {sub.status}
          </span>
        </div>
      </div>

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
                  href={`tel:${sub.phone}`}
                  className="font-medium hover:underline"
                >
                  {sub.phone}
                </a>
              </div>
            </div>

            {sub.email && (
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <a
                    href={`mailto:${sub.email}`}
                    className="font-medium hover:underline"
                  >
                    {sub.email}
                  </a>
                </div>
              </div>
            )}

            {sub.rating && (
              <div className="flex items-center gap-3">
                <Star className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Rating</p>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">{sub.rating}</span>
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Performance Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Briefcase className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Jobs Completed</p>
                <p className="font-bold text-2xl">{sub.jobs_completed}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <DollarSign className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Total Earnings</p>
                <p className="font-bold text-2xl text-green-600">
                  ${sub.total_earnings.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Star className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Review Bonuses</p>
                <p className="font-medium">
                  {sub.review_bonuses_earned} bonuses ($
                  {(sub.review_bonuses_earned * 25).toLocaleString()})
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Compliance */}
        <Card>
          <CardHeader>
            <CardTitle>Compliance & Documentation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <FileCheck className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">W-9 on File</p>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      sub.w9_on_file ? "bg-green-500" : "bg-red-500"
                    }`}
                  />
                  <span className="font-medium">
                    {sub.w9_on_file ? "Yes" : "No"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Insurance on File</p>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      sub.insurance_on_file ? "bg-green-500" : "bg-red-500"
                    }`}
                  />
                  <span className="font-medium">
                    {sub.insurance_on_file ? "Yes" : "No"}
                  </span>
                </div>
              </div>
            </div>

            {sub.insurance_expiry && (
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Insurance Expiry
                  </p>
                  <p
                    className={`font-medium ${
                      new Date(sub.insurance_expiry) < new Date()
                        ? "text-red-600"
                        : ""
                    }`}
                  >
                    {new Date(sub.insurance_expiry).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            {sub.notes ? (
              <p className="whitespace-pre-wrap">{sub.notes}</p>
            ) : (
              <p className="text-muted-foreground">No notes added</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity Placeholder */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Job history coming soon...
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
