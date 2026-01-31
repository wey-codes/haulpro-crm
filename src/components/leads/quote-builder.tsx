"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Package as PackageIcon, Clock, Check } from "lucide-react";
import type { Lead, Package } from "@/types/database";

interface QuoteBuilderProps {
  lead: Lead;
  packages: Package[];
}

export function QuoteBuilder({ lead, packages }: QuoteBuilderProps) {
  const router = useRouter();
  const [selectedPackageId, setSelectedPackageId] = useState<string>(
    lead.quoted_package_id || ""
  );
  const [price, setPrice] = useState<string>(
    lead.quoted_price?.toString() || ""
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const selectedPackage = packages.find((p) => p.id === selectedPackageId);

  // Auto-fill price when package is selected
  useEffect(() => {
    if (selectedPackage && !lead.quoted_package_id) {
      setPrice(selectedPackage.price.toString());
    }
  }, [selectedPackage, lead.quoted_package_id]);

  const handlePackageChange = (packageId: string) => {
    setSelectedPackageId(packageId);
    const pkg = packages.find((p) => p.id === packageId);
    if (pkg) {
      setPrice(pkg.price.toString());
    }
    setSaved(false);
  };

  const handleSaveQuote = async () => {
    if (!selectedPackageId || !price) return;

    setSaving(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    // In production, this would update the lead in the database
    // For now, we just show a success state
    setSaved(true);
    setSaving(false);

    // Refresh the page to show updated status
    router.refresh();
  };

  const isAlreadyQuoted = !!lead.quoted_package_id;
  const hasChanges =
    selectedPackageId !== lead.quoted_package_id ||
    price !== lead.quoted_price?.toString();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Quote Builder
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {isAlreadyQuoted && !hasChanges && (
          <div className="flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-lg">
            <Check className="h-5 w-5" />
            <span>Quote already sent for this lead</span>
          </div>
        )}

        {/* Package Selection */}
        <div className="space-y-2">
          <Label>Select Package</Label>
          <Select value={selectedPackageId} onValueChange={handlePackageChange}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a package..." />
            </SelectTrigger>
            <SelectContent>
              {packages.map((pkg) => (
                <SelectItem key={pkg.id} value={pkg.id}>
                  <div className="flex items-center gap-2">
                    <PackageIcon className="h-4 w-4" />
                    <span>{pkg.name}</span>
                    <span className="text-muted-foreground">
                      - ${pkg.price}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Package Details */}
        {selectedPackage && (
          <div className="p-4 bg-muted rounded-lg space-y-3">
            <h4 className="font-medium">{selectedPackage.name}</h4>
            <p className="text-sm text-muted-foreground">
              {selectedPackage.description}
            </p>
            <div className="flex items-center gap-4 text-sm">
              {selectedPackage.limit_type === "time" &&
                selectedPackage.limit_value && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {selectedPackage.limit_value} hour
                    {selectedPackage.limit_value > 1 ? "s" : ""} max
                  </span>
                )}
              <span className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                Base price: ${selectedPackage.price}
              </span>
            </div>
          </div>
        )}

        {/* Custom Price */}
        <div className="space-y-2">
          <Label htmlFor="price">Quote Price</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="price"
              type="number"
              value={price}
              onChange={(e) => {
                setPrice(e.target.value);
                setSaved(false);
              }}
              placeholder="0"
              className="pl-9"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            You can adjust the price from the default package price if needed
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            onClick={handleSaveQuote}
            disabled={!selectedPackageId || !price || saving || (saved && !hasChanges)}
            className="flex-1"
          >
            {saving
              ? "Saving..."
              : saved && !hasChanges
              ? "Quote Saved"
              : isAlreadyQuoted
              ? "Update Quote"
              : "Save Quote"}
          </Button>
        </div>

        {saved && !hasChanges && (
          <p className="text-sm text-center text-muted-foreground">
            Lead status updated to &quot;Quoted&quot;
          </p>
        )}
      </CardContent>
    </Card>
  );
}
