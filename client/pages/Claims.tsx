import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  CreditCard,
  Plus,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  FileText,
  Calendar,
  DollarSign,
  User,
  Upload,
  MessageSquare,
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
import { toast } from "sonner";
import { mockClaims, mockCustomers, Claim, Customer } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const statusColors = {
  Submitted: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
  "Under Review":
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
  Approved:
    "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  Rejected: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
  Paid: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
  Closed: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
};

const priorityColors = {
  Low: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  Medium:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
  High: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
  Critical: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
};

const statusIcons = {
  Submitted: FileText,
  "Under Review": Clock,
  Approved: CheckCircle,
  Rejected: XCircle,
  Paid: DollarSign,
  Closed: CheckCircle,
};

export default function Claims() {
  const [claims, setClaims] = useState<Claim[]>(mockClaims);
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [formData, setFormData] = useState<Partial<Claim>>({});
  const [statusUpdate, setStatusUpdate] = useState({ status: "", notes: "" });

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

  const handleAddClaim = () => {
    if (
      !formData.customerName ||
      !formData.policyType ||
      !formData.claimAmount
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newClaim: Claim = {
      id: `CLM-${String(claims.length + 1).padStart(3, "0")}`,
      policyId:
        formData.policyId ||
        `POL-${String(Math.floor(Math.random() * 999) + 1).padStart(3, "0")}`,
      customerId:
        formData.customerId ||
        `CUST-${String(Math.floor(Math.random() * 999) + 1).padStart(3, "0")}`,
      customerName: formData.customerName || "",
      policyType: formData.policyType || "",
      claimType: formData.claimType || "Other",
      claimAmount: formData.claimAmount || 0,
      status: "Submitted",
      priority: formData.priority || "Medium",
      submissionDate: new Date().toISOString().split("T")[0],
      incidentDate:
        formData.incidentDate || new Date().toISOString().split("T")[0],
      description: formData.description || "",
      assignedAdjuster: formData.assignedAdjuster || "John Martinez",
      documents: [],
      timeline: [
        {
          date: new Date().toISOString().split("T")[0],
          action: "Claim Submitted",
          user: formData.customerName || "Customer",
        },
      ],
    };

    setClaims([...claims, newClaim]);
    setShowAddDialog(false);
    setFormData({});
    toast.success("Claim submitted successfully");
  };

  const handleUpdateStatus = () => {
    if (!selectedClaim || !statusUpdate.status) {
      toast.error("Please select a status");
      return;
    }

    const updatedClaims = claims.map((claim) =>
      claim.id === selectedClaim.id
        ? {
            ...claim,
            status: statusUpdate.status as any,
            timeline: [
              ...claim.timeline,
              {
                date: new Date().toISOString().split("T")[0],
                action: `Status Updated to ${statusUpdate.status}`,
                user: "Admin",
                notes: statusUpdate.notes,
              },
            ],
          }
        : claim,
    );

    setClaims(updatedClaims);
    setShowStatusDialog(false);
    setStatusUpdate({ status: "", notes: "" });
    toast.success("Claim status updated successfully");
  };

  const openAddDialog = () => {
    setFormData({});
    setShowAddDialog(true);
  };

  const openDetailsDialog = (claim: Claim) => {
    setSelectedClaim(claim);
    setShowDetailsDialog(true);
  };

  const openStatusDialog = (claim: Claim) => {
    setSelectedClaim(claim);
    setStatusUpdate({ status: claim.status, notes: "" });
    setShowStatusDialog(true);
  };

  const columns: ColumnDef<Claim>[] = [
    {
      accessorKey: "id",
      header: "Claim ID",
      cell: ({ row }) => (
        <div className="font-medium text-blue-600 dark:text-blue-400">
          {row.getValue("id")}
        </div>
      ),
    },
    {
      accessorKey: "customerName",
      header: "Customer",
      cell: ({ row }) => {
        const claim = row.original;
        return (
          <div>
            <div className="font-medium">{claim.customerName}</div>
            <div className="text-sm text-muted-foreground">
              {claim.policyType}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "claimType",
      header: "Type",
      cell: ({ row }) => (
        <Badge variant="outline">{row.getValue("claimType")}</Badge>
      ),
    },
    {
      accessorKey: "claimAmount",
      header: "Amount",
      cell: ({ row }) => formatCurrency(row.getValue("claimAmount")),
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
      accessorKey: "priority",
      header: "Priority",
      cell: ({ row }) => {
        const priority = row.getValue(
          "priority",
        ) as keyof typeof priorityColors;
        return <Badge className={priorityColors[priority]}>{priority}</Badge>;
      },
    },
    {
      accessorKey: "assignedAdjuster",
      header: "Adjuster",
    },
    {
      accessorKey: "submissionDate",
      header: "Submitted",
      cell: ({ row }) => formatDate(row.getValue("submissionDate")),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const claim = row.original;
        return (
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                openDetailsDialog(claim);
              }}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                openStatusDialog(claim);
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  const renderClaimForm = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="customerName">Customer Name *</Label>
        <Input
          id="customerName"
          value={formData.customerName || ""}
          onChange={(e) =>
            setFormData({ ...formData, customerName: e.target.value })
          }
          placeholder="Enter customer name"
        />
      </div>
      <div>
        <Label htmlFor="policyType">Policy Type *</Label>
        <Select
          value={formData.policyType || ""}
          onValueChange={(value) =>
            setFormData({ ...formData, policyType: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select policy type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Life Insurance">Life Insurance</SelectItem>
            <SelectItem value="Health Insurance">Health Insurance</SelectItem>
            <SelectItem value="Auto Insurance">Auto Insurance</SelectItem>
            <SelectItem value="Home Insurance">Home Insurance</SelectItem>
            <SelectItem value="Travel Insurance">Travel Insurance</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="claimType">Claim Type</Label>
        <Select
          value={formData.claimType || ""}
          onValueChange={(value) =>
            setFormData({ ...formData, claimType: value as any })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select claim type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Accident">Accident</SelectItem>
            <SelectItem value="Medical">Medical</SelectItem>
            <SelectItem value="Fire">Fire</SelectItem>
            <SelectItem value="Theft">Theft</SelectItem>
            <SelectItem value="Natural Disaster">Natural Disaster</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="claimAmount">Claim Amount *</Label>
        <Input
          id="claimAmount"
          type="number"
          value={formData.claimAmount || ""}
          onChange={(e) =>
            setFormData({ ...formData, claimAmount: Number(e.target.value) })
          }
          placeholder="Enter claim amount"
        />
      </div>
      <div>
        <Label htmlFor="incidentDate">Incident Date</Label>
        <Input
          id="incidentDate"
          type="date"
          value={formData.incidentDate || ""}
          onChange={(e) =>
            setFormData({ ...formData, incidentDate: e.target.value })
          }
        />
      </div>
      <div>
        <Label htmlFor="priority">Priority</Label>
        <Select
          value={formData.priority || ""}
          onValueChange={(value) =>
            setFormData({ ...formData, priority: value as any })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Low">Low</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="High">High</SelectItem>
            <SelectItem value="Critical">Critical</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="assignedAdjuster">Assigned Adjuster</Label>
        <Select
          value={formData.assignedAdjuster || ""}
          onValueChange={(value) =>
            setFormData({ ...formData, assignedAdjuster: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select adjuster" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="John Martinez">John Martinez</SelectItem>
            <SelectItem value="Maria Rodriguez">Maria Rodriguez</SelectItem>
            <SelectItem value="Robert Lee">Robert Lee</SelectItem>
            <SelectItem value="Jennifer White">Jennifer White</SelectItem>
            <SelectItem value="Michael Brown">Michael Brown</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="policyId">Policy ID</Label>
        <Input
          id="policyId"
          value={formData.policyId || ""}
          onChange={(e) =>
            setFormData({ ...formData, policyId: e.target.value })
          }
          placeholder="Enter policy ID (optional)"
        />
      </div>
      <div className="md:col-span-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={formData.description || ""}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Describe the incident and claim details"
          rows={4}
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Claims Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Process insurance claims, track status, and manage approval
            workflows.
          </p>
        </div>
        <Button onClick={openAddDialog} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>New Claim</span>
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Claims
                </p>
                <p className="text-2xl font-bold">{claims.length}</p>
              </div>
              <CreditCard className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Under Review
                </p>
                <p className="text-2xl font-bold">
                  {claims.filter((c) => c.status === "Under Review").length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Approved
                </p>
                <p className="text-2xl font-bold">
                  {claims.filter((c) => c.status === "Approved").length}
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
                  Rejected
                </p>
                <p className="text-2xl font-bold">
                  {claims.filter((c) => c.status === "Rejected").length}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Amount
                </p>
                <p className="text-2xl font-bold">
                  {formatCurrency(
                    claims.reduce((sum, c) => sum + c.claimAmount, 0),
                  )}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Claims Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Claims</CardTitle>
          <CardDescription>
            View and manage all insurance claims with status tracking and
            approval workflows.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={claims}
            searchPlaceholder="Search claims..."
            onRowClick={openDetailsDialog}
          />
        </CardContent>
      </Card>

      {/* Add Claim Dialog */}
      <FormDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        title="Submit New Claim"
        description="Enter claim information to submit a new insurance claim."
        onSubmit={handleAddClaim}
        maxWidth="max-w-2xl"
      >
        {renderClaimForm()}
      </FormDialog>

      {/* Update Status Dialog */}
      <FormDialog
        open={showStatusDialog}
        onOpenChange={setShowStatusDialog}
        title="Update Claim Status"
        description="Change the status of the claim and add notes."
        onSubmit={handleUpdateStatus}
        submitLabel="Update Status"
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="status">New Status</Label>
            <Select
              value={statusUpdate.status}
              onValueChange={(value) =>
                setStatusUpdate({ ...statusUpdate, status: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select new status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Submitted">Submitted</SelectItem>
                <SelectItem value="Under Review">Under Review</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={statusUpdate.notes}
              onChange={(e) =>
                setStatusUpdate({ ...statusUpdate, notes: e.target.value })
              }
              placeholder="Add notes about this status change"
              rows={3}
            />
          </div>
        </div>
      </FormDialog>

      {/* Claim Details Dialog */}
      <FormDialog
        open={showDetailsDialog}
        onOpenChange={setShowDetailsDialog}
        title={selectedClaim ? `Claim ${selectedClaim.id}` : "Claim Details"}
        description="View complete claim information and timeline."
        maxWidth="max-w-4xl"
      >
        {selectedClaim && (
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Claim Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Customer:
                    </span>
                    <span className="font-medium">
                      {selectedClaim.customerName}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Policy Type:
                    </span>
                    <span>{selectedClaim.policyType}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Claim Type:
                    </span>
                    <Badge variant="outline">{selectedClaim.claimType}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Priority:
                    </span>
                    <Badge className={priorityColors[selectedClaim.priority]}>
                      {selectedClaim.priority}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Status & Amounts</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Status:
                    </span>
                    <Badge className={statusColors[selectedClaim.status]}>
                      {selectedClaim.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Claim Amount:
                    </span>
                    <span className="font-medium">
                      {formatCurrency(selectedClaim.claimAmount)}
                    </span>
                  </div>
                  {selectedClaim.approvedAmount && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Approved Amount:
                      </span>
                      <span className="font-medium text-green-600">
                        {formatCurrency(selectedClaim.approvedAmount)}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Adjuster:
                    </span>
                    <span>{selectedClaim.assignedAdjuster}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Incident Date
                      </div>
                      <div className="font-medium">
                        {formatDate(selectedClaim.incidentDate)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Submission Date
                      </div>
                      <div className="font-medium">
                        {formatDate(selectedClaim.submissionDate)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm">{selectedClaim.description}</p>
              </div>
            </div>

            {/* Documents */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Documents</h3>
              <div className="space-y-2">
                {selectedClaim.documents.map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg dark:border-gray-700"
                  >
                    <div className="flex items-center space-x-3">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{doc.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {doc.type} • {formatDate(doc.uploadDate)}
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {selectedClaim.documents.length === 0 && (
                  <div className="text-center text-muted-foreground py-4">
                    No documents uploaded yet.
                  </div>
                )}
              </div>
            </div>

            {/* Timeline */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Timeline</h3>
              <div className="space-y-4">
                {selectedClaim.timeline.map((event, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{event.action}</div>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(event.date)}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        by {event.user}
                      </div>
                      {event.notes && (
                        <div className="text-sm mt-1 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                          {event.notes}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </FormDialog>
    </div>
  );
}
