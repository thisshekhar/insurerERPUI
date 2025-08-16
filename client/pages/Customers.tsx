import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  Users,
  Plus,
  Eye,
  Edit,
  Trash2,
  FileText,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Brain,
  Sparkles,
  Target,
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
import { mockCustomers, Customer, getClaimsByCustomer } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const statusColors = {
  Active:
    "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  Inactive: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
  Suspended: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
};

const kycStatusColors = {
  Verified:
    "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  Pending:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
  Rejected: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
};

const kycStatusIcons = {
  Verified: CheckCircle,
  Pending: Clock,
  Rejected: XCircle,
};

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [formData, setFormData] = useState<Partial<Customer>>({});

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

  const handleAddCustomer = () => {
    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newCustomer: Customer = {
      id: `CUST-${String(customers.length + 1).padStart(3, "0")}`,
      firstName: formData.firstName || "",
      lastName: formData.lastName || "",
      email: formData.email || "",
      phone: formData.phone || "",
      dateOfBirth: formData.dateOfBirth || "",
      address: formData.address || {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "USA",
      },
      kycStatus: "Pending",
      kycDocuments: [],
      registrationDate: new Date().toISOString().split("T")[0],
      status: "Active",
      assignedAgent: formData.assignedAgent || "Mike Chen",
      totalPolicies: 0,
      totalPremium: 0,
      notes: formData.notes || "",
    };

    setCustomers([...customers, newCustomer]);
    setShowAddDialog(false);
    setFormData({});
    toast.success("Customer added successfully");
  };

  const handleEditCustomer = () => {
    if (
      !selectedCustomer ||
      !formData.firstName ||
      !formData.lastName ||
      !formData.email
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    const updatedCustomers = customers.map((customer) =>
      customer.id === selectedCustomer.id
        ? { ...customer, ...formData }
        : customer,
    );

    setCustomers(updatedCustomers);
    setShowEditDialog(false);
    setSelectedCustomer(null);
    setFormData({});
    toast.success("Customer updated successfully");
  };

  const handleDeleteCustomer = (customer: Customer) => {
    setCustomers(customers.filter((c) => c.id !== customer.id));
    toast.success("Customer deleted successfully");
  };

  const openAddDialog = () => {
    setFormData({
      address: { street: "", city: "", state: "", zipCode: "", country: "USA" },
    });
    setShowAddDialog(true);
  };

  const openEditDialog = (customer: Customer) => {
    setSelectedCustomer(customer);
    setFormData(customer);
    setShowEditDialog(true);
  };

  const openDetailsDialog = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowDetailsDialog(true);
  };

  const columns: ColumnDef<Customer>[] = [
    {
      accessorKey: "id",
      header: "Customer ID",
      cell: ({ row }) => (
        <div className="font-medium text-blue-600 dark:text-blue-400">
          {row.getValue("id")}
        </div>
      ),
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const customer = row.original;
        return (
          <div>
            <div className="font-medium">
              {customer.firstName} {customer.lastName}
            </div>
            <div className="text-sm text-muted-foreground">
              {customer.email}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <span>{row.getValue("phone")}</span>
        </div>
      ),
    },
    {
      accessorKey: "kycStatus",
      header: "KYC Status",
      cell: ({ row }) => {
        const status = row.getValue(
          "kycStatus",
        ) as keyof typeof kycStatusColors;
        const Icon = kycStatusIcons[status];
        return (
          <Badge className={kycStatusColors[status]}>
            <Icon className="h-3 w-3 mr-1" />
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as keyof typeof statusColors;
        return <Badge className={statusColors[status]}>{status}</Badge>;
      },
    },
    {
      accessorKey: "assignedAgent",
      header: "Agent",
    },
    {
      accessorKey: "totalPolicies",
      header: "Policies",
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("totalPolicies")}</div>
      ),
    },
    {
      accessorKey: "totalPremium",
      header: "Total Premium",
      cell: ({ row }) => formatCurrency(row.getValue("totalPremium")),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const customer = row.original;
        return (
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                openDetailsDialog(customer);
              }}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                openEditDialog(customer);
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteCustomer(customer);
              }}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  const renderCustomerForm = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="firstName">First Name *</Label>
        <Input
          id="firstName"
          value={formData.firstName || ""}
          onChange={(e) =>
            setFormData({ ...formData, firstName: e.target.value })
          }
          placeholder="Enter first name"
        />
      </div>
      <div>
        <Label htmlFor="lastName">Last Name *</Label>
        <Input
          id="lastName"
          value={formData.lastName || ""}
          onChange={(e) =>
            setFormData({ ...formData, lastName: e.target.value })
          }
          placeholder="Enter last name"
        />
      </div>
      <div>
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          value={formData.email || ""}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="Enter email address"
        />
      </div>
      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          value={formData.phone || ""}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="Enter phone number"
        />
      </div>
      <div>
        <Label htmlFor="dateOfBirth">Date of Birth</Label>
        <Input
          id="dateOfBirth"
          type="date"
          value={formData.dateOfBirth || ""}
          onChange={(e) =>
            setFormData({ ...formData, dateOfBirth: e.target.value })
          }
        />
      </div>
      <div>
        <Label htmlFor="assignedAgent">Assigned Agent</Label>
        <Select
          value={formData.assignedAgent || ""}
          onValueChange={(value) =>
            setFormData({ ...formData, assignedAgent: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select agent" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Mike Chen">Mike Chen</SelectItem>
            <SelectItem value="Sarah Williams">Sarah Williams</SelectItem>
            <SelectItem value="James Brown">James Brown</SelectItem>
            <SelectItem value="Lisa Anderson">Lisa Anderson</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="md:col-span-2">
        <Label htmlFor="street">Street Address</Label>
        <Input
          id="street"
          value={formData.address?.street || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              address: { ...formData.address, street: e.target.value } as any,
            })
          }
          placeholder="Enter street address"
        />
      </div>
      <div>
        <Label htmlFor="city">City</Label>
        <Input
          id="city"
          value={formData.address?.city || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              address: { ...formData.address, city: e.target.value } as any,
            })
          }
          placeholder="Enter city"
        />
      </div>
      <div>
        <Label htmlFor="state">State</Label>
        <Input
          id="state"
          value={formData.address?.state || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              address: { ...formData.address, state: e.target.value } as any,
            })
          }
          placeholder="Enter state"
        />
      </div>
      <div>
        <Label htmlFor="zipCode">ZIP Code</Label>
        <Input
          id="zipCode"
          value={formData.address?.zipCode || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              address: { ...formData.address, zipCode: e.target.value } as any,
            })
          }
          placeholder="Enter ZIP code"
        />
      </div>
      <div>
        <Label htmlFor="country">Country</Label>
        <Input
          id="country"
          value={formData.address?.country || "USA"}
          onChange={(e) =>
            setFormData({
              ...formData,
              address: { ...formData.address, country: e.target.value } as any,
            })
          }
          placeholder="Enter country"
        />
      </div>
      <div className="md:col-span-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes || ""}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Additional notes about the customer"
          rows={3}
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Customer Management
            </h1>
            <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white flex items-center space-x-1">
              <Brain className="h-3 w-3" />
              <span>AI-Enhanced</span>
            </Badge>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            AI-powered customer insights, risk assessment, and KYC verification.
          </p>
        </div>
        <Button onClick={openAddDialog} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Customer</span>
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Customers
                </p>
                <p className="text-2xl font-bold">{customers.length}</p>
                <div className="flex items-center text-xs text-purple-600 mt-1">
                  <Sparkles className="h-3 w-3 mr-1" />
                  <span>AI-scored</span>
                </div>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  KYC Verified
                </p>
                <p className="text-2xl font-bold">
                  {customers.filter((c) => c.kycStatus === "Verified").length}
                </p>
                <div className="flex items-center text-xs text-green-600 mt-1">
                  <Brain className="h-3 w-3 mr-1" />
                  <span>AI-verified</span>
                </div>
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
                  Active Customers
                </p>
                <p className="text-2xl font-bold">
                  {customers.filter((c) => c.status === "Active").length}
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
                  Total Premium
                </p>
                <p className="text-2xl font-bold">
                  {formatCurrency(
                    customers.reduce((sum, c) => sum + c.totalPremium, 0),
                  )}
                </p>
              </div>
              <FileText className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Customers</CardTitle>
          <CardDescription>
            View and manage all customer records, KYC status, and policy
            information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={customers}
            searchPlaceholder="Search customers..."
            onRowClick={openDetailsDialog}
          />
        </CardContent>
      </Card>

      {/* Add Customer Dialog */}
      <FormDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        title="Add New Customer"
        description="Enter customer information to create a new customer record."
        onSubmit={handleAddCustomer}
        maxWidth="max-w-2xl"
      >
        {renderCustomerForm()}
      </FormDialog>

      {/* Edit Customer Dialog */}
      <FormDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        title="Edit Customer"
        description="Update customer information and details."
        onSubmit={handleEditCustomer}
        maxWidth="max-w-2xl"
      >
        {renderCustomerForm()}
      </FormDialog>

      {/* Customer Details Dialog */}
      <FormDialog
        open={showDetailsDialog}
        onOpenChange={setShowDetailsDialog}
        title={
          selectedCustomer
            ? `${selectedCustomer.firstName} ${selectedCustomer.lastName}`
            : "Customer Details"
        }
        description="View complete customer information and activity."
        maxWidth="max-w-4xl"
      >
        {selectedCustomer && (
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Contact Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedCustomer.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedCustomer.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {selectedCustomer.address.street},{" "}
                      {selectedCustomer.address.city},{" "}
                      {selectedCustomer.address.state}{" "}
                      {selectedCustomer.address.zipCode}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Account Status</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>KYC Status:</span>
                    <Badge
                      className={kycStatusColors[selectedCustomer.kycStatus]}
                    >
                      {selectedCustomer.kycStatus}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Account Status:</span>
                    <Badge className={statusColors[selectedCustomer.status]}>
                      {selectedCustomer.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Registration Date:</span>
                    <span>{formatDate(selectedCustomer.registrationDate)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Assigned Agent:</span>
                    <span>{selectedCustomer.assignedAgent}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Policy Summary */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Policy Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {selectedCustomer.totalPolicies}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Active Policies
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {formatCurrency(selectedCustomer.totalPremium)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Total Premium
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Claims History */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Recent Claims</h3>
              <div className="space-y-2">
                {getClaimsByCustomer(selectedCustomer.id)
                  .slice(0, 3)
                  .map((claim) => (
                    <div
                      key={claim.id}
                      className="flex items-center justify-between p-3 border rounded-lg dark:border-gray-700"
                    >
                      <div>
                        <div className="font-medium">{claim.id}</div>
                        <div className="text-sm text-muted-foreground">
                          {claim.description.substring(0, 50)}...
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          {formatCurrency(claim.claimAmount)}
                        </div>
                        <Badge
                          className={cn(
                            "text-xs",
                            claim.status === "Approved" &&
                              "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
                            claim.status === "Rejected" &&
                              "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
                            claim.status === "Under Review" &&
                              "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
                            claim.status === "Paid" &&
                              "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
                          )}
                        >
                          {claim.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                {getClaimsByCustomer(selectedCustomer.id).length === 0 && (
                  <div className="text-center text-muted-foreground py-4">
                    No claims found for this customer.
                  </div>
                )}
              </div>
            </div>

            {/* Notes */}
            {selectedCustomer.notes && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Notes</h3>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm">{selectedCustomer.notes}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </FormDialog>
    </div>
  );
}
