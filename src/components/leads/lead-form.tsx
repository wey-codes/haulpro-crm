"use client";

import { useState } from "react";
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
import type { Lead, LeadSource } from "@/types/database";

const leadSources: { value: LeadSource; label: string }[] = [
  { value: "gmb", label: "Google My Business" },
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "call", label: "Phone Call" },
  { value: "text", label: "Text Message" },
  { value: "walk_in", label: "Walk-in" },
  { value: "bandit_sign", label: "Bandit Sign" },
  { value: "website", label: "Website" },
  { value: "referral", label: "Referral" },
  { value: "other", label: "Other" },
];

interface LeadFormProps {
  lead?: Lead;
  onSave?: (lead: Partial<Lead>) => void;
}

export function LeadForm({ lead, onSave }: LeadFormProps) {
  const router = useRouter();
  const isEdit = !!lead;

  const [formData, setFormData] = useState({
    customer_name: lead?.customer_name || "",
    phone: lead?.phone || "",
    email: lead?.email || "",
    address_line1: lead?.address_line1 || "",
    address_line2: lead?.address_line2 || "",
    city: lead?.city || "",
    state: lead?.state || "",
    zip: lead?.zip || "",
    source: lead?.source || ("gmb" as LeadSource),
    source_detail: lead?.source_detail || "",
    notes: lead?.notes || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.customer_name.trim()) {
      newErrors.customer_name = "Customer name is required";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[\d\s\-+()]+$/.test(formData.phone)) {
      newErrors.phone = "Invalid phone number format";
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
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

    if (onSave) {
      onSave({
        ...formData,
        email: formData.email || null,
        address_line2: formData.address_line2 || null,
        source_detail: formData.source_detail || null,
        notes: formData.notes || null,
      });
    }

    // For now, just redirect back to leads list
    // In production, this would save to the database
    router.push(isEdit ? `/leads/${lead.id}` : "/leads");
    router.refresh();
  };

  const handleCancel = () => {
    router.push(isEdit ? `/leads/${lead.id}` : "/leads");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
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
              <Label htmlFor="phone">
                Phone <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="(512) 555-1234"
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email (optional)</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="john@example.com"
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Address */}
      <Card>
        <CardHeader>
          <CardTitle>Address</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address_line1">Street Address</Label>
            <Input
              id="address_line1"
              value={formData.address_line1}
              onChange={(e) =>
                setFormData({ ...formData, address_line1: e.target.value })
              }
              placeholder="123 Main Street"
            />
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

      {/* Lead Source */}
      <Card>
        <CardHeader>
          <CardTitle>Lead Source</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="source">Source</Label>
              <Select
                value={formData.source}
                onValueChange={(value: LeadSource) =>
                  setFormData({ ...formData, source: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  {leadSources.map((source) => (
                    <SelectItem key={source.value} value={source.value}>
                      {source.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="source_detail">Source Details</Label>
              <Input
                id="source_detail"
                value={formData.source_detail}
                onChange={(e) =>
                  setFormData({ ...formData, source_detail: e.target.value })
                }
                placeholder="e.g., Referred by Sarah Thompson"
              />
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
            placeholder="Add any notes about the customer or job..."
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
          {saving ? "Saving..." : isEdit ? "Save Changes" : "Create Lead"}
        </Button>
      </div>
    </form>
  );
}
