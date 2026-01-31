import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getLeads } from "@/lib/mock-data";

const statusColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-800",
  photo_requested: "bg-yellow-100 text-yellow-800",
  quoted: "bg-purple-100 text-purple-800",
  won: "bg-green-100 text-green-800",
  lost: "bg-gray-100 text-gray-800",
};

export default function LeadsPage() {
  const leads = getLeads();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Leads</h1>
        <Button asChild>
          <Link href="/leads/new">New Lead</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Leads</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium">Phone</th>
                  <th className="pb-3 font-medium">Source</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Quoted</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} className="border-b last:border-0">
                    <td className="py-3">
                      <Link
                        href={`/leads/${lead.id}`}
                        className="font-medium hover:underline"
                      >
                        {lead.customer_name}
                      </Link>
                    </td>
                    <td className="py-3 text-muted-foreground">{lead.phone}</td>
                    <td className="py-3 capitalize">{lead.source.replace("_", " ")}</td>
                    <td className="py-3">
                      <span
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          statusColors[lead.status] || "bg-gray-100"
                        }`}
                      >
                        {lead.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-3">
                      {lead.quoted_price ? `$${lead.quoted_price}` : "-"}
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
