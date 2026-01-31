import {
  Building2,
  CreditCard,
  Phone,
  Mail,
  Globe,
  Check,
  X,
  Clock,
  DollarSign,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getAccount, getPackages } from "@/lib/mock-data";

const subscriptionStatusColors: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  trial: "bg-blue-100 text-blue-800",
  past_due: "bg-yellow-100 text-yellow-800",
  cancelled: "bg-gray-100 text-gray-800",
};

export default function SettingsPage() {
  const account = getAccount();
  const packages = getPackages(true);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Company Info */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Company Info
            </CardTitle>
            <Button variant="outline" size="sm">
              Edit
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Company Name
              </label>
              <p className="mt-1 font-medium">{account.company_name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Email
              </label>
              <p className="mt-1 flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                {account.email}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Phone
              </label>
              <p className="mt-1 flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                {account.phone}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Website
              </label>
              <p className="mt-1 flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                {account.website || "Not set"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Subscription */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Subscription
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <p className="font-medium capitalize">{account.subscription_plan} Plan</p>
                <p className="text-sm text-muted-foreground">$20/month</p>
              </div>
              <span
                className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                  subscriptionStatusColors[account.subscription_status]
                }`}
              >
                {account.subscription_status}
              </span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Unlimited users</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Unlimited leads & jobs</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>SMS dispatch</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Magic links</span>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              Manage Subscription
            </Button>
          </CardContent>
        </Card>

        {/* Integrations */}
        <Card>
          <CardHeader>
            <CardTitle>Integrations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">Stripe</p>
                  <p className="text-sm text-muted-foreground">
                    Payment processing
                  </p>
                </div>
              </div>
              {account.stripe_account_id ? (
                <span className="flex items-center gap-1 text-green-600 text-sm">
                  <Check className="h-4 w-4" />
                  Connected
                </span>
              ) : (
                <Button size="sm">Connect</Button>
              )}
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <Phone className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="font-medium">Twilio</p>
                  <p className="text-sm text-muted-foreground">SMS messaging</p>
                </div>
              </div>
              {account.twilio_phone ? (
                <span className="flex items-center gap-1 text-green-600 text-sm">
                  <Check className="h-4 w-4" />
                  Connected
                </span>
              ) : (
                <Button size="sm">Connect</Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Google Review */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Google Review Link</CardTitle>
            <Button variant="outline" size="sm">
              Edit
            </Button>
          </CardHeader>
          <CardContent>
            {account.google_review_url ? (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm break-all">{account.google_review_url}</p>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground mb-4">
                  Add your Google review link to enable review requests
                </p>
                <Button>Add Review Link</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Packages */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Service Packages</CardTitle>
          <Button variant="outline" size="sm">
            Add Package
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3 font-medium">Package</th>
                  <th className="pb-3 font-medium">Description</th>
                  <th className="pb-3 font-medium">Time Limit</th>
                  <th className="pb-3 font-medium">Price</th>
                  <th className="pb-3 font-medium">Sub Payout</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {packages.map((pkg) => (
                  <tr key={pkg.id} className="border-b last:border-0">
                    <td className="py-3 font-medium">{pkg.name}</td>
                    <td className="py-3 text-sm text-muted-foreground max-w-xs truncate">
                      {pkg.description || "-"}
                    </td>
                    <td className="py-3">
                      {pkg.limit_type === "time" && pkg.limit_value
                        ? `${pkg.limit_value}h`
                        : pkg.limit_type === "flat"
                        ? "Flat"
                        : "-"}
                    </td>
                    <td className="py-3 font-medium">${pkg.price}</td>
                    <td className="py-3">
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        {pkg.sub_payout}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        {pkg.is_active ? (
                          <span className="flex items-center gap-1 text-green-600 text-sm">
                            <Check className="h-4 w-4" />
                            Active
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-gray-500 text-sm">
                            <X className="h-4 w-4" />
                            Inactive
                          </span>
                        )}
                        {pkg.is_hidden && (
                          <span className="text-xs text-muted-foreground">
                            (hidden)
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3">
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Agreement Template */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Agreement Template</CardTitle>
          <Button variant="outline" size="sm">
            Edit
          </Button>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-muted rounded-lg">
            <pre className="text-sm whitespace-pre-wrap font-sans">
              {account.agreement_template || "No agreement template set"}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
