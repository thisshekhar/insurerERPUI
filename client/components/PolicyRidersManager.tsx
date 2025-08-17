import { useState, useEffect } from "react";
import {
  Plus,
  Shield,
  Heart,
  DollarSign,
  Calendar,
  AlertTriangle,
  CheckCircle,
  X,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Rider,
  PolicyRider,
  getRidersByPolicyType,
  getRidersByPolicy,
  calculateRiderPremium,
  isRiderEligible,
} from "@/lib/rider-data";
import { Policy } from "@/lib/policy-data";

interface PolicyRidersManagerProps {
  policy: Policy;
  customerAge?: number;
  onRidersUpdate?: (riders: PolicyRider[]) => void;
}

const categoryColors = {
  Protection:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
  Health:
    "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  Savings:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
  Accident: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
  Premium:
    "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
};

const categoryIcons = {
  Protection: Shield,
  Health: Heart,
  Savings: DollarSign,
  Accident: AlertTriangle,
  Premium: DollarSign,
};

export default function PolicyRidersManager({
  policy,
  customerAge = 35,
  onRidersUpdate,
}: PolicyRidersManagerProps) {
  const [currentRiders, setCurrentRiders] = useState<PolicyRider[]>(
    getRidersByPolicy(policy.id),
  );
  const [availableRiders] = useState<Rider[]>(
    getRidersByPolicyType(policy.policyType),
  );
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedRider, setSelectedRider] = useState<Rider | null>(null);
  const [customTerms, setCustomTerms] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState(0);

  // Cleanup effect to prevent memory leaks
  useEffect(() => {
    return () => {
      // Clear any pending timeouts or intervals
      setSelectedRider(null);
      setCustomTerms("");
      setDiscountPercentage(0);
    };
  }, []);

  // Error boundary wrapper for the component
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      if (event.error?.message?.includes("ResizeObserver")) {
        event.preventDefault();
        return false;
      }
    };

    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleAddRider = () => {
    if (!selectedRider) {
      toast.error("Please select a rider to add");
      return;
    }

    // Check if rider is already added
    const existingRider = currentRiders.find((r) => r.id === selectedRider.id);
    if (existingRider) {
      toast.error("This rider is already added to the policy");
      return;
    }

    // Check eligibility
    if (!isRiderEligible(selectedRider, customerAge)) {
      toast.error(
        "Customer is not eligible for this rider based on age requirements",
      );
      return;
    }

    const newPolicyRider: PolicyRider = {
      ...selectedRider,
      policyId: policy.id,
      addedDate: new Date().toISOString().split("T")[0],
      addedBy: policy.agentName,
      status: "Pending",
      effectiveDate: new Date().toISOString().split("T")[0],
      customTerms: customTerms || undefined,
      discountPercentage: discountPercentage || undefined,
    };

    const updatedRiders = [...currentRiders, newPolicyRider];
    setCurrentRiders(updatedRiders);
    onRidersUpdate?.(updatedRiders);

    setShowAddDialog(false);
    setSelectedRider(null);
    setCustomTerms("");
    setDiscountPercentage(0);
    toast.success(`${selectedRider.name} rider added successfully`);
  };

  const handleRemoveRider = (riderId: string) => {
    const updatedRiders = currentRiders.filter((r) => r.id !== riderId);
    setCurrentRiders(updatedRiders);
    onRidersUpdate?.(updatedRiders);
    toast.success("Rider removed successfully");
  };

  const handleActivateRider = (riderId: string) => {
    const updatedRiders = currentRiders.map((r) =>
      r.id === riderId ? { ...r, status: "Active" as const } : r,
    );
    setCurrentRiders(updatedRiders);
    onRidersUpdate?.(updatedRiders);
    toast.success("Rider activated successfully");
  };

  const openRiderDetails = (rider: Rider) => {
    setSelectedRider(rider);
    setShowDetailsDialog(true);
  };

  const eligibleRiders = availableRiders.filter(
    (rider) =>
      isRiderEligible(rider, customerAge) &&
      !currentRiders.some((cr) => cr.id === rider.id),
  );

  const ridersByCategory = eligibleRiders.reduce(
    (acc, rider) => {
      if (!acc[rider.category]) {
        acc[rider.category] = [];
      }
      acc[rider.category].push(rider);
      return acc;
    },
    {} as Record<string, Rider[]>,
  );

  const totalRiderPremium = calculateRiderPremium(currentRiders);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Policy Riders & Coverage</h3>
          <p className="text-sm text-muted-foreground">
            Enhance your policy with additional coverage options
          </p>
        </div>
        <Button
          onClick={() => setShowAddDialog(true)}
          className="flex items-center space-x-2"
          disabled={eligibleRiders.length === 0}
        >
          <Plus className="h-4 w-4" />
          <span>Add Rider</span>
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Riders</p>
                <p className="text-2xl font-bold">
                  {currentRiders.filter((r) => r.status === "Active").length}
                </p>
              </div>
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Total Rider Premium
                </p>
                <p className="text-2xl font-bold">
                  {formatCurrency(totalRiderPremium)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Available Riders
                </p>
                <p className="text-2xl font-bold">{eligibleRiders.length}</p>
              </div>
              <Plus className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Riders */}
      {currentRiders.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Current Riders</CardTitle>
            <CardDescription>Riders attached to this policy</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentRiders.map((rider) => {
                const CategoryIcon = categoryIcons[rider.category];
                return (
                  <div
                    key={rider.id}
                    className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-700"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                        <CategoryIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">{rider.name}</h4>
                          <Badge className={categoryColors[rider.category]}>
                            {rider.category}
                          </Badge>
                          <Badge
                            variant={
                              rider.status === "Active"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {rider.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {rider.description}
                        </p>
                        <div className="flex items-center space-x-4 mt-2 text-sm">
                          <span>
                            Coverage: {formatCurrency(rider.coverage)}
                          </span>
                          <span>Premium: {formatCurrency(rider.premium)}</span>
                          {rider.discountPercentage && (
                            <span className="text-green-600">
                              Discount: {rider.discountPercentage}%
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openRiderDetails(rider)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {rider.status === "Pending" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleActivateRider(rider.id)}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveRider(rider.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Rider Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Policy Rider</DialogTitle>
            <DialogDescription>
              Select a rider to enhance your policy coverage
            </DialogDescription>
          </DialogHeader>

          <Tabs
            defaultValue={Object.keys(ridersByCategory)[0]}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-5">
              {Object.keys(ridersByCategory).map((category) => (
                <TabsTrigger key={category} value={category}>
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.entries(ridersByCategory).map(([category, riders]) => (
              <TabsContent
                key={category}
                value={category}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {riders.map((rider) => {
                    const CategoryIcon = categoryIcons[rider.category];
                    const isSelected = selectedRider?.id === rider.id;
                    return (
                      <Card
                        key={rider.id}
                        className={cn(
                          "cursor-pointer transition-colors",
                          isSelected && "ring-2 ring-blue-500 border-blue-500",
                        )}
                        onClick={() => setSelectedRider(rider)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3 mb-3">
                            <CategoryIcon className="h-5 w-5 text-blue-600" />
                            <h4 className="font-medium">{rider.name}</h4>
                            <Badge className={categoryColors[rider.category]}>
                              {rider.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {rider.description}
                          </p>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Coverage:</span>
                              <span className="font-medium">
                                {formatCurrency(rider.coverage)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Annual Premium:</span>
                              <span className="font-medium">
                                {formatCurrency(rider.premium)}
                              </span>
                            </div>
                            {rider.waitingPeriod && (
                              <div className="flex justify-between">
                                <span>Waiting Period:</span>
                                <span>{rider.waitingPeriod} months</span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>
            ))}
          </Tabs>

          {selectedRider && (
            <div className="space-y-4 border-t pt-4">
              <h4 className="font-medium">Additional Options</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customTerms">Custom Terms (Optional)</Label>
                  <Textarea
                    id="customTerms"
                    value={customTerms}
                    onChange={(e) => setCustomTerms(e.target.value)}
                    placeholder="Enter any custom terms or conditions"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="discount">Discount Percentage</Label>
                  <Input
                    id="discount"
                    type="number"
                    min="0"
                    max="50"
                    value={discountPercentage}
                    onChange={(e) =>
                      setDiscountPercentage(Number(e.target.value))
                    }
                    placeholder="0"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Optional discount (0-50%)
                  </p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddRider} disabled={!selectedRider}>
              Add Rider
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rider Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedRider ? selectedRider.name : "Rider Details"}
            </DialogTitle>
            <DialogDescription>
              Complete coverage information and terms
            </DialogDescription>
          </DialogHeader>

          {selectedRider && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Coverage Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Type:</span>
                      <span>{selectedRider.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Category:</span>
                      <Badge className={categoryColors[selectedRider.category]}>
                        {selectedRider.category}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Coverage Amount:</span>
                      <span className="font-medium">
                        {formatCurrency(selectedRider.coverage)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Annual Premium:</span>
                      <span className="font-medium">
                        {formatCurrency(selectedRider.premium)}
                      </span>
                    </div>
                    {selectedRider.deductible && (
                      <div className="flex justify-between">
                        <span>Deductible:</span>
                        <span>{formatCurrency(selectedRider.deductible)}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Eligibility</h4>
                  <div className="space-y-2 text-sm">
                    {selectedRider.minAge && (
                      <div className="flex justify-between">
                        <span>Minimum Age:</span>
                        <span>{selectedRider.minAge} years</span>
                      </div>
                    )}
                    {selectedRider.maxAge && (
                      <div className="flex justify-between">
                        <span>Maximum Age:</span>
                        <span>{selectedRider.maxAge} years</span>
                      </div>
                    )}
                    {selectedRider.waitingPeriod && (
                      <div className="flex justify-between">
                        <span>Waiting Period:</span>
                        <span>{selectedRider.waitingPeriod} months</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">Benefits</h4>
                <ul className="text-sm space-y-1">
                  {selectedRider.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">Exclusions</h4>
                <ul className="text-sm space-y-1">
                  {selectedRider.exclusions.map((exclusion, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <X className="h-4 w-4 text-red-600" />
                      <span>{exclusion}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">Terms & Conditions</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedRider.terms}
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setShowDetailsDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
