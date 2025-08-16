import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  DollarSign,
  Plus,
  Eye,
  Edit,
  Download,
  Send,
  CreditCard,
  Building,
  Phone,
  Mail,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw,
  FileText,
  Calculator,
  TrendingUp,
  TrendingDown,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  mockPayments,
  mockInvoices,
  mockReminders,
  mockPaymentMethods,
  Payment,
  Invoice,
  PaymentReminder,
  getPaymentsByStatus,
  getOverduePayments,
  getUpcomingPayments,
  calculateTotalRevenue,
  calculateOutstandingAmount,
  getMonthlyRevenue,
} from "@/lib/payment-data";
import { mockCustomers } from "@/lib/mock-data";
import { mockPolicies } from "@/lib/policy-data";
import { cn } from "@/lib/utils";

const paymentStatusColors = {
  Pending:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
  Paid: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  Overdue: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
  Partial: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
  Failed: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
  Refunded: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
};

const invoiceStatusColors = {
  Draft: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
  Sent: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
  Paid: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  Overdue: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
  Cancelled: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
};

const statusIcons = {
  Pending: Clock,
  Paid: CheckCircle,
  Overdue: AlertTriangle,
  Partial: RefreshCw,
  Failed: XCircle,
  Refunded: RefreshCw,
  Draft: FileText,
  Sent: Send,
  Cancelled: XCircle,
};

const paymentMethodIcons = {
  "Credit Card": CreditCard,
  "Bank Transfer": Building,
  Check: FileText,
  Cash: DollarSign,
  PayPal: DollarSign,
  "Direct Debit": Building,
};

export default function Payments() {
  const [payments, setPayments] = useState<Payment[]>(mockPayments);
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [reminders, setReminders] = useState<PaymentReminder[]>(mockReminders);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showProcessPaymentDialog, setShowProcessPaymentDialog] =
    useState(false);
  const [showCreateInvoiceDialog, setShowCreateInvoiceDialog] = useState(false);
  const [showSendReminderDialog, setShowSendReminderDialog] = useState(false);
  const [showPaymentDetailsDialog, setShowPaymentDetailsDialog] =
    useState(false);
  const [showInvoiceDetailsDialog, setShowInvoiceDetailsDialog] =
    useState(false);
  const [formData, setFormData] = useState<any>({});

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

  const handleProcessPayment = () => {
    if (!selectedPayment || !formData.amount || !formData.paymentMethod) {
      toast.error("Please fill in all required fields");
      return;
    }

    const updatedPayment = {
      ...selectedPayment,
      status: "Paid" as const,
      paidDate: new Date().toISOString().split("T")[0],
      paymentMethod: formData.paymentMethod,
      transactionId: `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      processedBy: "Admin",
      notes: formData.notes || undefined,
    };

    setPayments(
      payments.map((p) => (p.id === selectedPayment.id ? updatedPayment : p)),
    );
    setShowProcessPaymentDialog(false);
    setFormData({});
    toast.success("Payment processed successfully");
  };

  const handleCreateInvoice = () => {
    if (!formData.customerId || !formData.amount) {
      toast.error("Please fill in all required fields");
      return;
    }

    const customer = mockCustomers.find((c) => c.id === formData.customerId);
    const policy = mockPolicies.find((p) => p.id === formData.policyId);

    const newInvoice: Invoice = {
      id: `INV-${String(invoices.length + 1).padStart(3, "0")}`,
      invoiceNumber: `INV-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(3, "0")}`,
      policyId: formData.policyId || "",
      customerId: formData.customerId,
      customerName: customer
        ? `${customer.firstName} ${customer.lastName}`
        : "",
      policyNumber: policy?.policyNumber || "",
      issueDate: new Date().toISOString().split("T")[0],
      dueDate:
        formData.dueDate ||
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
      amount: formData.amount,
      taxAmount: formData.taxAmount || 0,
      totalAmount: (formData.amount || 0) + (formData.taxAmount || 0),
      status: "Draft",
      paymentTerms: formData.paymentTerms || "Net 30",
      lineItems: [
        {
          id: "LI-001",
          description: formData.description || "Premium Payment",
          quantity: 1,
          unitPrice: formData.amount || 0,
          totalPrice: formData.amount || 0,
          taxRate: 0,
          taxAmount: formData.taxAmount || 0,
        },
      ],
      payments: [],
      billingAddress: customer?.address || {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "USA",
      },
    };

    setInvoices([...invoices, newInvoice]);
    setShowCreateInvoiceDialog(false);
    setFormData({});
    toast.success("Invoice created successfully");
  };

  const handleSendReminder = () => {
    if (!selectedPayment || !formData.type) {
      toast.error("Please select reminder type");
      return;
    }

    const newReminder: PaymentReminder = {
      id: `REM-${String(reminders.length + 1).padStart(3, "0")}`,
      paymentId: selectedPayment.id,
      customerId: selectedPayment.customerId,
      customerName: selectedPayment.customerName,
      type: formData.type,
      sentDate: new Date().toISOString().split("T")[0],
      dueDate: selectedPayment.dueDate,
      amount: selectedPayment.amount,
      status: "Sent",
      template: formData.template || "Payment Reminder",
    };

    setReminders([...reminders, newReminder]);
    setShowSendReminderDialog(false);
    setFormData({});
    toast.success("Reminder sent successfully");
  };

  const paymentColumns: ColumnDef<Payment>[] = [
    {
      accessorKey: "reference",
      header: "Reference",
      cell: ({ row }) => (
        <div className="font-medium text-blue-600 dark:text-blue-400">
          {row.getValue("reference")}
        </div>
      ),
    },
    {
      accessorKey: "customerName",
      header: "Customer",
      cell: ({ row }) => {
        const payment = row.original;
        return (
          <div>
            <div className="font-medium">{payment.customerName}</div>
            <div className="text-sm text-muted-foreground">
              {payment.policyNumber}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => {
        const payment = row.original;
        return (
          <div>
            <div className="font-medium">{formatCurrency(payment.amount)}</div>
            {payment.late_fee && (
              <div className="text-sm text-red-600">
                +{formatCurrency(payment.late_fee)} late fee
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "dueDate",
      header: "Due Date",
      cell: ({ row }) => formatDate(row.getValue("dueDate")),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue(
          "status",
        ) as keyof typeof paymentStatusColors;
        const Icon = statusIcons[status];
        return (
          <Badge className={paymentStatusColors[status]}>
            <Icon className="h-3 w-3 mr-1" />
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "paymentMethod",
      header: "Method",
      cell: ({ row }) => {
        const method = row.getValue("paymentMethod") as string;
        if (!method) return <span className="text-muted-foreground">-</span>;
        const Icon =
          paymentMethodIcons[method as keyof typeof paymentMethodIcons];
        return (
          <div className="flex items-center space-x-2">
            <Icon className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{method}</span>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const payment = row.original;
        return (
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedPayment(payment);
                setShowPaymentDetailsDialog(true);
              }}
            >
              <Eye className="h-4 w-4" />
            </Button>
            {payment.status === "Pending" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPayment(payment);
                  setFormData({ amount: payment.amount });
                  setShowProcessPaymentDialog(true);
                }}
              >
                <CreditCard className="h-4 w-4" />
              </Button>
            )}
            {(payment.status === "Pending" || payment.status === "Overdue") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPayment(payment);
                  setShowSendReminderDialog(true);
                }}
              >
                <Send className="h-4 w-4" />
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  const invoiceColumns: ColumnDef<Invoice>[] = [
    {
      accessorKey: "invoiceNumber",
      header: "Invoice #",
      cell: ({ row }) => (
        <div className="font-medium text-blue-600 dark:text-blue-400">
          {row.getValue("invoiceNumber")}
        </div>
      ),
    },
    {
      accessorKey: "customerName",
      header: "Customer",
      cell: ({ row }) => {
        const invoice = row.original;
        return (
          <div>
            <div className="font-medium">{invoice.customerName}</div>
            <div className="text-sm text-muted-foreground">
              {invoice.policyNumber}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "totalAmount",
      header: "Total",
      cell: ({ row }) => formatCurrency(row.getValue("totalAmount")),
    },
    {
      accessorKey: "issueDate",
      header: "Issue Date",
      cell: ({ row }) => formatDate(row.getValue("issueDate")),
    },
    {
      accessorKey: "dueDate",
      header: "Due Date",
      cell: ({ row }) => formatDate(row.getValue("dueDate")),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue(
          "status",
        ) as keyof typeof invoiceStatusColors;
        const Icon = statusIcons[status];
        return (
          <Badge className={invoiceStatusColors[status]}>
            <Icon className="h-3 w-3 mr-1" />
            {status}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const invoice = row.original;
        return (
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedInvoice(invoice);
                setShowInvoiceDetailsDialog(true);
              }}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                toast.success("Invoice downloaded");
              }}
            >
              <Download className="h-4 w-4" />
            </Button>
            {invoice.status === "Draft" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  const updatedInvoices = invoices.map((inv) =>
                    inv.id === invoice.id
                      ? {
                          ...inv,
                          status: "Sent" as const,
                          sentDate: new Date().toISOString().split("T")[0],
                        }
                      : inv,
                  );
                  setInvoices(updatedInvoices);
                  toast.success("Invoice sent to customer");
                }}
              >
                <Send className="h-4 w-4" />
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  // Calculate statistics
  const totalRevenue = calculateTotalRevenue(payments);
  const outstandingAmount = calculateOutstandingAmount(payments);
  const overduePayments = getOverduePayments();
  const upcomingPayments = getUpcomingPayments(30);
  const thisMonthRevenue = getMonthlyRevenue(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
  );
  const lastMonthRevenue = getMonthlyRevenue(
    new Date().getFullYear(),
    new Date().getMonth(),
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Payments & Premiums
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Track payment history, manage invoices, and handle premium
            collections.
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => setShowCreateInvoiceDialog(true)}
            className="flex items-center space-x-2"
          >
            <FileText className="h-4 w-4" />
            <span>Create Invoice</span>
          </Button>
          <Button
            onClick={() => {
              setSelectedPayment(null);
              setFormData({});
              setShowProcessPaymentDialog(true);
            }}
            className="flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Process Payment</span>
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Revenue
                </p>
                <p className="text-2xl font-bold">
                  {formatCurrency(totalRevenue)}
                </p>
                <div className="flex items-center text-xs text-green-600 mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span>+12.5% from last month</span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Outstanding
                </p>
                <p className="text-2xl font-bold">
                  {formatCurrency(outstandingAmount)}
                </p>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <span>
                    {getPaymentsByStatus("Pending").length} pending payments
                  </span>
                </div>
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
                  Overdue
                </p>
                <p className="text-2xl font-bold">{overduePayments.length}</p>
                <div className="flex items-center text-xs text-red-600 mt-1">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  <span>
                    {formatCurrency(
                      overduePayments.reduce((sum, p) => sum + p.amount, 0),
                    )}
                  </span>
                </div>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  This Month
                </p>
                <p className="text-2xl font-bold">
                  {formatCurrency(thisMonthRevenue)}
                </p>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  {thisMonthRevenue > lastMonthRevenue ? (
                    <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1 text-red-600" />
                  )}
                  <span>vs {formatCurrency(lastMonthRevenue)} last month</span>
                </div>
              </div>
              <Calculator className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different views */}
      <Tabs defaultValue="payments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="overdue">
            Overdue ({overduePayments.length})
          </TabsTrigger>
          <TabsTrigger value="upcoming">
            Upcoming ({upcomingPayments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>
                View and manage all payment transactions with status tracking.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={paymentColumns}
                data={payments}
                searchPlaceholder="Search payments..."
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Management</CardTitle>
              <CardDescription>
                Create, send, and track invoices for premium payments.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={invoiceColumns}
                data={invoices}
                searchPlaceholder="Search invoices..."
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overdue">
          <Card>
            <CardHeader>
              <CardTitle>Overdue Payments</CardTitle>
              <CardDescription>
                Payments that are past due and require immediate attention.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={paymentColumns}
                data={overduePayments}
                searchPlaceholder="Search overdue payments..."
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upcoming">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Payments</CardTitle>
              <CardDescription>
                Payments due within the next 30 days.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={paymentColumns}
                data={upcomingPayments}
                searchPlaceholder="Search upcoming payments..."
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Process Payment Dialog */}
      <FormDialog
        open={showProcessPaymentDialog}
        onOpenChange={setShowProcessPaymentDialog}
        title="Process Payment"
        description="Record a payment transaction."
        onSubmit={handleProcessPayment}
        submitLabel="Process Payment"
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="amount">Amount *</Label>
            <Input
              id="amount"
              type="number"
              value={formData.amount || ""}
              onChange={(e) =>
                setFormData({ ...formData, amount: Number(e.target.value) })
              }
              placeholder="Enter payment amount"
            />
          </div>
          <div>
            <Label htmlFor="paymentMethod">Payment Method *</Label>
            <Select
              value={formData.paymentMethod || ""}
              onValueChange={(value) =>
                setFormData({ ...formData, paymentMethod: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Credit Card">Credit Card</SelectItem>
                <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                <SelectItem value="Check">Check</SelectItem>
                <SelectItem value="Cash">Cash</SelectItem>
                <SelectItem value="PayPal">PayPal</SelectItem>
                <SelectItem value="Direct Debit">Direct Debit</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes || ""}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="Additional notes about this payment"
              rows={3}
            />
          </div>
        </div>
      </FormDialog>

      {/* Create Invoice Dialog */}
      <FormDialog
        open={showCreateInvoiceDialog}
        onOpenChange={setShowCreateInvoiceDialog}
        title="Create Invoice"
        description="Generate a new invoice for premium payment."
        onSubmit={handleCreateInvoice}
        submitLabel="Create Invoice"
        maxWidth="max-w-2xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="customerId">Customer *</Label>
            <Select
              value={formData.customerId || ""}
              onValueChange={(value) =>
                setFormData({ ...formData, customerId: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select customer" />
              </SelectTrigger>
              <SelectContent>
                {mockCustomers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.firstName} {customer.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="policyId">Policy</Label>
            <Select
              value={formData.policyId || ""}
              onValueChange={(value) =>
                setFormData({ ...formData, policyId: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select policy" />
              </SelectTrigger>
              <SelectContent>
                {mockPolicies.map((policy) => (
                  <SelectItem key={policy.id} value={policy.id}>
                    {policy.policyNumber} - {policy.policyType}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="amount">Amount *</Label>
            <Input
              id="amount"
              type="number"
              value={formData.amount || ""}
              onChange={(e) =>
                setFormData({ ...formData, amount: Number(e.target.value) })
              }
              placeholder="Enter invoice amount"
            />
          </div>
          <div>
            <Label htmlFor="taxAmount">Tax Amount</Label>
            <Input
              id="taxAmount"
              type="number"
              value={formData.taxAmount || ""}
              onChange={(e) =>
                setFormData({ ...formData, taxAmount: Number(e.target.value) })
              }
              placeholder="Enter tax amount"
            />
          </div>
          <div>
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              value={formData.dueDate || ""}
              onChange={(e) =>
                setFormData({ ...formData, dueDate: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="paymentTerms">Payment Terms</Label>
            <Select
              value={formData.paymentTerms || ""}
              onValueChange={(value) =>
                setFormData({ ...formData, paymentTerms: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment terms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Net 15">Net 15</SelectItem>
                <SelectItem value="Net 30">Net 30</SelectItem>
                <SelectItem value="Net 45">Net 45</SelectItem>
                <SelectItem value="Net 60">Net 60</SelectItem>
                <SelectItem value="Due on Receipt">Due on Receipt</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ""}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Invoice description"
              rows={3}
            />
          </div>
        </div>
      </FormDialog>

      {/* Send Reminder Dialog */}
      <FormDialog
        open={showSendReminderDialog}
        onOpenChange={setShowSendReminderDialog}
        title="Send Payment Reminder"
        description="Send a reminder to the customer about their overdue payment."
        onSubmit={handleSendReminder}
        submitLabel="Send Reminder"
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="type">Reminder Type *</Label>
            <Select
              value={formData.type || ""}
              onValueChange={(value) =>
                setFormData({ ...formData, type: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select reminder type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Email">Email</SelectItem>
                <SelectItem value="SMS">SMS</SelectItem>
                <SelectItem value="Phone Call">Phone Call</SelectItem>
                <SelectItem value="Letter">Letter</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="template">Template</Label>
            <Select
              value={formData.template || ""}
              onValueChange={(value) =>
                setFormData({ ...formData, template: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Payment Reminder">
                  Payment Reminder
                </SelectItem>
                <SelectItem value="First Overdue Notice">
                  First Overdue Notice
                </SelectItem>
                <SelectItem value="Second Notice">Second Notice</SelectItem>
                <SelectItem value="Final Notice">Final Notice</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </FormDialog>

      {/* Payment Details Dialog */}
      <FormDialog
        open={showPaymentDetailsDialog}
        onOpenChange={setShowPaymentDetailsDialog}
        title={
          selectedPayment ? `Payment ${selectedPayment.id}` : "Payment Details"
        }
        description="View complete payment information and transaction details."
        maxWidth="max-w-2xl"
      >
        {selectedPayment && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Customer</Label>
                <p>{selectedPayment.customerName}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Policy Number</Label>
                <p>{selectedPayment.policyNumber}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Amount</Label>
                <p className="text-lg font-bold">
                  {formatCurrency(selectedPayment.amount)}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Status</Label>
                <Badge className={paymentStatusColors[selectedPayment.status]}>
                  {selectedPayment.status}
                </Badge>
              </div>
              <div>
                <Label className="text-sm font-medium">Due Date</Label>
                <p>{formatDate(selectedPayment.dueDate)}</p>
              </div>
              {selectedPayment.paidDate && (
                <div>
                  <Label className="text-sm font-medium">Paid Date</Label>
                  <p>{formatDate(selectedPayment.paidDate)}</p>
                </div>
              )}
              {selectedPayment.paymentMethod && (
                <div>
                  <Label className="text-sm font-medium">Payment Method</Label>
                  <p>{selectedPayment.paymentMethod}</p>
                </div>
              )}
              {selectedPayment.transactionId && (
                <div>
                  <Label className="text-sm font-medium">Transaction ID</Label>
                  <p className="font-mono text-sm">
                    {selectedPayment.transactionId}
                  </p>
                </div>
              )}
            </div>
            {selectedPayment.description && (
              <div>
                <Label className="text-sm font-medium">Description</Label>
                <p className="text-sm text-muted-foreground">
                  {selectedPayment.description}
                </p>
              </div>
            )}
            {selectedPayment.notes && (
              <div>
                <Label className="text-sm font-medium">Notes</Label>
                <p className="text-sm text-muted-foreground">
                  {selectedPayment.notes}
                </p>
              </div>
            )}
          </div>
        )}
      </FormDialog>

      {/* Invoice Details Dialog */}
      <FormDialog
        open={showInvoiceDetailsDialog}
        onOpenChange={setShowInvoiceDetailsDialog}
        title={
          selectedInvoice
            ? `Invoice ${selectedInvoice.invoiceNumber}`
            : "Invoice Details"
        }
        description="View complete invoice information and line items."
        maxWidth="max-w-4xl"
      >
        {selectedInvoice && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Customer</Label>
                <p>{selectedInvoice.customerName}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Policy Number</Label>
                <p>{selectedInvoice.policyNumber}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Issue Date</Label>
                <p>{formatDate(selectedInvoice.issueDate)}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Due Date</Label>
                <p>{formatDate(selectedInvoice.dueDate)}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Payment Terms</Label>
                <p>{selectedInvoice.paymentTerms}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Status</Label>
                <Badge className={invoiceStatusColors[selectedInvoice.status]}>
                  {selectedInvoice.status}
                </Badge>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">
                Line Items
              </Label>
              <div className="border rounded-lg">
                <table className="w-full">
                  <thead className="border-b bg-muted/50">
                    <tr>
                      <th className="text-left p-3">Description</th>
                      <th className="text-right p-3">Qty</th>
                      <th className="text-right p-3">Unit Price</th>
                      <th className="text-right p-3">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedInvoice.lineItems.map((item) => (
                      <tr key={item.id} className="border-b">
                        <td className="p-3">{item.description}</td>
                        <td className="text-right p-3">{item.quantity}</td>
                        <td className="text-right p-3">
                          {formatCurrency(item.unitPrice)}
                        </td>
                        <td className="text-right p-3">
                          {formatCurrency(item.totalPrice)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-muted/50">
                    <tr>
                      <td colSpan={3} className="text-right p-3 font-medium">
                        Subtotal:
                      </td>
                      <td className="text-right p-3 font-medium">
                        {formatCurrency(selectedInvoice.amount)}
                      </td>
                    </tr>
                    {selectedInvoice.taxAmount > 0 && (
                      <tr>
                        <td colSpan={3} className="text-right p-3">
                          Tax:
                        </td>
                        <td className="text-right p-3">
                          {formatCurrency(selectedInvoice.taxAmount)}
                        </td>
                      </tr>
                    )}
                    <tr>
                      <td colSpan={3} className="text-right p-3 font-bold">
                        Total:
                      </td>
                      <td className="text-right p-3 font-bold">
                        {formatCurrency(selectedInvoice.totalAmount)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Billing Address</Label>
              <div className="text-sm text-muted-foreground">
                <p>{selectedInvoice.billingAddress.street}</p>
                <p>
                  {selectedInvoice.billingAddress.city},{" "}
                  {selectedInvoice.billingAddress.state}{" "}
                  {selectedInvoice.billingAddress.zipCode}
                </p>
                <p>{selectedInvoice.billingAddress.country}</p>
              </div>
            </div>
          </div>
        )}
      </FormDialog>
    </div>
  );
}
