import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getJobs, getPackageById, getSubById } from "@/lib/mock-data";

const statusColors: Record<string, string> = {
  booked: "bg-blue-100 text-blue-800",
  pending_claim: "bg-yellow-100 text-yellow-800",
  assigned: "bg-purple-100 text-purple-800",
  in_progress: "bg-orange-100 text-orange-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-gray-100 text-gray-800",
};

export default function JobsPage() {
  const jobs = getJobs();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Jobs</h1>
        <Button asChild>
          <Link href="/jobs/new">New Job</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Package</th>
                  <th className="pb-3 font-medium">Price</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Assigned To</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => {
                  const pkg = getPackageById(job.package_id);
                  const sub = job.assigned_sub_id
                    ? getSubById(job.assigned_sub_id)
                    : null;

                  return (
                    <tr key={job.id} className="border-b last:border-0 hover:bg-muted/50">
                      <td className="py-3 font-medium">
                        <Link href={`/jobs/${job.id}`} className="hover:underline">
                          {new Date(job.scheduled_date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </Link>
                      </td>
                      <td className="py-3">
                        <Link href={`/jobs/${job.id}`} className="hover:underline">
                          {job.customer_name}
                        </Link>
                      </td>
                      <td className="py-3">{pkg?.name || "-"}</td>
                      <td className="py-3 font-medium">${job.price.toLocaleString()}</td>
                      <td className="py-3">
                        <span
                          className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                            statusColors[job.status] || "bg-gray-100"
                          }`}
                        >
                          {job.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-3 text-muted-foreground">
                        {sub ? (
                          <Link href={`/subs/${sub.id}`} className="hover:underline">
                            {sub.name}
                          </Link>
                        ) : (
                          "Unassigned"
                        )}
                      </td>
                    </tr>
                  );
                })}
                {jobs.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-muted-foreground">
                      No jobs scheduled yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
