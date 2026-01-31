"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Lead, Package } from "@/types/database";

interface JobFormProps {
  lead?: Lead | null;
  packages: Package[];
}

export function JobForm({ lead, packages }: JobFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    customer_name: lead?.customer_name || "",
    customer_phone: lead?.phone || "",
    customer_email: lead?.email || "",
    address_line1: lead?.address_line1 || "",
    address_line2: lead?.address_line2 || "",
    city: lead?.city || "",
    state: lead?.state || "",
    zip: lead?.zip || "",
    package_id: lead?.quoted_package_id || "",
    price: lead?.quoted_price?.toString() || "",
    scheduled_date: "",
    time_window: "morning",
    notes: lead?.notes || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const selectedPackage = packages.find((p) => p.id === formData.package_id);

  // Auto-fill price when package is selected
  useEffect(() => {
    if (selectedPackage && !lead?.quoted_price) {
      setFormData((prev) => ({
        ...prev,
        price: selectedPackage.price.toString(),
      }));
    }
  }, [selectedPackage, lead?.quoted_price]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.customer_name.trim()) {
      newErrors.customer_name = "Customer name is required";
    }

    if (!formData.customer_phone.trim()) {
      newErrors.customer_phone = "Phone number is required";
    }

    if (!formData.address_line1.trim()) {
      newErrors.address_line1 = "Address is required";
    }

    if (!formData.package_id) {
      newErrors.package_id = "Package is required";
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = "Valid price is required";
    }

    if (!formData.scheduled_date) {
      newErrors.scheduled_date = "Scheduled date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setSaving(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    // In production, this would:
    // 1. Create the job in the database
    // 2. Update the lead status to 'won' if from a lead
    // 3. Redirect to the new job's detail page

    router.push("/jobs");
    router.refresh();
  };

  const handleCancel = () => {
    if (lead) {
      router.push(`/leads/${lead.id}`);
    } else {
      router.push("/jobs");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Customer Information */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="customer_name">
                Customer Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="customer_name"
                value={formData.customer_name}
                onChange={(e) =>
                  setFormData({ ...formData, customer_name: e.target.value })
                }
                placeholder="John Smith"
              />
              {errors.customer_name && (
                <p className="text-sm text-red-500">{errors.customer_name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="customer_phone">
                Phone <span className="text-red-500">*</span>
              </Label>
              <Input
                id="customer_phone"
                type="tel"
                value={formData.customer_phone}
                onChange={(e) =>
                  setFormData({ ...formData, customer_phone: e.target.value })
                }
                placeholder="(512) 555-1234"
              />
              {errors.customer_phone && (
                <p className="text-sm text-red-500">{errors.customer_phone}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="customer_email">Email (optional)</Label>
            <Input
              id="customer_email"
              type="email"
              value={formData.customer_email}
              onChange={(e) =>
                setFormData({ ...formData, customer_email: e.target.value })
              }
              placeholder="john@example.com"
            />
          </div>
        </CardContent>
      </Card>

      {/* Address */}
      <Card>
        <CardHeader>
          <CardTitle>Job Address</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address_line1">
              Street Address <span className="text-red-500">*</span>
            </Label>
            <Input
              id="address_line1"
              value={formData.address_line1}
              onChange={(e) =>
                setFormData({ ...formData, address_line1: e.target.value })
              }
              placeholder="123 Main Street"
            />
            {errors.address_line1 && (
              <p className="text-sm text-red-500">{errors.address_line1}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address_line2">Address Line 2</Label>
            <Input
              id="address_line2"
              value={formData.address_line2}
              onChange={(e) =>
                setFormData({ ...formData, address_line2: e.target.value })
              }
              placeholder="Apt, Suite, Unit, etc."
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                placeholder="Austin"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) =>
                  setFormData({ ...formData, state: e.target.value })
                }
                placeholder="TX"
                maxLength={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="zip">ZIP Code</Label>
              <Input
                id="zip"
                value={formData.zip}
                onChange={(e) =>
                  setFormData({ ...formData, zip: e.target.value })
                }
                placeholder="78701"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Package & Pricing */}
      <Card>
        <CardHeader>
          <CardTitle>Package & Pricing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="package_id">
                Package <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.package_id}
                onValueChange={(value) =>
                  setFormData({ ...formData, package_id: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select package" />
                </SelectTrigger>
                <SelectContent>
                  {packages.map((pkg) => (
                    <SelectItem key={pkg.id} value={pkg.id}>
                      {pkg.name} - ${pkg.price}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.package_id && (
                <p className="text-sm text-red-500">{errors.package_id}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">
                Price <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  placeholder="0"
                  className="pl-7"
                />
              </div>
              {errors.price && (
                <p className="text-sm text-red-500">{errors.price}</p>
              )}
            </div>
          </div>

          {selectedPackage && (
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium">{selectedPackage.name}</h4>
              <p className="text-sm text-muted-foreground mt-1">
                {selectedPackage.description}
              </p>
              {selectedPackage.limit_type === "time" &&
                selectedPackage.limit_value && (
                  <p className="text-sm font-medium mt-2">
                    Time Block: {selectedPackage.limit_value} hour
                    {selectedPackage.limit_value > 1 ? "s" : ""} max
                  </p>
                )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Scheduling */}
      <Card>
        <CardHeader>
          <CardTitle>Scheduling</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="scheduled_date">
                Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="scheduled_date"
                type="date"
                value={formData.scheduled_date}
                onChange={(e) =>
                  setFormData({ ...formData, scheduled_date: e.target.value })
                }
                min={new Date().toISOString().split("T")[0]}
              />
              {errors.scheduled_date && (
                <p className="text-sm text-red-500">{errors.scheduled_date}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="time_window">Time Window</Label>
              <Select
                value={formData.time_window}
                onValueChange={(value) =>
                  setFormData({ ...formData, time_window: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">Morning (8am - 12pm)</SelectItem>
                  <SelectItem value="afternoon">
                    Afternoon (12pm - 5pm)
                  </SelectItem>
                  <SelectItem value="evening">Evening (5pm - 8pm)</SelectItem>
                  <SelectItem value="flexible">Flexible</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
            placeholder="Any special instructions or notes about the job..."
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? "Creating Job..." : "Create Job"}
        </Button>
      </div>
    </form>
  );
}
