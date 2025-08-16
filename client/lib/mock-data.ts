// Customer types
export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  kycStatus: "Pending" | "Verified" | "Rejected";
  kycDocuments: {
    type: string;
    status: string;
    uploadDate: string;
  }[];
  registrationDate: string;
  status: "Active" | "Inactive" | "Suspended";
  assignedAgent: string;
  totalPolicies: number;
  totalPremium: number;
  notes: string;
}

// Claim types
export interface Claim {
  id: string;
  policyId: string;
  customerId: string;
  customerName: string;
  policyType: string;
  claimType:
    | "Accident"
    | "Medical"
    | "Fire"
    | "Theft"
    | "Natural Disaster"
    | "Other";
  claimAmount: number;
  approvedAmount?: number;
  status:
    | "Submitted"
    | "Under Review"
    | "Approved"
    | "Rejected"
    | "Paid"
    | "Closed";
  priority: "Low" | "Medium" | "High" | "Critical";
  submissionDate: string;
  incidentDate: string;
  description: string;
  assignedAdjuster: string;
  documents: {
    name: string;
    type: string;
    uploadDate: string;
  }[];
  timeline: {
    date: string;
    action: string;
    user: string;
    notes?: string;
  }[];
}

// Mock Customers Data
export const mockCustomers: Customer[] = [
  {
    id: "CUST-001",
    firstName: "Alice",
    lastName: "Johnson",
    email: "alice.johnson@email.com",
    phone: "+1-555-0123",
    dateOfBirth: "1985-03-15",
    address: {
      street: "123 Oak Street",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA",
    },
    kycStatus: "Verified",
    kycDocuments: [
      {
        type: "Driver's License",
        status: "Verified",
        uploadDate: "2024-01-15",
      },
      {
        type: "Social Security Card",
        status: "Verified",
        uploadDate: "2024-01-15",
      },
    ],
    registrationDate: "2024-01-15",
    status: "Active",
    assignedAgent: "Mike Chen",
    totalPolicies: 3,
    totalPremium: 8400,
    notes: "Premium customer with excellent payment history.",
  },
  {
    id: "CUST-002",
    firstName: "Bob",
    lastName: "Smith",
    email: "bob.smith@email.com",
    phone: "+1-555-0124",
    dateOfBirth: "1978-07-22",
    address: {
      street: "456 Pine Avenue",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90210",
      country: "USA",
    },
    kycStatus: "Pending",
    kycDocuments: [
      { type: "Driver's License", status: "Pending", uploadDate: "2024-02-01" },
    ],
    registrationDate: "2024-02-01",
    status: "Active",
    assignedAgent: "Sarah Williams",
    totalPolicies: 1,
    totalPremium: 1200,
    notes: "New customer, KYC documents under review.",
  },
  {
    id: "CUST-003",
    firstName: "Carol",
    lastName: "Davis",
    email: "carol.davis@email.com",
    phone: "+1-555-0125",
    dateOfBirth: "1990-11-08",
    address: {
      street: "789 Maple Drive",
      city: "Chicago",
      state: "IL",
      zipCode: "60601",
      country: "USA",
    },
    kycStatus: "Verified",
    kycDocuments: [
      { type: "Passport", status: "Verified", uploadDate: "2023-12-10" },
      { type: "Bank Statement", status: "Verified", uploadDate: "2023-12-10" },
    ],
    registrationDate: "2023-12-10",
    status: "Active",
    assignedAgent: "James Brown",
    totalPolicies: 2,
    totalPremium: 4800,
    notes: "Health insurance customer with family coverage.",
  },
  {
    id: "CUST-004",
    firstName: "David",
    lastName: "Wilson",
    email: "david.wilson@email.com",
    phone: "+1-555-0126",
    dateOfBirth: "1982-05-30",
    address: {
      street: "321 Cedar Lane",
      city: "Houston",
      state: "TX",
      zipCode: "77001",
      country: "USA",
    },
    kycStatus: "Rejected",
    kycDocuments: [
      {
        type: "Driver's License",
        status: "Rejected",
        uploadDate: "2024-01-20",
      },
    ],
    registrationDate: "2024-01-20",
    status: "Suspended",
    assignedAgent: "Lisa Anderson",
    totalPolicies: 0,
    totalPremium: 0,
    notes:
      "KYC documents rejected due to poor image quality. Customer contacted for resubmission.",
  },
  {
    id: "CUST-005",
    firstName: "Emma",
    lastName: "Brown",
    email: "emma.brown@email.com",
    phone: "+1-555-0127",
    dateOfBirth: "1995-09-14",
    address: {
      street: "654 Birch Street",
      city: "Miami",
      state: "FL",
      zipCode: "33101",
      country: "USA",
    },
    kycStatus: "Verified",
    kycDocuments: [
      {
        type: "Driver's License",
        status: "Verified",
        uploadDate: "2023-11-05",
      },
      { type: "Utility Bill", status: "Verified", uploadDate: "2023-11-05" },
    ],
    registrationDate: "2023-11-05",
    status: "Active",
    assignedAgent: "Mike Chen",
    totalPolicies: 4,
    totalPremium: 9600,
    notes: "Young professional with comprehensive coverage.",
  },
];

// Mock Claims Data
export const mockClaims: Claim[] = [
  {
    id: "CLM-001",
    policyId: "POL-001",
    customerId: "CUST-001",
    customerName: "Alice Johnson",
    policyType: "Life Insurance",
    claimType: "Medical",
    claimAmount: 15000,
    approvedAmount: 12000,
    status: "Approved",
    priority: "High",
    submissionDate: "2024-02-15",
    incidentDate: "2024-02-10",
    description:
      "Emergency surgery following car accident. Requesting coverage for medical expenses including surgery, hospital stay, and rehabilitation.",
    assignedAdjuster: "John Martinez",
    documents: [
      { name: "Medical Report.pdf", type: "Medical", uploadDate: "2024-02-15" },
      { name: "Hospital Bills.pdf", type: "Invoice", uploadDate: "2024-02-16" },
      { name: "Surgery Report.pdf", type: "Medical", uploadDate: "2024-02-17" },
    ],
    timeline: [
      { date: "2024-02-15", action: "Claim Submitted", user: "Alice Johnson" },
      {
        date: "2024-02-16",
        action: "Documents Received",
        user: "John Martinez",
      },
      {
        date: "2024-02-18",
        action: "Medical Review Completed",
        user: "Dr. Smith",
        notes: "All medical documents verified",
      },
      {
        date: "2024-02-20",
        action: "Claim Approved",
        user: "John Martinez",
        notes: "Approved for $12,000 after deductible",
      },
    ],
  },
  {
    id: "CLM-002",
    policyId: "POL-003",
    customerId: "CUST-003",
    customerName: "Carol Davis",
    policyType: "Health Insurance",
    claimType: "Medical",
    claimAmount: 2500,
    status: "Under Review",
    priority: "Medium",
    submissionDate: "2024-02-20",
    incidentDate: "2024-02-18",
    description:
      "Routine medical checkup and blood tests as part of annual health screening.",
    assignedAdjuster: "Maria Rodriguez",
    documents: [
      { name: "Lab Results.pdf", type: "Medical", uploadDate: "2024-02-20" },
      { name: "Doctor Visit.pdf", type: "Medical", uploadDate: "2024-02-20" },
    ],
    timeline: [
      { date: "2024-02-20", action: "Claim Submitted", user: "Carol Davis" },
      {
        date: "2024-02-21",
        action: "Initial Review Started",
        user: "Maria Rodriguez",
      },
    ],
  },
  {
    id: "CLM-003",
    policyId: "POL-004",
    customerId: "CUST-004",
    customerName: "David Wilson",
    policyType: "Home Insurance",
    claimType: "Fire",
    claimAmount: 25000,
    status: "Submitted",
    priority: "Critical",
    submissionDate: "2024-02-22",
    incidentDate: "2024-02-20",
    description:
      "Kitchen fire caused significant damage to kitchen appliances and cabinets. No injuries reported.",
    assignedAdjuster: "Robert Lee",
    documents: [
      { name: "Fire Report.pdf", type: "Official", uploadDate: "2024-02-22" },
      { name: "Photos.zip", type: "Evidence", uploadDate: "2024-02-22" },
    ],
    timeline: [
      { date: "2024-02-22", action: "Claim Submitted", user: "David Wilson" },
      { date: "2024-02-22", action: "Assigned to Adjuster", user: "System" },
    ],
  },
  {
    id: "CLM-004",
    policyId: "POL-005",
    customerId: "CUST-005",
    customerName: "Emma Brown",
    policyType: "Auto Insurance",
    claimType: "Accident",
    claimAmount: 8500,
    approvedAmount: 7200,
    status: "Paid",
    priority: "Medium",
    submissionDate: "2024-02-10",
    incidentDate: "2024-02-08",
    description:
      "Rear-end collision at traffic light. Vehicle damage to bumper and trunk area.",
    assignedAdjuster: "Jennifer White",
    documents: [
      { name: "Police Report.pdf", type: "Official", uploadDate: "2024-02-10" },
      {
        name: "Repair Estimate.pdf",
        type: "Estimate",
        uploadDate: "2024-02-11",
      },
      { name: "Photos.jpg", type: "Evidence", uploadDate: "2024-02-10" },
    ],
    timeline: [
      { date: "2024-02-10", action: "Claim Submitted", user: "Emma Brown" },
      {
        date: "2024-02-11",
        action: "Vehicle Inspected",
        user: "Jennifer White",
      },
      {
        date: "2024-02-12",
        action: "Repair Estimate Received",
        user: "Auto Shop",
      },
      { date: "2024-02-14", action: "Claim Approved", user: "Jennifer White" },
      { date: "2024-02-16", action: "Payment Processed", user: "Finance Team" },
    ],
  },
  {
    id: "CLM-005",
    policyId: "POL-002",
    customerId: "CUST-002",
    customerName: "Bob Smith",
    policyType: "Auto Insurance",
    claimType: "Theft",
    claimAmount: 12000,
    status: "Rejected",
    priority: "Low",
    submissionDate: "2024-02-05",
    incidentDate: "2024-02-03",
    description:
      "Vehicle theft from parking garage. Customer reported missing car stereo and navigation system.",
    assignedAdjuster: "Michael Brown",
    documents: [
      { name: "Police Report.pdf", type: "Official", uploadDate: "2024-02-05" },
    ],
    timeline: [
      { date: "2024-02-05", action: "Claim Submitted", user: "Bob Smith" },
      {
        date: "2024-02-06",
        action: "Investigation Started",
        user: "Michael Brown",
      },
      {
        date: "2024-02-12",
        action: "Claim Rejected",
        user: "Michael Brown",
        notes: "Policy exclusions apply - personal items not covered",
      },
    ],
  },
];

// Utility functions
export const getCustomerById = (id: string): Customer | undefined => {
  return mockCustomers.find((customer) => customer.id === id);
};

export const getClaimById = (id: string): Claim | undefined => {
  return mockClaims.find((claim) => claim.id === id);
};

export const getClaimsByCustomer = (customerId: string): Claim[] => {
  return mockClaims.filter((claim) => claim.customerId === customerId);
};

export const getCustomersByAgent = (agentName: string): Customer[] => {
  return mockCustomers.filter(
    (customer) => customer.assignedAgent === agentName,
  );
};
