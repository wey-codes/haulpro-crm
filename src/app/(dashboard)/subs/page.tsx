import Link from "next/link";
import { Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSubcontractors } from "@/lib/mock-data";

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-gray-100 text-gray-800",
  removed: "bg-red-100 text-red-800",
};

export default function SubsPage() {
  const subs = getSubcontractors();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Subcontractors</h1>

      <Card>
        <CardHeader>
          <CardTitle>All Subs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium">Phone</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Rating</th>
                  <th className="pb-3 font-medium">Jobs</th>
                  <th className="pb-3 font-medium">Earnings</th>
                </tr>
              </thead>
              <tbody>
                {subs.map((sub) => (
                  <tr key={sub.id} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="py-3">
                      <Link
                        href={`/subs/${sub.id}`}
                        className="font-medium hover:underline"
                      >
                        {sub.name}
                      </Link>
                    </td>
                    <td className="py-3 text-muted-foreground">{sub.phone}</td>
                    <td className="py-3">
                      <span
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          statusColors[sub.status] || "bg-gray-100"
                        }`}
                      >
                        {sub.status}
                      </span>
                    </td>
                    <td className="py-3">
                      {sub.rating ? (
                        <span className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          {sub.rating}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="py-3">{sub.jobs_completed}</td>
                    <td className="py-3 font-medium">
                      ${sub.total_earnings.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
