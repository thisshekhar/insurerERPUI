// Payment and Invoice types
export interface Payment {
  id: string;
  invoiceId: string;
  policyId: string;
  customerId: string;
  customerName: string;
  policyNumber: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: "Pending" | "Paid" | "Overdue" | "Partial" | "Failed" | "Refunded";
  paymentMethod?:
    | "Credit Card"
    | "Bank Transfer"
    | "Check"
    | "Cash"
    | "PayPal"
    | "Direct Debit";
  transactionId?: string;
  reference: string;
  description: string;
  late_fee?: number;
  discount?: number;
  notes?: string;
  createdDate: string;
  processedBy?: string;
  receiptUrl?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  policyId: string;
  customerId: string;
  customerName: string;
  policyNumber: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  taxAmount: number;
  totalAmount: number;
  status: "Draft" | "Sent" | "Paid" | "Overdue" | "Cancelled";
  paymentTerms: string;
  lineItems: InvoiceLineItem[];
  payments: string[]; // Payment IDs
  sentDate?: string;
  paidDate?: string;
  notes?: string;
  billingAddress: Address;
}

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  taxRate: number;
  taxAmount: number;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface PaymentReminder {
  id: string;
  paymentId: string;
  customerId: string;
  customerName: string;
  type: "Email" | "SMS" | "Phone Call" | "Letter";
  sentDate: string;
  dueDate: string;
  amount: number;
  status: "Sent" | "Delivered" | "Failed" | "Responded";
  template: string;
  notes?: string;
}

export interface PaymentMethod {
  id: string;
  customerId: string;
  type: "Credit Card" | "Bank Account" | "PayPal";
  isDefault: boolean;
  details: {
    cardLast4?: string;
    cardType?: string;
    expiryDate?: string;
    bankName?: string;
    accountLast4?: string;
    accountType?: string;
    email?: string;
  };
  createdDate: string;
  isActive: boolean;
}

// Mock Payments Data
export const mockPayments: Payment[] = [
  {
    id: "PAY-001",
    invoiceId: "INV-001",
    policyId: "POL-001",
    customerId: "CUST-001",
    customerName: "Alice Johnson",
    policyNumber: "LIF-2024-001-AL",
    amount: 2400,
    dueDate: "2024-02-01",
    paidDate: "2024-01-28",
    status: "Paid",
    paymentMethod: "Bank Transfer",
    transactionId: "TXN-001-2024",
    reference: "Premium Payment - Life Insurance",
    description: "Annual premium payment for Term Life Insurance policy",
    createdDate: "2024-01-15",
    processedBy: "System",
    receiptUrl: "/receipts/pay-001.pdf",
  },
  {
    id: "PAY-002",
    invoiceId: "INV-002",
    policyId: "POL-001",
    customerId: "CUST-001",
    customerName: "Alice Johnson",
    policyNumber: "LIF-2024-001-AL",
    amount: 2400,
    dueDate: "2025-02-01",
    status: "Pending",
    reference: "Premium Payment - Life Insurance",
    description: "Annual premium payment for Term Life Insurance policy",
    createdDate: "2024-01-15",
  },
  {
    id: "PAY-003",
    invoiceId: "INV-003",
    policyId: "POL-002",
    customerId: "CUST-002",
    customerName: "Bob Smith",
    policyNumber: "AUT-2024-002-BS",
    amount: 1200,
    dueDate: "2024-02-15",
    paidDate: "2024-02-10",
    status: "Paid",
    paymentMethod: "Credit Card",
    transactionId: "TXN-002-2024",
    reference: "Premium Payment - Auto Insurance",
    description: "Annual premium payment for Auto Insurance policy",
    createdDate: "2024-02-01",
    processedBy: "Sarah Williams",
  },
  {
    id: "PAY-004",
    invoiceId: "INV-004",
    policyId: "POL-003",
    customerId: "CUST-003",
    customerName: "Carol Davis",
    policyNumber: "HLT-2024-003-CD",
    amount: 1200,
    dueDate: "2024-01-01",
    paidDate: "2023-12-28",
    status: "Paid",
    paymentMethod: "Bank Transfer",
    transactionId: "TXN-003-2024",
    reference: "Premium Payment - Health Insurance",
    description: "Quarterly premium payment for Family Health Insurance",
    createdDate: "2023-12-10",
    processedBy: "James Brown",
  },
  {
    id: "PAY-005",
    invoiceId: "INV-005",
    policyId: "POL-003",
    customerId: "CUST-003",
    customerName: "Carol Davis",
    policyNumber: "HLT-2024-003-CD",
    amount: 1200,
    dueDate: "2024-04-01",
    paidDate: "2024-03-25",
    status: "Paid",
    paymentMethod: "Bank Transfer",
    transactionId: "TXN-004-2024",
    reference: "Premium Payment - Health Insurance",
    description: "Quarterly premium payment for Family Health Insurance",
    createdDate: "2024-03-01",
    processedBy: "James Brown",
  },
  {
    id: "PAY-006",
    invoiceId: "INV-006",
    policyId: "POL-003",
    customerId: "CUST-003",
    customerName: "Carol Davis",
    policyNumber: "HLT-2024-003-CD",
    amount: 1200,
    dueDate: "2024-07-01",
    status: "Overdue",
    reference: "Premium Payment - Health Insurance",
    description: "Quarterly premium payment for Family Health Insurance",
    late_fee: 50,
    createdDate: "2024-06-01",
  },
  {
    id: "PAY-007",
    invoiceId: "INV-007",
    policyId: "POL-004",
    customerId: "CUST-004",
    customerName: "David Wilson",
    policyNumber: "HOM-2024-004-DW",
    amount: 1800,
    dueDate: "2024-02-01",
    status: "Pending",
    reference: "Premium Payment - Home Insurance",
    description: "Annual premium payment for Homeowner's Insurance",
    createdDate: "2024-01-20",
  },
  {
    id: "PAY-008",
    invoiceId: "INV-008",
    policyId: "POL-005",
    customerId: "CUST-005",
    customerName: "Emma Brown",
    policyNumber: "LIF-2023-005-EB",
    amount: 3600,
    dueDate: "2023-12-01",
    paidDate: "2023-11-28",
    status: "Paid",
    paymentMethod: "Bank Transfer",
    transactionId: "TXN-005-2023",
    reference: "Premium Payment - Whole Life Insurance",
    description: "Annual premium payment for Whole Life Insurance policy",
    createdDate: "2023-11-05",
    processedBy: "Mike Chen",
  },
  {
    id: "PAY-009",
    invoiceId: "INV-009",
    policyId: "POL-005",
    customerId: "CUST-005",
    customerName: "Emma Brown",
    policyNumber: "LIF-2023-005-EB",
    amount: 3600,
    dueDate: "2024-12-01",
    status: "Pending",
    reference: "Premium Payment - Whole Life Insurance",
    description: "Annual premium payment for Whole Life Insurance policy",
    createdDate: "2024-11-01",
  },
  {
    id: "PAY-010",
    invoiceId: "INV-010",
    policyId: "POL-006",
    customerId: "CUST-001",
    customerName: "Alice Johnson",
    policyNumber: "TRV-2024-006-AL",
    amount: 150,
    dueDate: "2024-01-10",
    paidDate: "2024-01-10",
    status: "Paid",
    paymentMethod: "Credit Card",
    transactionId: "TXN-006-2024",
    reference: "Premium Payment - Travel Insurance",
    description: "One-time premium for International Travel Insurance",
    createdDate: "2024-01-10",
    processedBy: "Sarah Williams",
  },
  {
    id: "PAY-011",
    invoiceId: "INV-011",
    policyId: "POL-002",
    customerId: "CUST-002",
    customerName: "Bob Smith",
    policyNumber: "AUT-2024-002-BS",
    amount: 300,
    dueDate: "2024-03-15",
    status: "Failed",
    paymentMethod: "Credit Card",
    reference: "Premium Payment - Auto Insurance",
    description: "Quarterly premium payment for Auto Insurance policy",
    notes: "Payment failed due to insufficient funds",
    createdDate: "2024-03-01",
  },
];

// Mock Invoices Data
export const mockInvoices: Invoice[] = [
  {
    id: "INV-001",
    invoiceNumber: "INV-2024-001",
    policyId: "POL-001",
    customerId: "CUST-001",
    customerName: "Alice Johnson",
    policyNumber: "LIF-2024-001-AL",
    issueDate: "2024-01-15",
    dueDate: "2024-02-01",
    amount: 2400,
    taxAmount: 0,
    totalAmount: 2400,
    status: "Paid",
    paymentTerms: "Net 30",
    lineItems: [
      {
        id: "LI-001",
        description: "Term Life Insurance - Annual Premium",
        quantity: 1,
        unitPrice: 2400,
        totalPrice: 2400,
        taxRate: 0,
        taxAmount: 0,
      },
    ],
    payments: ["PAY-001"],
    sentDate: "2024-01-15",
    paidDate: "2024-01-28",
    billingAddress: {
      street: "123 Oak Street",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA",
    },
  },
  {
    id: "INV-002",
    invoiceNumber: "INV-2025-002",
    policyId: "POL-001",
    customerId: "CUST-001",
    customerName: "Alice Johnson",
    policyNumber: "LIF-2024-001-AL",
    issueDate: "2024-12-01",
    dueDate: "2025-02-01",
    amount: 2400,
    taxAmount: 0,
    totalAmount: 2400,
    status: "Sent",
    paymentTerms: "Net 30",
    lineItems: [
      {
        id: "LI-002",
        description: "Term Life Insurance - Annual Premium Renewal",
        quantity: 1,
        unitPrice: 2400,
        totalPrice: 2400,
        taxRate: 0,
        taxAmount: 0,
      },
    ],
    payments: ["PAY-002"],
    sentDate: "2024-12-01",
    billingAddress: {
      street: "123 Oak Street",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA",
    },
  },
  {
    id: "INV-006",
    invoiceNumber: "INV-2024-006",
    policyId: "POL-003",
    customerId: "CUST-003",
    customerName: "Carol Davis",
    policyNumber: "HLT-2024-003-CD",
    issueDate: "2024-06-01",
    dueDate: "2024-07-01",
    amount: 1200,
    taxAmount: 60,
    totalAmount: 1260,
    status: "Overdue",
    paymentTerms: "Net 30",
    lineItems: [
      {
        id: "LI-006",
        description: "Family Health Insurance - Q3 Premium",
        quantity: 1,
        unitPrice: 1200,
        totalPrice: 1200,
        taxRate: 5,
        taxAmount: 60,
      },
    ],
    payments: ["PAY-006"],
    sentDate: "2024-06-01",
    billingAddress: {
      street: "789 Maple Drive",
      city: "Chicago",
      state: "IL",
      zipCode: "60601",
      country: "USA",
    },
    notes: "Payment overdue. Late fees may apply.",
  },
];

// Mock Payment Reminders
export const mockReminders: PaymentReminder[] = [
  {
    id: "REM-001",
    paymentId: "PAY-006",
    customerId: "CUST-003",
    customerName: "Carol Davis",
    type: "Email",
    sentDate: "2024-07-05",
    dueDate: "2024-07-01",
    amount: 1200,
    status: "Delivered",
    template: "First Overdue Notice",
  },
  {
    id: "REM-002",
    paymentId: "PAY-006",
    customerId: "CUST-003",
    customerName: "Carol Davis",
    type: "SMS",
    sentDate: "2024-07-10",
    dueDate: "2024-07-01",
    amount: 1200,
    status: "Delivered",
    template: "Second Notice - SMS",
    notes: "Customer responded via phone",
  },
  {
    id: "REM-003",
    paymentId: "PAY-007",
    customerId: "CUST-004",
    customerName: "David Wilson",
    type: "Email",
    sentDate: "2024-01-25",
    dueDate: "2024-02-01",
    amount: 1800,
    status: "Sent",
    template: "Payment Reminder - Due Soon",
  },
];

// Mock Payment Methods
export const mockPaymentMethods: PaymentMethod[] = [
  {
    id: "PM-001",
    customerId: "CUST-001",
    type: "Bank Account",
    isDefault: true,
    details: {
      bankName: "Chase Bank",
      accountLast4: "1234",
      accountType: "Checking",
    },
    createdDate: "2024-01-15",
    isActive: true,
  },
  {
    id: "PM-002",
    customerId: "CUST-002",
    type: "Credit Card",
    isDefault: true,
    details: {
      cardLast4: "5678",
      cardType: "Visa",
      expiryDate: "12/26",
    },
    createdDate: "2024-02-01",
    isActive: true,
  },
  {
    id: "PM-003",
    customerId: "CUST-003",
    type: "Bank Account",
    isDefault: true,
    details: {
      bankName: "Bank of America",
      accountLast4: "9012",
      accountType: "Checking",
    },
    createdDate: "2023-12-10",
    isActive: true,
  },
];

// Utility functions
export const getPaymentById = (id: string): Payment | undefined => {
  return mockPayments.find((payment) => payment.id === id);
};

export const getPaymentsByCustomer = (customerId: string): Payment[] => {
  return mockPayments.filter((payment) => payment.customerId === customerId);
};

export const getPaymentsByPolicy = (policyId: string): Payment[] => {
  return mockPayments.filter((payment) => payment.policyId === policyId);
};

export const getPaymentsByStatus = (status: string): Payment[] => {
  return mockPayments.filter((payment) => payment.status === status);
};

export const getOverduePayments = (): Payment[] => {
  const today = new Date().toISOString().split("T")[0];
  return mockPayments.filter(
    (payment) =>
      (payment.status === "Pending" && payment.dueDate < today) ||
      payment.status === "Overdue",
  );
};

export const getUpcomingPayments = (daysFromNow: number = 30): Payment[] => {
  const today = new Date();
  const targetDate = new Date();
  targetDate.setDate(today.getDate() + daysFromNow);

  return mockPayments.filter((payment) => {
    if (payment.status !== "Pending") return false;
    const dueDate = new Date(payment.dueDate);
    return dueDate >= today && dueDate <= targetDate;
  });
};

export const calculateTotalRevenue = (payments: Payment[]): number => {
  return payments
    .filter((payment) => payment.status === "Paid")
    .reduce((total, payment) => total + payment.amount, 0);
};

export const calculateOutstandingAmount = (payments: Payment[]): number => {
  return payments
    .filter(
      (payment) => payment.status === "Pending" || payment.status === "Overdue",
    )
    .reduce((total, payment) => total + payment.amount, 0);
};

export const getMonthlyRevenue = (year: number, month: number): number => {
  return mockPayments
    .filter((payment) => {
      if (payment.status !== "Paid" || !payment.paidDate) return false;
      const paidDate = new Date(payment.paidDate);
      return (
        paidDate.getFullYear() === year && paidDate.getMonth() === month - 1
      );
    })
    .reduce((total, payment) => total + payment.amount, 0);
};

// Payment method utilities
export const getPaymentMethodsByCustomer = (
  customerId: string,
): PaymentMethod[] => {
  return mockPaymentMethods.filter(
    (method) => method.customerId === customerId,
  );
};

export const getDefaultPaymentMethod = (
  customerId: string,
): PaymentMethod | undefined => {
  return mockPaymentMethods.find(
    (method) =>
      method.customerId === customerId && method.isDefault && method.isActive,
  );
};

// Invoice utilities
export const getInvoiceById = (id: string): Invoice | undefined => {
  return mockInvoices.find((invoice) => invoice.id === id);
};

export const getInvoicesByCustomer = (customerId: string): Invoice[] => {
  return mockInvoices.filter((invoice) => invoice.customerId === customerId);
};

export const getInvoicesByStatus = (status: string): Invoice[] => {
  return mockInvoices.filter((invoice) => invoice.status === status);
};

// Reminder utilities
export const getRemindersByCustomer = (
  customerId: string,
): PaymentReminder[] => {
  return mockReminders.filter((reminder) => reminder.customerId === customerId);
};

export const getRemindersByPayment = (paymentId: string): PaymentReminder[] => {
  return mockReminders.filter((reminder) => reminder.paymentId === paymentId);
};
