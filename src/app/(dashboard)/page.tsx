import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getLeads, getJobs, getSubcontractors } from "@/lib/mock-data";

export default function DashboardPage() {
  const leads = getLeads();
  const jobs = getJobs();
  const subs = getSubcontractors("active");

  const newLeads = leads.filter((l) => l.status === "new").length;
  const quotedLeads = leads.filter((l) => l.status === "quoted").length;
  const upcomingJobs = jobs.filter((j) => j.status !== "completed" && j.status !== "cancelled").length;
  const activeSubs = subs.length;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">New Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{newLeads}</div>
            <p className="text-xs text-muted-foreground">Awaiting follow-up</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Quoted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{quotedLeads}</div>
            <p className="text-xs text-muted-foreground">Pending booking</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingJobs}</div>
            <p className="text-xs text-muted-foreground">Scheduled</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Subs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeSubs}</div>
            <p className="text-xs text-muted-foreground">Available for jobs</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Activity feed coming soon...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
