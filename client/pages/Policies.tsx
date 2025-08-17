import { useState, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  FileText,
  Plus,
  Eye,
  Edit,
  Calendar,
  DollarSign,
  Shield,
  User,
  Building,
  Car,
  Heart,
  Cross,
  Home,
  Plane,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
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
import { DataTable } from "@/components/ui/data-table";
import { FormDialog } from "@/components/ui/form-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  mockPolicies,
  Policy,
  policyTypeConfigs,
  getPoliciesByStatus,
  getExpiringPolicies,
  calculateTotalPremiums,
  calculateTotalCoverage,
} from "@/lib/policy-data";
import { mockCustomers } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import PolicyRidersManager from "@/components/PolicyRidersManager";
import {
  getRidersByPolicyType,
  getRiderById,
  calculateRiderPremium,
  isRiderEligible
} from "@/lib/rider-data";

const statusColors = {
  Active:
    "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  Pending:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
  Expired: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
  Cancelled: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
  "Under Review":
    "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
};

const statusIcons = {
  Active: CheckCircle,
  Pending: Clock,
  Expired: XCircle,
  Cancelled: XCircle,
  "Under Review": AlertTriangle,
};

const policyTypeIcons = {
  "Life Insurance": Heart,
  "Health Insurance": Cross,
  "Auto Insurance": Car,
  "Home Insurance": Home,
  "Travel Insurance": Plane,
  "Business Insurance": Building,
};

const agents = [
  "Mike Chen",
  "Sarah Williams",
  "James Brown",
  "Lisa Anderson",
  "Robert Johnson",
];

export default function Policies() {
  const [policies, setPolicies] = useState<Policy[]>(mockPolicies);
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showRenewalDialog, setShowRenewalDialog] = useState(false);
  const [formData, setFormData] = useState<Partial<Policy>>({});
  const [selectedRiders, setSelectedRiders] = useState<string[]>([]);

  // Handle ResizeObserver errors
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      if (event.error?.message?.includes('ResizeObserver')) {
        event.preventDefault();
        return false;
      }
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const generatePolicyNumber = (policyType: string, customerName: string) => {
    const typeCode = policyType.split(" ")[0].substring(0, 3).toUpperCase();
    const year = new Date().getFullYear();
    const customerCode = customerName
      .split(" ")
      .map((n) => n.substring(0, 1))
      .join("")
      .toUpperCase();
    const random = Math.floor(Math.random() * 999) + 1;
    return `${typeCode}-${year}-${String(random).padStart(3, "0")}-${customerCode}`;
  };

  const handleAddPolicy = () => {
    if (
      !formData.customerName ||
      !formData.policyType ||
      !formData.premiumAmount ||
      !formData.coverageAmount
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    const customer = mockCustomers.find(
      (c) => `${c.firstName} ${c.lastName}` === formData.customerName,
    );
    // Create riders from selected rider IDs
    const policyRiders = selectedRiders.map(riderId => {
      const rider = getRiderById(riderId);
      if (!rider) return null;

      return {
        id: rider.id,
        name: rider.name,
        type: rider.type,
        category: rider.category,
        description: rider.description,
        coverage: rider.coverage,
        premium: rider.premium,
        deductible: rider.deductible,
        status: "Active" as const,
        addedDate: new Date().toISOString().split("T")[0],
        addedBy: formData.agentName || "Mike Chen",
        effectiveDate: formData.effectiveDate || new Date().toISOString().split("T")[0],
      };
    }).filter(Boolean);

    // Calculate total premium including riders
    const ridersPremium = policyRiders.reduce((total, rider) => total + (rider?.premium || 0), 0);
    const totalPremium = (formData.premiumAmount || 0) + ridersPremium;

    const newPolicy: Policy = {
      id: `POL-${String(policies.length + 1).padStart(3, "0")}`,
      policyNumber: generatePolicyNumber(
        formData.policyType || "",
        formData.customerName || "",
      ),
      customerId:
        customer?.id ||
        `CUST-${String(Math.floor(Math.random() * 999) + 1).padStart(3, "0")}`,
      customerName: formData.customerName || "",
      agentId: `AGT-${String(Math.floor(Math.random() * 5) + 1).padStart(3, "0")}`,
      agentName: formData.agentName || "Mike Chen",
      policyType: (formData.policyType as any) || "Life Insurance",
      coverageType: formData.coverageType || "Standard",
      status: "Pending",
      issueDate: new Date().toISOString().split("T")[0],
      effectiveDate:
        formData.effectiveDate || new Date().toISOString().split("T")[0],
      expiryDate:
        formData.expiryDate ||
        new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
      renewalDate:
        formData.renewalDate ||
        new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
      premiumAmount: totalPremium,
      premiumFrequency: (formData.premiumFrequency as any) || "Annual",
      coverageAmount: formData.coverageAmount || 0,
      deductible: formData.deductible || 0,
      beneficiaries: [],
      coverageDetails: [],
      documents: [],
      payments: [],
      renewalHistory: [],
      riders: policyRiders as any,
      notes: formData.notes || "",
      riskAssessment: (formData.riskAssessment as any) || "Medium",
      commissionRate: formData.commissionRate || 5.0,
    };

    setPolicies([...policies, newPolicy]);
    setShowAddDialog(false);
    setFormData({});
    setSelectedRiders([]);
    toast.success("Policy created successfully");
  };

  const handleEditPolicy = () => {
    if (!selectedPolicy || !formData.customerName || !formData.policyType) {
      toast.error("Please fill in all required fields");
      return;
    }

    const updatedPolicies = policies.map((policy) =>
      policy.id === selectedPolicy.id ? { ...policy, ...formData } : policy,
    );

    setPolicies(updatedPolicies);
    setShowEditDialog(false);
    setSelectedPolicy(null);
    setFormData({});
    toast.success("Policy updated successfully");
  };

  const handleRenewal = () => {
    if (!selectedPolicy) return;

    const renewedPolicy = {
      ...selectedPolicy,
      status: "Active" as const,
      renewalDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      renewalHistory: [
        ...selectedPolicy.renewalHistory,
        {
          renewalDate: new Date().toISOString().split("T")[0],
          previousPremium: selectedPolicy.premiumAmount,
          newPremium: formData.premiumAmount || selectedPolicy.premiumAmount,
          changes: formData.notes ? [formData.notes] : [],
          status: "Completed" as const,
        },
      ],
    };

    const updatedPolicies = policies.map((policy) =>
      policy.id === selectedPolicy.id ? renewedPolicy : policy,
    );

    setPolicies(updatedPolicies);
    setShowRenewalDialog(false);
    setFormData({});
    toast.success("Policy renewed successfully");
  };

  const openAddDialog = () => {
    setFormData({});
    setSelectedRiders([]);
    setShowAddDialog(true);
  };

  const openEditDialog = (policy: Policy) => {
    setSelectedPolicy(policy);
    setFormData(policy);
    setShowEditDialog(true);
  };

  const openDetailsDialog = (policy: Policy) => {
    setSelectedPolicy(policy);
    setShowDetailsDialog(true);
  };

  const openRenewalDialog = (policy: Policy) => {
    setSelectedPolicy(policy);
    setFormData({ premiumAmount: policy.premiumAmount });
    setShowRenewalDialog(true);
  };

  const columns: ColumnDef<Policy>[] = [
    {
      accessorKey: "policyNumber",
      header: "Policy Number",
      cell: ({ row }) => (
        <div className="font-medium text-blue-600 dark:text-blue-400">
          {row.getValue("policyNumber")}
        </div>
      ),
    },
    {
      accessorKey: "customerName",
      header: "Customer",
      cell: ({ row }) => {
        const policy = row.original;
        const TypeIcon = policyTypeIcons[policy.policyType];
        return (
          <div className="flex items-center space-x-2">
            <TypeIcon className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="font-medium">{policy.customerName}</div>
              <div className="text-sm text-muted-foreground">
                {policy.policyType}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "coverageType",
      header: "Coverage",
      cell: ({ row }) => (
        <Badge variant="outline">{row.getValue("coverageType")}</Badge>
      ),
    },
    {
      accessorKey: "premiumAmount",
      header: "Premium",
      cell: ({ row }) => {
        const policy = row.original;
        return (
          <div>
            <div className="font-medium">
              {formatCurrency(policy.premiumAmount)}
            </div>
            <div className="text-sm text-muted-foreground">
              {policy.premiumFrequency}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "coverageAmount",
      header: "Coverage Amount",
      cell: ({ row }) => formatCurrency(row.getValue("coverageAmount")),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as keyof typeof statusColors;
        const Icon = statusIcons[status];
        return (
          <Badge className={statusColors[status]}>
            <Icon className="h-3 w-3 mr-1" />
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "agentName",
      header: "Agent",
    },
    {
      accessorKey: "expiryDate",
      header: "Expires",
      cell: ({ row }) => formatDate(row.getValue("expiryDate")),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const policy = row.original;
        return (
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                openDetailsDialog(policy);
              }}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                openEditDialog(policy);
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
            {policy.status === "Active" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  openRenewalDialog(policy);
                }}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  const renderPolicyForm = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="customerName">Customer *</Label>
        <Select
          value={formData.customerName || ""}
          onValueChange={(value) =>
            setFormData({ ...formData, customerName: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select customer" />
          </SelectTrigger>
          <SelectContent>
            {mockCustomers.map((customer) => (
              <SelectItem
                key={customer.id}
                value={`${customer.firstName} ${customer.lastName}`}
              >
                {customer.firstName} {customer.lastName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="policyType">Policy Type *</Label>
        <Select
          value={formData.policyType || ""}
          onValueChange={(value) =>
            setFormData({ ...formData, policyType: value as any })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select policy type" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(policyTypeConfigs).map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="coverageType">Coverage Type</Label>
        <Select
          value={formData.coverageType || ""}
          onValueChange={(value) =>
            setFormData({ ...formData, coverageType: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select coverage type" />
          </SelectTrigger>
          <SelectContent>
            {formData.policyType &&
              policyTypeConfigs[
                formData.policyType as keyof typeof policyTypeConfigs
              ]?.coverageTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="agentName">Assigned Agent</Label>
        <Select
          value={formData.agentName || ""}
          onValueChange={(value) =>
            setFormData({ ...formData, agentName: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select agent" />
          </SelectTrigger>
          <SelectContent>
            {agents.map((agent) => (
              <SelectItem key={agent} value={agent}>
                {agent}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="premiumAmount">Premium Amount *</Label>
        <Input
          id="premiumAmount"
          type="number"
          value={formData.premiumAmount || ""}
          onChange={(e) =>
            setFormData({ ...formData, premiumAmount: Number(e.target.value) })
          }
          placeholder="Enter premium amount"
        />
      </div>
      <div>
        <Label htmlFor="premiumFrequency">Premium Frequency</Label>
        <Select
          value={formData.premiumFrequency || ""}
          onValueChange={(value) =>
            setFormData({ ...formData, premiumFrequency: value as any })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select frequency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Monthly">Monthly</SelectItem>
            <SelectItem value="Quarterly">Quarterly</SelectItem>
            <SelectItem value="Semi-Annual">Semi-Annual</SelectItem>
            <SelectItem value="Annual">Annual</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="coverageAmount">Coverage Amount *</Label>
        <Input
          id="coverageAmount"
          type="number"
          value={formData.coverageAmount || ""}
          onChange={(e) =>
            setFormData({ ...formData, coverageAmount: Number(e.target.value) })
          }
          placeholder="Enter coverage amount"
        />
      </div>
      <div>
        <Label htmlFor="deductible">Deductible</Label>
        <Input
          id="deductible"
          type="number"
          value={formData.deductible || ""}
          onChange={(e) =>
            setFormData({ ...formData, deductible: Number(e.target.value) })
          }
          placeholder="Enter deductible amount"
        />
      </div>
      <div>
        <Label htmlFor="effectiveDate">Effective Date</Label>
        <Input
          id="effectiveDate"
          type="date"
          value={formData.effectiveDate || ""}
          onChange={(e) =>
            setFormData({ ...formData, effectiveDate: e.target.value })
          }
        />
      </div>
      <div>
        <Label htmlFor="expiryDate">Expiry Date</Label>
        <Input
          id="expiryDate"
          type="date"
          value={formData.expiryDate || ""}
          onChange={(e) =>
            setFormData({ ...formData, expiryDate: e.target.value })
          }
        />
      </div>
      <div>
        <Label htmlFor="riskAssessment">Risk Assessment</Label>
        <Select
          value={formData.riskAssessment || ""}
          onValueChange={(value) =>
            setFormData({ ...formData, riskAssessment: value as any })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select risk level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Low">Low</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="High">High</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="commissionRate">Commission Rate (%)</Label>
        <Input
          id="commissionRate"
          type="number"
          step="0.1"
          value={formData.commissionRate || ""}
          onChange={(e) =>
            setFormData({ ...formData, commissionRate: Number(e.target.value) })
          }
          placeholder="Enter commission rate"
        />
      </div>
      <div className="md:col-span-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes || ""}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Additional notes about the policy"
          rows={3}
        />
      </div>

      {/* Riders Selection */}
      {formData.policyType && (
        <div className="md:col-span-2">
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Add-on Riders & Coverage</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Select additional coverage options for this policy
            </p>
            {(() => {
              const availableRiders = getRidersByPolicyType(formData.policyType);
              const customerAge = 35; // Default age, could be calculated from customer data

              if (availableRiders.length === 0) {
                return (
                  <p className="text-sm text-muted-foreground">
                    No additional riders available for this policy type.
                  </p>
                );
              }

              // Group riders by category
              const ridersByCategory = availableRiders.reduce((acc, rider) => {
                if (!acc[rider.category]) {
                  acc[rider.category] = [];
                }
                acc[rider.category].push(rider);
                return acc;
              }, {} as Record<string, typeof availableRiders>);

              const selectedRidersPremium = selectedRiders.reduce((total, riderId) => {
                const rider = getRiderById(riderId);
                return total + (rider?.premium || 0);
              }, 0);

              return (
                <div className="space-y-6">
                  {/* Summary */}
                  {selectedRiders.length > 0 && (
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">
                          Selected Riders: {selectedRiders.length}
                        </span>
                        <span className="font-medium">
                          Additional Premium: {formatCurrency(selectedRidersPremium)}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Riders by Category */}
                  {Object.entries(ridersByCategory).map(([category, riders]) => (
                    <div key={category}>
                      <h4 className="font-medium mb-3 text-primary">{category} Riders</h4>
                      <div className="grid grid-cols-1 gap-3">
                        {riders.map((rider) => {
                          const isEligible = isRiderEligible(rider, customerAge);
                          const isSelected = selectedRiders.includes(rider.id);

                          return (
                            <div
                              key={rider.id}
                              className={cn(
                                "flex items-start space-x-3 p-4 border rounded-lg",
                                isEligible
                                  ? "border-gray-200 dark:border-gray-700"
                                  : "border-gray-100 dark:border-gray-800 opacity-50",
                                isSelected && "bg-blue-50 dark:bg-blue-900/20 border-blue-200"
                              )}
                            >
                              <Checkbox
                                checked={isSelected}
                                disabled={!isEligible}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedRiders([...selectedRiders, rider.id]);
                                  } else {
                                    setSelectedRiders(selectedRiders.filter(id => id !== rider.id));
                                  }
                                }}
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <h5 className="font-medium">{rider.name}</h5>
                                  <span className="text-sm font-medium">
                                    {formatCurrency(rider.premium)}/year
                                  </span>
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">
                                  {rider.description}
                                </p>
                                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                  <span>Coverage: {formatCurrency(rider.coverage)}</span>
                                  {rider.deductible && (
                                    <span>Deductible: {formatCurrency(rider.deductible)}</span>
                                  )}
                                  {rider.waitingPeriod && (
                                    <span>Waiting: {rider.waitingPeriod} months</span>
                                  )}
                                  {!isEligible && (
                                    <span className="text-red-500">Age restrictions apply</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Policy Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Create, update, and manage insurance policies for customers and
            agents.
          </p>
        </div>
        <Button onClick={openAddDialog} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>New Policy</span>
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Policies
                </p>
                <p className="text-2xl font-bold">{policies.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Active
                </p>
                <p className="text-2xl font-bold">
                  {getPoliciesByStatus("Active").length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Expiring Soon
                </p>
                <p className="text-2xl font-bold">
                  {getExpiringPolicies(30).length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Premiums
                </p>
                <p className="text-2xl font-bold">
                  {formatCurrency(calculateTotalPremiums(policies))}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Coverage
                </p>
                <p className="text-xl font-bold">
                  {formatCurrency(calculateTotalCoverage(policies))}
                </p>
              </div>
              <Shield className="h-8 w-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Policies Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Policies</CardTitle>
          <CardDescription>
            View and manage all insurance policies with premium tracking and
            renewal management.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={policies}
            searchPlaceholder="Search policies..."
            onRowClick={openDetailsDialog}
          />
        </CardContent>
      </Card>

      {/* Add Policy Dialog */}
      <FormDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        title="Create New Policy"
        description="Enter policy information to create a new insurance policy."
        onSubmit={handleAddPolicy}
        maxWidth="max-w-4xl"
      >
        {renderPolicyForm()}
      </FormDialog>

      {/* Edit Policy Dialog */}
      <FormDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        title="Edit Policy"
        description="Update policy information and details."
        onSubmit={handleEditPolicy}
        maxWidth="max-w-4xl"
      >
        {renderPolicyForm()}
      </FormDialog>

      {/* Renewal Dialog */}
      <FormDialog
        open={showRenewalDialog}
        onOpenChange={setShowRenewalDialog}
        title="Renew Policy"
        description="Process policy renewal with updated terms."
        onSubmit={handleRenewal}
        submitLabel="Renew Policy"
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="renewalPremium">New Premium Amount</Label>
            <Input
              id="renewalPremium"
              type="number"
              value={formData.premiumAmount || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  premiumAmount: Number(e.target.value),
                })
              }
              placeholder="Enter new premium amount"
            />
          </div>
          <div>
            <Label htmlFor="renewalNotes">Changes/Notes</Label>
            <Textarea
              id="renewalNotes"
              value={formData.notes || ""}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="Describe any changes made during renewal"
              rows={3}
            />
          </div>
        </div>
      </FormDialog>

      {/* Policy Details Dialog */}
      <FormDialog
        open={showDetailsDialog}
        onOpenChange={setShowDetailsDialog}
        title={
          selectedPolicy
            ? `Policy ${selectedPolicy.policyNumber}`
            : "Policy Details"
        }
        description="View complete policy information and coverage details."
        maxWidth="max-w-6xl"
      >
        {selectedPolicy && (
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="riders">Riders & Coverage</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Policy Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Policy Number:
                    </span>
                    <span className="font-medium">
                      {selectedPolicy.policyNumber}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Customer:
                    </span>
                    <span>{selectedPolicy.customerName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Type:</span>
                    <span>{selectedPolicy.policyType}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Coverage:
                    </span>
                    <Badge variant="outline">
                      {selectedPolicy.coverageType}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Status:
                    </span>
                    <Badge className={statusColors[selectedPolicy.status]}>
                      {selectedPolicy.status}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Financial Details</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Premium:
                    </span>
                    <span className="font-medium">
                      {formatCurrency(selectedPolicy.premiumAmount)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Frequency:
                    </span>
                    <span>{selectedPolicy.premiumFrequency}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Coverage Amount:
                    </span>
                    <span className="font-medium">
                      {formatCurrency(selectedPolicy.coverageAmount)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Deductible:
                    </span>
                    <span>{formatCurrency(selectedPolicy.deductible)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Commission:
                    </span>
                    <span>{selectedPolicy.commissionRate}%</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Important Dates</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Issue Date:
                    </span>
                    <span>{formatDate(selectedPolicy.issueDate)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Effective:
                    </span>
                    <span>{formatDate(selectedPolicy.effectiveDate)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Expires:
                    </span>
                    <span>{formatDate(selectedPolicy.expiryDate)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Next Renewal:
                    </span>
                    <span>{formatDate(selectedPolicy.renewalDate)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Risk Level:
                    </span>
                    <Badge
                      className={cn(
                        selectedPolicy.riskAssessment === "Low" &&
                          "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
                        selectedPolicy.riskAssessment === "Medium" &&
                          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
                        selectedPolicy.riskAssessment === "High" &&
                          "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
                      )}
                    >
                      {selectedPolicy.riskAssessment}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Coverage Details */}
            {selectedPolicy.coverageDetails.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Coverage Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedPolicy.coverageDetails.map((coverage, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{coverage.type}</h4>
                          <Badge
                            variant={coverage.covered ? "default" : "secondary"}
                          >
                            {coverage.covered ? "Covered" : "Not Covered"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {coverage.description}
                        </p>
                        <div className="flex justify-between text-sm">
                          <span>Limit: {formatCurrency(coverage.limit)}</span>
                          <span>
                            Deductible: {formatCurrency(coverage.deductible)}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Beneficiaries */}
            {selectedPolicy.beneficiaries.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Beneficiaries</h3>
                <div className="space-y-3">
                  {selectedPolicy.beneficiaries.map((beneficiary) => (
                    <div
                      key={beneficiary.id}
                      className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-700"
                    >
                      <div>
                        <div className="font-medium">{beneficiary.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {beneficiary.relationship}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {beneficiary.contactInfo.email}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          {beneficiary.percentage}%
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {beneficiary.contactInfo.phone}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Renewal History */}
            {selectedPolicy.renewalHistory.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Renewal History</h3>
                <div className="space-y-3">
                  {selectedPolicy.renewalHistory.map((renewal, index) => (
                    <div
                      key={index}
                      className="p-4 border rounded-lg dark:border-gray-700"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">
                          Renewed on {formatDate(renewal.renewalDate)}
                        </div>
                        <Badge
                          className={
                            renewal.status === "Completed"
                              ? statusColors.Active
                              : statusColors.Pending
                          }
                        >
                          {renewal.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground mb-2">
                        <span>
                          Previous: {formatCurrency(renewal.previousPremium)}
                        </span>
                        <span>New: {formatCurrency(renewal.newPremium)}</span>
                      </div>
                      {renewal.changes.length > 0 && (
                        <div className="text-sm">
                          <div className="font-medium mb-1">Changes:</div>
                          <ul className="list-disc list-inside text-muted-foreground">
                            {renewal.changes.map((change, i) => (
                              <li key={i}>{change}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

              {/* Notes */}
              {selectedPolicy.notes && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Notes</h3>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm">{selectedPolicy.notes}</p>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="riders" className="space-y-6">
              <PolicyRidersManager
                policy={selectedPolicy}
                customerAge={35}
                onRidersUpdate={(riders) => {
                  // Handle rider updates
                  const updatedPolicy = { ...selectedPolicy, riders };
                  console.log('Riders updated:', riders);
                }}
              />
            </TabsContent>

            <TabsContent value="payments" className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Payment History</h3>
                <div className="space-y-3">
                  {selectedPolicy.payments.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-700"
                    >
                      <div>
                        <div className="font-medium">
                          Payment #{payment.id}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Due: {formatDate(payment.dueDate)}
                          {payment.paidDate && (
                            <span> • Paid: {formatDate(payment.paidDate)}</span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          {formatCurrency(payment.amount)}
                        </div>
                        <Badge
                          className={cn(
                            payment.status === "Paid" && "bg-green-100 text-green-800",
                            payment.status === "Pending" && "bg-yellow-100 text-yellow-800",
                            payment.status === "Overdue" && "bg-red-100 text-red-800"
                          )}
                        >
                          {payment.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="documents" className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Policy Documents</h3>
                <div className="space-y-3">
                  {selectedPolicy.documents.map((document) => (
                    <div
                      key={document.id}
                      className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-700"
                    >
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <div>
                          <div className="font-medium">{document.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {document.type} • {document.size} • Uploaded {formatDate(document.uploadDate)}
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </FormDialog>
    </div>
  );
}
